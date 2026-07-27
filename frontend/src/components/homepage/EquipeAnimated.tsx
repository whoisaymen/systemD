'use client'
import { motion } from 'motion/react'

interface EquipeLogoAnimatedProps {
	theme: {
		icon?: string
	}
	className?: string
}

const EquipeLogoAnimated: React.FC<EquipeLogoAnimatedProps> = ({
	theme,
	className,
}) => (
	<svg
		className={className}
		viewBox="0 0 316 56"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<motion.path
			d="M155 5C155 2.23858 157.239 0 160 0H173.983C176.745 0 178.983 2.23858 178.983 5V51C178.983 53.7614 176.745 56 173.983 56H160C157.239 56 155 53.7614 155 51V5Z"
			stroke="currentColor"
			strokeWidth="0"
			fill={theme.icon}
			style={{ originX: 1.3 }}
			animate={{
				scaleX: [1, 1.2, 0.9, 1],
				scaleY: [1, 0.8, 1.1, 1],
				x: [0, -2, 2, 0], // Slight side-to-side motion
				transition: {
					duration: 4,
					ease: [0.76, 0, 0.24, 1],
					repeat: Infinity,
				},
			}}
		/>

		<motion.path
			d="M182.181 5C182.181 2.23858 184.42 0 187.181 0H204.362C207.123 0 209.362 2.23858 209.362 5V51C209.362 53.7614 207.123 56 204.362 56H187.181C184.42 56 182.181 53.7614 182.181 51V5Z"
			fill={theme.icon}
			stroke="currentColor"
			style={{ originX: 0.4 }}
			strokeWidth="0"
			animate={{
				scaleX: [1, 0.8, 1.1, 1],
				scaleY: [1, 1.1, 0.9, 1],
				x: [0, 3, -3, 0], // Opposite direction wobble
				transition: {
					duration: 5,
					// delay: 2,
					ease: [0.76, 0, 0.24, 1],
					repeat: Infinity,
				},
			}}
		/>

		<motion.path
			d="M212.56 5C212.56 2.23858 214.798 0 217.56 0H237.939C240.7 0 242.939 2.23858 242.939 5V51C242.939 53.7614 240.7 56 237.939 56H217.56C214.798 56 212.56 53.7614 212.56 51V5Z"
			fill={theme.icon}
			style={{ originX: 1 }}
			stroke="currentColor"
			strokeWidth="0"
			animate={{
				scaleX: [1, 0.7, 0.9, 1],
				scaleY: [1, 0.9, 1.1, 1],
				x: [0, -1, 1, 0],
				transition: {
					duration: 3.5,
					ease: [0.76, 0, 0.24, 1],
					repeat: Infinity,
				},
			}}
		/>

		<motion.path
			d="M246.136 5C246.136 2.23858 248.375 0 251.136 0H255.038C257.8 0 260.038 2.23858 260.038 5V51C260.038 53.7614 257.8 56 255.038 56H251.136C248.375 56 246.136 53.7614 246.136 51V5Z"
			fill={theme.icon}
			stroke="currentColor"
			strokeWidth="0"
			animate={{
				scaleX: [1, 1.2, 0.8, 1],
				scaleY: [1, 0.9, 1.1, 1],
				x: [0, 2, -2, 0],
				transition: {
					duration: 4.2,
					ease: [0.76, 0, 0.24, 1],
					repeat: Infinity,
				},
			}}
		/>

		<motion.path
			d="M263 5C263 2.23858 265.239 0 268 0H289.178C291.94 0 294.178 2.23858 294.178 5V51C294.178 53.7614 291.94 56 289.178 56H268C265.239 56 263 53.7614 263 51V5Z"
			fill={theme.icon}
			stroke="currentColor"
			strokeWidth="0"
			animate={{
				scaleX: [1, 0.9, 1.1, 1],
				scaleY: [1, 1.2, 0.8, 1],
				x: [0, -2, 2, 0],
				transition: {
					duration: 3.8,
					ease: [0.76, 0, 0.24, 1],
					repeat: Infinity,
				},
			}}
		/>

		<motion.path
			d="M297 5C297 2.23858 299.239 0 302 0H310.387C313.149 0 315.387 2.23858 315.387 5V51C315.387 53.7614 313.149 56 310.387 56H302C299.239 56 297 53.7614 297 51V5Z"
			fill={theme.icon}
			stroke="currentColor"
			strokeWidth="0"
			animate={{
				scaleX: [1, 1.3, 0.7, 1],
				scaleY: [1, 0.8, 1.2, 1],
				x: [0, 1, -1, 0],
				transition: {
					duration: 4.5,
					ease: [0.76, 0, 0.24, 1],
					repeat: Infinity,
				},
			}}
		/>
	</svg>
)

export default EquipeLogoAnimated
