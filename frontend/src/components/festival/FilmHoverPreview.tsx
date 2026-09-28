'use client'

import { useLayoutEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type Placement = {
	left: number
	top?: number
	bottom?: number
	maxWidth: number
	maxHeight: number
}

/** A viewport overlay never changes the list's scroll height when a poster loads. */
export default function FilmHoverPreview({
	anchor,
	onClose,
	children,
}: {
	anchor: HTMLTableRowElement
	onClose: () => void
	children: ReactNode
}) {
	const [placement, setPlacement] = useState<Placement | null>(null)

	useLayoutEffect(() => {
		const row = anchor.getBoundingClientRect()
		const margin = 16
		const gap = 12
		const above = Math.max(0, row.top - gap - margin)
		const below = Math.max(0, window.innerHeight - row.bottom - gap - margin)
		const showAbove = above >= below
		setPlacement({
			left: row.left + row.width / 2,
			...(showAbove
				? { bottom: window.innerHeight - row.top + gap }
				: { top: row.bottom + gap }),
			maxWidth: Math.min(480, row.width - margin * 2),
			maxHeight: Math.min(480, showAbove ? above : below),
		})
		// Dismiss when the anchor moves; the next hovered row opens a fresh preview.
		window.addEventListener('scroll', onClose, true)
		window.addEventListener('resize', onClose)
		return () => {
			window.removeEventListener('scroll', onClose, true)
			window.removeEventListener('resize', onClose)
		}
	}, [anchor, onClose])

	if (!placement) return null
	const { maxHeight, ...position } = placement
	return createPortal(
		<div
			aria-hidden="true"
			className="festival-film-preview pointer-events-none fixed z-[60] hidden -translate-x-1/2 lg:block [&_img]:h-auto [&_img]:w-auto"
			style={
				{
					...position,
					'--preview-max-height': `${maxHeight}px`,
				} as CSSProperties
			}
		>
			{children}
		</div>,
		document.body,
	)
}
