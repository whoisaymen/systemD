'use client'

import { useId, useLayoutEffect, useState } from 'react'

export type FolderSection = 'festival' | 'bigbang' | 'memoire' | 'fabrique' | 'equipe'

type Point = { x: number; y: number }
type Rect = { left: number; right: number; top: number; bottom: number }

// Round the outline of the joined panel and tab, rather than overlapping shadows.
function folderOutline(panel: Rect, tab: Rect) {
	const mirrored = tab.left >= panel.right
	const reflect = (rect: Rect): Rect => mirrored
		? { left: -rect.right, right: -rect.left, top: rect.top, bottom: rect.bottom }
		: rect
	const p = reflect(panel)
	const t = reflect(tab)
	const points: Point[] = [
		{ x: p.left, y: p.top },
		{ x: p.right, y: p.top },
		{ x: p.right, y: p.bottom },
		{ x: p.left, y: p.bottom },
		{ x: p.left, y: t.bottom },
		{ x: t.left, y: t.bottom },
		{ x: t.left, y: t.top },
		{ x: p.left, y: t.top },
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
	const format = ({ x, y }: Point) => `${mirrored ? -x : x},${y}`
	const rounded = corners.map((point, index) => {
		const previous = corners[(index + corners.length - 1) % corners.length]
		const next = corners[(index + 1) % corners.length]
		const concave = (point.x - previous.x) * (next.y - point.y)
			- (point.y - previous.y) * (next.x - point.x) < 0
		const inset = (neighbor: Point): Point => {
			const horizontal = neighbor.y === point.y
			// Keep the inward curve inside the existing gap; never shrink a menu card.
			const radius = concave && horizontal ? Math.min(12, p.left - t.right) : 12
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
	const [outline, setOutline] = useState('')

	useLayoutEffect(() => {
		let frame = 0
		let panel: Element | null = null
		let tab: Element | null = null
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
			if (nextPanel !== panel || nextTab !== tab) {
				resizeObserver.disconnect()
				panel = nextPanel
				tab = nextTab
				if (panel) resizeObserver.observe(panel)
				if (tab) resizeObserver.observe(tab)
			}
			setOutline(desktop.matches && panel && tab
				? folderOutline(panel.getBoundingClientRect(), tab.getBoundingClientRect())
				: '')
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
		<svg aria-hidden="true" className="section-folder-surface">
			<defs>
				<filter id={filterId} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
					<feFlood floodColor="white" />
					<feComposite in2="SourceAlpha" operator="out" />
					<feGaussianBlur stdDeviation="3" />
					<feComposite in2="SourceAlpha" operator="in" result="inner-shadow" />
					<feFlood floodColor="var(--section-folder-shadow)" />
					<feComposite in2="inner-shadow" operator="in" />
					<feComposite in2="SourceGraphic" operator="over" />
				</filter>
			</defs>
			<path d={outline} fill="var(--section-folder-background)" filter={`url(#${filterId})`} />
		</svg>
	)
}
