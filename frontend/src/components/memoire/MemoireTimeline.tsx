'use client'

import {
	useEffect,
	useLayoutEffect,
	useId,
	useRef,
	useState,
	type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import {
	MEMOIRE_FORWARD_PATHS,
	MEMOIRE_MOBILE_FORWARD_CENTER,
} from './MemoireFwdIcon'
import styles from './MemoireContent.module.css'
import { MemoireCardsSkeleton } from '@/components/loading/PageSkeleton'

interface TimelineLine {
	d: string
	x: number
	y: number
	angle: number
	bounds: { x: number; y: number; width: number; height: number }
	joinRadius?: number
}

type Point = { x: number; y: number }

interface TimelineFrame {
	x: number
	y: number
	width: number
	height: number
	rotation: number
	radius: number
}

type FrameJoin = {
	frame: TimelineFrame
	side: 'top' | 'bottom' | 'left'
	offset?: number
}

function frameAnchor({ frame, side, offset = 0 }: FrameJoin) {
	const angle = (frame.rotation * Math.PI) / 180
	const edgeX = side === 'left' ? -frame.width / 2 : 0
	const edgeY =
		side === 'left'
			? offset * frame.height
			: ((side === 'top' ? -1 : 1) * frame.height) / 2
	return {
		x: frame.x + edgeX * Math.cos(angle) - edgeY * Math.sin(angle),
		y: frame.y + edgeX * Math.sin(angle) + edgeY * Math.cos(angle),
	}
}

function ConcaveJoin({
	join,
	lineWidth,
	radius,
}: {
	join: FrameJoin
	lineWidth: number
	radius: number
}) {
	const anchor = frameAnchor(join)
	const half = lineWidth / 2
	const shoulder = half + radius
	// Two concave shoulders blend the narrow connector into the frame. The
	// one-pixel overlap avoids a hairline seam without any raster blur.
	return (
		<path
			data-memoire-concave-join
			d={`M ${-shoulder} -1 V 0 Q ${-half} 0 ${-half} ${radius} H ${half} Q ${half} 0 ${shoulder} 0 V -1 Z`}
			transform={`translate(${anchor.x} ${anchor.y}) rotate(${join.frame.rotation + (join.side === 'top' ? 180 : join.side === 'left' ? 90 : 0)})`}
			fill="currentColor"
		/>
	)
}

interface LogoGeometry {
	line: TimelineLine
	card: TimelineFrame
	lineWidth: number
	clip: { y: number; width: number; height: number }
	join: { x: number; y: number; width: number; height: number }
}

function FrameShape({ frame, fill }: { frame: TimelineFrame; fill?: string }) {
	return (
		<rect
			x={frame.x - frame.width / 2}
			y={frame.y - frame.height / 2}
			width={frame.width}
			height={frame.height}
			rx={frame.radius}
			transform={`rotate(${frame.rotation} ${frame.x} ${frame.y})`}
			fill={fill}
		/>
	)
}

function ForwardSymbol() {
	return (
		<g transform="translate(-8 -5.5) scale(0.082)" className={styles.forward}>
			{MEMOIRE_FORWARD_PATHS.map((d) => (
				<path key={d} d={d} />
			))}
		</g>
	)
}

function TimelineForward({
	line,
	index,
	reverse = true,
}: {
	line: TimelineLine
	index: number
	reverse?: boolean
}) {
	const duration = `${6.4 + (index % 3) * 0.4}s`
	const begin = `${index * -0.8}s`
	return (
		<>
			<g className={styles.animatedForward}>
				<animateMotion
					path={line.d}
					rotate={reverse ? 'auto-reverse' : 'auto'}
					keyPoints={reverse ? '1;0;0' : '0;1;1'}
					keyTimes="0;0.94;1"
					calcMode="spline"
					keySplines="0.4 0 0.2 1;0 0 1 1"
					dur={duration}
					begin={begin}
					repeatCount="indefinite"
				/>
				<animate
					attributeName="opacity"
					values="0;1;1;0;0"
					keyTimes="0;0.04;0.9;0.94;1"
					dur={duration}
					begin={begin}
					repeatCount="indefinite"
				/>
				<ForwardSymbol />
			</g>
			<g
				className={styles.stillForward}
				transform={`translate(${line.x} ${line.y}) rotate(${line.angle + (reverse ? 180 : 0)})`}
			>
				<ForwardSymbol />
			</g>
		</>
	)
}

// Keep mobile animation paints local to one crisp vector connector, rather
// than sharing a filtered page-height SVG with every photo and moving arrow.
function MobileTimelineConnection({
	line,
	joins,
	lineWidth,
	index,
	logo = false,
}: {
	line: TimelineLine
	joins: FrameJoin[]
	lineWidth: number
	index: number
	logo?: boolean
}) {
	const ref = useRef<SVGSVGElement>(null)
	const cardMaskId = useId().replace(/:/g, '')
	const [playing, setPlaying] = useState(false)
	const padding = lineWidth * 2
	const bounds = {
		x: line.bounds.x - padding,
		y: line.bounds.y - padding,
		width: line.bounds.width + padding * 2,
		height: line.bounds.height + padding * 2,
	}

	useEffect(() => {
		const svg = ref.current
		if (!svg) return
		let visible = false
		const update = () => setPlaying(visible && !document.hidden)
		const observer = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting
				update()
			},
			{ rootMargin: '100px 0px' },
		)
		observer.observe(svg)
		document.addEventListener('visibilitychange', update)
		return () => {
			observer.disconnect()
			document.removeEventListener('visibilitychange', update)
		}
	}, [])

	return (
		<svg
			ref={ref}
			className={styles.mobileConnection}
			style={{
				left: bounds.x,
				top: bounds.y,
				width: bounds.width,
				height: bounds.height,
			}}
			viewBox={`${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`}
			data-memoire-connection="mobile"
			data-memoire-logo-connection={logo ? 'mobile' : undefined}
			aria-hidden="true"
			focusable="false"
		>
			<defs>
				<mask
					id={cardMaskId}
					maskUnits="userSpaceOnUse"
					{...bounds}
					data-memoire-card-occlusion
				>
					<rect {...bounds} fill="white" />
					{joins.map(({ frame }, frameIndex) => (
						<FrameShape key={frameIndex} frame={frame} fill="black" />
					))}
				</mask>
			</defs>
			{joins.map((join, joinIndex) => (
				<ConcaveJoin
					key={joinIndex}
					join={join}
					lineWidth={lineWidth}
					radius={line.joinRadius ?? lineWidth * 1.4}
				/>
			))}
			<path d={line.d} className={styles.connection} />
			{playing && (
				// Hide the arrow under the entire card, including any transparent
				// space between its CSS border and the contained photo.
				<g mask={`url(#${cardMaskId})`}>
					<TimelineForward line={line} index={index} reverse={!logo} />
				</g>
			)}
		</svg>
	)
}

function curve(
	start: Point,
	first: Point,
	second: Point,
	end: Point,
	waveSpan = Math.hypot(end.x - start.x, end.y - start.y),
): TimelineLine {
	const amplitude = Math.min(22, waveSpan * 0.06)
	const waves = waveSpan > 250 ? 2 : 1.5
	const points = Array.from({ length: 25 }, (_, index) => {
		const t = index / 24
		const u = 1 - t
		const x =
			u ** 3 * start.x +
			3 * u ** 2 * t * first.x +
			3 * u * t ** 2 * second.x +
			t ** 3 * end.x
		const y =
			u ** 3 * start.y +
			3 * u ** 2 * t * first.y +
			3 * u * t ** 2 * second.y +
			t ** 3 * end.y
		const dx =
			3 * u ** 2 * (first.x - start.x) +
			6 * u * t * (second.x - first.x) +
			3 * t ** 2 * (end.x - second.x)
		const dy =
			3 * u ** 2 * (first.y - start.y) +
			6 * u * t * (second.y - first.y) +
			3 * t ** 2 * (end.y - second.y)
		const length = Math.hypot(dx, dy) || 1
		// Fade the wave into each frame so entry and exit stay smooth.
		const wave =
			amplitude * Math.sin(t * Math.PI * waves * 2) * Math.sin(t * Math.PI)
		return { x: x - (dy / length) * wave, y: y + (dx / length) * wave }
	})
	let d = `M ${start.x} ${start.y}`
	for (let index = 0; index < points.length - 1; index++) {
		const before = points[Math.max(0, index - 1)]
		const point = points[index]
		const next = points[index + 1]
		const after = points[Math.min(points.length - 1, index + 2)]
		d += ` C ${point.x + (next.x - before.x) / 6} ${point.y + (next.y - before.y) / 6}, ${next.x - (after.x - point.x) / 6} ${next.y - (after.y - point.y) / 6}, ${next.x} ${next.y}`
	}
	return {
		d,
		bounds: {
			x: Math.min(...points.map((point) => point.x)),
			y: Math.min(...points.map((point) => point.y)),
			width:
				Math.max(...points.map((point) => point.x)) -
				Math.min(...points.map((point) => point.x)),
			height:
				Math.max(...points.map((point) => point.y)) -
				Math.min(...points.map((point) => point.y)),
		},
		x: points[12].x,
		y: points[12].y,
		angle:
			(Math.atan2(points[13].y - points[11].y, points[13].x - points[11].x) *
				180) /
			Math.PI,
	}
}

function mobileCurve(
	start: Point,
	first: Point,
	second: Point,
	end: Point,
	lineWidth: number,
	joinAtEnd = true,
): TimelineLine {
	// Keep the centreline perpendicular to the card until the entire concave
	// shoulder has merged into the stroke. Bending earlier exposes a square cap.
	const joinRadius = Math.min(
		lineWidth * 1.4,
		Math.max(0, Math.abs(end.y - start.y) * 0.3 - lineWidth / 2),
	)
	const neckLength = joinRadius + lineWidth / 2
	const neck = (anchor: Point, control: Point) => {
		const length = Math.hypot(control.x - anchor.x, control.y - anchor.y) || 1
		return {
			x: anchor.x + ((control.x - anchor.x) / length) * neckLength,
			y: anchor.y + ((control.y - anchor.y) / length) * neckLength,
		}
	}
	const startNeck = neck(start, first)
	const endNeck = joinAtEnd ? neck(end, second) : end
	const middle = curve(startNeck, first, second, endNeck)
	const left = Math.min(start.x, end.x, middle.bounds.x)
	const top = Math.min(start.y, end.y, middle.bounds.y)
	return {
		...middle,
		joinRadius,
		d: `M ${start.x} ${start.y} L ${middle.d.slice(2)}${joinAtEnd ? ` L ${end.x} ${end.y}` : ''}`,
		bounds: {
			x: left,
			y: top,
			width:
				Math.max(start.x, end.x, middle.bounds.x + middle.bounds.width) - left,
			height:
				Math.max(start.y, end.y, middle.bounds.y + middle.bounds.height) - top,
		},
	}
}

export default function MemoireTimeline({ children }: { children: ReactNode }) {
	const isMemoireIndex = /\/memoire\/?$/.test(usePathname())
	const containerRef = useRef<HTMLDivElement>(null)
	const joinFilterId = useId().replace(/:/g, '')
	const logoClipId = `${joinFilterId}-logo-clip`
	const logoMaskId = `${joinFilterId}-logo-mask`
	const logoJoinId = `${joinFilterId}-logo-join`
	const [logoGeometry, setLogoGeometry] = useState<LogoGeometry | null>(null)
	const [geometry, setGeometry] = useState({
		desktop: false,
		width: 0,
		height: 0,
		lineWidth: 12,
		frames: [] as TimelineFrame[],
		lines: [] as TimelineLine[],
		mobileLogoLine: null as TimelineLine | null,
	})

	useLayoutEffect(() => {
		const container = containerRef.current
		if (!container || !isMemoireIndex) return
		const cards = Array.from(
			container.querySelectorAll<HTMLElement>('[data-memoire-card]'),
		)
		const panel = container.closest('.section-folder-content--memoire')
		const navigation = document.querySelector('.desktop-navigation')
		const mobileNavigation = document.getElementById('navbar-mobile')
		let logo: SVGSVGElement | null = null
		const desktop = window.matchMedia('(min-width: 1024px)')
		let frame = 0
		let logoFrame = 0
		let animateUntil = 0
		let firstCard: TimelineFrame | undefined
		let measuredLineWidth = 12
		let viewportWidth = window.innerWidth

		const measureLogo = () => {
			logoFrame = 0
			// Reconnect if the navigation artwork changes (for example on a locale change).
			const nextLogo = document.querySelector<SVGSVGElement>(
				'.section-folder-tab--memoire .menu-artwork svg',
			)
			if (logo !== nextLogo) {
				if (logo) observer.unobserve(logo)
				logo = nextLogo
				if (logo) observer.observe(logo)
			}
			if (!desktop.matches || !logo || !panel || !firstCard) {
				setLogoGeometry(null)
				return
			}
			const bounds = container.getBoundingClientRect()
			const scaleX = bounds.width / container.offsetWidth
			const scaleY = bounds.height / container.offsetHeight
			const lineWidth = measuredLineWidth * scaleX
			// Every part of this connection uses the same fixed viewport coordinates.
			const card = {
				...firstCard,
				x: bounds.left + firstCard.x * scaleX,
				y: bounds.top + firstCard.y * scaleY,
				width: firstCard.width * scaleX,
				height: firstCard.height * scaleY,
				radius: firstCard.radius * scaleX,
			}
			const radians = (card.rotation * Math.PI) / 180
			const edgeX = card.width / 2 - lineWidth * 0.275
			const edgeY = -card.height * 0.24
			const start = {
				x: card.x + edgeX * Math.cos(radians) - edgeY * Math.sin(radians),
				y: card.y + edgeX * Math.sin(radians) + edgeY * Math.cos(radians),
			}
			const panelBounds = panel.getBoundingClientRect()
			const logoBounds = logo.getBoundingClientRect()
			const viewBox = logo.viewBox.baseVal
			const logoScale = Math.min(
				logoBounds.width / viewBox.width,
				logoBounds.height / viewBox.height,
			)
			// Meet the left edge of the M, allowing for the SVG's letterboxing.
			const end = {
				x:
					logoBounds.left +
					(logoBounds.width - viewBox.width * logoScale) / 2 +
					8 * logoScale,
				y:
					logoBounds.top +
					(logoBounds.height - viewBox.height * logoScale) / 2 +
					72 * logoScale,
			}
			const span = end.x - start.x
			const reach = span * 0.4
			setLogoGeometry({
				card,
				lineWidth,
				join: {
					x: start.x - lineWidth * 4,
					y: start.y - lineWidth * 4,
					width: lineWidth * 8,
					height: lineWidth * 8,
				},
				clip: {
					y: panelBounds.top,
					width: window.innerWidth,
					height: panelBounds.height,
				},
				line: curve(
					start,
					{ x: start.x + reach, y: start.y + 24 },
					{ x: end.x - reach, y: end.y - 24 },
					end,
					// Scrolling changes the reach, never the number or size of waves.
					Math.abs(span),
				),
			})
		}

		const scheduleLogo = () => {
			if (desktop.matches && !logoFrame)
				logoFrame = requestAnimationFrame(measureLogo)
		}

		const measure = () => {
			const bounds = container.getBoundingClientRect()
			if (!bounds.width || !bounds.height) return
			const scaleX = bounds.width / container.offsetWidth
			const scaleY = bounds.height / container.offsetHeight
			const lineWidth =
				Number.parseFloat(
					getComputedStyle(container).getPropertyValue('--memoire-line-width'),
				) || 12
			const rects = cards.map((card) => {
				const rect = card.getBoundingClientRect()
				return {
					left: (rect.left - bounds.left) / scaleX,
					top: (rect.top - bounds.top) / scaleY,
					width: rect.width / scaleX,
					height: rect.height / scaleY,
				}
			})
			const frames = cards.map((card, index) => {
				const rect = rects[index]
				const rotation =
					Number.parseFloat(getComputedStyle(card.parentElement!).rotate) || 0
				const radians = (rotation * Math.PI) / 180
				const cosine = Math.abs(Math.cos(radians))
				const sine = Math.abs(Math.sin(radians))
				const divisor = cosine ** 2 - sine ** 2
				// Recover the tilted frame itself from its axis-aligned browser bounds.
				const width = (rect.width * cosine - rect.height * sine) / divisor
				const height = (rect.height * cosine - rect.width * sine) / divisor
				return {
					x: rect.left + rect.width / 2,
					y: rect.top + rect.height / 2,
					width,
					height,
					rotation,
					radius: Number.parseFloat(getComputedStyle(card).borderTopLeftRadius),
				}
			})
			const lines = rects.slice(0, -1).map((from, index) => {
				const to = rects[index + 1]
				if (!desktop.matches) {
					const start = frameAnchor({ frame: frames[index], side: 'bottom' })
					const end = frameAnchor({ frame: frames[index + 1], side: 'top' })
					const startAngle = (frames[index].rotation * Math.PI) / 180
					const endAngle = (frames[index + 1].rotation * Math.PI) / 180
					const reach = Math.max(24, (end.y - start.y) * 0.5)
					return mobileCurve(
						start,
						{
							x: start.x - Math.sin(startAngle) * reach,
							y: start.y + Math.cos(startAngle) * reach,
						},
						{
							x: end.x + Math.sin(endAngle) * reach,
							y: end.y - Math.cos(endAngle) * reach,
						},
						end,
						lineWidth,
					)
				}
				const fromCenter = from.left + from.width / 2
				const toCenter = to.left + to.width / 2
				const direction = toCenter > fromCenter ? 1 : -1
				const sideBySide =
					Math.abs(toCenter - fromCenter) > container.offsetWidth * 0.25

				if (sideBySide && index % 4 === 0) {
					const start = {
						x: direction > 0 ? from.left + from.width - 12 : from.left + 12,
						y: from.top + from.height * 0.2,
					}
					const end = {
						x: to.left + to.width * (direction > 0 ? 0.65 : 0.35),
						y: to.top + 12,
					}
					return curve(
						start,
						{ x: start.x + (end.x - start.x) * 0.65, y: start.y - 24 },
						{ x: end.x, y: start.y + (end.y - start.y) * 0.45 },
						end,
					)
				}

				if (sideBySide && index % 4 === 2) {
					const start = {
						x: from.left + from.width * (direction > 0 ? 0.65 : 0.35),
						y: from.top + from.height - 12,
					}
					const end = {
						x: to.left + to.width * (direction > 0 ? 0.35 : 0.65),
						y: to.top + 12,
					}
					const bend = Math.max(48, Math.abs(end.x - start.x) * 0.35)
					return curve(
						start,
						{ x: start.x, y: start.y + bend },
						{ x: end.x, y: end.y - bend },
						end,
					)
				}

				if (sideBySide) {
					const x = direction > 0 ? from.left + from.width - 12 : from.left + 12
					const y = from.top + from.height * 0.65
					const endX = direction > 0 ? to.left + 12 : to.left + to.width - 12
					const endY = to.top + to.height * 0.35
					const bend = Math.max(44, Math.abs(endX - x) * 0.8)
					return curve(
						{ x, y },
						{ x: x + direction * bend, y: y - 32 },
						{ x: endX - direction * bend, y: endY + 32 },
						{ x: endX, y: endY },
					)
				}

				const x = fromCenter
				const y = from.top + from.height - 12
				const endX = toCenter
				const endY = to.top + 12
				const bend = (index % 2 === 0 ? 1 : -1) * 42
				const middleY = (y + endY) / 2
				return curve(
					{ x, y },
					{ x: x + bend, y: middleY },
					{ x: endX - bend, y: middleY },
					{ x: endX, y: endY },
				)
			})

			let mobileLogoLine: TimelineLine | null = null
			const mobileLogo = mobileNavigation?.querySelector('svg')
			if (!desktop.matches && mobileLogo && frames[0]) {
				const card = frames[0]
				const radians = (card.rotation * Math.PI) / 180
				const start = frameAnchor({ frame: card, side: 'left', offset: -0.25 })
				const logoBounds = mobileLogo.getBoundingClientRect()
				const viewBox = mobileLogo.viewBox.baseVal
				const logoScale = Math.min(
					logoBounds.width / viewBox.width,
					logoBounds.height / viewBox.height,
				)
				// Keep the approved curve positioned relative to the first triangle.
				// Both endpoints scroll together without an overlay or scroll handler.
				const playCenter = {
					x:
						(logoBounds.left +
							(logoBounds.width - viewBox.width * logoScale) / 2 +
							MEMOIRE_MOBILE_FORWARD_CENTER.x * logoScale -
							bounds.left) /
						scaleX,
					y:
						(logoBounds.top +
							(logoBounds.height - viewBox.height * logoScale) / 2 +
							MEMOIRE_MOBILE_FORWARD_CENTER.y * logoScale -
							bounds.top) /
						scaleY,
				}
				const end = playCenter
				const reach = Math.max(lineWidth * 2, start.x - lineWidth * 1.2)
				const joinRadius = lineWidth * 1.4
				const normal = (distance: number) => ({
					x: start.x - Math.cos(radians) * distance,
					y: start.y - Math.sin(radians) * distance,
				})
				const neck = normal(joinRadius + lineWidth / 2)
				const first = normal(reach)
				// Add a broad reverse bend in the space above the flyer. Matching
				// handle directions keep both turns round, without a pinched elbow.
				const bend = {
					x: playCenter.x - lineWidth * 4,
					y: rects[0].top - lineWidth * 1.6,
				}
				const bendIn = {
					x: bend.x - lineWidth * 3.2,
					y: bend.y + lineWidth * 0.7,
				}
				const bendOut = {
					x: bend.x + lineWidth * 3.2,
					y: bend.y - lineWidth * 0.7,
				}
				const crest = {
					x: playCenter.x + lineWidth * 3.7,
					y: bend.y - lineWidth * 1.8,
				}
				const crestIn = { x: crest.x, y: crest.y + lineWidth * 2.7 }
				const crestOut = { x: crest.x, y: crest.y - lineWidth * 2.7 }
				// Approach directly underneath the first play triangle's centre.
				const entryControl = {
					x: end.x,
					y: end.y + (start.y - end.y) * 0.4,
				}
				const arc = curve(neck, first, bendIn, bend, 0)
				const points = [
					start,
					neck,
					first,
					bendIn,
					bend,
					bendOut,
					crestIn,
					crest,
					crestOut,
					entryControl,
					end,
				]
				const left = Math.min(...points.map((point) => point.x))
				const top = Math.min(...points.map((point) => point.y))
				const point = ({ x, y }: Point) => `${x} ${y}`
				mobileLogoLine = {
					...arc,
					joinRadius,
					d: `M ${point(start)} L ${point(neck)} C ${point(first)}, ${point(bendIn)}, ${point(bend)} C ${point(bendOut)}, ${point(crestIn)}, ${point(crest)} C ${point(crestOut)}, ${point(entryControl)}, ${point(end)}`,
					bounds: {
						x: left,
						y: top,
						width: Math.max(...points.map((point) => point.x)) - left,
						height: Math.max(...points.map((point) => point.y)) - top,
					},
				}
			}

			setGeometry({
				desktop: desktop.matches,
				width: container.offsetWidth,
				height: container.offsetHeight,
				lineWidth,
				frames,
				lines,
				mobileLogoLine,
			})
			firstCard = frames[0]
			measuredLineWidth = lineWidth
			cancelAnimationFrame(logoFrame)
			measureLogo()

			if (performance.now() < animateUntil)
				frame = requestAnimationFrame(measure)
		}

		const schedule = () => {
			cancelAnimationFrame(frame)
			frame = requestAnimationFrame(measure)
		}
		const onResize = () => {
			// iOS browser chrome changes viewport height during a scroll, but neither
			// document-space endpoint moves. Avoid rebuilding every SVG for that.
			const width = window.innerWidth
			if (desktop.matches || width !== viewportWidth) schedule()
			viewportWidth = width
		}
		const followCardTransition = (event: TransitionEvent) => {
			if (
				event.propertyName !== 'transform' ||
				!cards.includes(event.target as HTMLElement)
			)
				return
			animateUntil = performance.now() + 300
			schedule()
		}
		// Image loading and Studio crop changes can both alter the natural height.
		const observer = new ResizeObserver(schedule)
		observer.observe(container)
		if (mobileNavigation) observer.observe(mobileNavigation)
		cards.forEach((card) => observer.observe(card))
		const navigationObserver = new MutationObserver(schedule)
		if (navigation)
			navigationObserver.observe(navigation, { childList: true, subtree: true })
		if (mobileNavigation)
			navigationObserver.observe(mobileNavigation, {
				childList: true,
				subtree: true,
			})
		panel?.addEventListener('scroll', scheduleLogo, { passive: true })
		window.addEventListener('resize', onResize)
		desktop.addEventListener('change', schedule)
		container.addEventListener('transitionrun', followCardTransition)
		// Draw the cards and connections in the same first paint, including cached returns.
		measure()
		return () => {
			cancelAnimationFrame(frame)
			cancelAnimationFrame(logoFrame)
			observer.disconnect()
			navigationObserver.disconnect()
			panel?.removeEventListener('scroll', scheduleLogo)
			window.removeEventListener('resize', onResize)
			desktop.removeEventListener('change', schedule)
			container.removeEventListener('transitionrun', followCardTransition)
		}
	}, [children, isMemoireIndex])

	return (
		<div
			ref={containerRef}
			className={styles.timeline}
			data-layout-ready={geometry.width > 0}
			style={geometry.width > 0 ? undefined : { visibility: 'hidden' }}
		>
			{geometry.width === 0 && (
				<div
					className="visible absolute inset-0 motion-safe:animate-pulse"
					aria-hidden="true"
				>
					<MemoireCardsSkeleton />
				</div>
			)}
			{geometry.width > 0 && !geometry.desktop && (
				<>
					<svg
						className={styles.connections}
						viewBox={`0 0 ${geometry.width} ${geometry.height}`}
						fill="currentColor"
						aria-hidden="true"
						focusable="false"
					>
						{geometry.frames.map((frame, index) => (
							<FrameShape key={index} frame={frame} />
						))}
					</svg>
					{geometry.mobileLogoLine && (
						<MobileTimelineConnection
							line={geometry.mobileLogoLine}
							joins={[
								{ frame: geometry.frames[0], side: 'left', offset: -0.25 },
							]}
							lineWidth={geometry.lineWidth}
							index={geometry.lines.length}
							logo
						/>
					)}
					{geometry.lines.map((line, index) => (
						<MobileTimelineConnection
							key={index}
							line={line}
							joins={[
								{ frame: geometry.frames[index], side: 'bottom' },
								{ frame: geometry.frames[index + 1], side: 'top' },
							]}
							lineWidth={geometry.lineWidth}
							index={index}
						/>
					))}
				</>
			)}
			{geometry.width > 0 && geometry.desktop && (
				<svg
					className={styles.connections}
					viewBox={`0 0 ${geometry.width} ${geometry.height}`}
					aria-hidden="true"
					focusable="false"
				>
					<defs>
						<filter
							id={joinFilterId}
							x="-5%"
							y="-5%"
							width="110%"
							height="110%"
							colorInterpolationFilters="sRGB"
						>
							<feGaussianBlur stdDeviation={geometry.lineWidth * 0.7} />
							<feColorMatrix
								type="matrix"
								values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9.5"
							/>
						</filter>
					</defs>
					{/* Only the background silhouette is softened; photos and lines stay crisp. */}
					<g filter={`url(#${joinFilterId})`} fill="currentColor">
						{geometry.frames.map((card, index) => (
							<rect
								key={index}
								x={card.x - card.width / 2}
								y={card.y - card.height / 2}
								width={card.width}
								height={card.height}
								rx={card.radius}
								transform={`rotate(${card.rotation} ${card.x} ${card.y})`}
							/>
						))}
						{geometry.lines.map((line, index) => (
							<path key={index} d={line.d} className={styles.connection} />
						))}
						{geometry.mobileLogoLine && (
							<path
								d={geometry.mobileLogoLine.d}
								className={styles.connection}
							/>
						)}
					</g>
					{geometry.mobileLogoLine && (
						<g data-memoire-logo-connection="mobile">
							<path
								d={geometry.mobileLogoLine.d}
								className={styles.connection}
							/>
							<TimelineForward
								line={geometry.mobileLogoLine}
								index={geometry.lines.length}
								reverse={false}
							/>
						</g>
					)}
					{geometry.lines.map((line, index) => (
						<g key={index}>
							<path d={line.d} className={styles.connection} />
							<TimelineForward line={line} index={index} />
						</g>
					))}
				</svg>
			)}
			{children}
			{isMemoireIndex &&
				logoGeometry &&
				createPortal(
					<svg
						className={styles.logoConnection}
						aria-hidden="true"
						focusable="false"
					>
						<defs>
							<clipPath id={logoClipId}>
								<rect x={0} {...logoGeometry.clip} />
							</clipPath>
							<mask
								id={logoMaskId}
								maskUnits="userSpaceOnUse"
								x={0}
								{...logoGeometry.clip}
							>
								<rect x={0} {...logoGeometry.clip} fill="white" />
								<FrameShape frame={logoGeometry.card} fill="black" />
							</mask>
							<filter
								id={logoJoinId}
								filterUnits="userSpaceOnUse"
								{...logoGeometry.join}
								colorInterpolationFilters="sRGB"
							>
								<feGaussianBlur stdDeviation={logoGeometry.lineWidth * 0.7} />
								<feColorMatrix
									type="matrix"
									values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9.5"
								/>
							</filter>
						</defs>
						<g clipPath={`url(#${logoClipId})`} mask={`url(#${logoMaskId})`}>
							{/* Keep the join and crisp line together; neither belongs to the scrolling SVG. */}
							<g filter={`url(#${logoJoinId})`} fill="currentColor">
								<FrameShape frame={logoGeometry.card} />
								<path
									d={logoGeometry.line.d}
									className={styles.connection}
									style={{ strokeWidth: logoGeometry.lineWidth }}
								/>
							</g>
							<path
								d={logoGeometry.line.d}
								className={styles.connection}
								style={{ strokeWidth: logoGeometry.lineWidth }}
							/>
							<TimelineForward
								line={logoGeometry.line}
								index={geometry.lines.length}
								reverse={false}
							/>
						</g>
					</svg>,
					document.body,
				)}
		</div>
	)
}
