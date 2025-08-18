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
		<div className="no-scrollbar relative flex h-full min-h-screen w-full flex-col space-y-4 rounded-md px-4 py-24 pt-0 text-base font-medium leading-tight tracking-tighter text-dark dark:text-primary sm:justify-start sm:space-y-1 sm:px-0 sm:pt-1 lg:mt-1 lg:w-full lg:rounded-lg lg:bg-primary lg:py-32">
			<div className="fixed bottom-4 right-12 z-50 lg:hidden">
				<BackToTopButton targetId="navbar-mobile" />
			</div>
			<div
				className={`absolute -top-1 rounded-md text-3xl font-semibold text-dark sm:hidden`}
			>
				<button
					onClick={() => router.push(`/${language}/memoire`)}
					className=""
					aria-label="Go back"
				>
					<ArrowRight
						theme={{ fill: 'var(--color-primary)' }}
						className="h-auto w-10 -rotate-180 lg:w-9"
					/>
				</button>
			</div>
			<motion.div
				className={`absolute -top-4 left-[3.5rem] z-10 -rotate-6 rounded-md bg-grayDark px-2 text-2xl font-semibold tracking-tighter text-dark lg:top-4 lg:rounded-xl lg:border-[4px] lg:border-dark lg:px-4 lg:text-9xl`}
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
				className={`absolute -top-3 right-[0.5rem] z-20 rotate-6 rounded-md bg-primary px-2 text-xl font-black text-dark lg:top-3 lg:bg-dark lg:text-6xl lg:text-primary`}
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
				<div className="sticky top-[0] z-10 flex flex-col items-center justify-center bg-dark lg:bg-transparent">
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
							className={`flex w-fit items-center justify-center gap-1 rounded-md border-[3px] px-2 pr-4 text-center text-4xl font-bold uppercase italic tracking-tighter shadow-sm transition-all lg:text-6xl ${
								isFilmSectionOpen
									? 'border-dark bg-dark text-grayDark dark:border-grayDark dark:bg-grayDark dark:text-dark lg:dark:border-0 lg:dark:bg-grayDark'
									: 'border-dark bg-grayDark text-dark dark:border-primary dark:bg-dark dark:text-primary'
							}`}
						>
							<span>{tFilmSelection('title')}</span>
						</motion.div>
					</div>

					{isFilmSectionOpen && (
						<>
							{festival.filmSelection && festival.filmSelection.length > 0 ? (
								<div className="mt-0 flex w-full items-center justify-between rounded-none border-0 border-b-0 border-primary bg-grayLight text-sm dark:bg-dark lg:pt-0">
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
															? 'border-primary underline underline-offset-4'
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
												<span className="text-primary">x</span>
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
						<div className="mt-0 pb-16">
							{view === 'grid' ? (
								<ul className="sticky top-32 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:px-4 lg:grid-cols-3">
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
																className="aspect-square h-auto rounded-lg border-2 border-grayDark object-cover dark:border-primary"
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
								<table className="relative mt-4 w-full table-auto border-collapse text-sm">
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
												className="relative"
												data-film-slug={film.slug?.current}
											>
												<td className="border-b border-dark py-2 dark:border-primary">
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
												<td className="border-b border-dark px-4 py-2 dark:border-primary">
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
												<td className="border-b border-dark px-4 py-2 pr-8 text-dark dark:border-primary dark:text-primary">
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
														<div className="absolute -top-1/2 left-1/2 z-10 w-40 -translate-x-1/2 translate-y-1/2">
															<Img
																image={film.affiche}
																src={film.affiche.asset.url}
																alt={getLocalizedValue(film.title, language)}
																className="h-auto w-full rounded-md object-cover"
															/>
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
					className="-mt-5 flex flex-col items-center justify-center pb-1"
				>
					<AccordionTrigger className={`rotate-[3deg] lg:text-6xl`}>
						{tExpo('title')}
					</AccordionTrigger>
					<AccordionContent>
						{festival.expoPhoto && festival.expoPhoto.length > 0 && (
							<div className="my-4">
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
												<h3 className="z-0 -mt-3 inline-block -rotate-1 rounded-md border-2 border-dark bg-primary px-2 py-0 text-center text-base font-medium tracking-tighter text-dark">
													{tExpo('curatedBy')}{' '}
													{expo.curatorName || 'Unknown Curator'}
												</h3>
											</div>

											{/* Artist Names */}
											{photosByArtist &&
											Object.keys(photosByArtist).length > 0 ? (
												<ul className="mt-2 text-base text-primary lg:text-dark">
													{Object.keys(photosByArtist).map(
														(artistName, artistIndex) => {
															const isExpanded = selectedArtist === artistName

															return (
																<li
																	key={artistIndex}
																	className="dark:border-primary/50 border-b border-primary lg:border-dark"
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
																					// <button
																					// 	key={photoIndex}
																					// 	onClick={() => {
																					// 		setCurrentImageIndex(photoIndex)
																					// 		setIsLightboxOpen(true)
																					// 	}}
																					// 	className="focus:outline-none"
																					// >
																					<Img
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
						className={`flex w-fit items-center justify-center gap-1 rounded-md border-[3px] px-2 pr-4 text-center text-4xl font-bold uppercase italic tracking-[-0.06em] shadow-sm transition-all lg:text-6xl ${
							isPhotoGalleryOpen
								? 'border-primary bg-dark text-primary dark:border-grayDark dark:bg-grayDark dark:text-dark'
								: 'border-dark bg-grayDark text-dark dark:border-primary dark:bg-dark dark:text-primary'
						}`}
					>
						<span>{tPhotoGallery('title')}</span>
					</motion.div>
				</div>

				{isPhotoGalleryOpen && (
					<div className="relative">
						<div className="flex justify-center">
							<h3 className="-z-10 -mt-0 inline-block rotate-2 rounded-md border-2 border-dark bg-primary px-2 py-0 text-center text-base font-medium tracking-tighter text-dark">
								{tPhotoGallery('photosBy')}{' '}
								{festival.photoGallery[0].photographer || ''}
							</h3>
						</div>

						<div className="relative space-y-4 pt-4">
							{photoRows.map((row, rowIndex) => (
								<div
									key={rowIndex}
									className="relative flex flex-col items-center justify-center rounded-md bg-grayDark py-4"
								>
									{/* Top perforation */}
									<div className="absolute left-0 top-1 flex w-full justify-between px-2">
										{[...Array(12)].map((_, i) => (
											<div key={i} className="h-2 w-4 rounded-sm bg-dark" />
										))}
									</div>
									{/* Bottom perforation */}
									<div className="absolute bottom-1 left-0 flex w-full justify-between px-2">
										{[...Array(12)].map((_, i) => (
											<div key={i} className="h-2 w-4 rounded-sm bg-dark" />
										))}
									</div>
									{/* Images */}
									<div className="z-10 grid w-full max-w-3xl grid-cols-3">
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
													className="aspect-square h-auto w-full rounded-none object-cover"
												/>
											</button>
										))}
									</div>
								</div>
							))}
						</div>

						{/* Lightbox Modal */}
						{isLightboxOpen && (
							<div className="fixed inset-0 z-40 flex items-center justify-center bg-dark">
								<div
									className={`absolute right-4 top-2 z-50 rounded-md text-3xl font-semibold text-dark sm:hidden`}
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
								/>
							</div>
						)}
					</div>
				)}
			</div>

			<div className="py-4 pt-3 lg:mx-32 lg:pt-16 lg:text-dark [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-grayDark [&::-webkit-scrollbar]:w-2">
				{festival.text?.[language]?.map((block: any) => {
					// Check if the block is a list item
					if (block.listItem === 'bullet') {
						return (
							<ul key={block._key} className="list-disc">
								<li className="mt-4 text-base font-normal leading-[1.2] tracking-tighter lg:text-xl">
									{block.children.map((child: any) => child.text).join('')}
								</li>
							</ul>
						)
					}

					// Render regular paragraphs for non-list items
					return (
						<p
							key={block._key}
							className="mt-4 text-base font-normal leading-[1.2] tracking-tighter first:mt-0 lg:text-xl"
						>
							{block.children.map((child: any) => child.text).join('')}
						</p>
					)
				})}
			</div>

			{festival.description && (
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
			)}

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
