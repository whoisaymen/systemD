'use client'

import {
	useLayoutEffect,
	useRef,
	type ComponentProps,
	type ReactNode,
} from 'react'
import { motion, useReducedMotion } from 'motion/react'
import RichText from './RichText'
import { EDITORIAL_MOBILE_TAB_STYLE } from './editorialStyles'

export interface MobileSection {
	value: string
	title: ComponentProps<typeof RichText>['value']
	rotation: number
	delay?: number
}

export default function MobileSectionMenu({
	id,
	sections,
	value,
	onValueChange,
	panelIdPrefix,
	buttonClassName = '',
	collapsible = false,
	stickyActiveOnly = false,
	stickyBackground = false,
	activeCaption,
	activeBadge,
	onStickyHeightChange,
	onStickyChange,
}: {
	id: string
	sections: MobileSection[]
	value: string
	onValueChange: (value: string) => void
	panelIdPrefix: string
	buttonClassName?: string
	collapsible?: boolean
	stickyActiveOnly?: boolean
	stickyBackground?: boolean
	activeCaption?: ReactNode
	activeBadge?: ReactNode
	onStickyHeightChange?: (height: number) => void
	onStickyChange?: (stuck: boolean) => void
}) {
	const reduceMotion = useReducedMotion()
	const menuRef = useRef<HTMLDivElement>(null)
	const orderedSections = [
		...sections.filter((section) => section.value !== value),
		...sections.filter((section) => section.value === value),
	]

	useLayoutEffect(() => {
		const item = menuRef.current?.querySelector<HTMLElement>(
			'[data-sticky-active="true"]',
		)
		if (!stickyActiveOnly || !item) return

		const updateHeight = () => onStickyHeightChange?.(item.offsetHeight)
		updateHeight()
		const observer = new ResizeObserver(updateHeight)
		observer.observe(item)
		return () => observer.disconnect()
	}, [stickyActiveOnly, value, onStickyHeightChange])

	useLayoutEffect(() => {
		if (!onStickyChange) return
		const item = menuRef.current?.querySelector<HTMLElement>(
			'[data-sticky-active="true"]',
		)
		if (!stickyActiveOnly || !item) {
			onStickyChange(false)
			return
		}

		let frame: number | undefined
		const update = () => {
			frame = undefined
			const top = parseFloat(getComputedStyle(item).top) || 0
			onStickyChange(
				item.offsetHeight > 0 && item.getBoundingClientRect().top <= top + 0.5,
			)
		}
		const schedule = () => {
			if (frame === undefined) frame = requestAnimationFrame(update)
		}
		update()
		const observer = new ResizeObserver(schedule)
		observer.observe(item)
		window.addEventListener('scroll', schedule, { passive: true })
		window.addEventListener('resize', schedule)
		return () => {
			observer.disconnect()
			if (frame !== undefined) cancelAnimationFrame(frame)
			window.removeEventListener('scroll', schedule)
			window.removeEventListener('resize', schedule)
		}
	}, [stickyActiveOnly, value, onStickyChange])

	return (
		<div
			ref={menuRef}
			id={id}
			data-testid={id}
			className={
				stickyActiveOnly
					? 'contents lg:hidden'
					: 'sticky top-2 z-50 mx-auto flex w-fit flex-col items-center justify-center lg:hidden'
			}
		>
			{orderedSections.map((section, index) => (
				<div
					key={section.value}
					data-sticky-active={stickyActiveOnly && value === section.value}
					className={
						stickyActiveOnly && value === section.value
							? `sticky z-50 -mt-2 flex flex-col items-center justify-center pb-1 pt-2 ${stickyBackground ? 'top-0 bg-dark' : 'top-2'}`
							: `relative mx-auto flex w-fit flex-col items-center justify-center ${stickyActiveOnly ? (stickyBackground ? 'z-[60]' : 'z-40') : ''}`
					}
				>
					<div className="relative flex max-w-full">
						<motion.button
							layout="position"
							initial={false}
							animate={{
								rotate: Math.abs(section.rotation) * (index % 2 === 0 ? -1 : 1),
							}}
							transition={{
								duration: reduceMotion ? 0 : 0.34,
								ease: [0.76, 0, 0.24, 1],
							}}
							type="button"
							aria-pressed={value === section.value}
							aria-controls={`${panelIdPrefix}-${section.value}`}
							onClick={() => {
								if (section.value !== value) onValueChange(section.value)
								else if (collapsible) onValueChange('')
							}}
							style={{ animationDelay: `${section.delay ?? 0.2}s` }}
							className={`interactive-title-motion relative rounded-md border-[3px] border-primary bg-dark px-2 pr-4 text-center font-bold uppercase italic tracking-tighter text-primary shadow-sm transition-colors aria-pressed:z-10 aria-pressed:border-dark aria-pressed:bg-grayDark aria-pressed:text-dark ${EDITORIAL_MOBILE_TAB_STYLE} ${buttonClassName}`}
						>
							<RichText value={section.title} inline allowLinks={false} />
						</motion.button>
						{value === section.value && activeBadge}
					</div>
					{value === section.value && activeCaption && (
						<div className="relative z-20 -mt-1 flex max-w-full justify-center px-4">
							{activeCaption}
						</div>
					)}
				</div>
			))}
		</div>
	)
}
