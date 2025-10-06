'use client'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import Img from '@/ui/Img'
import Link from 'next/link'
import { getRandomRotationClass } from '@/lib/utils'
import { useEffect, useMemo, useState } from 'react'
import { IoGrid, IoList } from 'react-icons/io5'
import ReadMore from '../common/ReadMore'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import FestivalPhotoGallery from './FestivalPhotoGallery'
import FestivalCarousel from './FestivalCarousel'
import BackToTopButton from '../common/BackToTop'
import FilterIcon from '../svgs/FilterIcon'
import { renderParagraph } from '../common/RenderParagraph'
import { useRouter, useSearchParams } from 'next/navigation'
import ArrowRight from '../common/ArrowRight'
import CloseIcon from '../common/CloseIcon'

interface FestivalEditionContentProps {
	festival: any
	language: string
}

const FestivalEditionContent: React.FC<FestivalEditionContentProps> = ({
	festival,
	language,
}) => {
	const tExpo = useTranslations('expo')
	const tFilmSelection = useTranslations('filmSelection')
	const tPhotoGallery = useTranslations('photoGallery')

	const [view, setView] = useState<'grid' | 'list'>('grid')
	const [hoveredFilm, setHoveredFilm] = useState<string | null>(null)
	const [expanded, setExpanded] = useState(false)
	const [isFilmSectionOpen, setIsFilmSectionOpen] = useState(false)
	const [isPhotoGalleryOpen, setIsPhotoGalleryOpen] = useState(false)
	const [sortField, setSortField] = useState<'year' | 'title' | 'director'>(
		'year',
	)
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

	const [isLightboxOpen, setIsLightboxOpen] = useState(false)
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [showWinnersOnly, setShowWinnersOnly] = useState(false)
	const [selectedArtist, setSelectedArtist] = useState<string | null>(null)

	const openLightbox = (index: number) => {
		setCurrentImageIndex(index)
		setIsLightboxOpen(true)
	}

	const closeLightbox = () => {
		setIsLightboxOpen(false)
	}

	function chunkArray(array: any[], size: number) {
		return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
			array.slice(i * size, i * size + size),
		)
	}
	const photoRows = useMemo(
		() =>
			chunkArray(
				festival.photoGallery.flatMap((gallery: any) => gallery.photos),
				3,
			),
		[festival.photoGallery],
	)

	const handleAccordionToggle = (value: string) => {
		setTimeout(() => {
			const element = document.getElementById(value)
			if (element) {
				element.scrollIntoView({ behavior: 'smooth', block: 'start' })
			}
		}, 100) // Short delay to allow UI updates
	}

	const getLocalizedValue = (array: any[], lang: string) => {
		if (!Array.isArray(array)) {
			return ''
		}
		const item = array.find((entry) => entry._key === lang)
		return item ? item.value : ''
	}

	if (!festival) {
		return <div>No content available</div>
	}

	const filteredFilms = showWinnersOnly
		? festival.filmSelection.filter((film: any) => film.isWinner)
		: festival.filmSelection

	const sortedFilms = [...filteredFilms].sort((a: any, b: any) => {
		if (sortField === 'year') {
			return sortOrder === 'asc' ? a.year - b.year : b.year - a.year
		} else if (sortField === 'title') {
			const titleA = getLocalizedValue(a.title, language).toLowerCase()
			const titleB = getLocalizedValue(b.title, language).toLowerCase()
			return sortOrder === 'asc'
				? titleA.localeCompare(titleB)
				: titleB.localeCompare(titleA)
		} else if (sortField === 'director') {
			const directorA = a.director.toLowerCase()
			const directorB = b.director.toLowerCase()
			return sortOrder === 'asc'
				? directorA.localeCompare(directorB)
				: directorB.localeCompare(directorA)
		}
		return 0
	})

	const router = useRouter()
	const searchParams = useSearchParams()

	function updateQuery(params: Record<string, string | undefined>) {
		const newParams = new URLSearchParams(searchParams.toString())
		Object.entries(params).forEach(([key, value]) => {
			if (value === undefined) {
				newParams.delete(key)
			} else {
				newParams.set(key, value)
			}
		})
		router.replace(`?${newParams.toString()}`, { scroll: false })
	}

	useEffect(() => {
		const sort = searchParams.get('sort') as 'year' | 'title' | 'director'
		const order = searchParams.get('order') as 'asc' | 'desc'
		const winners = searchParams.get('winners') === '1'
		const view = searchParams.get('view') as 'grid' | 'list'

		if (sort) setSortField(sort)
		if (order) setSortOrder(order)
		setShowWinnersOnly(winners)
		if (view) setView(view)

		// Check if we're returning from a film
		const currentFilmSlug = sessionStorage.getItem('currentFilmSlug')
		const scroll = sessionStorage.getItem('festivalScroll')

		if (currentFilmSlug) {
			// We're returning from a film, open the film selection and scroll to that film
			setIsFilmSectionOpen(true)

			// Use a timeout to ensure the DOM is rendered
			setTimeout(() => {
				scrollToFilm(currentFilmSlug)
				sessionStorage.removeItem('currentFilmSlug')
			}, 100)

			return
		}

		if (scroll) {
			// Regular scroll restoration
			setIsFilmSectionOpen(true)
			window.scrollTo(0, parseInt(scroll, 10))
			sessionStorage.removeItem('festivalScroll')
			return
		}

		// Otherwise, open dropdown if any filter/sort/view param is present
		if (sort || order || winners || view) {
			setIsFilmSectionOpen(true)
		}
	}, [])

	const scrollToFilm = (filmSlug: string) => {
		// Try to find the film element in the DOM
		const filmElement = document.querySelector(`[data-film-slug="${filmSlug}"]`)

		if (filmElement) {
			// Scroll to the film with some offset for better visibility
			const elementRect = filmElement.getBoundingClientRect()
			const absoluteElementTop = elementRect.top + window.pageYOffset
			const offset = 100 // Adjust this value as needed

			window.scrollTo({
				top: absoluteElementTop - offset,
				behavior: 'smooth',
			})
		} else {
			// Fallback: find the film in the sorted list and calculate approximate position
			const filmIndex = sortedFilms.findIndex(
				(f) => f.slug?.current === filmSlug,
			)
			if (filmIndex !== -1) {
				// Approximate scroll position based on index
				// Adjust these values based on your grid/list item heights
				const itemHeight = view === 'grid' ? 400 : 60 // Approximate height per item
				const approximatePosition = filmIndex * itemHeight

				window.scrollTo({
					top: approximatePosition,
					behavior: 'smooth',
				})
			}
		}
	}

	return (
		<div className="no-scrollbar lg:shadowtest relative flex h-full w-full flex-col space-y-4 rounded-md px-4 py-24 pt-0 text-base font-medium leading-tight tracking-tighter text-primary sm:justify-start sm:space-y-1 sm:px-0 sm:pt-1 lg:mt-1 lg:h-[calc(100svh-10px)] lg:w-full lg:overflow-y-auto lg:rounded-lg lg:bg-dark lg:py-16">
			<div className="fixed bottom-4 right-12 z-50 lg:bottom-2 lg:right-[16.5%]">
				<BackToTopButton targetId="navbar-mobile" />
			</div>
			<div
				className={`absolute -top-1 rounded-md text-3xl font-semibold text-dark lg:left-6 lg:top-4 lg:transition-all lg:hover:scale-110 lg:hover:duration-300`}
			>
				<button
					onClick={() => router.push(`/${language}/memoire`)}
					aria-label="Go back"
				>
					<ArrowRight
						theme={{ fill: 'var(--color-primary)' }}
						className="h-auto w-10 -rotate-180 lg:w-9"
					/>
				</button>
			</div>

			<div className="z-10 hidden w-full flex-row items-end justify-between border-0 px-8 lg:pointer-events-none lg:absolute lg:right-0 lg:top-8 lg:z-[10000] lg:mt-0 lg:flex lg:flex-col lg:justify-center lg:gap-4">
				<motion.div
					className="rounded-md bg-grayDark px-2 text-2xl font-semibold tracking-tighter text-dark lg:rounded-xl lg:border-[0px] lg:border-primary lg:text-5xl"
					initial={{ rotate: -6 }}
					animate={{
						scale: [1, 0.9, 1, 1, 1],
						rotate: [-6, 360, -6, -6, -6],
						transition: {
							duration: 5,
							ease: [0.76, 0, 0.24, 1],
						},
					}}
				>
					<span>{festival.venue}</span>
				</motion.div>
				<motion.div
					className="-mt-5 rounded-md border-[0px] border-primary bg-primary px-2 text-xl font-black text-primary lg:bg-primary lg:text-3xl lg:text-dark"
					initial={{ rotate: 6 }}
					animate={{
						scale: [1, 0.9, 1, 1, 1],
						rotate: [6, 360, 6, 6, 6],
						transition: {
							duration: 5,
							ease: [0.76, 0, 0.24, 1],
						},
					}}
				>
					<span>{festival.year}</span>
				</motion.div>
			</div>
			<motion.div
				className={`absolute -top-4 left-[3.5rem] z-10 -rotate-6 rounded-md bg-grayDark px-2 text-2xl font-semibold tracking-tighter text-dark lg:right-[1rem] lg:top-4 lg:hidden lg:w-fit lg:rounded-xl lg:border-[3px] lg:border-dark lg:px-4 lg:text-5xl`}
				initial={{ rotate: -6 }}
				animate={{
					scale: [1, 0.9, 1, 1, 1],
					rotate: [-6, 360, -6, -6, -6],
					transition: {
						duration: 5,
						ease: [0.76, 0, 0.24, 1],
					},
				}}
			>
				<span>{festival.venue}</span>
			</motion.div>
			<motion.div
				className={`absolute -top-3 right-[0.5rem] z-20 rotate-6 rounded-md bg-primary px-2 text-xl font-black text-dark lg:top-8 lg:hidden lg:w-fit lg:bg-dark lg:text-3xl lg:text-primary`}
				initial={{ rotate: 6 }}
				animate={{
					scale: [1, 0.9, 1, 1, 1],
					rotate: [6, 360, 6, 6, 6],
					transition: {
						duration: 5,
						ease: [0.76, 0, 0.24, 1],
					},
				}}
			>
				<span>{festival.year}</span>
			</motion.div>

			<div className="mb-8 pt-8 lg:pt-0" id="film-selection">
				<div className="sticky top-[0px] z-10 flex flex-col items-center justify-center bg-dark pt-2 lg:-top-[64px] lg:z-10 lg:mx-1 lg:bg-dark lg:pt-4">
					<div className="flex items-center justify-center">
						<motion.div
							initial={{ rotate: -1 }}
							animate={{
								rotate: 1,
								transition: {
									duration: 0.3,
									repeat: Infinity,
									delay: 5,
									repeatType: 'reverse',
									ease: 'easeInOut',
								},
							}}
							onClick={() => setIsFilmSectionOpen(!isFilmSectionOpen)}
							className={`flex w-fit items-center justify-center gap-1 rounded-md border-[3px] px-2 pr-4 text-center text-4xl font-bold uppercase italic tracking-tighter shadow-sm transition-all lg:text-5xl ${
								isFilmSectionOpen
									? 'border-primary bg-dark text-primary dark:border-grayDark dark:bg-grayDark dark:text-dark'
									: 'border-primary bg-dark text-primary'
							}`}
						>
							<span>{tFilmSelection('title')}</span>
						</motion.div>
					</div>

					{isFilmSectionOpen && (
						<>
							{festival.filmSelection && festival.filmSelection.length > 0 ? (
								<div className="mt-0 flex w-full items-center justify-between rounded-none border-0 border-b-0 border-primary bg-dark text-sm lg:mt-2 lg:bg-dark lg:px-16 lg:pt-0 lg:text-lg lg:font-bold lg:tracking-tight lg:text-primary">
									{[
										{ field: 'year', label: tFilmSelection('year') },
										{ field: 'title', label: tFilmSelection('titleCol') },
										{ field: 'director', label: tFilmSelection('director') },
									].map(({ field, label }) => (
										<button
											key={field}
											onClick={() => {
												setSortField(field as any)
												setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
												updateQuery({
													sort: field,
													order: sortOrder === 'asc' ? 'desc' : 'asc',
												})
											}}
											className={`relative flex items-center justify-center p-1`}
										>
											<motion.span
												animate={
													sortField === field
														? {
																scale: 1.05,
																color: 'var(--color-primary)',
															}
														: { scale: 1, rotate: 0, color: 'inherit' }
												}
												transition={{
													type: 'spring',
													stiffness: 400,
													damping: 22,
												}}
												className="flex items-center"
											>
												{sortField === field && (
													<FilterIcon
														theme={{
															upArrow:
																sortOrder === 'asc'
																	? 'var(--color-primary)'
																	: 'var(--color-grayDark)',
															downArrow:
																sortOrder === 'desc'
																	? 'var(--color-primary)'
																	: 'var(--color-grayDark)',
														}}
														className="mr-1 h-3"
													/>
												)}
												<span
													className={
														sortField === field
															? 'border-primary underline underline-offset-4 lg:text-primary'
															: ''
													}
												>
													{label}
												</span>{' '}
											</motion.span>
										</button>
									))}
									<button
										onClick={() => {
											setShowWinnersOnly(!showWinnersOnly)
											updateQuery({
												winners: !showWinnersOnly ? '1' : undefined,
											})
											if (!showWinnersOnly) {
												// We're about to show winners only, scroll to top
												setTimeout(() => {
													window.scrollTo({
														top: 0,
														behavior: 'smooth',
													})
												}, 100)
											}
										}}
										className={`p-1`}
									>
										{showWinnersOnly ? (
											<div className="flex items-center gap-1 rounded-md p-1">
												<span className="text-primary lg:text-dark">x</span>
												<span className="underline underline-offset-4">
													{' '}
													{tFilmSelection('winners')}
												</span>
											</div>
										) : (
											<>
												<span> {tFilmSelection('winners')}</span>
											</>
										)}
									</button>
									<div className="flex items-center justify-center gap-0">
										<button
											onClick={() => {
												setView('grid')
												updateQuery({ view: 'grid' })
											}}
											className="relative p-0 text-center font-bold tracking-tight transition-colors"
											aria-label="Grid view"
										>
											<motion.span
												animate={
													view === 'grid'
														? {
																scale: 0.65,
																rotate: 0,
																opacity: 1,
															}
														: {
																scale: 0.5,
																rotate: 0,
																filter: 'none',
																opacity: 0.5,
															}
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
											onClick={() => {
												setView('list')
												updateQuery({ view: 'list' })
											}}
											className="relative p-0 text-center font-bold tracking-tight transition-colors"
											aria-label="List view"
										>
											<motion.span
												animate={
													view === 'list'
														? {
																scale: 0.85,
																rotate: 0,
																opacity: 1,
															}
														: {
																scale: 0.75,
																rotate: 0,
																filter: 'none',
																opacity: 0.5,
															}
												}
												transition={{
													type: 'spring',
													stiffness: 400,
													damping: 22,
												}}
												className="inline-block"
											>
												<IoList
													className={
														view === 'list'
															? 'text-primary'
															: 'text-dark dark:text-grayDark'
													}
													size={36}
												/>
											</motion.span>
										</button>
									</div>
								</div>
							) : (
								<div className="w-full pb-4 pt-2 text-center text-lg text-primary dark:text-primary">
									Films coming soon...
								</div>
							)}
						</>
					)}
				</div>

				{isFilmSectionOpen &&
					festival.filmSelection &&
					festival.filmSelection.length > 0 && (
						<div className="mt-0 pb-16 lg:px-16">
							{view === 'grid' ? (
								<ul className="sticky top-32 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
									{sortedFilms.map((film: any, index: number) => (
										<li
											key={index}
											className="relative h-full w-full"
											data-film-slug={film.slug?.current}
										>
											{film.slug?.current ? (
												<Link
													href={{
														pathname: `/${language}/film/${film.slug.current}`,
														query: searchParams
															? Object.fromEntries(searchParams.entries())
															: {},
													}}
													onClick={() => {
														sessionStorage.setItem(
															'festivalScroll',
															window.scrollY.toString(),
														)
													}}
												>
													{film.affiche && (
														<div className="relative">
															<Img
																image={film.affiche}
																src={film.affiche.asset.url}
																alt={getLocalizedValue(film.title, language)}
																className="aspect-square h-auto rounded-lg border-2 border-primary object-cover lg:border-dark"
															/>
															<div className="flex items-center justify-center rounded-b-md bg-grayLight px-2 dark:bg-dark">
																<div className="absolute left-1/2 top-1/2 -mt-4 mb-8 flex w-[90%] -translate-x-1/2 flex-col items-center">
																	{film.title && (
																		<>
																			{splitTitle(
																				getLocalizedValue(film.title, language),
																				20,
																			).map((line, idx) => (
																				<h1
																					key={idx}
																					className={[
																						'z-10 rounded-md border-2 border-dark bg-grayDark px-2 text-center text-3xl font-black italic text-dark dark:border-primary dark:bg-dark dark:text-primary lg:text-xl',
																						idx === 0 ? '' : '-z-0 -mt-1',
																						idx % 2 === 0
																							? '-rotate-1'
																							: 'rotate-1',
																					].join(' ')}
																				>
																					{line}
																				</h1>
																			))}
																		</>
																	)}

																	{film.director && (
																		<>
																			{splitTitle(film.director, 26).map(
																				(line, idx) => (
																					<p
																						key={idx}
																						className={[
																							'z-10 mt-0 inline-block w-auto rounded-md border-2 border-dark bg-grayDark px-2 py-0 text-center font-medium tracking-tighter text-dark',

																							idx === 0
																								? ''
																								: '-z-0 -mt-[0.15rem]',
																							idx % 2 === 0
																								? '-rotate-1'
																								: 'rotate-1',
																						].join(' ')}
																					>
																						{line}
																					</p>
																				),
																			)}
																		</>
																	)}

																	{film.year && (
																		<p
																			className={`z-0 mt-0 -rotate-6 rounded-md bg-grayDark px-2 text-xl font-black text-primary dark:bg-primary dark:text-dark sm:hidden`}
																		>
																			{film.year}
																		</p>
																	)}
																</div>
															</div>
														</div>
													)}
												</Link>
											) : (
												// Fallback UI when there's no slug (just showing image & title)
												<>
													{film.affiche && (
														<Img
															image={film.affiche}
															src={film.affiche.asset.url}
															alt={getLocalizedValue(film.title, language)}
															className="aspect-square h-auto rounded-md border-0 border-primary object-cover"
														/>
													)}
													<div className="flex items-center justify-center rounded-b-md bg-grayLight px-2 dark:bg-dark">
														<div className="absolute left-1/2 top-1/2 -mt-4 mb-8 flex w-[90%] -translate-x-1/2 flex-col items-center">
															{film.title && (
																<h1
																	className={`z-10 -rotate-6 rounded-md border-2 border-dark bg-grayDark px-2 text-center text-3xl font-black italic text-dark dark:border-primary dark:bg-dark dark:text-primary lg:text-xl`}
																>
																	{getLocalizedValue(film.title, language)}
																</h1>
															)}

															{film.director && (
																<p
																	className={`z-10 mt-2 inline-block w-auto rotate-3 rounded-md border-2 border-dark bg-grayDark px-2 py-0 text-center font-medium tracking-tighter text-dark`}
																>
																	{film.director}
																</p>
															)}

															{film.year && (
																<p
																	className={`z-0 mt-2 -rotate-6 rounded-md bg-grayDark px-2 text-xl font-black text-primary dark:bg-primary dark:text-dark sm:hidden`}
																>
																	{film.year}
																</p>
															)}
														</div>
													</div>
												</>
											)}
										</li>
									))}
								</ul>
							) : (
								<table className="relative mt-4 w-full table-auto border-collapse text-sm lg:text-lg">
									<thead className="sticky left-0 top-0 z-10 hidden">
										<tr className="bg-white text-left">
											<th className="border-grayDark px-4 py-2 pl-0">
												<span className="px-3 py-1">Year</span>
											</th>
											<th className="border-grayDark px-4 py-2">
												<span className="px-3 py-1">Director</span>
											</th>
											<th className="border-grayDark px-4 py-2">
												<span className="px-3 py-1">Title</span>
											</th>
										</tr>
									</thead>
									<tbody>
										{sortedFilms.map((film: any, index: number) => (
											<tr
												key={index}
												onMouseEnter={() => setHoveredFilm(film._id)}
												onMouseLeave={() => setHoveredFilm(null)}
												className="relative hover:bg-secondary/15"
												data-film-slug={film.slug?.current}
											>
												<td
													className={`border-b border-primary py-2 lg:border-primary lg:text-primary ${film.isWinner ? 'lg:text-secondary' : 'lg:text-primary'}`}
												>
													{film.slug?.current ? (
														<Link
															href={`/${language}/film/${film.slug.current}`}
														>
															{film.year}
														</Link>
													) : (
														<span className="text-grayDark">{film.year}</span>
													)}
												</td>
												<td
													className={`border-b border-primary px-4 py-2 lg:border-primary ${film.isWinner ? 'text-secondary' : 'text-dark lg:text-primary'}`}
												>
													{film.slug?.current ? (
														<Link
															href={`/${language}/film/${film.slug.current}`}
														>
															{film.director}
														</Link>
													) : (
														<span className="text-grayDark">
															{film.director}
														</span>
													)}
												</td>
												<td
													className={`border-b border-primary px-4 py-2 pr-8 lg:border-primary ${film.isWinner ? 'text-secondary' : 'text-primary lg:text-primary'}`}
												>
													{film.slug?.current ? (
														<Link
															href={`/${language}/film/${film.slug.current}`}
															className="flex gap-x-1"
														>
															{film.isWinner && <span>★</span>}
															{getLocalizedValue(film.title, language)}
														</Link>
													) : (
														<span className="flex gap-x-1 text-grayDark">
															{film.isWinner && <span>★</span>}
															{getLocalizedValue(film.title, language)}
														</span>
													)}
													{hoveredFilm === film._id && film.affiche && (
														<div className="absolute -top-1/2 left-1/2 z-10 w-40 -translate-x-1/2 translate-y-1/2 lg:w-[30rem]">
															<div className="relative">
																<Img
																	image={film.affiche}
																	src={film.affiche.asset.url}
																	alt={getLocalizedValue(film.title, language)}
																	className="h-auto w-full rounded-md object-cover lg:border-[3px] lg:border-secondary"
																/>
																<p
																	className={`absolute left-1/2 top-1/2 z-50 mt-0 w-fit -translate-x-1/2 translate-y-1/2 -rotate-6 rounded-md bg-primary px-2 text-xl font-black text-dark`}
																>
																	{film.year}
																</p>
																{film.director && (
																	<>
																		{splitTitle(film.director, 26).map(
																			(line, idx) => (
																				<p
																					key={idx}
																					className={[
																						'absolute left-1/2 top-[60%] z-10 mt-0 inline-block w-auto -translate-x-1/2 translate-y-1/2 rounded-md border-2 border-dark bg-grayDark px-2 py-0 text-center font-medium tracking-tighter text-dark',

																						idx === 0
																							? ''
																							: '-z-0 -mt-[0.15rem]',
																						idx % 2 === 0
																							? '-rotate-1'
																							: 'rotate-1',
																					].join(' ')}
																				>
																					{line}
																				</p>
																			),
																		)}
																	</>
																)}
															</div>
														</div>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
						</div>
					)}
			</div>

			<Accordion type="single" collapsible>
				<AccordionItem
					value="item-3"
					className="-mt-5 flex flex-col items-center justify-center pb-1 lg:-mt-2"
				>
					<AccordionTrigger className={`z-50 rotate-[2deg] lg:text-5xl`}>
						{tExpo('title')}
					</AccordionTrigger>
					<AccordionContent>
						{festival.expoPhoto && festival.expoPhoto.length > 0 && (
							<div className="my-4 lg:px-16">
								{/* Curator Name */}
								{festival.expoPhoto.map((expo: any, expoIndex: number) => {
									// Group photos by artist
									const photosByArtist = expo.photos?.reduce(
										(acc: any, photo: any) => {
											const artistName = photo.artistName || 'Unknown Artist'
											if (!acc[artistName]) {
												acc[artistName] = []
											}
											acc[artistName].push(photo)
											return acc
										},
										{},
									)

									return (
										<div key={expoIndex} className="mb-4">
											<div className="flex justify-center">
												<h3 className="z-0 -mt-3 inline-block -rotate-1 rounded-md border-2 border-dark bg-primary px-2 py-0 text-center text-base font-medium tracking-tighter text-dark lg:text-lg">
													{tExpo('curatedBy')}{' '}
													{expo.curatorName || 'Unknown Curator'}
												</h3>
											</div>

											{/* Artist Names */}
											{photosByArtist &&
											Object.keys(photosByArtist).length > 0 ? (
												<ul className="mt-2 text-base text-primary lg:text-primary">
													{Object.keys(photosByArtist).map(
														(artistName, artistIndex) => {
															const isExpanded = selectedArtist === artistName

															return (
																<li
																	key={artistIndex}
																	className="dark:border-primary/50 border-b border-primary lg:border-primary"
																>
																	<div
																		className="flex cursor-pointer items-center justify-between py-2"
																		onClick={() =>
																			setSelectedArtist(
																				isExpanded ? null : artistName,
																			)
																		}
																	>
																		<span>{artistName}</span>
																		<span>
																			{isExpanded ? (
																				<span className="font-bold">-</span>
																			) : (
																				<span className="font-bold">+</span>
																			)}
																		</span>
																		{/* <ArrowGallery
																					className="mr-1 h-auto w-2 -rotate-90 lg:w-9"
																					theme={{
																						fill: 'var(--color-primary)',
																					}}
																				/> */}
																	</div>

																	{/* Photos for Selected Artist */}
																	{isExpanded && photosByArtist[artistName] && (
																		<div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
																			{photosByArtist[artistName].map(
																				(photo: any, photoIndex: number) => (
																					<Img
																						key={
																							photo.photo?._key ||
																							photo.photo?.asset?._id ||
																							`${artistName}-${photoIndex}`
																						}
																						image={photo.photo}
																						src={photo.photo.asset.url}
																						alt={`Photo by ${artistName}`}
																						className="aspect-square h-auto w-full rounded-md object-cover"
																					/>
																					// </button>
																				),
																			)}
																		</div>
																	)}
																</li>
															)
														},
													)}
												</ul>
											) : (
												<p className="mt-2 text-base text-dark dark:text-primary">
													No photos available.
												</p>
											)}
										</div>
									)
								})}
							</div>
						)}
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			<div className="pb-0 pt-0" id="photo-gallery">
				<div className="z-10 -mt-5 flex justify-center">
					<motion.div
						initial={{ rotate: -3 }}
						animate={{
							rotate: 1,
							transition: {
								duration: 0.3,
								repeat: Infinity,
								delay: 5,
								repeatType: 'reverse',
								ease: 'easeInOut',
							},
						}}
						onClick={() => setIsPhotoGalleryOpen(!isPhotoGalleryOpen)}
						className={`flex w-fit items-center justify-center gap-1 rounded-md border-[3px] px-2 pr-4 text-center text-4xl font-bold uppercase italic tracking-[-0.06em] shadow-sm transition-all lg:z-10 lg:text-5xl ${
							isPhotoGalleryOpen
								? 'border-primary bg-dark text-primary dark:border-grayDark dark:bg-grayDark dark:text-dark lg:z-50'
								: 'border-dark bg-grayDark text-dark dark:border-primary dark:bg-dark dark:text-primary'
						}`}
					>
						<span>{tPhotoGallery('title')}</span>
					</motion.div>
				</div>

				{isPhotoGalleryOpen && (
					<div className="relative">
						<div className="flex justify-center">
							<h3 className="-z-10 -mt-0 inline-block rotate-2 rounded-md border-2 border-dark bg-primary px-2 py-0 text-center text-base font-medium tracking-tighter text-dark lg:z-0 lg:text-lg">
								{tPhotoGallery('photosBy')}{' '}
								{festival.photoGallery[0].photographer || ''}
							</h3>
						</div>

						<div className="relative space-y-4 pt-4 lg:px-16">
							{photoRows.map((row, rowIndex) => (
								<div
									key={rowIndex}
									className="relative flex flex-col items-center justify-center rounded-md bg-grayDark py-4 lg:py-[2.4rem]"
								>
									{/* Top perforation */}
									<div className="absolute left-0 top-1 flex w-full justify-between px-2 lg:top-2">
										{[...Array(28)].map((_, i) => (
											<div
												key={i}
												className="hidden h-2 w-4 rounded-sm bg-dark lg:block lg:h-[1.45rem] lg:w-[1.15rem] lg:rounded-[0.25rem] lg:bg-dark"
											/>
										))}
										{[...Array(12)].map((_, i) => (
											<div
												key={i}
												className="h-2 w-4 rounded-sm bg-dark lg:hidden lg:h-[1.45rem] lg:w-3 lg:rounded-[0.25rem] lg:bg-dark"
											/>
										))}
									</div>
									{/* Bottom perforation */}
									<div className="absolute bottom-1 left-0 flex w-full justify-between px-2 lg:bottom-2">
										{[...Array(28)].map((_, i) => (
											<div
												key={i}
												className="hidden h-2 w-4 rounded-sm bg-dark lg:block lg:h-[1.45rem] lg:w-[1.15rem] lg:rounded-[0.25rem] lg:bg-dark"
											/>
										))}
										{[...Array(12)].map((_, i) => (
											<div
												key={i}
												className="h-2 w-4 rounded-sm bg-dark lg:hidden lg:h-[1.45rem] lg:w-3 lg:rounded-[0.25rem] lg:bg-dark"
											/>
										))}
									</div>
									{/* Images */}
									<div className="z-10 grid w-full max-w-3xl grid-cols-3 lg:max-w-full lg:gap-2">
										{row.map((photo: any, index: number) => (
											<button
												key={index}
												onClick={() => openLightbox(rowIndex * 3 + index)}
												className="focus:outline-none"
											>
												<Img
													image={photo}
													src={photo.asset.url}
													alt={`Photo ${rowIndex * 3 + index + 1}`}
													className="aspect-square h-auto w-full rounded-none object-cover lg:aspect-video"
												/>
											</button>
										))}
									</div>
								</div>
							))}
						</div>

						{/* Lightbox Modal */}
						{isLightboxOpen && (
							<div className="fixed inset-0 z-[10000] flex items-center justify-center bg-dark">
								<div
									className={`absolute right-4 top-2 z-50 rounded-md text-3xl font-semibold text-dark lg:hidden`}
								>
									<button
										onClick={closeLightbox}
										className="border-primary"
										aria-label="Go back"
									>
										<CloseIcon
											theme={{ fill: 'var(--color-primary)' }}
											className="h-auto w-5 -rotate-180 lg:w-9"
										/>
									</button>
								</div>

								{/* Carousel */}
								<FestivalCarousel
									photos={festival.photoGallery.flatMap((gallery: any) =>
										gallery.photos.map((photo: any) => ({
											photo,
											photographer: gallery.photographer,
										})),
									)}
									initialIndex={currentImageIndex}
									onClose={closeLightbox}
								/>
							</div>
						)}
					</div>
				)}
			</div>

			<div className="py-4 pt-3 lg:mx-32 lg:py-16 lg:text-primary [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-grayDark [&::-webkit-scrollbar]:w-2">
				<div className="relative mt-0 rounded-md bg-primary p-6 lg:mb-4 lg:bg-transparent">
					<p className="mx-auto py-0 text-center text-xl font-bold leading-[1.2] tracking-tight text-dark sm:py-4 sm:text-4xl lg:text-primary">
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

				{festival.text?.[language]?.map((block: any) => {
					// Check if the block is a list item
					if (block.listItem === 'bullet') {
						return (
							<ul key={block._key} className="list-disc">
								<li className="mt-4 text-base font-normal leading-[1.2] tracking-tight lg:text-xl lg:leading-[1.5rem]">
									{block.children.map((child: any) => child.text).join('')}
								</li>
							</ul>
						)
					}

					// Render regular paragraphs for non-list items
					return (
						<p
							key={block._key}
							className="mt-4 text-base font-normal leading-[1.2] tracking-tight first:mt-0 lg:text-xl lg:leading-[1.5rem]"
						>
							{block.children.map((child: any) => child.text).join('')}
						</p>
					)
				})}
			</div>

			{/* {festival.description && (
				<div className="relative rounded-md border-dark bg-primary p-5 sm:py-10 lg:mx-32 lg:bg-dark">
					<div className="flex flex-wrap items-center justify-center gap-2 lg:gap-4">
						{(getLocalizedValue(festival.description, language) || '')
							.split(' ')
							.map((word: string, index: number) => {
								// Generate random rotation and position
								const randomRotation = Math.floor(Math.random() * 21) - 10 // -10 to 10 deg
								const randomMarginTop = Math.floor(Math.random() * 10) - 5 // -5px to 5px
								const randomMarginLeft = Math.floor(Math.random() * 10) - 5 // -5px to 5px

								return (
									<span
										key={index}
										className="inline-block text-xl font-bold leading-[1.2] tracking-tighter text-dark sm:text-4xl lg:text-primary"
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
					</div>
				</div>
			)} */}

			{/* {festival.pressLink && (
				<a
					href={festival.pressLink}
					target="_blank"
					rel="noopener noreferrer"
					className="mt-4 inline-block text-primary underline"
				>
					Press Link
				</a>
			)} */}
		</div>
	)
}

export default FestivalEditionContent

// Split a string into chunks of maxLength (default 20)
function splitTitle(title: string, maxLength = 18) {
	const result = []
	let str = title

	while (str.length > maxLength) {
		let idx = str.lastIndexOf(' ', maxLength)
		if (idx === -1) idx = maxLength // no space found, hard cut
		result.push(str.slice(0, idx).trim())
		str = str.slice(idx).trim()
	}
	if (str.length) result.push(str)
	return result
}
