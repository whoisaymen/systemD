'use client'
import { motion } from 'motion/react'
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
))
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
		rotation?: number
		onOpenChange?: (isOpen: boolean) => void
	}
>(({ className, children, rotation = 0, onOpenChange, ...props }, ref) => {
	const triggerRef = React.useRef<HTMLButtonElement>(null)

	React.useEffect(() => {
		const trigger = triggerRef.current
		if (!trigger) return

		const handleClick = () => {
			// Small delay to ensure the accordion state has updated
			setTimeout(() => {
				const isOpen = trigger.getAttribute('data-state') === 'open'
				if (isOpen) {
					// Scroll the trigger to near the top of the viewport
					trigger.scrollIntoView({
						behavior: 'smooth',
						block: 'start',
						inline: 'nearest',
					})
				}
				onOpenChange?.(isOpen)
			}, 50)
		}

		trigger.addEventListener('click', handleClick)
		return () => trigger.removeEventListener('click', handleClick)
	}, [onOpenChange])

	return (
		<motion.div
			className="z-10"
			style={{ rotate: rotation }}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			transition={{ duration: 0.2, ease: 'easeInOut' }}
		>
			<AccordionPrimitive.Header className="flex">
				<AccordionPrimitive.Trigger
					ref={(node) => {
						triggerRef.current = node
						if (typeof ref === 'function') {
							ref(node)
						} else if (ref) {
							ref.current = node
						}
					}}
					className={cn(
						'flex items-center justify-center gap-1 rounded-md border-[3px] px-2 pr-4 text-center text-4xl font-bold uppercase italic tracking-tighter shadow-sm transition-all duration-300',
						'border-dark bg-grayDark text-dark dark:border-primary dark:bg-dark dark:text-primary',
						'data-[state=open]:border-primary data-[state=open]:bg-dark data-[state=open]:text-primary data-[state=open]:dark:bg-primary data-[state=open]:dark:text-dark',
						'hover:shadow-lg',
						className,
					)}
					{...props}
				>
					{children}
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
		className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
		{...props}
	>
		<div className={cn('pb-8 pt-4', className)}>{children}</div>
	</AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
