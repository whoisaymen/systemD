'use client'

import { useEffect, useRef, useState } from 'react'
import type {
	PortableTextBlock,
	PortableTextComponentProps,
	PortableTextComponents,
} from 'next-sanity'
import RichText from './RichText'

const singleLineComponents: Partial<PortableTextComponents> = {
	block: ({
		children,
		index,
	}: PortableTextComponentProps<PortableTextBlock>) => (
		<>
			{index > 0 && ' '}
			{children}
		</>
	),
	listItem: ({ children, index }) => (
		<>
			{index > 0 && ' '}
			{children}
		</>
	),
	hardBreak: () => <> </>,
}

/** Truncate at rest, then scroll overflowing text on a parent group's hover/focus. */
export default function OverflowText({
	value,
	className = '',
}: {
	value: any
	className?: string
}) {
	const containerRef = useRef<HTMLSpanElement>(null)
	const trackRef = useRef<HTMLSpanElement>(null)
	const [isOverflowing, setIsOverflowing] = useState(false)

	useEffect(() => {
		const container = containerRef.current
		const track = trackRef.current
		if (!container || !track) return
		let disposed = false

		const measure = () => {
			if (disposed) return
			const distance = Math.max(0, track.scrollWidth - container.clientWidth)
			setIsOverflowing(distance > 1)
			container.style.setProperty(
				'--festival-event-marquee-distance',
				`${distance}px`,
			)
			container.style.setProperty(
				'--festival-event-marquee-duration',
				`${Math.max(3, distance / 28 + 1.5)}s`,
			)
		}

		measure()
		const observer = new ResizeObserver(measure)
		observer.observe(container)
		observer.observe(track)
		document.fonts?.ready.then(measure)

		return () => {
			disposed = true
			observer.disconnect()
		}
	}, [value])

	const content = (
		<RichText
			value={value}
			inline
			allowLinks={false}
			components={singleLineComponents}
		/>
	)

	return (
		<span
			ref={containerRef}
			className={`relative block min-w-0 overflow-hidden whitespace-nowrap ${className}`}
		>
			<span
				className="theme-festival-event-title-static block truncate"
				data-overflow={isOverflowing}
			>
				{content}
			</span>
			<span
				ref={trackRef}
				aria-hidden="true"
				data-overflow={isOverflowing}
				className="theme-festival-event-title-marquee pointer-events-none absolute left-0 top-0 block w-max whitespace-nowrap opacity-0"
			>
				{content}
			</span>
		</span>
	)
}
