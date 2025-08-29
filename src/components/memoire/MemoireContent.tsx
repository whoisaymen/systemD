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

	const [view, setView] = useState<'grid' | 'single'>('single')
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

	console.log('Filtered Festivals:', filteredFestivals)

	return (
		<div className="no-scrollbar dark:hover:bg-dark/50 dark:to-grayDark/25 sm:to-grayDark/25 rounded-md border-grayLight bg-transparent px-4 tracking-tighter dark:border-0 dark:from-dark sm:mt-1 sm:items-start sm:bg-dark sm:bg-gradient-to-b sm:from-grayLight sm:px-0 sm:shadow-inner lg:border-4 lg:border-black">
			<div className="relative flex flex-wrap items-center justify-center gap-2 rounded-none px-5 py-8 sm:gap-4 lg:px-16 lg:pt-16">
				<span className="inline-block text-2xl font-bold leading-[1.2] tracking-tighter text-dark dark:text-primary lg:text-7xl">
					"
				</span>
				{'La mémoire est l avenir du passé'
					.split(' ')
					.map((word: string, idx: number) => {
						const randomRotation = Math.floor(Math.random() * 21) - 10
						const randomMarginTop = Math.floor(Math.random() * 10) - 5
						const randomMarginLeft = Math.floor(Math.random() * 10) - 5

						return (
							<span
								key={idx}
								className="inline-block text-2xl font-bold leading-[1.2] tracking-tighter text-dark dark:text-primary lg:text-5xl"
								style={{
									transform: `rotate(${randomRotation}deg)`,
									marginTop: `${randomMarginTop}px`,
									marginLeft: `${randomMarginLeft}px`,
								}}
							>
								{word}
							</span>
						)
					})}
				<span className="inline-block text-2xl font-bold leading-[1.2] tracking-tighter text-dark dark:text-primary lg:text-7xl">
					"
				</span>
			</div>
			<p className="mt-4 px-16 text-base font-normal leading-[1.2] tracking-tighter text-primary first:mt-0 lg:pb-8 lg:pt-8 lg:text-xl">
				This festival was like a warm embrace in winter, without covid masks
				this time. People were happy to see each other, to connect with the
				community, particularly as the situation in Gaza was rapidly
				degenerating. Sbeul collective kicked off the festival with an electric
				performance of As Salem Aleykoum that absolutely brought down the house.
				Their assertivity, dignity and love were reflected in all other facets
				of the festival. A retrospective video installation by Maxime Bourlet
				revisited favorite films of the previous editions, a photo exhibit
				curated by Neima B Reyale reminded us of the little things we share
				while the salon du TURFU by Imiskill and Face B invited radical new
				imaginations of our future. The incredible selection of films were made
				by a mix of old friends, inspired new voices and storytellers from far
				away. The exceptional jury included Maja-Ajmia Yde Zellama, Rob Jacobs,
				Bwanga Pilipili, Gilles De Voghel, Mehdi Fikri and Mounir Amamra.
				Together they celebrated the unique identity of the festival while
				welcoming new perspectives.
			</p>
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
					onClick={() => setView('single')}
					className={`rounded px-2 py-1 ${view === 'single' ? 'bg-primary font-bold text-dark' : 'bg-grayDark text-dark'}`}
				>
					single
				</button>
			</div> */}

			<div className="mt-1 flex flex-wrap items-center justify-between sm:hidden">
				<span className="px-2 py-3 text-5xl font-bold leading-[1] text-primary">
					{'Éditions'.split('').map((char, idx) => {
						// Skip rendering for spaces (if any)
						if (char === ' ') return <span key={idx}>&nbsp;</span>
						// Random rotation and position for each character
						const randomRotation = Math.floor(Math.random() * 21) - 10 // -10 to 10 deg
						const randomMarginTop = Math.floor(Math.random() * 10) - 5 // -5px to 5px
						const randomMarginLeft = Math.floor(Math.random() * 10) - 5 // -5px to 5px
						return (
							<span
								key={idx}
								className="inline-block p-0.5"
								style={{
									transform: `rotate(${randomRotation}deg)`,
									marginTop: `${randomMarginTop}px`,
									marginLeft: `${randomMarginLeft}px`,
								}}
							>
								{char}
							</span>
						)
					})}
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
								className={
									view === 'single'
										? 'text-primary'
										: 'text-dark dark:text-grayDark'
								}
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
								className={
									view === 'grid'
										? 'text-primary'
										: 'text-dark dark:text-grayDark'
								}
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
							className={`relative block ${view === 'single' ? 'h-[60vh]' : 'h-[30vh]'} overflow-hidden rounded-xl border-[2.5px] border-grayDark transition-shadow duration-300 hover:shadow-lg lg:border-[3px]`}
						>
							<div
								className={`absolute left-1/2 ${view === 'single' ? 'top-[65%] text-3xl' : 'top-[38%] text-xl'} z-20 -translate-x-1/2 -rotate-6 rounded-md bg-primary px-2 font-black tracking-tighter text-dark lg:top-[50%] lg:text-6xl`}
							>
								<span>{festival.year}</span>
							</div>
							<div
								className={`absolute left-1/2 ${view === 'single' ? 'top-[72%] text-3xl' : 'top-[50%] text-xl'} z-10 -translate-x-1/2 rotate-6 rounded-md bg-dark px-2 font-semibold tracking-tighter text-primary lg:top-[61%] lg:text-6xl`}
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
