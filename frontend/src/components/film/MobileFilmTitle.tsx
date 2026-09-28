'use client'

import { useLayoutEffect, useRef, type ComponentProps } from 'react'
import RichText from '@/components/common/RichText'
import { filmTextLines } from './filmTextLines'
import { FILM_TITLE_TEXT } from './filmLabelStyles'

export default function MobileFilmTitle({
	value,
}: {
	value: ComponentProps<typeof RichText>['value']
}) {
	const containerRef = useRef<HTMLDivElement>(null)

	useLayoutEffect(() => {
		const container = containerRef.current
		if (!container) return
		const labels = Array.from(container.querySelectorAll('h1'))
		let disposed = false

		const fit = () => {
			if (disposed || !container.clientWidth) return
			const maximumSize = parseFloat(getComputedStyle(container).fontSize)
			let size = maximumSize
			for (const label of labels) {
				const text = label.firstElementChild
				if (!text) continue
				const style = getComputedStyle(label)
				const textWidth = parseFloat(getComputedStyle(text).width)
				if (!textWidth) continue
				const availableWidth = container.clientWidth
					- parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
					- parseFloat(style.borderLeftWidth) - parseFloat(style.borderRightWidth)
					- 2 // Leave room for the slight rotation.
				size = Math.min(size, parseFloat(style.fontSize) * availableWidth / textWidth)
			}
			// All labels share a size; fit the widest one without wrapping or clipping.
			const nextSize = Math.floor(size * 100) / 100
			const currentSize = parseFloat(container.style.getPropertyValue('--film-title-size')) || maximumSize
			if (Math.abs(nextSize - currentSize) > 0.05) {
				container.style.setProperty('--film-title-size', `${nextSize}px`)
			}
		}

		fit()
		const observer = new ResizeObserver(fit)
		observer.observe(container)
		for (const label of labels) {
			if (label.firstElementChild) observer.observe(label.firstElementChild)
		}
		void document.fonts.ready.then(fit)
		return () => {
			disposed = true
			observer.disconnect()
		}
	}, [value])

	return (
		<div ref={containerRef} className="flex w-full min-w-0 flex-col items-center text-3xl">
			{filmTextLines(value, 20).map((line, index) => (
				<h1
					key={index}
					style={{ fontSize: 'var(--film-title-size, 1.875rem)' }}
					className={`z-10 max-w-full shrink-0 whitespace-nowrap rounded-md border-2 border-primary bg-dark px-2 text-center text-primary ${FILM_TITLE_TEXT} ${index % 2 === 0 ? '-rotate-1' : 'rotate-1'} ${index ? '-mt-1' : ''}`}
				>
					<RichText value={line} inline className="inline-block w-max whitespace-nowrap" components={{ hardBreak: () => <> </> }} />
				</h1>
			))}
		</div>
	)
}
