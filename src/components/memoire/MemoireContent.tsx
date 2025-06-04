'use client'
import { motion, useScroll, useTransform } from 'motion/react'

import Img from '@/ui/Img'
import MemoireFwdIcon from './MemoireFwdIcon'
import Logo from '@/sanity/schemas/documents/logo'
import LogoShortTsx from '../svgs/LogoShort'

import Link from 'next/link'
import { getRandomRotationClass } from '@/lib/utils'
import MemoireLogoMobile from './MemoireLogoMobile'
import EmptyCinema from './EmptyCinema'

interface MemoireContentProps {
	memoire: any
	language: string
}

const MemoireContent: React.FC<MemoireContentProps> = ({
	memoire,
	language,
}) => {
	const getLocalizedValue = (array: any[], lang: string) => {
		if (!Array.isArray(array)) {
			return ''
		}
		const item = array.find((entry) => entry._key === lang)
		return item ? item.value : ''
	}

	if (!memoire) {
		return <div>No content available</div>
	}

	let { scrollY } = useScroll()
	let borderRadius = useTransform(scrollY, (value) => Math.max(80 - value, 10))

	console.log(memoire.pastFestivals, 'memoirePastFestivals')

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
			fill: 'var(--color-grayDark)',
			stroke: '',
			icon: 'var(--color-primary)',
		},
	}

	const emptyCinemaTheme = {
		fill: 'var(--color-primary)',
		shadow: 'var(--color-grayDark)',
	}

	return (
		<div className="no-scrollbar rounded-md border-grayLight bg-transparent px-4 tracking-tighter dark:border-0 dark:from-dark dark:to-grayDark/25 dark:hover:bg-dark/50 sm:mt-1 sm:items-start sm:bg-dark sm:bg-gradient-to-b sm:from-grayLight sm:to-grayDark/25 sm:px-0 sm:shadow-inner">
			{/* <motion.div
				style={{ borderRadius }}
				transition={{
					duration: 2,
					ease: [0.76, 0, 0.24, 1],
		
				}}
				className="relative w-full border-2 border-dark bg-primary px-8 py-10 shadow-sm dark:bg-secondary sm:border-0 sm:py-10 sm:dark:bg-transparent"
			>
				<div className="hidden h-full w-full px-32 sm:block">
					<MemoireLogoMobile
						theme={themeColors.memoire}
						className="overflow-visible text-dark"
					/>
				</div>
				<p className="mx-auto py-2 text-center text-2xl font-bold leading-[1.2] tracking-tighter text-dark sm:hidden sm:py-4 sm:text-4xl">
					{getLocalizedValue(memoire.description, language)}
				</p>
			</motion.div> */}
			{/* <EmptyCinema
				theme={emptyCinemaTheme}
				className="w-full scale-150 text-dark"
			/> */}

			{memoire.pastFestivals && memoire.pastFestivals.length > 0 && (
				<div className="grid grid-cols-1 gap-4 pb-16 pt-4 sm:grid-cols-2 lg:grid-cols-2 lg:gap-1 lg:p-0">
					{/* {memoire.pastFestivals.map((festival: any, index: number) => ( */}
					{[...memoire.pastFestivals, ...memoire.pastFestivals].map(
						(festival: any, index: number) => (
							<Link
								key={index}
								href={`/${language}/festival/${festival.year}`}
								className="relative block h-[60vh] overflow-hidden rounded-md border-2 border-transparent shadow-md transition-shadow duration-300 hover:shadow-lg"
							>
								<div
									className={`absolute left-1/2 top-[65%] z-20 -translate-x-1/2 -rotate-6 rounded-md bg-primary px-2 text-5xl font-black tracking-tighter text-dark`}
								>
									<span>{festival.year}</span>
								</div>
								<div className="absolute left-[50%] top-[74%] z-10 -translate-x-1/2 rotate-6 rounded-md bg-grayDark px-2 text-5xl font-semibold tracking-tighter text-dark">
									<span>{festival.venue}</span>
								</div>
								<div className="relative h-full">
									<div className="absolute left-1 z-30 h-full w-[2.5%] rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:11px_30px] bg-center bg-repeat-y sm:h-full"></div>
									<div className="absolute right-1 z-30 h-full w-[2.5%] rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:11px_30px] bg-center bg-repeat-y sm:h-full"></div>
									{festival.visual ? (
										<Img
											image={festival.visual}
											src={festival.visual.asset.url}
											alt={
												festival.title
													? getLocalizedValue(festival.title, language)
													: 'Festival image'
											}
											className="h-full w-full object-cover"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center rounded-md bg-dark dark:bg-primary" />
									)}
								</div>
							</Link>
						),
					)}
				</div>
			)}
		</div>
	)
}

export default MemoireContent
