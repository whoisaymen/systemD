'use client'
import { motion, AnimatePresence } from 'motion/react'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { FiX } from 'react-icons/fi'
import { useNavigation } from './NavigationProvider'

interface SlideContentProps {
	children: ReactNode
	locale: string
}

export default function SlideContent({ children, locale }: SlideContentProps) {
	const { isSliding, closeContent } = useNavigation()
	const pathname = usePathname()

	return (
		<div className="relative w-full">
			{/* Render content normally when not sliding */}
			{!isSliding && (
				<main className="z-40 w-full rounded-md lg:flex lg:min-h-[calc(100svh-0.50rem)] lg:w-full lg:items-center lg:justify-center lg:px-[calc(var(--width-column-width))]">
					{children}
				</main>
			)}

			{/* Animated sliding content */}
			<AnimatePresence>
				{isSliding && (
					<motion.main
						key="slide-content"
						className="absolute left-0 top-0 z-40 w-full rounded-md lg:flex lg:min-h-[calc(100svh-0.50rem)] lg:w-full lg:items-center lg:justify-center lg:px-[calc(var(--width-column-width))]"
						initial={{ x: '-100%' }}
						animate={{ x: 0 }}
						exit={{ x: '-100%' }}
						transition={{ type: 'spring', stiffness: 300, damping: 30 }}
					>
						{/* Close button */}
						<button
							onClick={closeContent}
							className="hover:bg-primary/80 fixed right-8 top-8 z-50 rounded-full bg-primary p-2 text-dark shadow-md"
						>
							<FiX size={24} />
						</button>

						{children}
					</motion.main>
				)}
			</AnimatePresence>
		</div>
	)
}
