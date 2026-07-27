'use client'
import { motion } from 'motion/react'

import Img from '@/ui/Img'
import Link from 'next/link'
import { useState } from 'react'
import { IoGrid } from 'react-icons/io5'
import { BiSolidSquareRounded } from 'react-icons/bi'
import { renderParagraph } from '../common/RenderParagraph'

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
		const languages = [lang, 'en', 'fr', 'nl']
		const item = languages
			.map((language) =>
				array.find(
					(entry) => entry.language === language || entry._key === language,
				),
			)
			.find(Boolean)
		return item ? item.value : ''
	}

	const [view, setView] = useState<'grid' | 'single'>('grid')

	if (!memoire) {
		return <div>No content available</div>
	}

	const description = getLocalizedValue(memoire.description, language)
	const pastFestivals = Array.isArray(memoire.pastFestivals)
		? memoire.pastFestivals
		: []

	const filteredFestivals = [...pastFestivals].sort(
		(a: any, b: any) => b.year - a.year,
	)

	return (
		<div className="no-scrollbar relative flex min-h-[calc(100svh-4rem)] w-full flex-col gap-1 px-4 pb-16 tracking-tight sm:mt-1 sm:px-0 lg:h-[calc(100svh-10px)] lg:overflow-hidden lg:p-0">
			<section
				id="memoire-description"
				className="shadowtest relative z-10 mt-8 shrink-0 rounded-md bg-primary p-4 text-dark sm:mx-0 lg:mt-0 lg:rounded-md lg:bg-dark lg:bg-gradient-to-b lg:from-dark lg:to-grayDark/25 lg:px-10 lg:py-8 lg:text-primary"
			>
				<p className="mx-auto py-0 text-xl font-bold leading-[1.2] tracking-tight text-dark sm:py-4 sm:text-4xl lg:mx-6 lg:text-primary xl:mx-12">
					{renderParagraph(
						{
							value: description,
						},
						[],
						'bg-dark text-primary lg:bg-grayDark lg:text-dark',
					)}
				</p>
			</section>

			<div className="relative z-10 mt-1 flex flex-wrap items-center justify-between border-t-0 border-t-primary pt-4 sm:hidden">
				<span className="px-2 py-3 text-xl font-bold leading-[1] text-primary">
					Éditions
				</span>
				{/* View toggle */}
				<div className="flex items-center justify-center gap-0">
					<button
						onClick={() => setView('single')}
						className="relative flex items-center justify-center p-0 text-center font-bold tracking-tight transition-colors"
						aria-label="Single view"
					>
						<motion.span
							animate={
								view === 'single'
									? { scale: 0.85, opacity: 1 }
									: { scale: 0.75, opacity: 0.5 }
							}
							transition={{
								type: 'spring',
								stiffness: 400,
								damping: 22,
							}}
							className="inline-block"
						>
							<BiSolidSquareRounded
								className={view === 'single' ? 'text-primary' : 'text-grayDark'}
								size={30}
							/>
						</motion.span>
					</button>
					<button
						onClick={() => setView('grid')}
						className="relative -ml-2 flex items-center justify-center p-0 text-center font-bold tracking-tight transition-colors"
						aria-label="Grid view"
					>
						<motion.span
							animate={
								view === 'grid'
									? { scale: 0.65, opacity: 1 }
									: { scale: 0.5, opacity: 0.5 }
							}
							transition={{
								type: 'spring',
								stiffness: 400,
								damping: 22,
							}}
							className="inline-block"
						>
							<IoGrid
								className={view === 'grid' ? 'text-primary' : 'text-grayDark'}
								size={36}
							/>
						</motion.span>
					</button>
				</div>
			</div>

			{pastFestivals.length > 0 && (
				<section
					data-testid="memoire-cards-area"
					className="no-scrollbar relative z-10 min-h-[18rem] flex-1 overflow-visible lg:min-h-0 lg:overflow-y-auto"
				>
					<div
						className={`mt-0 grid sm:mx-0 ${view === 'single' ? 'grid-cols-1 gap-1' : 'grid-cols-2 gap-1'} pb-16 sm:grid-cols-2 lg:grid-cols-2 lg:gap-1 lg:pb-10`}
					>
						{filteredFestivals.map((festival: any, index: number) => (
							<Link
								key={festival._id || index}
								href={`/${language}/festival/${festival.year}`}
								className={`relative block ${view === 'single' ? 'h-[60vh]' : 'h-[30vh] lg:h-[54vh]'} overflow-hidden rounded-xl border-[2.5px] border-grayDark bg-dark shadow-[0_18px_42px_rgba(0,0,0,0.16)] transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.22)] lg:rounded-md lg:border-0`}
							>
								<div
									className={`absolute left-1/2 ${view === 'single' ? 'top-[65%] text-3xl' : 'top-[38%] text-xl'} z-20 -translate-x-1/2 -rotate-6 rounded-md bg-primary px-2 font-black tracking-tight text-dark lg:top-[50%] lg:text-5xl`}
								>
									<span>{festival.year}</span>
								</div>
								<div
									className={`absolute left-1/2 ${view === 'single' ? 'top-[72%] text-3xl' : 'top-[50%] text-xl'} z-10 -translate-x-1/2 rotate-6 rounded-md bg-dark px-2 font-semibold tracking-tight text-primary lg:top-[58%] lg:text-5xl`}
								>
									<span>{festival.venue}</span>
								</div>
								<div className="relative h-full overflow-hidden">
									{festival.visual ? (
										<Img
											image={festival.visual}
											src={festival.visual.asset.url}
											alt={
												festival.title
													? getLocalizedValue(festival.title, language)
													: 'Festival image'
											}
											className="h-full w-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center rounded-md bg-primary" />
									)}
								</div>
							</Link>
						))}
					</div>
				</section>
			)}
		</div>
	)
}

export default MemoireContent
