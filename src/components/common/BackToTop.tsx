'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

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
			className="ml-2 flex cursor-pointer items-center justify-center rounded-md border-[3px] border-primary bg-dark px-3 text-3xl font-black text-primary"
		>
			{isVisible && (
				<motion.button
					whileHover={{ y: -5 }}
					onClick={scrollToTop}
					aria-label="Scroll to top of section"
				>
					↑
				</motion.button>
			)}
		</motion.div>
	) : null
}

export default BackToTopButton
