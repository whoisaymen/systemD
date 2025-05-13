'use client'
import { motion } from 'motion/react'
import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
	<AccordionPrimitive.Item
		ref={ref}
		className={cn('border-b-none', className)}
		{...props}
	/>
))
AccordionItem.displayName = 'AccordionItem'

// Generate a random delay between min and max values
const getRandomDelay = (min = 0.1, max = 0.8) => {
	return Math.random() * (max - min) + min
}

const AccordionTrigger = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
		animationDelay?: number
	}
>(({ className, children, animationDelay, ...props }, ref) => {
	// Use provided delay or generate a random one if not specified
	const delay = animationDelay !== undefined ? animationDelay : getRandomDelay()

	return (
		<motion.div
			className="z-10"
			animate={{
				rotate: 1,
				transition: {
					duration: 0.3,
					repeat: Infinity,
					delay: delay,
					repeatType: 'reverse',
					ease: 'easeInOut',
				},
			}}
		>
			<AccordionPrimitive.Header className="flex">
				<AccordionPrimitive.Trigger
					ref={ref}
					className={cn(
						'flex items-center justify-center gap-1 rounded-md border-[3px] px-2 pr-4 text-center text-4xl font-bold uppercase italic tracking-tighter shadow-sm transition-all',
						'border-dark bg-primary text-dark dark:border-primary dark:bg-dark dark:text-primary',
						'data-[state=open]:border-primary data-[state=open]:bg-dark data-[state=open]:text-primary data-[state=open]:dark:bg-primary data-[state=open]:dark:text-dark',
						className,
					)}
					{...props}
				>
					{children}
					{/* <ChevronDown className="text-muted-foreground h-full w-12 shrink-0 transition-transform duration-200" /> */}
				</AccordionPrimitive.Trigger>
			</AccordionPrimitive.Header>
		</motion.div>
	)
})
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Content
		ref={ref}
		className="h-full w-full overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
		{...props}
	>
		<div className={cn('pb-4 pt-0', className)}>{children}</div>
	</AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
