'use client'
import { motion } from 'motion/react'

interface AnimatedCircleProps {
	theme: {
		fill: string
	}
	className?: string
}

const AnimatedCircle: React.FC<AnimatedCircleProps> = ({
	theme,
	className,
}) => (
	<svg
		className={className}
		viewBox="-30 -30 120 120"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<motion.circle
			cx="30"
			cy="30"
			r="30"
			fill={theme.fill}
			animate={{
				scale: [1, 1.5, 1], // Zoom in and out
				transition: {
					duration: 6,
					ease: [0.76, 0, 0.24, 1],
					repeat: Infinity,
				},
			}}
		/>
	</svg>
)

export default AnimatedCircle
