'use client'
import { motion, useInView } from 'motion/react'
import { useScroll, useTransform } from 'motion/react'
import Img from '@/ui/Img'
import LogoShortTsx from '../svgs/LogoShort'
import { useRef } from 'react'
import BigBangLogoMobile from './BigBangLogoMobile'
import BackToTopButton from '../common/BackToTop'

const ShortStory = ({ content, lang }: { content: any; lang: any }) => {
	return (
		<div className="flex flex-col space-y-8 pb-28 sm:space-y-0 sm:py-0">
			{content.map((block: any) => (
				<StoryBlock key={block._key} block={block} lang={lang} />
			))}
		</div>
	)
}

const StoryBlock = ({ block, lang }: { block: any; lang: any }) => {
	const ref = useRef(null)

	// Use scroll and transform for each individual block
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start 25vh', 'end center'], // Animation starts when the block reaches the middle of the screen
	})

	// Transform the scroll progress into a border radius value
	const borderRadius = useTransform(scrollYProgress, [0, 1], [10, 120])

	const scale = useTransform(scrollYProgress, [0, 1], [0.75, 1])
	const rotate = useTransform(scrollYProgress, [0, 1], [-10, 10])

	const themeColors = {
		dark: {
			fill: 'var(--color-dark)',
			stroke: 'var(--color-primary)',
			icon: 'var(--color-primary)',
		},
		sparkle: {
			fill: 'var(--color-primary)',
			stroke: 'var(--color-dark)',
		},
		festival: {
			fill: 'var(--color-dark)',
			stroke: 'var(--color-primary)',
			icon: 'var(--color-grayDark)',
		},
		memoire: {
			fill: 'var(--color-dark)',
			stroke: '',
			icon: 'var(--color-primary)',
		},
	}
	return (
		<div
			ref={ref}
			className="flex w-full flex-col items-center justify-center space-y-4 rounded-md px-4 text-center sm:my-0 sm:space-y-0 sm:bg-grayLight sm:dark:bg-grayDark"
			id="short-story"
		>
			<div className="fixed bottom-4 right-12 z-50">
				<BackToTopButton targetId="navbar-mobile" />
			</div>
			{block.text && (
				<motion.div
					style={{ borderRadius }}
					transition={{
						// duration: 2,
						ease: [0.76, 0, 0.24, 1],
					}}
					className="relative border-2 border-dark bg-primary px-4 py-6 shadow-sm dark:bg-secondary sm:mt-1 sm:border-0 sm:py-10 sm:shadow-none sm:dark:bg-transparent"
				>
					{block.text
						.filter((paragraph: any) => paragraph._key === lang) // Filter the text by the selected language key
						.map((paragraph: any, index: number) => (
							<p
								key={index}
								className="py-0 text-center text-xl font-bold leading-[1.1] tracking-tighter text-dark dark:text-dark sm:py-4 sm:text-3xl"
							>
								{renderParagraph(
									paragraph,
									block.title.map((title: any) => title.value),
								)}
							</p>
						))}
				</motion.div>
			)}
			{block.image && (
				<motion.div
					className="w-full px-2 pt-6 sm:px-8 sm:py-8"
					style={{ scale }}

					// animate={{
					// 	scale: [1, 0.75, 1],
					// 	transition: {
					// 		duration: 6,
					// 		ease: [0.76, 0, 0.24, 1],
					// 		repeat: Infinity,
					// 	},
					// }}
				>
					<Img
						image={block.image}
						src={`/${block.image.asset._ref.split('-')[1]}-${block.image.asset._ref.split('-')[2]}.${block.image.asset._ref.split('-')[3]}`}
						alt="Story Image"
						className="h-auto w-full"
					/>
				</motion.div>
			)}
		</div>
	)
}

const renderParagraph = (paragraph: any, titles: string[]) => {
	if (!paragraph?.value) return null

	return paragraph.value
		.split(/(System D)/i)
		.map((part: string, index: number) => {
			const isTitle = titles.some(
				(title) => title.trim().toLowerCase() === part.trim().toLowerCase(),
			)
			const isSystemD = part.trim().toLowerCase() === 'system d'

			return isSystemD ? (
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
						},
					}}
				>
					<LogoShortTsx className="mr-[0.10rem] inline-block h-auto w-[8rem] -rotate-6 rounded-md bg-dark px-2 py-1 leading-[0] text-primary dark:bg-dark sm:w-[15rem]" />
				</motion.span>
			) : (
				<span key={index} className={isTitle ? 'font-bold' : ''}>
					{part}
				</span>
			)
		})
}

export default ShortStory
