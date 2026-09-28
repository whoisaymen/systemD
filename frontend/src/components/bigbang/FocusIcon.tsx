'use client'
import { motion } from 'motion/react'

interface FocusIconProps {
	theme: {
		frame?: string
		focus?: string
		fill?: string
	}
	className?: string
}

const FocusIcon: React.FC<FocusIconProps> = ({ theme, className }) => (
	<svg
		className={className}
		viewBox="0 0 3070 1917"
		fill="none"
		xmlns="http://www.w3.org/1000/svg"
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M2608.06 1891.26H3044.37V1454.95H3069.22V1916.11H2608.06V1891.26Z"
			fill={theme.frame}
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M3044.37 461.736V25.4237L2608.06 25.4236V0.576294L3069.22 0.576334V461.736H3044.37Z"
			fill={theme.frame}
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M25.4235 1454.95V1891.26H461.736V1916.11H0.576172V1454.95H25.4235Z"
			fill={theme.frame}
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M461.738 25.4237L25.4257 25.4236L25.4257 461.736H0.578318L0.578339 0.576303L461.738 0.576323V25.4237Z"
			fill={theme.frame}
		/>
		<motion.path
			animate={{
				// x: [0, 100, 0],

				scale: [1.1, 1.6, 1.1],
				transition: {
					duration: 3,
					ease: [0.76, 0, 0.24, 1],
					repeat: Infinity,
				},
			}}
			d="M1374.3 1330.8H1698.12V1566.66H1374.3V1330.8Z"
			fill={theme.fill}
		/>
		<motion.path
			animate={{
				// x: [0, 100, 0],
				scale: [1.1, 1.6, 1.1],
				transition: {
					duration: 3,
					ease: [0.76, 0, 0.24, 1],
					repeat: Infinity,
				},
			}}
			fillRule="evenodd"
			clipRule="evenodd"
			d="M1673.27 1355.65H1399.15V1541.82H1673.27V1355.65ZM1374.3 1330.8V1566.66H1698.12V1330.8H1374.3Z"
			fill={theme.focus}
		/>
		<motion.path
			animate={{
				x: [0, -100, 0],
				scale: [1.1, 1.6, 1.1],
				transition: {
					delay: 0.1,
					duration: 3,
					ease: [0.76, 0, 0.24, 1],
					repeat: Infinity,
				},
			}}
			d="M1374.3 344.419H1698.12V580.284H1374.3V344.419Z"
			fill={theme.fill}
		/>
		<motion.path
			animate={{
				x: [0, -100, 0],
				scale: [1.1, 1.6, 1.1],
				transition: {
					delay: 0.1,
					duration: 3,
					ease: [0.76, 0, 0.24, 1],
					repeat: Infinity,
				},
			}}
			fillRule="evenodd"
			clipRule="evenodd"
			d="M1673.27 369.266H1399.15V555.437H1673.27V369.266ZM1374.3 344.419V580.284H1698.12V344.419H1374.3Z"
			fill={theme.focus}
		/>
		<motion.path
			animate={{
				x: [0, 100, 0],
				scale: [1.1, 1.6, 1.1],
				transition: {
					delay: 0.2,
					duration: 3,
					ease: [0.76, 0, 0.24, 1],
					repeat: Infinity,
				},
			}}
			d="M425.092 835.019H748.908V1070.89H425.092V835.019Z"
			fill={theme.fill}
		/>
		<motion.path
			animate={{
				x: [0, 100, 0],
				scale: [1.1, 1.6, 1.1],
				transition: {
					delay: 0.2,
					duration: 3,
					ease: [0.76, 0, 0.24, 1],
					repeat: Infinity,
				},
			}}
			fillRule="evenodd"
			clipRule="evenodd"
			d="M724.06 859.867H449.939V1046.04H724.06V859.867ZM425.092 835.019V1070.89H748.908V835.019H425.092Z"
			fill={theme.focus}
		/>
		<motion.path
			animate={{
				x: [0, -100, 0],
				scale: [1.1, 1.6, 1.1],
				transition: {
					delay: 0.3,
					duration: 3,
					ease: [0.76, 0, 0.24, 1],
					repeat: Infinity,
				},
			}}
			d="M2310.58 835.019H2634.4V1070.89H2310.58V835.019Z"
			fill={theme.fill}
		/>
		<motion.path
			animate={{
				x: [0, -100, 0],
				scale: [1.1, 1.6, 1.1],
				transition: {
					delay: 0.3,
					duration: 3,
					ease: [0.76, 0, 0.24, 1],
					repeat: Infinity,
				},
			}}
			fillRule="evenodd"
			clipRule="evenodd"
			d="M2609.55 859.867H2335.43V1046.04H2609.55V859.867ZM2310.58 835.019V1070.89H2634.4V835.019H2310.58Z"
			fill={theme.focus}
		/>
	</svg>
)

export default FocusIcon
