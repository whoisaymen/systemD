'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import FilterIcon from '../svgs/FilterIcon'
import ArrowIcon from '../svgs/ArrowIcon'
import ArrowRight from './ArrowRight'

interface BackToTopButtonProps {
	targetId: string // Section ID (e.g. "photo-gallery")
}

const BackToTopButton: React.FC<BackToTopButtonProps> = ({ targetId }) => {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			const target = document.getElementById(targetId)
			if (!target) return

			const rect = target.getBoundingClientRect()
			const inView = rect.top <= 100 && rect.bottom >= 200 // adjust as needed
			setIsVisible(inView)
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [targetId])

	const scrollToTop = () => {
		const target = document.getElementById(targetId)
		if (target) {
			target.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		}
	}

	return isVisible ? (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: isVisible ? 1 : 0 }}
			transition={{ duration: 0.3 }}
			// className="flex w-10 items-center justify-center rounded-md border-2 border-primary bg-dark"
			className="flex w-10 items-center justify-center"
		>
			{isVisible && (
				<motion.button
					whileHover={{ y: -5 }}
					onClick={scrollToTop}
					aria-label="Scroll to top of section"
				>
					{/* <ArrowIcon
						theme={{
							fill: 'var(--color-primary)',
						}}
						className="h-full w-full p-1"
					/> */}
					<ArrowRight
						theme={{ fill: 'var(--color-primary)' }}
						className="h-auto w-10 -rotate-90 lg:w-9"
					/>
				</motion.button>
			)}
		</motion.div>
	) : null
}

export default BackToTopButton
