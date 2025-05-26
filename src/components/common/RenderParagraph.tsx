import { motion } from 'motion/react'
import LogoShortTsx from '@/components/svgs/LogoShort'

export const renderParagraph = (
	paragraph: any,
	titles: string[],
	logoStyle?: string,
) => {
	if (!paragraph?.value) return null

	const systemDVariations = [
		'system d',
		'system_d',
		'system-d',
		'système d',
		'système_d',
		'système-d',
		'SYSTEM D',
		'SYSTEM_D',
		'SYSTEM-D',
		'SYSTÈME D',
		'SYSTÈME_D',
		'SYSTÈME-D',
	]

	// Define a few fun rotation classes
	const rotations = [
		'-rotate-6',
		'-rotate-3',
		'rotate-12',
		'-rotate-12',
		'rotate-3',
		'rotate-6',
	]

	return paragraph.value
		.split(new RegExp(`(${systemDVariations.join('|')})`, 'gi'))
		.map((part: string, index: number) => {
			const isTitle = titles.some(
				(title) => title.trim().toLowerCase() === part.trim().toLowerCase(),
			)

			// Check if the part matches a System D variation and is not part of another word
			const isSystemD =
				systemDVariations.some(
					(variation) => variation.toLowerCase() === part.trim().toLowerCase(),
				) &&
				// Ensure it's surrounded by spaces, punctuation, or is at the start/end of the string
				/^\s*$|[\s.,!?;:"'(){}\[\]]/.test(
					paragraph.value[paragraph.value.indexOf(part) - 1] || ' ',
				) &&
				/^\s*$|[\s.,!?;:"'(){}\[\]]/.test(
					paragraph.value[paragraph.value.indexOf(part) + part.length] || ' ',
				)

			if (isSystemD) {
				const randomRotation =
					rotations[Math.floor(Math.random() * rotations.length)]

				const randomDelay = Math.random() * 1.5 // Random delay between 0 and 1.5 seconds

				return (
					<motion.span
						key={index}
						className="z-10 inline-block"
						animate={{
							rotate: 3,
							transition: {
								ease: [0.76, 0, 0.24, 1],
								duration: 1.5,
								repeat: Infinity,
								repeatType: 'reverse',
								delay: randomDelay,
							},
						}}
					>
						<LogoShortTsx
							className={`mr-[0.10rem] inline-block h-auto w-[9rem] rounded-md px-2 py-1 sm:w-[15rem] ${randomRotation} ${logoStyle}`}
						/>
					</motion.span>
				)
			}

			return (
				<span key={index} className={isTitle ? 'font-bold' : ''}>
					{part}
				</span>
			)
		})
}
