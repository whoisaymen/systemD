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
import FilterIcon from '../svgs/FilterIcon'
import { renderParagraph } from '../common/RenderParagraph'

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

	return (
		<div className="no-scrollbar relative flex h-full min-h-screen w-full flex-col space-y-4 rounded-md px-4 py-24 pt-0 text-base font-medium leading-tight tracking-tighter text-dark dark:text-primary sm:justify-start sm:space-y-1 sm:px-0 sm:pt-1">
			<div className="fixed bottom-8 right-12 z-50">
				<BackToTopButton targetId="photo-gallery" />
				<BackToTopButton targetId="film-selection" />
			</div>

			{/* <div className="relative h-[80vh] w-full">
				<div className="absolute left-1 z-30 h-full w-[2.5%] rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:11px_30px] bg-center bg-repeat-y sm:h-full"></div>
				<div className="absolute right-1 z-30 h-full w-[2.5%] rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:11px_30px] bg-center bg-repeat-y sm:h-full"></div>
				{festival.visual ? (
					<>
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
						<div
							className={`z-10 hidden -rotate-6 rounded-md bg-grayDark px-2 text-9xl font-semibold text-dark lg:absolute lg:left-1/2 lg:top-1/2 lg:block lg:-translate-x-1/2 lg:-translate-y-1/2`}
						>
							<span>{festival.venue}</span>
						</div>
						<div
							className={`z-10 hidden rotate-6 rounded-md bg-primary px-2 text-7xl font-black text-dark sm:hidden lg:absolute lg:left-1/2 lg:top-[59%] lg:block lg:-translate-x-1/2`}
						>
							<span>{festival.year}</span>
						</div>
					</>
				) : (
					<div className="flex h-full w-full items-center justify-center rounded-md bg-dark dark:bg-primary" />
				)}
			</div> */}

			{/* {festival.description && (
				<ReadMore
					text={getLocalizedValue(festival.description, language)}
					link={festival.pressLink}
				/>
			)} */}

			{/* {festival.description && (
				<div className="relative mt-2 rounded-md border-2 border-dark bg-[#fff] p-6 shadow-sm dark:bg-secondary sm:py-10">
					<p className="mx-auto py-0 text-xl font-bold leading-[1.2] tracking-tighter text-dark transition-all duration-300 sm:py-4 sm:text-4xl">
						{renderParagraph(
							{ value: getLocalizedValue(festival.description, language) },
							[],
							'bg-primary text-primary dark:bg-dark dark:text-primary',
						)}
					</p>
				</div>
			)} */}
			<div
				className={`absolute -top-4 z-50 -rotate-6 rounded-md bg-grayDark px-2 text-3xl font-semibold text-dark sm:hidden`}
			>
				<span>{festival.venue}</span>
			</div>
			<div
				className={`absolute -top-1 right-2 z-50 rotate-6 rounded-md bg-primary px-2 text-xl font-black text-dark sm:hidden`}
			>
				<span>{festival.year}</span>
			</div>
			{festival.filmSelection && festival.filmSelection.length > 0 && (
				<div className="mb-8 pt-8" id="film-selection">
					<div className="sticky top-[0] z-10 flex flex-col items-center justify-center bg-dark">
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
								className={`flex w-fit -rotate-6 items-center justify-center gap-1 rounded-md border-[3px] px-2 pr-4 text-center text-4xl font-bold uppercase italic tracking-tighter shadow-sm transition-all ${
									isFilmSectionOpen
										? 'border-dark bg-dark text-grayDark dark:border-dark dark:bg-primary dark:text-dark'
										: 'border-dark bg-grayDark text-dark dark:border-primary dark:bg-dark dark:text-primary'
								}`}
							>
								<span>Film Selection</span>
							</motion.div>
						</div>
						{/* <div className="flex items-center justify-center"> */}

						{/* <BackToTopButton targetId="film-selection" /> */}
						{/* </div> */}

						{isFilmSectionOpen && (
							<div className="mt-0 flex w-full items-center justify-between gap-1 rounded-none border-0 border-b-2 border-primary bg-grayLight py-4 pb-2 dark:bg-dark lg:pt-0">
								<div className="flex items-center justify-center">
									<button
										onClick={() => setView('grid')}
										className={`p-2 text-center font-bold tracking-tight transition-colors ${
											view === 'grid'
												? 'border-dark dark:border-dark dark:text-primary'
												: 'border-dark bg-none text-dark dark:border-primary dark:text-grayDark'
										}`}
									>
										<IoGrid />
									</button>

									<button
										onClick={() => setView('list')}
										className={`flex border-2 text-center font-bold tracking-tight transition-colors ${
											view === 'list'
												? 'border-dark dark:border-dark dark:text-primary'
												: 'border-dark bg-none text-dark dark:border-primary dark:text-grayDark'
										}`}
									>
										<IoList />
									</button>
								</div>

								<div className="flex gap-6 tracking-tighter">
									<button
										onClick={() => {
											setSortField('year')
											setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
										}}
										className={`relative flex items-center justify-center p-1 px-2 ${sortField === 'year' ? '' : ''}`}
									>
										{sortField === 'year' && (
											<FilterIcon
												theme={{
													upArrow:
														sortOrder === 'asc'
															? 'var(--color-primary)'
															: 'var(--color-grayDark)', // Use variable for ascending
													downArrow:
														sortOrder === 'desc'
															? 'var(--color-primary)'
															: 'var(--color-grayDark)', // Use variable for descending
												}}
												className="absolute -left-2 h-3"
											/>
										)}
										Year
									</button>
									<button
										onClick={() => {
											setSortField('title')
											setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
										}}
										className={`relative flex items-center justify-center p-1 px-2 ${sortField === 'title' ? '' : ''}`}
									>
										{sortField === 'title' && (
											<FilterIcon
												theme={{
													upArrow:
														sortOrder === 'asc'
															? 'var(--color-primary)'
															: 'var(--color-grayDark)', // Use variable for ascending
													downArrow:
														sortOrder === 'desc'
															? 'var(--color-primary)'
															: 'var(--color-grayDark)', // Use variable for descending
												}}
												className="absolute -left-2 h-3"
											/>
										)}
										Title
									</button>
									<button
										onClick={() => {
											setSortField('director')
											setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
										}}
										className={`relative flex items-center justify-center p-1 px-2 ${sortField === 'director' ? '' : ''}`}
									>
										Director
										{sortField === 'director' && (
											<FilterIcon
												theme={{
													upArrow:
														sortOrder === 'asc'
															? 'var(--color-primary)'
															: 'var(--color-grayDark)', // Use variable for ascending
													downArrow:
														sortOrder === 'desc'
															? 'var(--color-primary)'
															: 'var(--color-grayDark)', // Use variable for descending
												}}
												className="absolute -left-2 h-3"
											/>
										)}
									</button>
									<button
										onClick={() => setShowWinnersOnly(!showWinnersOnly)}
										className={`p-1 px-2 ${showWinnersOnly ? '' : ''}`}
									>
										{showWinnersOnly ? 'Show All' : 'Winners'}
									</button>
								</div>
							</div>
						)}
					</div>

					{isFilmSectionOpen && (
						<div className="-mt-1">
							{view === 'grid' ? (
								<ul className="sticky top-32 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:px-4 lg:grid-cols-3">
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
																className="aspect-square h-auto rounded-none border-2 border-grayDark object-cover dark:border-primary"
															/>
														</div>
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
					className="-mt-5 flex flex-col items-center justify-center pb-1"
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
												<h3 className="z-10 mt-2 inline-block -rotate-1 rounded-md border-2 border-dark bg-grayDark px-2 py-0 text-center text-base font-medium tracking-tighter text-dark">
													Curated by {expo.curatorName || 'Unknown Curator'}
												</h3>
											</div>

											{/* Artist Names */}
											{photosByArtist &&
											Object.keys(photosByArtist).length > 0 ? (
												<ul className="mt-2 text-base text-dark dark:text-primary">
													{Object.keys(photosByArtist).map(
														(artistName, artistIndex) => {
															const isExpanded = selectedArtist === artistName

															return (
																<li
																	key={artistIndex}
																	className="border-b border-dark dark:border-primary"
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
																		<span>{isExpanded ? '-' : '+'}</span>
																	</div>

																	{/* Photos for Selected Artist */}
																	{isExpanded && photosByArtist[artistName] && (
																		<div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
																			{photosByArtist[artistName].map(
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
																							alt={`Photo by ${artistName}`}
																							className="aspect-square h-auto w-full rounded-none object-cover"
																						/>
																					</button>
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

			<div className="pt-0" id="photo-gallery">
				<div className="z-10 -mt-5 flex justify-center">
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
						className={`flex w-fit -rotate-6 items-center justify-center gap-1 rounded-md border-[3px] px-2 pr-4 text-center text-4xl font-bold uppercase italic tracking-[-0.06em] shadow-sm transition-all ${
							isPhotoGalleryOpen
								? 'border-primary bg-dark text-primary dark:border-dark dark:bg-primary dark:text-dark'
								: 'border-dark bg-grayDark text-dark dark:border-primary dark:bg-dark dark:text-primary'
						}`}
					>
						<span>Photo Gallery</span>
					</motion.div>
				</div>

				{isPhotoGalleryOpen && (
					<div className="relative">
						<div className="flex justify-center">
							<h3 className="z-10 mt-2 inline-block -rotate-1 rounded-md border-2 border-dark bg-grayDark px-2 py-0 text-center text-base font-medium tracking-tighter text-dark">
								Photos by Soumaya Pheline
							</h3>
						</div>
						{/* Photo Gallery */}
						<div className="grid w-full grid-cols-3 gap-y-2 bg-grayLight pt-4 dark:bg-dark sm:grid-cols-2 lg:grid-cols-3">
							{festival.photoGallery.flatMap((gallery: any) =>
								gallery.photos.map((photo: any, index: number) => (
									<button
										key={index}
										onClick={() => openLightbox(index)}
										className="relative focus:outline-none"
									>
										{/* Left Film Roll */}
										{/* <div className="absolute top-1 h-[2.5%] w-full rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:15px_11px] bg-center bg-repeat-x sm:w-full"></div> */}
										<div
											className="absolute top-1 h-[2.5%] w-full sm:w-full"
											style={{
												WebkitMaskImage: "url('/assets/svg/filmroll.svg')", // Use the SVG as a mask
												WebkitMaskRepeat: 'repeat-x', // Repeat horizontally
												WebkitMaskSize: '15px 11px', // Adjust the size of the SVG
												maskImage: "url('/assets/svg/filmroll.svg')", // Fallback for non-Webkit browsers
												maskRepeat: 'repeat-x',
												maskSize: '15px 11px',
												backgroundColor: 'var(--color-dark)', // Control the color here
											}}
										></div>

										{/* Right Film Roll */}
										{/* <div className="absolute bottom-1 h-[2.5%] w-full rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:15px_11px] bg-center bg-repeat-x sm:w-full"></div> */}

										<div
											className="absolute bottom-1 h-[2.5%] w-full sm:w-full"
											style={{
												WebkitMaskImage: "url('/assets/svg/filmroll.svg')", // Use the SVG as a mask
												WebkitMaskRepeat: 'repeat-x', // Repeat horizontally
												WebkitMaskSize: '15px 11px', // Adjust the size of the SVG
												maskImage: "url('/assets/svg/filmroll.svg')", // Fallback for non-Webkit browsers
												maskRepeat: 'repeat-x',
												maskSize: '15px 11px',
												backgroundColor: 'var(--color-dark)', // Control the color here
											}}
										></div>

										<Img
											image={photo}
											src={photo.asset.url}
											alt={`Photo ${index + 1}`}
											className="aspect-square h-auto w-full rounded-none object-cover"
										/>
									</button>
								)),
							)}
						</div>

						{/* Lightbox Modal */}
						{isLightboxOpen && (
							<div className="fixed inset-0 z-40 flex items-center justify-center bg-dark/95">
								{/* Close Button */}
								<button
									onClick={closeLightbox}
									className="absolute right-4 top-4 z-40 px-2 text-3xl font-medium text-primary"
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
			</div>

			<div className="py-4 lg:max-w-[50%] [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-grayDark [&::-webkit-scrollbar]:w-2">
				{festival.text?.[language]?.map((block: any) => {
					// Check if the block is a list item
					if (block.listItem === 'bullet') {
						return (
							<ul key={block._key} className="list-disc">
								<li className="mt-4 text-lg font-normal leading-[1.2] tracking-tighter">
									{block.children.map((child: any) => child.text).join('')}
								</li>
							</ul>
						)
					}

					// Render regular paragraphs for non-list items
					return (
						<p
							key={block._key}
							className="mt-4 text-base font-normal leading-[1.2] tracking-tighter first:mt-0"
						>
							{block.children.map((child: any) => child.text).join('')}
						</p>
					)
				})}
			</div>

			{festival.pressLink && (
				<a
					href={festival.pressLink}
					target="_blank"
					rel="noopener noreferrer"
					className="mt-4 inline-block text-primary underline"
				>
					Press Link
				</a>
			)}
		</div>
	)
}

export default FestivalEditionContent
