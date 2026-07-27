'use client'
import { motion } from 'motion/react'

interface FestivalAnimatedProps {
	theme: {
		fill?: string
		stroke?: string
		icon?: string
	}
	className?: string
}

const FestivalAnimated: React.FC<FestivalAnimatedProps> = ({
	theme,
	className,
}) => (
	<svg
		className={className}
		viewBox="0 0 8908 1434"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<motion.path
			initial={{ scale: 1 }}
			animate={{
				scale: 0.8,
				transition: {
					duration: 1,
					ease: [0.76, 0, 0.24, 1],

					repeat: Infinity,
					repeatType: 'reverse',
				},
			}}
			d="M8892.75 723.017C8585.73 659.435 8453.77 471.277 8398.73 72.6173C8395.53 49.3327 8371.24 49.3327 8368.04 72.6173C8312.99 471.277 8181.04 659.435 7874.02 723.017C7864.81 724.899 7859.97 734.542 7859.42 744.577C7859.97 754.612 7864.81 764.177 7874.02 766.137C8181.04 829.719 8312.99 1017.88 8368.04 1416.54C8371.24 1439.82 8395.53 1439.82 8398.73 1416.54C8453.77 1017.88 8585.73 829.719 8892.75 766.137C8901.96 764.255 8906.8 754.612 8907.35 744.577C8906.8 734.542 8901.96 724.977 8892.75 723.017Z"
			fill={theme.icon}
			className="absolute bottom-0 left-0"
		/>

		<motion.path
			d="M734.202 467.504C516.061 422.997 422.302 291.286 383.19 12.2244C380.915 -4.0748 363.662 -4.0748 361.387 12.2244C322.275 291.286 228.516 422.997 10.3745 467.504C3.82802 468.821 0.388349 475.572 0 482.596C0.388349 489.621 3.82802 496.316 10.3745 497.688C228.516 542.195 322.275 673.906 361.387 952.968C363.662 969.267 380.915 969.267 383.19 952.968C422.302 673.906 516.061 542.195 734.202 497.688C740.749 496.371 744.189 489.621 744.577 482.596C744.189 475.572 740.749 468.876 734.202 467.504Z"
			fill={theme.icon}
			initial={{ scale: 1 }}
			className="absolute bottom-0 left-0"
			animate={{
				scale: 0.85,
				transition: {
					duration: 1,
					ease: 'easeInOut',
					repeat: Infinity,
					repeatType: 'reverse',
				},
			}}
		/>
	</svg>
)

export default FestivalAnimated
