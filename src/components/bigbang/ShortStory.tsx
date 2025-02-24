'use client'
import { motion } from 'motion/react'
import Img from '@/ui/Img'
import Link from 'next/link'
import LogoShortTsx from '../svgs/LogoShort'
import { getRandomRotationClass } from '@/lib/utils'
import FocusIcon from './FocusIcon'

const ShortStory = ({ content, lang }: { content: any; lang: any }) => {
	const theme = {
		light: {
			frame: 'var(--color-primary)',
			focus: 'var(--color-dark)',
			fill: 'var(--color-primary)',
		},
		dark: {
			frame: 'var(--color-primary)',
			focus: 'var(--color-primary)',
			fill: 'var(--color-grayDark)',
		},
	}

	return (
		<div className="flex flex-col space-y-8 pb-28">
			{content.map((block: any) => (
				<div
					key={block._key}
					className="flex w-full flex-col items-center justify-center space-y-12 px-2 text-center"
				>
					{/* {block.title && (
						<div>
							{block.title
								.map((title: any, index: number) => (
									<h3 key={index} className="font-bold">
										{title.value}
									</h3>
								))
								.slice(0, 1)}
						</div>
					)} */}

					{block.text && (
						<motion.div
							initial={{
								borderRadius: '0.375rem',
							}}
							animate={{ borderRadius: '5rem' }}
							transition={{
								duration: 2,
								ease: [0.76, 0, 0.24, 1],
								repeat: Infinity,
								repeatType: 'reverse',
							}}
							className="relative mt-2 rounded-full border-2 border-dark bg-[#fff] px-4 py-10 shadow-sm dark:bg-secondary sm:py-10"
						>
							{block.text
								.filter((paragraph: any) => paragraph._key === lang) // Filter the text by the selected language key
								.map((paragraph: any, index: number) => (
									<p
										key={index}
										className="mx-auto py-2 text-center text-xl font-bold leading-[1.2] tracking-tighter text-dark sm:py-4 sm:text-4xl"
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
						<div className="w-full px-2">
							<Img
								image={block.image}
								src={`/${block.image.asset._ref.split('-')[1]}-${block.image.asset._ref.split('-')[2]}.${block.image.asset._ref.split('-')[3]}`}
								alt="Story Image"
								className="h-auto w-full"
							/>
						</div>
					)}
				</div>
			))}
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
				<LogoShortTsx
					key={index}
					className="mr-[0.10rem] inline-block h-auto w-[9rem] -rotate-6 rounded-md bg-dark px-2 py-1 text-primary dark:bg-dark sm:w-[15rem]"
				/>
			) : (
				<span key={index} className={isTitle ? 'font-bold' : ''}>
					{part}
				</span>
			)
		})
}

export default ShortStory
