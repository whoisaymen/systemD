'use client'
import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'

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
	// <div ref={ref}>
	// 	<AccordionPrimitive.Item
	// 		className={cn('border-b-none', className)}
	// 		{...props}
	// 	/>
	// </div>
))
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
		animationDelay?: number
	}
>(({ className, children, animationDelay, style, ...props }, ref) => {
	const delay = animationDelay ?? 0.2

	return (
		<div className="z-20">
			<AccordionPrimitive.Header className="flex">
				<AccordionPrimitive.Trigger
					ref={ref}
					style={{ animationDelay: `${delay}s`, ...style }}
					className={cn(
						'interactive-title-motion',
						'flex items-center justify-center gap-1 rounded-md border-[3px] px-2 pr-4 text-center text-4xl font-bold uppercase italic tracking-tighter shadow-sm transition-colors lg:pt-px lg:text-7xl',
						'border-primary bg-dark text-primary',
						'data-[state=open]:border-grayDark data-[state=open]:bg-grayDark data-[state=open]:text-dark',
						'lg:hover:border-grayDark lg:hover:bg-grayDark lg:hover:text-dark',
						className,
					)}
					{...props}
				>
					{children}
					{/* <ChevronDown className="text-muted-foreground h-full w-12 shrink-0 transition-transform duration-200" /> */}
				</AccordionPrimitive.Trigger>
			</AccordionPrimitive.Header>
		</div>
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
