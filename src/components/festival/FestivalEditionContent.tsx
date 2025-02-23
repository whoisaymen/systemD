'use client'
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
		<div className="no-scrollbar flex h-full w-full flex-col space-y-4 overflow-y-scroll rounded-md px-4 py-24 text-base font-medium leading-tight tracking-tighter text-grayDark sm:space-y-0 sm:bg-white sm:px-0 sm:pt-0">
			<div
				className={`absolute left-[60%] top-16 z-10 rounded-md bg-primary px-2 text-lg font-black sm:hidden ${getRandomRotationClass()}`}
			>
				<span>{festival.year}</span>
			</div>
			<div className="absolute left-1/2 top-14 z-10 -translate-x-1/2 rounded-md bg-grayDark px-2 text-xl font-semibold text-dark sm:hidden">
				<span>{festival.venue}</span>
			</div>

			{festival.visual && (
				<div className="h-[50vh] sm:h-[50vh]">
					<Img
						image={festival.visual}
						src={festival.visual.asset.url}
						alt={
							festival.title
								? getLocalizedValue(festival.title, language)
								: 'Festival image'
						}
						className="h-full w-full rounded-md object-cover sm:rounded-b-none"
					/>
				</div>
			)}

			{/* {festival.aftermovieLink && (
				<h1 className="text-3xl font-bold">{festival.aftermovieLink}</h1>
			)} */}

			{festival.description && (
				<div className="pt-8">
					<ReadMore
						text={getLocalizedValue(festival.description, language)}
						link={festival.pressLink}
					/>
				</div>
			)}

			<div className="pt-8">
				<Accordion type="single" collapsible>
					<AccordionItem value="item-1">
						<AccordionTrigger>Photo gallery</AccordionTrigger>
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
					<div className="flex h-auto w-full items-center justify-between px-0 pt-0 sm:px-4">
						{/* <h2
							className={`w-1/2 rounded-md border-2 border-dark bg-primary px-2 py-1 text-center font-bold tracking-tight text-dark`}
						> */}
						<h2 className="rounded-md border-2 border-dark bg-white px-2 text-xl font-bold text-dark">
							Film Selection
						</h2>
						<div className="flex h-full w-1/2 items-center justify-end gap-1">
							<button
								onClick={() => setView('grid')}
								className={`rounded-md border-2 px-3 py-2 text-center font-bold tracking-tight transition-colors ${
									view === 'grid'
										? 'border-primary bg-dark text-primary' // Active: Dark background, primary text & border
										: 'border-grayDark bg-grayLight text-dark hover:bg-grayDark hover:text-white' // Inactive: Light gray, hover darkens
								}`}
							>
								<IoGrid />
							</button>

							<button
								onClick={() => setView('list')}
								className={`flex rounded-md border-2 px-3 py-2 text-center font-bold tracking-tight transition-colors ${
									view === 'list'
										? 'border-primary bg-dark text-primary' // Active: Strong contrast, bold secondary color
										: 'border-grayDark bg-grayLight text-dark hover:bg-grayDark hover:text-white' // Inactive: Light gray, hover darkens
								}`}
							>
								<IoList />
							</button>
						</div>
					</div>
					{view === 'grid' ? (
						<ul className="grid grid-cols-2 gap-2 px-0 sm:grid-cols-2 sm:px-4 lg:grid-cols-3">
							{festival.filmSelection.map((film: any, index: number) => (
								<li
									key={index}
									className="relative h-full w-full rounded-md shadow-md"
								>
									{film.slug?.current ? (
										<Link href={`/${language}/film/${film.slug.current}`}>
											{film.affiche && (
												<Img
													image={film.affiche}
													src={film.affiche.asset.url}
													alt={getLocalizedValue(film.title, language)}
													className="h-[20vh] w-full rounded-md object-cover"
												/>
											)}
											<div className="absolute bottom-1 left-0 z-10 flex items-center justify-between rounded-md px-2">
												<div className="flex items-center">
													<h3 className="text-xs font-semibold text-grayLight">
														{getLocalizedValue(film.title, language)}
														<span className="font-normal italic">
															{' '}
															({film.year})
														</span>
													</h3>
												</div>
												{/* <p className="text-sm">{film.director}</p> */}
											</div>
											<div className="absolute bottom-0 left-0 h-16 w-full rounded-md bg-gradient-to-t from-dark to-transparent"></div>
										</Link>
									) : (
										<div>
											{film.affiche && (
												<Img
													image={film.affiche}
													src={film.affiche.asset.url}
													alt={getLocalizedValue(film.title, language)}
													className="h-[20vh] w-full rounded-md object-cover"
												/>
											)}
											<div className="absolute bottom-1 left-0 z-10 flex items-center justify-between rounded-md px-2">
												<div className="flex items-center">
													<h3 className="text-xs font-semibold text-grayLight">
														{getLocalizedValue(film.title, language)}
														<span className="font-normal italic">
															{' '}
															({film.year})
														</span>
													</h3>
												</div>
												{/* <p className="text-sm">{film.director}</p> */}
											</div>
											<div className="absolute bottom-0 left-0 h-16 w-full rounded-md bg-gradient-to-t from-dark to-transparent"></div>
										</div>
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
								{festival.filmSelection.map((film: any, index: number) => (
									<tr
										key={index}
										onMouseEnter={() => setHoveredFilm(film._id)}
										onMouseLeave={() => setHoveredFilm(null)}
										className="relative hover:bg-grayLight"
									>
										<td className="border-b border-grayDark py-2">
											{film.year}
										</td>
										<td className="border-b border-grayDark px-4 py-2">
											{film.director}
										</td>
										<td className="border-b border-grayDark px-4 py-2 pr-8 text-dark">
											{film.slug?.current ? (
												<Link href={`/${language}/film/${film.slug.current}`}>
													{getLocalizedValue(film.title, language)}
												</Link>
											) : (
												<span>{getLocalizedValue(film.title, language)}</span>
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
				</>
			)}

			{festival.expoPhoto && festival.expoPhoto.length > 0 && (
				<div>
					<h2 className="text-2xl font-bold">Expo Photo</h2>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{/* {festival.expoPhoto.map((photo: any, index: number) => (
							<Img
								key={index}
								image={photo}
								src={photo.asset.url}
								alt={`Expo Photo ${index + 1}`}
								className="h-auto w-full rounded-md"
							/>
						))} */}
					</div>
				</div>
			)}
		</div>
	)
}

export default FestivalEditionContent
