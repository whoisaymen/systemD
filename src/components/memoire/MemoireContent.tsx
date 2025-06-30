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
import { IoGrid, IoList } from 'react-icons/io5'
import FilterIcon from '../svgs/FilterIcon'
import { BiSolidSquareRounded } from 'react-icons/bi'

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

	const [view, setView] = useState<'grid' | 'list'>('grid')
	const [sortField, setSortField] = useState<'year'>('year')
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
	const [yearFilter, setYearFilter] = useState<string | null>(null)

	if (!memoire) {
		return <div>No content available</div>
	}

	let { scrollY } = useScroll()
	let borderRadius = useTransform(scrollY, (value) => Math.max(80 - value, 10))

	const years = Array.from(
		new Set(memoire.pastFestivals.map((f: any) => f.year)),
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
		<div className="no-scrollbar dark:hover:bg-dark/50 dark:to-grayDark/25 sm:to-grayDark/25 rounded-md border-grayLight bg-transparent px-4 tracking-tighter dark:border-0 dark:from-dark sm:mt-1 sm:items-start sm:bg-dark sm:bg-gradient-to-b sm:from-grayLight sm:px-0 sm:shadow-inner">
			{/* <div className="mb-4 flex flex-wrap items-center gap-2">
				<span className="font-bold">Year:</span>
				<button
					onClick={() => setYearFilter(null)}
					className={`rounded px-2 py-1 ${!yearFilter ? 'bg-primary font-bold text-dark' : 'bg-grayDark text-dark'}`}
				>
					All
				</button>
				{years.map((year) => (
					<button
						key={year}
						onClick={() => setYearFilter(String(year))}
						className={`rounded px-2 py-1 ${yearFilter === String(year) ? 'bg-primary font-bold text-dark' : 'bg-grayDark text-dark'}`}
					>
						{year}
					</button>
				))}
				<span className="ml-4 font-bold">View:</span>
				<button
					onClick={() => setView('grid')}
					className={`rounded px-2 py-1 ${view === 'grid' ? 'bg-primary font-bold text-dark' : 'bg-grayDark text-dark'}`}
				>
					Grid
				</button>
				<button
					onClick={() => setView('list')}
					className={`rounded px-2 py-1 ${view === 'list' ? 'bg-primary font-bold text-dark' : 'bg-grayDark text-dark'}`}
				>
					List
				</button>
			</div> */}

			<div className="mt-2 flex flex-wrap items-center justify-end gap-2">
				{/* <span className="text-primary">Éditions précédentes</span> */}
				{/* View toggle */}
				<div className="flex items-center justify-center gap-0">
					<button
						onClick={() => setView('grid')}
						className="relative p-0 text-center font-bold tracking-tight transition-colors"
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
								className={
									view === 'grid'
										? 'text-primary'
										: 'text-dark dark:text-grayDark'
								}
								size={36}
							/>
						</motion.span>
					</button>
					<button
						onClick={() => setView('list')}
						className="relative -ml-2 p-0 text-center font-bold tracking-tight transition-colors"
						aria-label="List view"
					>
						<motion.span
							animate={
								view === 'list'
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
								className={
									view === 'list'
										? 'text-primary'
										: 'text-dark dark:text-grayDark'
								}
								size={30}
							/>
						</motion.span>
					</button>
				</div>
			</div>
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
				<div
					className={`grid ${view === 'list' ? 'grid-cols-1' : 'grid-cols-2'} gap-2 pb-16 sm:grid-cols-2 lg:grid-cols-2 lg:gap-1 lg:p-0`}
				>
					{/* {filteredFestivals.map((festival: any, index: number) => ( */}
					{[...Array(5)]
						.fill(filteredFestivals)
						.flat()
						.slice(0, 5)
						.map((festival: any, index: number) => (
							<Link
								key={festival._id || index}
								href={`/${language}/festival/${festival.year}`}
								className={`relative block ${view === 'list' ? 'h-[60vh]' : 'h-full'} overflow-hidden rounded-xl border-[2.5px] border-primary shadow-xl transition-shadow duration-300 hover:shadow-lg`}
							>
								<div
									className={`absolute left-1/2 ${view === 'list' ? 'top-[65%] text-5xl' : 'top-[38%] text-2xl'} z-20 -translate-x-1/2 -rotate-6 rounded-md bg-primary px-2 font-black tracking-tighter text-dark`}
								>
									<span>{festival.year}</span>
								</div>
								<div
									className={`absolute left-1/2 ${view === 'list' ? 'top-[74%] text-5xl' : 'top-[54%] text-2xl'} z-10 -translate-x-1/2 rotate-6 rounded-md bg-dark px-2 font-semibold tracking-tighter text-primary`}
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
											className="h-full w-full object-cover"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center rounded-md bg-dark dark:bg-primary" />
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
