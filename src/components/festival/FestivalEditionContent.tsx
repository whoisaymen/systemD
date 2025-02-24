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

	return (
		<div className="no-scrollbar flex h-full w-full flex-col space-y-4 overflow-y-scroll rounded-md px-4 py-24 text-base font-medium leading-tight tracking-tighter text-dark dark:text-primary sm:space-y-0 sm:bg-white sm:px-0 sm:pt-0">
			{festival.visual && (
				<div className="-mb-12 h-[50vh] sm:h-[50vh]">
					<motion.div
						initial={{
							borderRadius: '0.375rem',
						}}
						animate={{ borderRadius: '15rem' }}
						transition={{
							duration: 2,
							ease: [0.76, 0, 0.24, 1],
							repeat: Infinity,
							repeatType: 'reverse',
						}}
						className="overflow-hidden border-2 border-primary shadow-md"
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
					</motion.div>
				</div>
			)}

			{/* {festival.aftermovieLink && (
				<h1 className="text-3xl font-bold">{festival.aftermovieLink}</h1>
			)} */}
			<div className="flex h-full w-full flex-col items-center justify-center">
				<div
					className={`z-10 rounded-md bg-grayDark px-2 text-6xl font-semibold text-dark sm:hidden ${getRandomRotationClass()} `}
				>
					<span>{festival.venue}</span>
				</div>
				<div
					className={`relative z-10 rounded-md bg-primary px-2 text-4xl font-black text-dark sm:hidden ${getRandomRotationClass()}`}
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

			<div className="pt-8">
				<Accordion type="single" collapsible>
					<AccordionItem
						value="item-1"
						className="flex flex-col items-center justify-center"
					>
						<AccordionTrigger className={`${getRandomRotationClass()}`}>
							Photo Gallery
						</AccordionTrigger>
						<AccordionContent>
							{festival.photoGallery && festival.photoGallery.length > 0 && (
								<div className="grid w-full grid-cols-2 gap-2 pt-4 sm:grid-cols-2 lg:grid-cols-3">
									{festival.photoGallery.flatMap((gallery: any) =>
										gallery.photos.map((photo: any, photoIndex: number) => (
											<Img
												key={photoIndex}
												image={photo}
												src={photo.asset.url}
												alt={`Photo ${photoIndex + 1}`}
												className="h-auto w-full rounded-md"
											/>
										)),
									)}
								</div>
							)}
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>

			{festival.filmSelection && festival.filmSelection.length > 0 && (
				<>
					<Accordion type="single" collapsible>
						<AccordionItem
							value="item-2"
							className="flex flex-col items-center justify-center"
						>
							<AccordionTrigger
								className={`${getRandomRotationClass()} sticky left-0 top-0`}
							>
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
									<ul className="grid grid-cols-2 gap-4 px-2 sm:grid-cols-2 sm:px-4 lg:grid-cols-3">
										{festival.filmSelection.map((film: any, index: number) => (
											<li key={index} className="relative h-full w-full">
												{film.slug?.current ? (
													<Link href={`/${language}/film/${film.slug.current}`}>
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
			)}

			<Accordion type="single" collapsible>
				<AccordionItem
					value="item-3"
					className="flex flex-col items-center justify-center"
				>
					<AccordionTrigger className={`${getRandomRotationClass()}`}>
						Expo Photo
					</AccordionTrigger>
					<AccordionContent>
						{festival.expoPhoto && festival.expoPhoto.length > 0 && (
							<div className="my-4">
								<h2 className="text-2xl font-bold">Expo Photo</h2>
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"></div>
							</div>
						)}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	)
}

export default FestivalEditionContent
