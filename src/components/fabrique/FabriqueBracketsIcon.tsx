'use client'
import { motion } from 'motion/react'

interface FabriqueBracketsIconProps {
	theme: {
		fill?: string
		stroke?: string
		icon?: string
	}
	className?: string
}

const FabriqueBracketsIcon: React.FC<FabriqueBracketsIconProps> = ({
	theme,
	className,
}) => (
	<motion.svg
		className={className}
		viewBox="0 0 60 60"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		animate={{
			scale: [1.02, 1.2, 1.02],
		}}
		transition={{
			duration: 6,
			ease: [0.76, 0, 0.24, 1],
			repeat: Infinity,
		}}
	>
		<path
			d="M24 11C24 11.5523 23.5523 12 23 12H13C12.4477 12 12 12.4477 12 13V24C12 24.5523 11.5523 25 11 25H1C0.447715 25 0 24.5523 0 24V1C0 0.447716 0.447715 0 1 0H23C23.5523 0 24 0.447715 24 1V11Z"
			fill={theme.fill}
		/>
		<path
			d="M11 36C11.5523 36 12 36.4477 12 37L12 47C12 47.5523 12.4477 48 13 48L24 48C24.5523 48 25 48.4477 25 49L25 59C25 59.5523 24.5523 60 24 60L1 60C0.447716 60 -1.95703e-08 59.5523 -4.37114e-08 59L-1.00536e-06 37C-1.0295e-06 36.4477 0.447714 36 0.999999 36L11 36Z"
			fill={theme.fill}
		/>
		<path
			d="M36 49C36 48.4477 36.4477 48 37 48L47 48C47.5523 48 48 47.5523 48 47L48 36C48 35.4477 48.4477 35 49 35L59 35C59.5523 35 60 35.4477 60 36L60 59C60 59.5523 59.5523 60 59 60L37 60C36.4477 60 36 59.5523 36 59L36 49Z"
			fill={theme.fill}
		/>
		<path
			d="M49 24C48.4477 24 48 23.5523 48 23L48 13C48 12.4477 47.5523 12 47 12L36 12C35.4477 12 35 11.5523 35 11L35 0.999999C35 0.447714 35.4477 -1.07321e-06 36 -1.04907e-06L59 -4.37114e-08C59.5523 -1.95703e-08 60 0.447715 60 1L60 23C60 23.5523 59.5523 24 59 24L49 24Z"
			fill={theme.fill}
		/>
	</motion.svg>
)

export default FabriqueBracketsIcon
