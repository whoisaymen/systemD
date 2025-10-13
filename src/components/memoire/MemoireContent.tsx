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
import { useState } from 'react'
import { IoGrid } from 'react-icons/io5'
import FilterIcon from '../svgs/FilterIcon'
import { BiSolidSquareRounded } from 'react-icons/bi'
import { renderParagraph } from '../common/RenderParagraph'
import SectionTitle from '../ui/SectionTitle'

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

	const [view, setView] = useState<'grid' | 'single'>('grid')
	const [sortField, setSortField] = useState<'year'>('year')
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
	const [yearFilter, setYearFilter] = useState<string | null>(null)

	if (!memoire) {
		return <div>No content available</div>
	}

	let { scrollY } = useScroll()
	let borderRadius = useTransform(scrollY, (value) => Math.max(80 - value, 10))

	const years = Array.from(
		new Set<number>(memoire.pastFestivals.map((f: any) => Number(f.year))),
	).sort((a, b) => b - a)

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

	let filteredFestivals = memoire.pastFestivals
	if (yearFilter) {
		filteredFestivals = filteredFestivals.filter(
			(f: any) => String(f.year) === yearFilter,
		)
	}
	filteredFestivals = [...filteredFestivals].sort((a: any, b: any) =>
		sortOrder === 'asc' ? a.year - b.year : b.year - a.year,
	)

	return (
		<div className="no-scrollbar lg:shadowtest rounded-md border-0 bg-dark from-dark to-grayDark/25 px-4 tracking-tight hover:bg-dark/50 sm:mt-1 sm:items-start sm:bg-dark sm:bg-gradient-to-b sm:from-dark sm:to-grayDark/25 sm:px-0 sm:shadow-inner lg:h-[calc(100svh-10px)] lg:overflow-y-auto lg:py-8">
			{' '}
			{/* Description */}
			<div className="shadowtest relative mt-8 rounded-md bg-primary p-4 text-dark lg:mb-4 lg:mt-4 lg:bg-transparent lg:p-0 lg:shadow-none">
				<p className="mx-auto py-0 text-xl font-bold leading-[1.2] tracking-tight text-dark sm:py-4 sm:text-4xl lg:mx-16 lg:text-primary">
					{renderParagraph(
						{
							value:
								'System_D and the Citylab Pianofabriek team support your stories and imaginations in several ways.',
						},
						[],
						'bg-dark text-primary lg:bg-grayDark lg:text-dark',
					)}
				</p>
			</div>
			<div className="mt-1 flex flex-wrap items-center justify-between border-t-0 border-t-primary pt-4 sm:hidden">
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
			{memoire.pastFestivals && memoire.pastFestivals.length > 0 && (
				<div
					className={`mt-1 grid sm:mx-0 sm:mt-8 ${view === 'single' ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-2'} gap-2 pb-16 sm:grid-cols-2 lg:grid-cols-2 lg:gap-4 lg:px-16`}
				>
					{filteredFestivals.map((festival: any, index: number) => (
						// {[...Array(5)]
						// 	.fill(filteredFestivals)
						// 	.flat()
						// 	.slice(0, 5)
						// 	.map((festival: any, index: number) => (
						<Link
							key={festival._id || index}
							href={`/${language}/festival/${festival.year}`}
							className={`relative block ${view === 'single' ? 'h-[60vh]' : 'h-[30vh] lg:h-[60vh]'} overflow-hidden rounded-xl border-[2.5px] border-grayDark transition-shadow duration-300 hover:shadow-sm lg:rounded-xl lg:border-[0px]`}
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
							<div className="lg:shadowtest relative h-full overflow-hidden">
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
			)}
		</div>
	)
}

export default MemoireContent
