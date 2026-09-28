'use client'

import { useState, type ComponentProps } from 'react'
import { LayoutGroup, motion, useReducedMotion } from 'motion/react'
import MobileSectionMenu from '@/components/common/MobileSectionMenu'

type MobileEditionMenuProps = Omit<
	ComponentProps<typeof MobileSectionMenu>,
	'activeBadge' | 'onStickyChange'
> & { year: number }

export default function MobileEditionMenu({
	year,
	...props
}: MobileEditionMenuProps) {
	// Keep scroll updates local so the edition's photos and films do not re-render.
	const [yearDocked, setYearDocked] = useState(false)
	const reduceMotion = useReducedMotion()
	const yearBadge = (docked: boolean) => (
		<motion.span
			layoutId="edition-year"
			data-edition-year={docked ? 'docked' : 'header'}
			initial={false}
			animate={{ rotate: -6 }}
			transition={
				reduceMotion
					? { duration: 0 }
					: { type: 'spring', stiffness: 380, damping: 30, mass: 0.7 }
			}
			className={`pointer-events-none z-30 h-fit rounded-md bg-primary px-1.5 text-sm font-black not-italic leading-tight tracking-tight text-dark ${docked ? 'absolute -right-3 -top-1' : 'relative'}`}
		>
			{year}
		</motion.span>
	)

	return (
		<LayoutGroup id={`edition-${year}`}>
			<div className="pointer-events-none sticky top-2 z-[70] -mt-8 mb-8 flex h-0 justify-end lg:hidden">
				{!yearDocked && yearBadge(false)}
			</div>
			<MobileSectionMenu
				{...props}
				onStickyChange={setYearDocked}
				activeBadge={yearDocked ? yearBadge(true) : undefined}
			/>
		</LayoutGroup>
	)
}
