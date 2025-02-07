'use client'
import { motion } from 'framer-motion'

interface LogoShortAnimatedProps {
	fillColor?: string
	strokeColor?: string
	className?: string
}

const LogoShortAnimated: React.FC<LogoShortAnimatedProps> = ({
	fillColor,
	className,
}) => {
	return (
		<svg
			viewBox="0 0 162 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<motion.path
				id="letter-S"
				d="M13.2 8.40129C7.9 8.01502 6.1 7.62876 6.1 6.27682C6.1 5.02146 8.9 4.44206 14 4.44206C18 4.44206 21.7 5.02146 24.6 6.18026L25.8 1.64163C22.8 0.386266 18.3 0 14.1 0C5.3 0 0.1 2.3176 0.1 6.66309C0.1 11.3949 4.4 12.7468 12.9 13.4227C18.5 13.9056 20.6 14.1953 20.6 15.7403C20.6 17.1888 18.3 18.0579 12.6 18.0579C8.2 18.0579 4.3 17.382 1.3 16.2232L0 20.7618C3.8 22.1137 8.1 22.5 12.6 22.5C20.9 22.5 26.6 20.4721 26.6 14.9678C26.6 10.0429 21.9 9.07725 13.2 8.40129Z"
				fill={fillColor}
				animate={{
					scaleX: [1, 0.5, 1],
					transition: {
						duration: 5,
						ease: [0.76, 0, 0.24, 1],
						repeat: Infinity,
					},
				}}
				style={{ originX: 0 }}
			/>
			<motion.path
				id="letter-Y"
				d="M36.6999 8.61487L33.9999 0H28.3999L33.7999 15.1014L30.6999 22.5H36.5999L45.0999 0H39.4999L36.6999 8.61487Z"
				fill={fillColor}
				animate={{
					scaleX: [1, 0.6, 1],
					transition: {
						duration: 5,
						ease: [0.76, 0, 0.24, 1],
						repeat: Infinity,
					},
				}}
				style={{ originX: -2 }}
				transition={{ delay: 10 }}
			/>
			<motion.path
				id="letter-S"
				d="M55.1999 8.76106C53.1999 7.56637 52.1999 6.96903 52.1999 5.97345C52.1999 5.07743 53.0999 4.57965 55.7999 4.57965C56.7999 4.57965 57.8999 4.6792 58.7999 4.87832L58.9999 0.199115C57.9999 0.0995575 56.9999 0 55.9999 0C49.9999 0 46.8999 2.68805 46.8999 6.47124C46.8999 9.45796 48.7999 11.3496 51.1999 12.7434C53.4999 14.1372 54.3999 14.8341 54.3999 15.9292C54.3999 17.0243 53.2999 17.8208 50.0999 17.8208C49.2999 17.8208 48.0999 17.7212 47.1999 17.5221L46.9999 22.4004C47.8999 22.5 48.7999 22.5 49.5999 22.5C55.7999 22.5 59.6999 20.0111 59.6999 15.4314C59.7999 12.146 57.8999 10.354 55.1999 8.76106Z"
				fill={fillColor}
				animate={{
					scaleX: [1, 2, 1],
					transition: {
						duration: 5,
						ease: [0.76, 0, 0.24, 1],
						repeat: Infinity,
					},
				}}
				style={{ originX: 1.7 }}
				transition={{ delay: 10 }}
			/>
			<motion.path
				id="letter-T"
				d="M61.6001 4.78507H65.9001V22.5H71.2001V4.78507H75.5001V0H61.6001V4.78507Z"
				fill={fillColor}
				animate={{
					scaleX: [1, 2, 1],
					transition: {
						duration: 5,
						ease: [0.76, 0, 0.24, 1],
						repeat: Infinity,
					},
				}}
				transition={{ delay: 2 }}
				style={{ originX: 0.8 }}
			/>

			<motion.path
				id="letter-E"
				d="M77.2 22.5H89.8V17.9392H82.5V12.5676H89.8V8.20946H82.5V4.56081H89.8V0H77.2V22.5Z"
				fill={fillColor}
				animate={{
					scaleX: [1, 0.67, 1],
					transition: {
						duration: 5,
						ease: [0.76, 0, 0.24, 1],
						repeat: Infinity,
					},
				}}
				transition={{ delay: 8 }}
				style={{ originX: 0.7 }}
			/>
			<motion.path
				id="letter-M"
				d="M132 18.2H110.4V0H109.6L101 9.2L92.4001 0.1H91.6001V22.5H97.0001V11.9L100.8 16.1H101.2L105.1 11.8V22.5H105.3H132V18.2Z"
				fill={fillColor}
				animate={{
					scaleX: [1, 0.5, 1],
					transition: {
						duration: 5,
						ease: [0.76, 0, 0.24, 1],
						repeat: Infinity,
					},
				}}
				transition={{ delay: 8 }}
				style={{ originX: -0.07 }}
			/>
			<motion.path
				id="letter-D"
				d="M147.406 0H132V18.1841V22.5L147.442 22.4733C155.035 22.4733 162 19.307 162 11.0036C162 2.70031 154.967 0 147.406 0ZM146.432 17.6761H137.897V4.80097H146.432C152.329 4.80097 155.909 6.8367 155.909 11.0686C155.909 15.3005 152.333 17.6723 146.432 17.6723V17.6761Z"
				fill={fillColor}
				animate={{
					scaleX: [1, 1.6, 1],
					transition: {
						duration: 5,
						ease: [0.76, 0, 0.24, 1],
						repeat: Infinity,
					},
				}}
				transition={{ delay: 8 }}
				style={{ originX: 1.3 }}
			/>
		</svg>
	)
}

export default LogoShortAnimated
