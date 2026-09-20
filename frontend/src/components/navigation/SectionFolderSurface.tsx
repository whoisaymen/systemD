'use client'

import { useId, useLayoutEffect, useState } from 'react'

export type FolderSection = 'festival' | 'bigbang' | 'memoire' | 'fabrique' | 'equipe'

type Point = { x: number; y: number }
type Rect = { left: number; right: number; top: number; bottom: number }

// Round the outline of the joined panel and tab, rather than overlapping shadows.
function folderOutline(panel: Rect, tab: Rect, drawer?: Rect) {
	const onRight = tab.left >= panel.right
	const p = panel
	const t = tab
	const points: Point[] = [
		{ x: p.left, y: p.top },
		{ x: p.right, y: p.top },
		...(onRight ? [
			{ x: p.right, y: t.top },
			{ x: t.right, y: t.top },
			{ x: t.right, y: t.bottom },
			{ x: p.right, y: t.bottom },
		] : []),
		...(drawer ? [
			{ x: p.right, y: drawer.top },
			{ x: drawer.left, y: drawer.top },
			{ x: drawer.left, y: p.bottom },
		] : [{ x: p.right, y: p.bottom }]),
		{ x: p.left, y: p.bottom },
		...(!onRight ? [
			{ x: p.left, y: t.bottom },
			{ x: t.left, y: t.bottom },
			{ x: t.left, y: t.top },
			{ x: p.left, y: t.top },
		] : []),
	]

	// Top/bottom tabs can share an edge with the panel: remove redundant corners.
	const corners = points.filter((point, index) => {
		const previous = points[(index + points.length - 1) % points.length]
		return point.x !== previous.x || point.y !== previous.y
	}).filter((point, index, unique) => {
		const previous = unique[(index + unique.length - 1) % unique.length]
		const next = unique[(index + 1) % unique.length]
		return (point.x - previous.x) * (next.y - point.y)
			!== (point.y - previous.y) * (next.x - point.x)
	})
	const format = ({ x, y }: Point) => `${x},${y}`
	const rounded = corners.map((point, index) => {
		const previous = corners[(index + corners.length - 1) % corners.length]
		const next = corners[(index + 1) % corners.length]
		const concave = (point.x - previous.x) * (next.y - point.y)
			- (point.y - previous.y) * (next.x - point.x) < 0
		const inset = (neighbor: Point): Point => {
			const horizontal = neighbor.y === point.y
			// Keep the inward curve inside the existing gap; never shrink a menu card.
			const tabJoin = point.x === (onRight ? p.right : p.left)
				&& (point.y === t.top || point.y === t.bottom)
			const gap = onRight ? t.left - p.right : p.left - t.right
			const radius = concave && horizontal && tabJoin ? Math.min(12, gap) : 12
			const distance = Math.hypot(neighbor.x - point.x, neighbor.y - point.y)
			const fraction = Math.min(radius, distance / 2) / distance
			return {
				x: point.x + (neighbor.x - point.x) * fraction,
				y: point.y + (neighbor.y - point.y) * fraction,
			}
		}
		return { point, start: inset(previous), end: inset(next) }
	})
	return rounded.map(({ point, start, end }, index) =>
		`${index === 0 ? 'M' : 'L'} ${format(start)} Q ${format(point)} ${format(end)}`,
	).join(' ') + ' Z'
}

export default function SectionFolderSurface({ section }: { section: FolderSection }) {
	const filterId = `folder-shadow-${useId().replace(/:/g, '')}`
	const cutoutId = `${filterId}-language`
	const [{ outline, cutout }, setGeometry] = useState<{ outline: string; cutout?: Rect }>({ outline: '' })

	useLayoutEffect(() => {
		let frame = 0
		let panel: Element | null = null
		let tab: Element | null = null
		let drawer: Element | null = null
		const desktop = window.matchMedia('(min-width: 1024px)')
		const schedule = () => {
			cancelAnimationFrame(frame)
			frame = requestAnimationFrame(measure)
		}
		const resizeObserver = new ResizeObserver(schedule)
		function measure() {
			const nextPanel = document.querySelector('.navigation-loading-overlay .theme-loading-surface')
				?? document.querySelector(`.section-folder-content--${section}`)
				?? document.querySelector('main .theme-loading-surface')
			const nextTab = document.querySelector(`.section-folder-tab--${section}`)
			const nextDrawer = document.querySelector('.desktop-navigation [data-language-drawer]')
			if (nextPanel !== panel || nextTab !== tab || nextDrawer !== drawer) {
				resizeObserver.disconnect()
				panel = nextPanel
				tab = nextTab
				drawer = nextDrawer
				if (panel) resizeObserver.observe(panel)
				if (tab) resizeObserver.observe(tab)
				if (drawer) resizeObserver.observe(drawer)
			}
			if (!desktop.matches || !panel || !tab) {
				setGeometry({ outline: '' })
				return
			}
			const panelRect = panel.getBoundingClientRect()
			const tabRect = tab.getBoundingClientRect()
			const drawerRect = drawer?.getBoundingClientRect()
			const cutout = drawerRect && drawerRect.width > 0 && drawerRect.top < panelRect.bottom
				? { left: panelRect.right - drawerRect.width, top: drawerRect.top - 4, right: panelRect.right, bottom: panelRect.bottom }
				: undefined
			setGeometry({ outline: folderOutline(panelRect, tabRect, cutout), cutout })
		}
		const mutationObserver = new MutationObserver(schedule)
		mutationObserver.observe(document.body, { childList: true, subtree: true })
		window.addEventListener('resize', schedule)
		desktop.addEventListener('change', schedule)
		measure()
		return () => {
			cancelAnimationFrame(frame)
			resizeObserver.disconnect()
			mutationObserver.disconnect()
			window.removeEventListener('resize', schedule)
			desktop.removeEventListener('change', schedule)
		}
	}, [section])

	if (!outline) return null

	return (
		<>
			<svg aria-hidden="true" className="section-folder-surface">
				<path d={outline} fill="var(--section-folder-background)" />
			</svg>
			{cutout && (
				<svg aria-hidden="true" className="section-folder-language-surface">
					<defs>
						<mask id={cutoutId} maskUnits="userSpaceOnUse">
							<rect x={cutout.left - 12} y={cutout.top - 12} width={cutout.right - cutout.left + 24} height={cutout.bottom - cutout.top + 24} fill="white" />
							<path d={outline} fill="black" />
						</mask>
					</defs>
					<rect x={cutout.left - 12} y={cutout.top - 12} width={cutout.right - cutout.left + 24} height={cutout.bottom - cutout.top + 24} fill="var(--navigation-background)" mask={`url(#${cutoutId})`} />
				</svg>
			)}
			{/* Keep the inset edge above opaque content such as sticky headers. */}
			<svg aria-hidden="true" className="section-folder-shadow">
				<defs>
					<filter id={filterId} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
						<feFlood floodColor="white" />
						<feComposite in2="SourceAlpha" operator="out" />
						<feGaussianBlur stdDeviation="3" />
						<feComposite in2="SourceAlpha" operator="in" result="inner-shadow" />
						<feFlood floodColor="var(--section-folder-shadow)" />
						<feComposite in2="inner-shadow" operator="in" />
					</filter>
				</defs>
				<path d={outline} fill="var(--section-folder-background)" filter={`url(#${filterId})`} />
			</svg>
		</>
	)
}
