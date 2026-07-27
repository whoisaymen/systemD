'use client'
import { motion } from 'motion/react'
import Img from '@/ui/Img'
import LogoShortTsx from '../svgs/LogoShort'
import { useRef } from 'react'
import BackToTopButton from '../common/BackToTop'

const ease = [0.76, 0, 0.24, 1] as const

const ShortStory = ({ content, lang }: { content: any; lang: any }) => {
	return (
		<div className="flex flex-col space-y-0 pb-28 sm:space-y-0 sm:py-0">
			{content.map((block: any, index: number) => (
				<StoryBlock
					key={block._key}
					block={block}
					lang={lang}
					animationVariant={index % 3}
				/>
			))}
		</div>
	)
}

const StoryBlock = ({
	block,
	lang,
	animationVariant = 0,
}: {
	block: any
	lang: any
	animationVariant?: number
}) => {
	const ref = useRef(null)

	const animations = [
		{
			// Variant 0 - Slow pulse
			container: {
				borderRadius: [10, 50, 10],
				scale: [1, 1.02, 1],
				transition: {
					duration: 8,
					ease,
					repeat: Infinity,
				},
			},
			image: {
				// scale: [0.8, 0.6, 0.8],
				scale: [1, 0.3, 1],
				transition: {
					duration: 4,
					ease,
					repeat: Infinity,
				},
			},
		},
	]

	const imageVariants = {
		mobile: {
			scale: [1, 0.5, 1],
			transition: { duration: 4, ease, repeat: Infinity },
		},
		desktop: {
			scale: [0.8, 0.5, 0.8],
			transition: { duration: 4, ease, repeat: Infinity },
		},
	}

	const animation = animations[animationVariant % animations.length]

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
			className="flex w-full flex-col items-center justify-center space-y-4 rounded-md px-4 text-center sm:my-0 sm:mt-16 sm:space-y-0"
			id="short-story"
		>
			<div className="fixed bottom-4 right-12 z-50">
				<BackToTopButton targetId="navbar-mobile" />
			</div>
			{block.text && (
				<motion.div
					// animate={animation.container}
					className="lg:shadowtest shadowtest relative rounded-xl bg-primary px-4 py-6 shadow-sm sm:mx-40 sm:mt-1 sm:border-0 sm:py-10 sm:shadow-none lg:bg-primary lg:bg-gradient-to-t lg:from-primary"
				>
					{block.text
						.filter((paragraph: any) => paragraph.language === lang || paragraph._key === lang)
						.map((paragraph: any, index: number) => (
							<p
								key={index}
								className="py-0 text-center text-xl font-bold leading-[1.1] tracking-tighter text-dark sm:py-2 sm:text-3xl"
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
					variants={imageVariants}
					animate={window.innerWidth >= 1024 ? 'desktop' : 'mobile'}
					className="relative w-full px-2 pt-0 sm:px-8 lg:py-8"
				>
					{/* <Img
						image={block.image}
						src={`/${block.image.asset._ref.split('-')[1]}-${block.image.asset._ref.split('-')[2]}.${block.image.asset._ref.split('-')[3]}`}
						alt="Story Image"
						style={{
							filter: 'grayscale(1) hue-rotate(70deg) brightness(0.8)',
						}}
						className="h-auto w-full"
					/> */}

					{block.svgMarkup && (
						<div
							className="h-auto w-full"
							style={{ color: 'var(--color-grayDark)' }}
							dangerouslySetInnerHTML={{ __html: block.svgMarkup }}
						/>
					)}
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
							ease,
							duration: 1.5,
							repeat: Infinity,
							repeatType: 'reverse',
						},
					}}
				>
					<LogoShortTsx className="mr-[0.10rem] inline-block h-auto w-[8rem] -rotate-6 rounded-md bg-grayDark px-2 py-1 leading-[0] text-dark sm:w-[15rem]" />
				</motion.span>
			) : (
				<span key={index} className={isTitle ? 'font-bold' : ''}>
					{part}
				</span>
			)
		})
}

export default ShortStory
