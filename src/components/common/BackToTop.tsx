'use client'
import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import FilterIcon from '../svgs/FilterIcon'
import ArrowIcon from '../svgs/ArrowIcon'
import ArrowRight from './ArrowRight'
import NewArrowRightSimple from './NewArrowRightSimple'

interface BackToTopButtonProps {
	targetId: string // Section ID (e.g. "photo-gallery")
}

const BackToTopButton: React.FC<BackToTopButtonProps> = ({ targetId }) => {
	const [isVisible, setIsVisible] = useState(false)

	// useEffect(() => {
	// 	const handleScroll = () => {
	// 		const target = document.getElementById(targetId)
	// 		if (!target) return

	// 		const rect = target.getBoundingClientRect()
	// 		const inView = rect.top <= 100 && rect.bottom >= 200 // adjust as needed
	// 		setIsVisible(inView)
	// 	}

	// 	window.addEventListener('scroll', handleScroll)
	// 	return () => window.removeEventListener('scroll', handleScroll)
	// }, [targetId])

	useEffect(() => {
		const handleScroll = () => {
			setIsVisible(window.scrollY > 50) // Show after scrolling 200px
		}
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

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
					className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-lg border-2 border-dark bg-grayDark p-2"
				>
					<NewArrowRightSimple
						theme={{ stroke: 'var(--color-dark)' }}
						className="h-full w-full -rotate-90"
					/>
				</motion.button>
			)}
		</motion.div>
	) : null
}

export default BackToTopButton
