import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import FestivalSparkleIcon from './FestivalSparkleIcon'

const FallingSparkle: React.FC = () => {
	const [sparkles, setSparkles] = useState<number[]>([])

	useEffect(() => {
		// Add a sparkle every few seconds
		const interval = setInterval(() => {
			setSparkles((prev) => [...prev, Date.now()])
		}, 4000) // Adjust the interval as needed

		return () => clearInterval(interval)
	}, [])

	return (
		<div className="pointer-events-none fixed inset-0 z-50">
			{sparkles.map((id) => (
				<motion.div
					key={id}
					initial={{
						x: Math.random() * window.innerWidth, // Random horizontal start position
						y: '-10vh', // Start above the viewport
					}}
					animate={{
						y: '100vh', // End below the viewport
						x: [
							Math.random() * window.innerWidth, // Start position
							Math.random() * window.innerWidth, // Slight horizontal drift
						],

						scale: [1, 0.9, 1], // Gentle scaling effect
					}}
					transition={{
						duration: Math.random() * 10 + 8, // Slower falling (8 to 18 seconds)
						ease: 'easeInOut',
					}}
					// onAnimationComplete={() => {
					// 	// Remove sparkle after animation
					// 	setSparkles((prev) => prev.filter((sparkleId) => sparkleId !== id))
					// }}
					className="absolute"
				>
					<FestivalSparkleIcon
						theme={{
							fill: 'var(--color-primary)',
							stroke: 'var(--color-dark)',
						}}
						className="h-8 w-8" // Adjust size as needed
					/>
				</motion.div>
			))}
		</div>
	)
}

export default FallingSparkle
