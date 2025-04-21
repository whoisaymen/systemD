'use client'
import { motion } from 'motion/react'

interface MemoirePlayAnimatedProps {
	theme: {
		fill?: string
		stroke?: string
		icon?: string
	}
	className?: string
}

const MemoirePlayAnimated: React.FC<MemoirePlayAnimatedProps> = ({
	theme,
	className,
}) => (
	<svg
		className={className}
		viewBox="0 0 8160 1532"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<motion.path
			d="M2434.47 1296.86V230.918C2434.47 130.354 2545.06 69.0159 2630.37 122.259L3484.35 655.231C3564.71 705.383 3564.71 822.395 3484.35 872.547L2630.37 1405.52C2545.06 1458.76 2434.47 1397.42 2434.47 1296.86Z"
			fill={theme.icon}
			animate={{
				// x: [0, 200, 0],
				scale: [1, 0.9, 1, 1, 1],
				rotate: [0, 360, 0, 0, 0],
				transition: {
					duration: 5,
					ease: [0.76, 0, 0.24, 1],
					repeat: Infinity,
				},
			}}
		/>
		<motion.path
			d="M1472.77 1296.86L1472.77 230.918C1472.77 130.354 1583.36 69.0159 1668.67 122.259L2522.65 655.231C2603.01 705.383 2603.01 822.395 2522.65 872.547L1668.67 1405.52C1583.36 1458.76 1472.77 1397.42 1472.77 1296.86Z"
			fill={theme.icon}
			animate={{
				// x: [0, 200, 0],
				scale: [1, 0.9, 1, 1, 1],
				rotate: [0, 360, 0, 0, 0],
				transition: {
					duration: 5,
					ease: [0.76, 0, 0.24, 1],
					repeat: Infinity,
				},
			}}
		/>
	</svg>
)

export default MemoirePlayAnimated
