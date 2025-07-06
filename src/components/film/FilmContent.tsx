// 'use client'
// import { motion } from 'motion/react'

// import { getRandomRotationClass } from '@/lib/utils'
// import Img from '@/ui/Img'
// import { GoClockFill } from 'react-icons/go'
// import { FaLocationDot, FaPlay, FaTag } from 'react-icons/fa6'
// import { BiSolidCameraMovie } from 'react-icons/bi'
// import ReactPlayer from 'react-player'
// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import ArrowRight from '../common/ArrowRight'

// interface FilmContentProps {
// 	film: any
// 	language: string
// 	festival?: any // Optional in case festival data isn't available
// 	searchParams?: URLSearchParams
// }

// const FilmContent: React.FC<FilmContentProps> = ({ film, language }) => {
// 	const getLocalizedValue = (array: any[], lang: string) => {
// 		if (!Array.isArray(array)) {
// 			return ''
// 		}
// 		const item = array.find((entry) => entry._key === lang)
// 		return item ? item.value : ''
// 	}

// 	if (!film) {
// 		return <div>No content available</div>
// 	}

// 	const [showPlayer, setShowPlayer] = useState(false)

// 	const isYoutubeOrVimeo =
// 		film.playFilmUrl &&
// 		(film.playFilmUrl.includes('youtube.com') ||
// 			film.playFilmUrl.includes('youtu.be') ||
// 			film.playFilmUrl.includes('vimeo.com'))

// 	const router = useRouter()

// 	return (
// 		<div className="no-scrollbar relative mt-1 flex h-full w-full flex-col overflow-y-visible rounded-md px-5 tracking-tighter sm:mt-0 sm:min-h-screen sm:overflow-y-visible sm:py-1">
// 			<div className="relative my-4 flex w-full items-start justify-between">
// 				<div
// 					className={`rounded-md bg-dark p-0.5 pr-2 text-3xl font-semibold sm:hidden`}
// 				>
// 					<button
// 						onClick={() => router.back()}
// 						className=""
// 						aria-label="Go back"
// 					>
// 						<ArrowRight
// 							theme={{ fill: 'var(--color-primary)' }}
// 							className="h-auto w-8 -rotate-180 lg:w-9"
// 						/>
// 					</button>
// 				</div>
// 				<div className="flex flex-col items-end justify-start gap-0 px-2">
// 					{film.title && (
// 						<h1
// 							className={`z-10 rounded-md border-0 border-dark bg-primary p-0 text-right text-3xl font-black italic text-dark dark:border-primary dark:bg-dark dark:text-primary`}
// 						>
// 							{getLocalizedValue(film.title, language)}
// 							<span className="font-extralight italic">, ({film.year})</span>
// 						</h1>
// 					)}
// 					{film.director && (
// 						<p
// 							className={`z-10 -mt-1 inline-block w-auto rounded-md border-0 border-primary bg-dark px-1 py-0 text-center font-medium tracking-tighter text-primary`}
// 						>
// 							{film.director}
// 						</p>
// 					)}
// 				</div>

// 				{/* {film.year && (
// 					<p
// 						className={`z-10 rounded-md bg-grayDark px-1 text-xs font-black text-primary dark:bg-primary dark:text-dark sm:hidden`}
// 					>
// 						{film.year}
// 					</p>
// 				)} */}
// 			</div>
// 			{/* <div className="absolute left-1 z-30 h-full w-[2.5%] rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:11px_30px] bg-center bg-repeat-y sm:-left-0 sm:h-full"></div>
// 			<div className="absolute right-1 z-30 h-full w-[2.5%] rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:11px_30px] bg-center bg-repeat-y sm:-right-0 sm:h-full"></div> */}

// 			{isYoutubeOrVimeo ? (
// 				showPlayer ? (
// 					<div className="relative mx-auto flex max-h-[60vh] min-h-[30vh] w-full items-center justify-center overflow-hidden rounded-md border-2 border-primary bg-dark shadow-md">
// 						<ReactPlayer
// 							url={film.playFilmUrl}
// 							playing
// 							controls
// 							width="100%"
// 							height="100%"
// 							style={{ position: 'absolute', top: 0, left: 0 }}
// 							config={{
// 								youtube: { playerVars: { autoplay: 1, mute: 1, rel: 0 } },
// 								vimeo: { playerOptions: { autoplay: 1 } },
// 							}}
// 						/>
// 					</div>
// 				) : (
// 					<div className="relative mx-1 flex h-full items-center justify-center overflow-hidden rounded-md border-2 border-primary bg-dark shadow-md">
// 						<Img
// 							image={film.affiche}
// 							src={film.affiche.asset.url}
// 							alt={getLocalizedValue(film.title, language)}
// 							className="h-auto w-full object-cover"
// 						/>
// 						<button
// 							onClick={() => setShowPlayer(true)}
// 							className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-4xl dark:border-primary"
// 							aria-label="Play film"
// 						>
// 							<FaPlay className="pl-2 text-primary" />
// 						</button>
// 					</div>
// 				)
// 			) : (
// 				film.affiche && (
// 					<div className="relative mx-1 flex h-auto items-center justify-center overflow-hidden rounded-md border-2 border-primary bg-dark shadow-md">
// 						<Img
// 							image={film.affiche}
// 							src={film.affiche.asset.url}
// 							alt={getLocalizedValue(film.title, language)}
// 							className="h-auto w-full object-cover"
// 						/>
// 					</div>
// 				)
// 			)}

// 			<div className="relative mb-0 mt-6 flex w-full flex-col items-center justify-center gap-2 px-6 text-xs font-medium leading-[1.2]">
// 				<button className="absolute bottom-1/2 left-1" aria-label="Go back">
// 					<ArrowRight
// 						theme={{
// 							fill: 'var(--color-dark)',
// 							stroke: 'var(--color-grayDark)',
// 						}}
// 						className="h-auto w-8 -rotate-180 lg:w-9"
// 					/>
// 				</button>

// 				<button className="absolute bottom-1/2 right-1" aria-label="Go back">
// 					<ArrowRight
// 						theme={{
// 							fill: 'var(--color-dark)',
// 							stroke: 'var(--color-grayDark)',
// 						}}
// 						className="h-auto w-8 lg:w-9"
// 					/>
// 				</button>
// 				<div className="flex items-center justify-center gap-1">
// 					{film.length && (
// 						<span className="flex items-center justify-center gap-1 rounded-full border-2 px-2 text-dark dark:border-grayDark dark:bg-grayDark dark:text-dark">
// 							<GoClockFill />
// 							<span>{film.length} minutes</span>
// 						</span>
// 					)}

// 					{film.city && (
// 						<span className="flex items-center justify-center gap-1 rounded-full border-2 px-2 text-dark dark:border-grayDark dark:bg-grayDark dark:text-dark">
// 							<FaLocationDot />
// 							<span>{getLocalizedValue(film.city, language)}</span>
// 						</span>
// 					)}
// 				</div>

// 				<div className="flex items-center justify-center gap-1">
// 					{film.genre && film.genre.title && (
// 						<span className="flex items-center justify-center gap-1 rounded-full border-2 px-2 text-dark dark:border-grayDark dark:bg-grayDark dark:text-dark">
// 							<FaTag />
// 							{getLocalizedValue(film.genre.title, language) ||
// 								// fallback: show the first available value
// 								(Array.isArray(film.genre.title) &&
// 									film.genre.title[0]?.value) ||
// 								''}
// 						</span>
// 					)}
// 					{film.production && (
// 						<span className="flex items-center justify-center gap-1 rounded-full border-2 px-2 text-dark dark:border-grayDark dark:bg-grayDark dark:text-dark">
// 							<BiSolidCameraMovie />
// 							{film.production}
// 						</span>
// 					)}
// 				</div>
// 			</div>

// 			{/* {film.synopsis && (
// 				<div className="relative mt-2 rounded-full rounded-md border-2 border-dark bg-[#fff] px-4 py-10 shadow-sm dark:bg-secondary sm:py-10">
// 					<p className="mx-auto py-2 text-center text-xl font-bold leading-[1.2] tracking-tighter text-dark sm:py-4 sm:text-4xl">
// 						{getLocalizedValue(film.synopsis, language)}
// 					</p>
// 				</div>
// 			)} */}

// 			{film.synopsis && (
// 				<div className="relative px-2 py-6 sm:py-10">
// 					<p className="mx-auto py-2 text-left text-base leading-[1.2] tracking-tighter text-primary sm:py-4 sm:text-4xl">
// 						{getLocalizedValue(film.synopsis, language)}
// 					</p>
// 				</div>
// 			)}

// 			<div className="mx-2 flex items-center justify-center gap-1 pb-32">
// 				<span className="w-fit -rotate-2 rounded-md border-2 border-primary bg-primary px-2 text-sm font-medium text-dark">
// 					Press link
// 				</span>
// 				<span className="w-fit rotate-3 rounded-md border-2 border-primary bg-primary px-2 text-sm font-medium text-dark">
// 					Instagram
// 				</span>
// 				<span className="w-fit -rotate-3 rounded-md border-2 border-primary bg-primary px-2 text-sm font-medium text-dark">
// 					Prod
// 				</span>
// 				<span className="w-fit rotate-3 rounded-md border-2 border-primary bg-primary px-2 text-sm font-medium text-dark">
// 					Facebook
// 				</span>
// 			</div>
// 		</div>
// 	)
// }

// export default FilmContent

'use client'
import { motion } from 'motion/react'

import { getRandomRotationClass } from '@/lib/utils'
import Img from '@/ui/Img'
import { GoClockFill } from 'react-icons/go'
import { FaLocationDot, FaPlay, FaTag } from 'react-icons/fa6'
import { BiSolidCameraMovie } from 'react-icons/bi'
import ReactPlayer from 'react-player'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import ArrowRight from '../common/ArrowRight'

interface FilmContentProps {
	film: any
	language: string
	festival?: any
	searchParams?: Record<string, string> // Changed from URLSearchParams
}

const FilmContent: React.FC<FilmContentProps> = ({
	film,
	language,
	festival,
	searchParams,
}) => {
	const [showPlayer, setShowPlayer] = useState(false)
	const router = useRouter()

	const getLocalizedValue = (array: any[], lang: string) => {
		if (!Array.isArray(array)) {
			return ''
		}
		const item = array.find((entry) => entry._key === lang)
		return item ? item.value : ''
	}

	// Reconstruct the sorted films array based on current filters/sorting
	const sortedFilms = useMemo(() => {
		console.log('Sorting films with params:', searchParams)
		console.log('Festival film selection:', festival?.filmSelection)

		if (!festival?.filmSelection) return []

		const sortField = searchParams?.sort || 'year'
		const sortOrder = searchParams?.order || 'asc'
		const showWinnersOnly = searchParams?.winners === '1'

		// Apply filters
		const filteredFilms = showWinnersOnly
			? festival.filmSelection.filter((f: any) => f.isWinner)
			: festival.filmSelection

		// Apply sorting
		return [...filteredFilms].sort((a: any, b: any) => {
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
	}, [festival, searchParams, language])

	// Find current film index and navigation info
	const navigationInfo = useMemo(() => {
		const currentIndex = sortedFilms.findIndex(
			(f) => f.slug?.current === film.slug?.current,
		)
		const prevFilm = currentIndex > 0 ? sortedFilms[currentIndex - 1] : null
		const nextFilm =
			currentIndex < sortedFilms.length - 1
				? sortedFilms[currentIndex + 1]
				: null

		return {
			currentIndex,
			prevFilm,
			nextFilm,
			total: sortedFilms.length,
		}
	}, [sortedFilms, film])

	const navigateToFilm = (targetFilm: any) => {
		if (!targetFilm?.slug?.current) return

		// Preserve search parameters
		const params = new URLSearchParams(searchParams || {})
		const queryString = params.toString()
		const url = `/${language}/film/${targetFilm.slug.current}${queryString ? `?${queryString}` : ''}`

		router.push(url)
	}

	const goBack = () => {
		if (!festival?._id) {
			// Fallback to general memoire page if no festival data
			router.push(`/${language}/memoire`)
			return
		}

		sessionStorage.setItem('currentFilmSlug', film.slug?.current || '')

		const params = new URLSearchParams(searchParams || {})
		const queryString = params.toString()

		// Use the festival ID since we don't have a slug
		const url = `/${language}/festival/${festival.year}${queryString ? `?${queryString}` : ''}`

		console.log('Navigating back to:', url)
		router.push(url)
	}

	if (!film) {
		return <div>No content available</div>
	}

	const isYoutubeOrVimeo =
		film.playFilmUrl &&
		(film.playFilmUrl.includes('youtube.com') ||
			film.playFilmUrl.includes('youtu.be') ||
			film.playFilmUrl.includes('vimeo.com'))

	console.log('Film Content Props:', {
		film: film?.title,
		festival: festival?.year,
		filmCount: festival?.filmSelection?.length,
	})
	return (
		<div className="no-scrollbar relative mt-1 flex h-full w-full flex-col overflow-y-visible rounded-md px-5 tracking-tighter sm:mt-0 sm:min-h-screen sm:overflow-y-visible sm:py-1">
			<div className="relative my-0 flex w-full flex-col items-start justify-between">
				<div
					className={`w-full rounded-md bg-dark p-0.5 pr-2 text-3xl font-semibold text-primary sm:hidden`}
					onClick={goBack}
				>
					<button onClick={goBack} aria-label="Go back">
						<ArrowRight
							theme={{ fill: 'var(--color-primary)' }}
							className="h-auto w-8 -rotate-180 lg:w-9"
						/>
					</button>
					{/* ⟵ <span className="font-mono text-sm uppercase">Film selection</span> */}
				</div>
				{/* <div className="flex flex-col items-end justify-start gap-0 px-2">
					{film.title && (
						<h1
							className={`z-10 rounded-md border-0 border-dark bg-primary p-0 text-right text-3xl font-black italic text-dark dark:border-primary dark:bg-dark dark:text-primary`}
						>
							{getLocalizedValue(film.title, language)}
							<span className="font-extralight italic">, ({film.year})</span>
						</h1>
					)}
					{film.director && (
						<p
							className={`z-10 -mt-1 inline-block w-auto rounded-md border-0 border-primary bg-dark px-1 py-0 text-center font-medium tracking-tighter text-primary`}
						>
							{film.director}
						</p>
					)}
				</div> */}
			</div>

			{isYoutubeOrVimeo ? (
				showPlayer ? (
					<div className="relative mx-auto flex max-h-[60vh] min-h-[30vh] w-full items-center justify-center overflow-hidden rounded-md border-2 border-primary bg-dark shadow-md">
						<ReactPlayer
							url={film.playFilmUrl}
							playing
							controls
							width="100%"
							height="100%"
							style={{ position: 'absolute', top: 0, left: 0 }}
							config={{
								youtube: { playerVars: { autoplay: 1, mute: 1, rel: 0 } },
								vimeo: { playerOptions: { autoplay: 1 } },
							}}
						/>
					</div>
				) : (
					<div className="relative mx-1 flex h-full items-center justify-center overflow-hidden rounded-md border-2 border-primary bg-dark shadow-md">
						<Img
							image={film.affiche}
							src={film.affiche.asset.url}
							alt={getLocalizedValue(film.title, language)}
							className="h-auto w-full object-cover"
						/>
						<button
							onClick={() => setShowPlayer(true)}
							className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-4xl dark:border-primary"
							aria-label="Play film"
						>
							<FaPlay className="pl-2 text-primary" />
						</button>
					</div>
				)
			) : (
				film.affiche && (
					<div className="relative mx-1 flex h-auto items-center justify-center overflow-hidden rounded-md border-2 border-primary bg-dark shadow-md">
						<Img
							image={film.affiche}
							src={film.affiche.asset.url}
							alt={getLocalizedValue(film.title, language)}
							className="h-auto w-full object-cover"
						/>
					</div>
				)
			)}

			<div className="relative mb-0 mt-6 flex w-full flex-col items-center justify-center gap-2 px-6 text-xs font-medium leading-[1.2]">
				<div className="flex flex-col items-center justify-center gap-0 px-2">
					{film.title && (
						<h1
							className={`z-10 rounded-md border-0 border-dark bg-primary p-0 text-right text-3xl font-black italic text-dark dark:border-primary dark:bg-dark dark:text-primary`}
						>
							{getLocalizedValue(film.title, language)}
							<span className="font-extralight italic"> ({film.year})</span>
						</h1>
					)}
					{film.director && (
						<p
							className={`z-10 -mt-1 inline-block w-auto rounded-md border-0 border-primary bg-dark px-1 py-0 text-center font-mono text-base font-medium uppercase tracking-tighter text-primary`}
						>
							{film.director}
						</p>
					)}
				</div>
				{/* Previous film button */}
				<button
					className={`absolute bottom-1/2 left-1 ${
						navigationInfo.prevFilm ? 'opacity-100' : 'hidden'
					}`}
					onClick={() =>
						navigationInfo.prevFilm && navigateToFilm(navigationInfo.prevFilm)
					}
					disabled={!navigationInfo.prevFilm}
					aria-label="Previous film"
					title={
						navigationInfo.prevFilm
							? `Previous: ${getLocalizedValue(navigationInfo.prevFilm.title, language)}`
							: 'No previous film'
					}
				>
					<ArrowRight
						theme={{
							fill: navigationInfo.prevFilm
								? 'var(--color-dark)'
								: 'var(--color-grayDark)',
							stroke: 'var(--color-primary)',
						}}
						className="h-auto w-8 -rotate-180 lg:w-9"
					/>
				</button>

				{/* Next film button */}
				<button
					className={`absolute bottom-1/2 right-1 ${
						navigationInfo.nextFilm
							? 'opacity-100'
							: 'cursor-not-allowed opacity-30'
					}`}
					onClick={() =>
						navigationInfo.nextFilm && navigateToFilm(navigationInfo.nextFilm)
					}
					disabled={!navigationInfo.nextFilm}
					aria-label="Next film"
					title={
						navigationInfo.nextFilm
							? `Next: ${getLocalizedValue(navigationInfo.nextFilm.title, language)}`
							: 'No next film'
					}
				>
					<ArrowRight
						theme={{
							fill: navigationInfo.nextFilm
								? 'var(--color-dark)'
								: 'var(--color-grayDark)',
							stroke: 'var(--color-primary)',
						}}
						className="h-auto w-8 lg:w-9"
					/>
				</button>

				{/* Film counter - only show if we have festival data */}
				{festival && sortedFilms.length > 0 && (
					<div className="mb-2 text-xs text-grayDark">
						{navigationInfo.currentIndex + 1} / {navigationInfo.total}
					</div>
				)}

				<div className="flex items-center justify-center gap-1">
					{film.length && (
						<span className="flex items-center justify-center gap-1 rounded-full border-2 px-2 text-dark dark:border-grayDark dark:bg-grayDark dark:text-dark">
							<GoClockFill />
							<span>{film.length} minutes</span>
						</span>
					)}

					{film.city && (
						<span className="flex items-center justify-center gap-1 rounded-full border-2 px-2 text-dark dark:border-grayDark dark:bg-grayDark dark:text-dark">
							<FaLocationDot />
							<span>{getLocalizedValue(film.city, language)}</span>
						</span>
					)}
				</div>

				<div className="flex items-center justify-center gap-1">
					{film.genre && film.genre.title && (
						<span className="flex items-center justify-center gap-1 rounded-full border-2 px-2 text-dark dark:border-grayDark dark:bg-grayDark dark:text-dark">
							<FaTag />
							{getLocalizedValue(film.genre.title, language) ||
								// fallback: show the first available value
								(Array.isArray(film.genre.title) &&
									film.genre.title[0]?.value) ||
								''}
						</span>
					)}
					{film.production && (
						<span className="flex items-center justify-center gap-1 rounded-full border-2 px-2 text-dark dark:border-grayDark dark:bg-grayDark dark:text-dark">
							<BiSolidCameraMovie />
							{film.production}
						</span>
					)}
				</div>
			</div>

			{film.synopsis && (
				<div className="relative px-2 py-6 sm:py-10">
					<p className="mx-auto py-2 text-left text-base leading-[1.2] tracking-tighter text-primary sm:py-4 sm:text-4xl">
						{getLocalizedValue(film.synopsis, language)}
					</p>
				</div>
			)}

			<div className="mx-2 flex items-center justify-center gap-1 pb-32">
				<span className="w-fit -rotate-2 rounded-md border-2 border-primary bg-primary px-2 text-sm font-medium text-dark">
					Press link
				</span>
				<span className="w-fit rotate-3 rounded-md border-2 border-primary bg-primary px-2 text-sm font-medium text-dark">
					Instagram
				</span>
				<span className="w-fit -rotate-3 rounded-md border-2 border-primary bg-primary px-2 text-sm font-medium text-dark">
					Prod
				</span>
				<span className="w-fit rotate-3 rounded-md border-2 border-primary bg-primary px-2 text-sm font-medium text-dark">
					Facebook
				</span>
			</div>
		</div>
	)
}

export default FilmContent
