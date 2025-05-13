'use client'
import { motion } from 'motion/react'

import Img from '@/ui/Img'
import Link from 'next/link'
import { getRandomRotationClass } from '@/lib/utils'
import { useState } from 'react'
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

interface FestivalEditionContentProps {
	festival: any
	language: string
}

const FestivalEditionContent: React.FC<FestivalEditionContentProps> = ({
	festival,
	language,
}) => {
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

	console.log(festival.expoPhoto, 'expoPhotos')

	return (
		<div className="no-scrollbar relative flex h-full min-h-screen w-full flex-col space-y-4 rounded-md px-4 py-24 text-base font-medium leading-tight tracking-tighter text-dark dark:text-primary sm:justify-start sm:space-y-1 sm:px-0 sm:pt-1">
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
			{/* {festival.visual && (
				<div className="-mb-12 h-[50vh] sm:mb-0 sm:h-full">
					<div
						// initial={{
						// 	borderRadius: '0.375rem',
						// }}
						// animate={{ borderRadius: '15rem' }}
						// transition={{
						// 	duration: 2,
						// 	ease: [0.76, 0, 0.24, 1],
						// 	repeat: Infinity,
						// 	repeatType: 'reverse',
						// }}
						className="overflow-hidden rounded-md border-[3px] border-primary shadow-md sm:h-[65vh] sm:border-0"
					>
						<Img
							image={festival.visual}
							src={festival.visual.asset.url}
							alt={
								festival.title
									? getLocalizedValue(festival.title, language)
									: 'Festival image'
							}
							className="h-full w-full object-cover sm:rounded-b-none"
						/>
					</div>
				</div>
			)} */}

			{/* {festival.aftermovieLink && (
				<h1 className="text-3xl font-bold">{festival.aftermovieLink}</h1>
			)} */}
			<div className="flex h-full w-full flex-col items-center justify-center">
				<div
					className={`z-10 -rotate-6 rounded-md bg-grayDark px-2 text-6xl font-semibold text-dark sm:hidden`}
				>
					{/* <div
					className={`fixed right-4 top-4 z-50 rotate-12 rounded-md bg-grayDark px-2 text-lg font-bold tracking-tighter text-dark sm:hidden`}
				> */}
					<span>{festival.venue}</span>
				</div>
				<div
					className={`z-10 rotate-6 rounded-md bg-primary px-2 text-4xl font-black text-dark sm:hidden`}
				>
					<span>{festival.year}</span>
				</div>
			</div>

			{festival.description && (
				<ReadMore
					text={getLocalizedValue(festival.description, language)}
					link={festival.pressLink}
				/>
			)}

			<div className="pt-8" id="photo-gallery">
				<div className="sticky top-[6.5rem] z-10 flex justify-center">
					<motion.div
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
						className="flex w-fit items-center justify-center gap-1 rounded-md border-[3px] border-dark bg-grayLight px-2 pr-4 text-center text-4xl font-bold uppercase italic tracking-tighter text-dark shadow-sm dark:border-primary dark:bg-dark dark:text-primary [&[data-state=open]>svg]:rotate-180"
					>
						<span>Photo Gallery</span>
					</motion.div>
					<BackToTopButton targetId="photo-gallery" />
				</div>

				{/* <Accordion type="single" collapsible>
					<AccordionItem
						value="item-1"
						className="flex flex-col items-center justify-center"
					>
						<AccordionTrigger className={`rotate-[3deg]`}>
							Photo Gallery
						</AccordionTrigger>
						<AccordionContent> */}

				{isPhotoGalleryOpen && (
					<div className="relative">
						{/* Photo Gallery */}
						<div className="grid w-full grid-cols-3 gap-2 bg-black pt-4 sm:grid-cols-2 lg:grid-cols-3">
							{festival.photoGallery.flatMap((gallery: any) =>
								gallery.photos.map((photo: any, index: number) => (
									<button
										key={index}
										onClick={() => openLightbox(index)}
										className="relative focus:outline-none"
									>
										{/* Left Film Roll */}
										<div className="absolute top-1 z-30 h-[2.5%] w-full rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:15px_11px] bg-center bg-repeat-x sm:w-full"></div>

										{/* Right Film Roll */}
										<div className="absolute bottom-1 z-30 h-[2.5%] w-full rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:15px_11px] bg-center bg-repeat-x sm:w-full"></div>

										<Img
											image={photo}
											src={photo.asset.url}
											alt={`Photo ${index + 1}`}
											className="aspect-square h-auto w-full rounded-md object-cover"
										/>
									</button>
								)),
							)}
						</div>

						{/* Lightbox Modal */}
						{isLightboxOpen && (
							<div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/95">
								{/* Close Button */}
								<button
									onClick={closeLightbox}
									className="absolute right-4 top-4 z-50 px-2 text-3xl font-medium text-primary"
								>
									✕
								</button>

								{/* Carousel */}
								<FestivalCarousel
									photos={festival.photoGallery.flatMap((gallery: any) =>
										gallery.photos.map((photo: any) => ({
											photo, // Wrap the photo object
										})),
									)}
									initialIndex={currentImageIndex}
								/>
							</div>
						)}
					</div>
				)}
				{/* </AccordionContent>
					</AccordionItem>
				</Accordion> */}
			</div>

			{/* <div className="mx-auto flex h-auto max-w-7xl flex-col justify-center">
				<FestivalCarousel
					photos={festival.photoGallery.flatMap(
						(gallery: any) => gallery.photos,
					)}
				/>
			</div> */}

			{/* {festival.photoGallery && festival.photoGallery.length > 0 && (
				<FestivalPhotoGallery
					photos={festival.photoGallery.flatMap(
						(gallery: any) => gallery.photos,
					)}
				/>
			)} */}

			{/* {festival.filmSelection && festival.filmSelection.length > 0 && (
				<>
					<Accordion type="single" collapsible>
						<AccordionItem
							value="item-2"
							className="flex flex-col items-center justify-center"
						>
							<AccordionTrigger className={`-rotate-[3deg]`}>
								Film Selection
							</AccordionTrigger>
							<AccordionContent>
								<div className="mt-4 flex h-full w-full items-center justify-center gap-1 text-4xl">
									<button
										onClick={() => setView('grid')}
										className={`rounded-md border-2 p-2 text-center font-bold tracking-tight transition-colors ${
											view === 'grid'
												? 'border-dark bg-primary dark:border-dark dark:text-dark'
												: 'border-dark bg-none text-dark dark:border-primary dark:text-primary'
										}`}
									>
										<IoGrid />
									</button>

									<button
										onClick={() => setView('list')}
										className={`flex rounded-md border-2 p-2 text-center font-bold tracking-tight transition-colors ${
											view === 'list'
												? 'border-dark bg-primary dark:border-dark dark:text-dark'
												: 'border-dark bg-none text-dark dark:border-primary dark:text-primary'
										}`}
									>
										<IoList />
									</button>
								</div>
								{view === 'grid' ? (
									<ul className="sticky top-32 grid grid-cols-2 gap-4 px-2 sm:grid-cols-2 sm:px-4 lg:grid-cols-3">
										{festival.filmSelection.map((film: any, index: number) => (
											<li key={index} className="relative h-full w-full">
												{film.slug?.current ? (
													<Link href={`/${language}/film/${film.slug.current}`}>
														{film.affiche && (
															<Img
																image={film.affiche}
																src={film.affiche.asset.url}
																alt={getLocalizedValue(film.title, language)}
																className="aspect-square h-auto rounded-md border-2 border-primary object-cover"
															/>
														)}
														<div className="flex items-center justify-center rounded-b-md bg-grayLight px-2 dark:bg-dark">
															<h3
																className={`z-10 rounded-md border-2 bg-primary bg-none px-2 py-0 text-center text-base font-semibold tracking-tighter text-dark dark:border-primary dark:bg-primary dark:text-dark ${getRandomRotationClass()}`}
															>
																{getLocalizedValue(film.title, language)}
																<span className="font-normal italic">
																	{' '}
																	({film.year})
																</span>
															</h3>
														</div>
														<div className="absolute bottom-0 left-0 h-16 w-full rounded-md bg-gradient-to-t from-grayLight to-transparent dark:from-dark"></div>
													</Link>
												) : (
													// Fallback UI when there's no slug (just showing image & title)
													<>
														{film.affiche && (
															<Img
																image={film.affiche}
																src={film.affiche.asset.url}
																alt={getLocalizedValue(film.title, language)}
																className="aspect-square h-auto rounded-full border-2 border-primary object-cover"
															/>
														)}
														<div className="flex items-center justify-center rounded-b-md bg-grayLight px-2 dark:bg-dark">
															<h3
																className={`z-10 rounded-full border-2 bg-primary bg-none px-2 py-0 text-center text-base font-semibold tracking-tighter text-dark dark:border-primary dark:bg-primary dark:text-dark ${getRandomRotationClass()}`}
															>
																{getLocalizedValue(film.title, language)}
																<span className="font-normal italic">
																	{' '}
																	({film.year})
																</span>
															</h3>
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
											{festival.filmSelection.map(
												(film: any, index: number) => (
													<tr
														key={index}
														onMouseEnter={() => setHoveredFilm(film._id)}
														onMouseLeave={() => setHoveredFilm(null)}
														className="relative"
													>
														<td className="border-b border-dark py-2 dark:border-primary">
															{film.year}
														</td>
														<td className="border-b border-dark px-4 py-2 dark:border-primary">
															{film.director}
														</td>
														<td className="border-b border-dark px-4 py-2 pr-8 text-dark dark:border-primary dark:text-primary">
															{film.slug?.current ? (
																<Link
																	href={`/${language}/film/${film.slug.current}`}
																>
																	{getLocalizedValue(film.title, language)}
																</Link>
															) : (
																<span>
																	{getLocalizedValue(film.title, language)}
																</span>
															)}
															{hoveredFilm === film._id && film.affiche && (
																<div className="absolute -top-1/2 left-1/2 z-10 w-40 -translate-x-1/2 translate-y-1/2">
																	<Img
																		image={film.affiche}
																		src={film.affiche.asset.url}
																		alt={getLocalizedValue(
																			film.title,
																			language,
																		)}
																		className="h-auto w-full rounded-md object-cover"
																	/>
																</div>
															)}
														</td>
													</tr>
												),
											)}
										</tbody>
									</table>
								)}
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</>
			)} */}

			{festival.filmSelection && festival.filmSelection.length > 0 && (
				<div className="mb-8" id="film-selection">
					<div className="sticky top-[5.5rem] z-10 flex flex-col items-center justify-center">
						<div className="flex items-center justify-center">
							<motion.div
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
								className="flex w-fit -rotate-6 items-center justify-center gap-1 rounded-md border-[3px] border-dark bg-primary px-2 pr-4 text-center text-4xl font-bold uppercase italic tracking-tighter text-dark shadow-sm transition-all dark:border-primary dark:bg-dark dark:text-primary [&[data-state=open]>svg]:rotate-180"
							>
								<span>Film Selection</span>
							</motion.div>
							<BackToTopButton targetId="film-selection" />
						</div>

						{isFilmSectionOpen && (
							<div className="flex">
								<div className="mt-4 flex h-full w-full items-center justify-center gap-1">
									<button
										onClick={() => setView('grid')}
										className={`rounded-md border-2 p-2 text-center font-bold tracking-tight transition-colors ${
											view === 'grid'
												? 'border-dark bg-primary dark:border-dark dark:text-dark'
												: 'border-dark bg-none text-dark dark:border-primary dark:text-primary'
										}`}
									>
										<IoGrid />
									</button>

									<button
										onClick={() => setView('list')}
										className={`flex rounded-md border-2 p-2 text-center font-bold tracking-tight transition-colors ${
											view === 'list'
												? 'border-dark bg-primary dark:border-dark dark:text-dark'
												: 'border-dark bg-none text-dark dark:border-primary dark:text-primary'
										}`}
									>
										<IoList />
									</button>
									<div className="flex gap-2 tracking-tighter">
										<button
											onClick={() => {
												setSortField('year')
												setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
											}}
											className={`rounded-md border-2 p-1 px-2 ${
												sortField === 'year'
													? 'bg-primary text-dark'
													: 'bg-dark text-primary'
											}`}
										>
											Year{' '}
											{sortField === 'year' &&
												(sortOrder === 'asc' ? '↑' : '↓')}
										</button>
										<button
											onClick={() => {
												setSortField('title')
												setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
											}}
											className={`rounded-md border-2 p-1 px-2 ${
												sortField === 'title'
													? 'bg-primary text-dark'
													: 'bg-dark text-primary'
											}`}
										>
											Title{' '}
											{sortField === 'title' &&
												(sortOrder === 'asc' ? '↑' : '↓')}
										</button>
										<button
											onClick={() => {
												setSortField('director')
												setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
											}}
											className={`rounded-md border-2 p-1 px-2 ${
												sortField === 'director'
													? 'bg-primary text-dark'
													: 'bg-dark text-primary'
											}`}
										>
											Director{' '}
											{sortField === 'director' &&
												(sortOrder === 'asc' ? '↑' : '↓')}
										</button>
										<button
											onClick={() => setShowWinnersOnly(!showWinnersOnly)}
											className={`rounded-md border-2 p-1 px-2 ${
												showWinnersOnly
													? 'bg-primary text-dark'
													: 'bg-dark text-primary'
											}`}
										>
											{showWinnersOnly ? 'Show All' : 'Winners'}
										</button>
									</div>
								</div>
							</div>
						)}
					</div>

					{isFilmSectionOpen && (
						<div className="mt-4">
							{/* <div className="mt-4 flex h-full w-full items-center justify-center gap-1 text-4xl">
								<button
									onClick={() => setView('grid')}
									className={`rounded-md border-2 p-2 text-center font-bold tracking-tight transition-colors ${
										view === 'grid'
											? 'border-dark bg-primary dark:border-dark dark:text-dark'
											: 'border-dark bg-none text-dark dark:border-primary dark:text-primary'
									}`}
								>
									<IoGrid />
								</button>

								<button
									onClick={() => setView('list')}
									className={`flex rounded-md border-2 p-2 text-center font-bold tracking-tight transition-colors ${
										view === 'list'
											? 'border-dark bg-primary dark:border-dark dark:text-dark'
											: 'border-dark bg-none text-dark dark:border-primary dark:text-primary'
									}`}
								>
									<IoList />
								</button>
							</div>
							<div className="mb-4 flex items-center justify-between">
								<div className="flex gap-2">
									<button
										onClick={() => {
											setSortField('year')
											setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
										}}
										className={`rounded-md border-2 px-4 py-2 ${
											sortField === 'year'
												? 'bg-primary text-dark'
												: 'bg-dark text-primary'
										}`}
									>
										Year{' '}
										{sortField === 'year' && (sortOrder === 'asc' ? '↑' : '↓')}
									</button>
									<button
										onClick={() => {
											setSortField('title')
											setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
										}}
										className={`rounded-md border-2 px-4 py-2 ${
											sortField === 'title'
												? 'bg-primary text-dark'
												: 'bg-dark text-primary'
										}`}
									>
										Title{' '}
										{sortField === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
									</button>
									<button
										onClick={() => {
											setSortField('director')
											setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
										}}
										className={`rounded-md border-2 px-4 py-2 ${
											sortField === 'director'
												? 'bg-primary text-dark'
												: 'bg-dark text-primary'
										}`}
									>
										Director{' '}
										{sortField === 'director' &&
											(sortOrder === 'asc' ? '↑' : '↓')}
									</button>
									<button
										onClick={() => setShowWinnersOnly(!showWinnersOnly)}
										className={`rounded-md border-2 px-4 py-2 ${
											showWinnersOnly
												? 'bg-primary text-dark'
												: 'bg-dark text-primary'
										}`}
									>
										{showWinnersOnly ? 'Show All' : 'Winners'}
									</button>
								</div>
							</div> */}

							{view === 'grid' ? (
								<ul className="sticky top-32 grid grid-cols-1 gap-4 px-2 sm:grid-cols-2 sm:px-4 lg:grid-cols-5">
									{sortedFilms.map((film: any, index: number) => (
										<li key={index} className="relative h-full w-full">
											{film.slug?.current ? (
												<Link href={`/${language}/film/${film.slug.current}`}>
													{film.affiche && (
														<div className="relative">
															<Img
																image={film.affiche}
																src={film.affiche.asset.url}
																alt={getLocalizedValue(film.title, language)}
																className="aspect-square h-auto rounded-md border-[3px] border-grayDark object-cover dark:border-primary"
															/>
															{/* <div className="absolute inset-0 bg-dark/70"></div> */}
														</div>
													)}
													<div className="flex items-center justify-center rounded-b-md bg-grayLight px-2 dark:bg-dark">
														{/* <h3
															className={`absolute bottom-4 left-1 z-10 flex gap-x-1 rounded-md border-2 bg-primary bg-none px-2 py-0 text-base font-bold tracking-tighter text-dark dark:border-0 dark:border-primary dark:bg-transparent dark:text-primary`}
															style={{
																whiteSpace: 'nowrap',
																overflow: 'hidden',
																textOverflow: 'ellipsis',
															}}
														>
															{film.isWinner && <span>★</span>}
															{getLocalizedValue(film.title, language)}
															<span className="font-normal italic">
																{' '}
																({film.year})
															</span>
														</h3> */}
														<div className="absolute left-1/2 top-1/2 -mt-4 mb-8 flex w-[90%] -translate-x-1/2 flex-col items-center">
															{film.title && (
																<h1
																	className={`z-10 -rotate-6 rounded-md border-2 border-dark bg-grayDark px-2 text-center text-3xl font-black italic text-dark dark:border-primary dark:bg-dark dark:text-primary`}
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
													{/* <div className="absolute bottom-0 left-0 h-16 w-full rounded-md bg-gradient-to-t from-grayLight to-transparent dark:from-dark"></div> */}
												</Link>
											) : (
												// Fallback UI when there's no slug (just showing image & title)
												<>
													{film.affiche && (
														<Img
															image={film.affiche}
															src={film.affiche.asset.url}
															alt={getLocalizedValue(film.title, language)}
															className="aspect-square h-auto rounded-md border-2 border-primary object-cover"
														/>
													)}
													<div className="flex items-center justify-center rounded-b-md bg-grayLight px-2 dark:bg-dark">
														{/* <div className="relative -mt-4 mb-8 flex flex-col items-center">
															{film.title && (
																<h1
																	className={`z-10 rounded-md border-2 border-dark bg-primary px-2 text-center text-3xl font-black italic text-dark dark:border-primary dark:bg-dark dark:text-primary ${getRandomRotationClass()}`}
																>
																	{getLocalizedValue(film.title, language)}
																</h1>
															)}

															{film.director && (
																<p
																	className={`z-10 inline-block w-auto rounded-md border-2 border-primary bg-dark px-2 py-0 text-center font-medium tracking-tight text-primary ${getRandomRotationClass()}`}
																>
																	{film.director}
																</p>
															)}

															{film.year && (
																<p
																	className={`absolute right-[10%] top-10 z-10 rounded-md bg-grayDark px-2 text-4xl font-black text-primary dark:bg-primary dark:text-dark sm:hidden ${getRandomRotationClass()}`}
																>
																	{film.year}
																</p>
															)}
														</div> */}

														<div className="absolute left-1/2 top-1/2 -mt-4 mb-8 flex w-[90%] -translate-x-1/2 flex-col items-center">
															{film.title && (
																<h1
																	className={`z-10 -rotate-6 rounded-md border-2 border-dark bg-primary px-2 text-center text-3xl font-black italic text-dark dark:border-primary dark:bg-dark dark:text-primary`}
																>
																	{getLocalizedValue(film.title, language)}
																</h1>
															)}

															{film.director && (
																<p
																	className={`z-10 mt-2 inline-block w-auto rotate-3 rounded-md border-2 border-primary bg-dark px-2 py-0 text-center font-medium tracking-tight text-primary`}
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
														{/* <h3
															className={`z-10 flex gap-x-1 rounded-md border-2 bg-primary bg-none px-2 py-0 text-center text-base font-semibold tracking-tighter text-dark dark:border-primary dark:bg-primary dark:text-dark ${getRandomRotationClass()}`}
														>
															{film.isWinner && <span>★</span>}
															{getLocalizedValue(film.title, language)}
														</h3> */}
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
											>
												<td className="border-b border-dark py-2 dark:border-primary">
													{film.slug?.current ? (
														<Link
															href={`/${language}/film/${film.slug.current}`}
														>
															{film.year}
														</Link>
													) : (
														<span>{film.year}</span>
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
														<span>{film.director}</span>
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
														<span className="flex gap-x-1">
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
			)}

			<Accordion type="single" collapsible>
				<AccordionItem
					value="item-3"
					className="flex flex-col items-center justify-center pb-1"
				>
					<AccordionTrigger className={`rotate-[3deg]`}>
						Expo Photo
					</AccordionTrigger>
					<AccordionContent>
						{festival.expoPhoto && festival.expoPhoto.length > 0 && (
							<div className="my-4">
								{/* Curator Name */}
								{festival.expoPhoto.map((expo: any, expoIndex: number) => {
									// Group photos by artist
									const photosByArtist = expo.photos.reduce(
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
											<h3 className="text-xl font-bold text-primary">
												Curated by: {expo.curatorName || 'Unknown Curator'}
											</h3>

											{/* Artist Names */}
											<ul className="mt-2 pl-5 text-base text-dark dark:text-primary">
												{Object.keys(photosByArtist).map(
													(artistName, artistIndex) => (
														<li
															key={artistIndex}
															className="cursor-pointer hover:underline"
															onClick={() => setSelectedArtist(artistName)}
														>
															{artistName}
														</li>
													),
												)}
											</ul>

											{/* Photos for Selected Artist */}
											{selectedArtist && photosByArtist[selectedArtist] && (
												<div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-2 lg:grid-cols-3">
													{photosByArtist[selectedArtist].map(
														(photo: any, photoIndex: number) => (
															<button
																key={photoIndex}
																onClick={() => {
																	setCurrentImageIndex(photoIndex)
																	setIsLightboxOpen(true)
																}}
																className="focus:outline-none"
															>
																<Img
																	image={photo.photo}
																	src={photo.photo.asset.url}
																	alt={`Photo by ${selectedArtist}`}
																	className="aspect-square h-auto w-full rounded-md object-cover"
																/>
															</button>
														),
													)}
												</div>
											)}
										</div>
									)
								})}

								{/* Lightbox Modal */}
								{isLightboxOpen && (
									<div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/95">
										<button
											onClick={closeLightbox}
											className="absolute right-4 top-4 z-50 rounded-full border-2 border-primary bg-dark px-2 text-3xl font-medium text-primary"
										>
											✕
										</button>

										<FestivalCarousel
											photos={festival.expoPhoto.flatMap((expo: any) =>
												expo.photos.map((photo: any) => ({
													photo: photo.photo,
													artistName: photo.artistName,
													curatorName: expo.curatorName,
												})),
											)}
											initialIndex={currentImageIndex}
										/>
									</div>
								)}
							</div>
						)}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	)
}

export default FestivalEditionContent
