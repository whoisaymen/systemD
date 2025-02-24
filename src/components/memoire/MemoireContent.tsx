'use client'
import { motion } from 'motion/react'

import Img from '@/ui/Img'
import MemoireFwdIcon from './MemoireFwdIcon'
import Logo from '@/sanity/schemas/documents/logo'
import LogoShortTsx from '../svgs/LogoShort'

import Link from 'next/link'
import { getRandomRotationClass } from '@/lib/utils'

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

	return (
		<div className="no-scrollbar mt-12 flex h-full w-full flex-col space-y-1 overflow-y-scroll rounded-md px-4 tracking-tighter sm:mt-0 sm:bg-white">
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
				className="relative rounded-full border-2 border-dark bg-primary px-4 py-10 shadow-sm dark:bg-secondary sm:py-10"
			>
				<p className="mx-auto py-2 text-center text-xl font-bold leading-[1.2] tracking-tighter text-dark sm:py-4 sm:text-4xl">
					{getLocalizedValue(memoire.description, language)}
				</p>
			</motion.div>

			{memoire.pastFestivals && memoire.pastFestivals.length > 0 && (
				<div className="grid grid-cols-1 gap-4 pb-16 pt-4 sm:grid-cols-2 lg:grid-cols-3">
					{memoire.pastFestivals.map((festival: any, index: number) => (
						<Link
							key={index}
							href={`/${language}/festival/${festival.year}`}
							className="relative block h-[60vh] overflow-hidden rounded-full border-2 border-primary shadow-md transition-shadow duration-300 hover:shadow-lg"
						>
							<div
								className={`absolute left-[30%] top-[45%] z-10 -rotate-6 rounded-md bg-primary px-2 text-5xl font-black text-dark`}
							>
								<span>{festival.year}</span>
							</div>
							<div className="absolute left-1/2 top-[54%] z-0 -translate-x-1/2 rounded-md bg-grayDark px-2 text-xl font-semibold text-dark">
								<span>{festival.venue}</span>
							</div>
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
						</Link>
					))}
				</div>
			)}
		</div>
	)
}

export default MemoireContent
