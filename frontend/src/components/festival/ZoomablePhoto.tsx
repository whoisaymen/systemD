'use client'

import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react'
import {
	useEffect,
	useRef,
	useState,
	type PointerEvent,
	type ReactNode,
} from 'react'

type Point = { x: number; y: number }
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y)
const midpoint = (a: Point, b: Point) => ({
	x: (a.x + b.x) / 2,
	y: (a.y + b.y) / 2,
})
const clamp = (value: number, limit: number) =>
	Math.max(-limit, Math.min(limit, value))

export default function ZoomablePhoto({
	active,
	children,
	onClose,
	onSwipeMove,
	onSwipeEnd,
}: {
	active: boolean
	children: (resolutionScale: number) => ReactNode
	onClose: () => void
	onSwipeMove: (offset: number) => void
	onSwipeEnd: (offset: number, velocity: number) => void
}) {
	const zoom = useMotionValue(1)
	const x = useMotionValue(0)
	const y = useMotionValue(0)
	const reducedMotion = useReducedMotion()
	const [resolutionScale, setResolutionScale] = useState(1)
	const pointers = useRef(new Map<number, Point>())
	const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
	const moved = useRef(false)
	const start = useRef({
		point: { x: 0, y: 0 },
		x: 0,
		y: 0,
		zoom: 1,
		distance: 1,
		time: 0,
		mode: 'swipe',
	})

	useEffect(() => {
		if (!active) {
			zoom.set(1)
			x.set(0)
			y.set(0)
			setResolutionScale(1)
			pointers.current.clear()
		}
		return () => {
			if (tapTimer.current) clearTimeout(tapTimer.current)
			tapTimer.current = null
		}
	}, [active, x, y, zoom])

	const fit = (point: Point, scale: number, element: HTMLDivElement) => ({
		x: clamp(point.x, ((scale - 1) * element.clientWidth) / 2),
		y: clamp(point.y, ((scale - 1) * element.clientHeight) / 2),
	})

	const rememberResolution = () => {
		// Upgrade only after the pinch finishes, avoiding a request at every pointer move.
		setResolutionScale((previous) => Math.max(previous, Math.ceil(zoom.get())))
	}

	const finishPointer = (
		event: PointerEvent<HTMLDivElement>,
		cancelled = false,
	) => {
		if (!pointers.current.has(event.pointerId)) return
		event.stopPropagation()
		const wasPinching = pointers.current.size > 1
		pointers.current.delete(event.pointerId)
		if (cancelled) {
			pointers.current.clear()
			moved.current = true
			onSwipeEnd(0, 0)
		} else if (pointers.current.size === 1) {
			start.current = {
				...start.current,
				point: [...pointers.current.values()][0],
				x: x.get(),
				y: y.get(),
				mode: 'pan',
			}
		} else if (
			!wasPinching &&
			moved.current &&
			start.current.mode === 'swipe'
		) {
			const offset = event.clientX - start.current.point.x
			const vertical = event.clientY - start.current.point.y
			const isSwipe = Math.abs(offset) > Math.abs(vertical)
			onSwipeEnd(
				isSwipe ? offset : 0,
				isSwipe
					? (offset / Math.max(1, event.timeStamp - start.current.time)) * 1000
					: 0,
			)
		}
		rememberResolution()
	}

	return (
		<div
			data-zoomable-photo
			className="h-full w-full touch-none select-none overflow-hidden"
			onPointerDown={(event) => {
				if (!active || event.button !== 0) return
				event.stopPropagation()
				event.currentTarget.setPointerCapture(event.pointerId)
				zoom.stop()
				x.stop()
				y.stop()
				pointers.current.set(event.pointerId, {
					x: event.clientX,
					y: event.clientY,
				})
				const points = [...pointers.current.values()]
				if (points.length === 1) {
					moved.current = false
					start.current = {
						point: points[0],
						x: x.get(),
						y: y.get(),
						zoom: zoom.get(),
						distance: 1,
						time: event.timeStamp,
						mode: zoom.get() > 1.01 ? 'pan' : 'swipe',
					}
				} else if (points.length === 2) {
					if (tapTimer.current) clearTimeout(tapTimer.current)
					tapTimer.current = null
					moved.current = true
					onSwipeMove(0)
					start.current = {
						...start.current,
						point: midpoint(points[0], points[1]),
						x: x.get(),
						y: y.get(),
						zoom: zoom.get(),
						distance: Math.max(1, distance(points[0], points[1])),
						mode: 'pinch',
					}
				}
			}}
			onPointerMove={(event) => {
				if (!pointers.current.has(event.pointerId)) return
				event.stopPropagation()
				const point = { x: event.clientX, y: event.clientY }
				pointers.current.set(event.pointerId, point)
				const points = [...pointers.current.values()]
				if (points.length >= 2) {
					const scale = Math.max(
						1,
						Math.min(
							4,
							(start.current.zoom * distance(points[0], points[1])) /
								start.current.distance,
						),
					)
					const middle = midpoint(points[0], points[1])
					const rect = event.currentTarget.getBoundingClientRect()
					const center = {
						x: rect.left + rect.width / 2,
						y: rect.top + rect.height / 2,
					}
					const offset = fit(
						{
							x:
								middle.x -
								center.x -
								((start.current.point.x - center.x - start.current.x) * scale) /
									start.current.zoom,
							y:
								middle.y -
								center.y -
								((start.current.point.y - center.y - start.current.y) * scale) /
									start.current.zoom,
						},
						scale,
						event.currentTarget,
					)
					zoom.set(scale)
					x.set(offset.x)
					y.set(offset.y)
				} else {
					if (distance(point, start.current.point) > 8) {
						moved.current = true
						if (tapTimer.current) clearTimeout(tapTimer.current)
						tapTimer.current = null
					}
					if (start.current.mode === 'pan') {
						const offset = fit(
							{
								x: start.current.x + point.x - start.current.point.x,
								y: start.current.y + point.y - start.current.point.y,
							},
							zoom.get(),
							event.currentTarget,
						)
						x.set(offset.x)
						y.set(offset.y)
					} else if (moved.current) onSwipeMove(point.x - start.current.point.x)
				}
			}}
			onPointerUp={(event) => finishPointer(event)}
			onPointerCancel={(event) => finishPointer(event, true)}
			onClick={(event) => {
				event.stopPropagation()
				if (!active || moved.current) return
				if (tapTimer.current) {
					clearTimeout(tapTimer.current)
					tapTimer.current = null
					const scale = zoom.get() > 1.01 ? 1 : 2.5
					const rect = event.currentTarget.getBoundingClientRect()
					const offset = fit(
						{
							x: (rect.width / 2 - (event.clientX - rect.left)) * (scale - 1),
							y: (rect.height / 2 - (event.clientY - rect.top)) * (scale - 1),
						},
						scale,
						event.currentTarget,
					)
					const transition = { duration: reducedMotion ? 0 : 0.25 }
					animate(zoom, scale, transition)
					animate(x, offset.x, transition)
					animate(y, offset.y, transition)
					setResolutionScale((previous) => Math.max(previous, Math.ceil(scale)))
				} else {
					tapTimer.current = setTimeout(() => {
						tapTimer.current = null
						onClose()
					}, 280)
				}
			}}
			onDoubleClick={(event) => {
				event.preventDefault()
				event.stopPropagation()
			}}
		>
			<motion.div className="h-full w-full" style={{ scale: zoom, x, y }}>
				{children(resolutionScale)}
			</motion.div>
		</div>
	)
}
