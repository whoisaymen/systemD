'use client'
import { motion } from 'motion/react'

import { getRandomRotationClass } from '@/lib/utils'
import Img from '@/ui/Img'
import { GoClockFill } from 'react-icons/go'
import { FaLocationDot, FaPlay, FaTag } from 'react-icons/fa6'
import { BiSolidCameraMovie } from 'react-icons/bi'
import ReactPlayer from 'react-player'
import { useState, useMemo } from 'react'
import ArrowRight from '../common/ArrowRight'
import { useRouter } from 'next/navigation'

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
		<div className="no-scrollbar relative mt-1 flex h-full w-full flex-col overflow-y-visible rounded-md px-5 tracking-tighter sm:mt-0 sm:min-h-screen sm:overflow-y-visible sm:py-1 lg:px-32">
			<div className="relative my-0 my-2 flex w-full items-start justify-between">
				<div
					className={`w-fit rounded-md bg-dark p-0.5 pr-2 text-3xl font-semibold text-primary lg:absolute lg:-left-32 lg:top-0`}
					onClick={goBack}
				>
					<button onClick={goBack} aria-label="Go back">
						<ArrowRight
							theme={{ fill: 'var(--color-primary)' }}
							className="h-auto w-8 -rotate-180 lg:w-9"
						/>
					</button>
				</div>

				<div className="z-50 hidden items-center justify-center rounded-b-md bg-grayLight px-2 dark:bg-dark lg:mt-24 lg:flex">
					<div className="absolute left-1/2 top-20 flex w-[90%] -translate-x-1/2 flex-col items-center lg:flex-row">
						{film.title && (
							<>
								{splitTitle(getLocalizedValue(film.title, language), 20).map(
									(line, idx) => (
										<h1
											key={idx}
											className={[
												'z-10 rounded-md border-2 border-dark bg-grayDark px-2 text-center text-3xl font-black italic text-dark dark:border-primary dark:bg-dark dark:text-primary lg:text-4xl',
												idx === 0 ? '' : '-z-0 -mt-1',
												idx % 2 === 0
													? '-rotate-1 lg:-rotate-3'
													: 'rotate-1 lg:rotate-3',
											].join(' ')}
										>
											{line}
										</h1>
									),
								)}
							</>
						)}

						{film.director && (
							<>
								{splitTitle(film.director, 26).map((line, idx) => (
									<p
										key={idx}
										className={[
											'z-10 mt-0 inline-block w-auto rounded-md border-2 border-dark bg-grayDark px-2 py-0 text-center font-medium tracking-tighter text-dark lg:border-0 lg:text-2xl',

											idx === 0 ? '' : '-z-0 -mt-[0.15rem]',
											idx % 2 === 0
												? '-rotate-1 lg:-rotate-3'
												: 'rotate-1 lg:rotate-3',
										].join(' ')}
									>
										{line}
									</p>
								))}
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

				<div className="flex w-full flex-col items-end justify-start gap-0 px-2 lg:hidden">
					{film.title && (
						<h1
							className={`z-10 rounded-md border-0 border-dark bg-primary p-0 text-right text-3xl font-black italic leading-[1.2] text-dark dark:border-primary dark:bg-dark dark:text-primary`}
						>
							{getLocalizedValue(film.title, language)}
						</h1>
					)}

					<span className="text-right font-mono text-base font-normal tracking-[-0.10em] text-primary">
						{film.director}{' '}
						<span className="font-sans italic">({film.year})</span>
					</span>
				</div>
			</div>
			<div className="relative">
				<button
					className={`absolute -left-12 top-1/2 hidden lg:block ${
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
							stroke: 'var(--color-grayDark)',
						}}
						className="h-auto w-8 -rotate-180 lg:w-9"
					/>
				</button>
				<button
					className={`absolute -right-12 top-1/2 hidden lg:block ${
						navigationInfo.nextFilm ? 'opacity-100' : 'hidden'
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
							stroke: 'var(--color-grayDark)',
						}}
						className="h-auto w-8 lg:w-9"
					/>
				</button>
				{isYoutubeOrVimeo ? (
					showPlayer ? (
						<div className="relative mx-auto flex max-h-[60vh] min-h-[30vh] w-full items-center justify-center overflow-hidden rounded-md border-2 border-primary bg-dark shadow-md lg:min-h-[60vh]">
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
						<div className="relative mx-1 flex h-full items-center justify-center overflow-hidden rounded-md border-2 border-primary bg-dark shadow-md lg:max-h-[60vh] lg:border-[3px]">
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
						<div className="relative mx-1 flex h-auto items-center justify-center overflow-hidden rounded-md border-2 border-primary bg-dark shadow-md lg:max-h-[60vh] lg:border-[3px]">
							<Img
								image={film.affiche}
								src={film.affiche.asset.url}
								alt={getLocalizedValue(film.title, language)}
								className="h-auto w-full object-cover"
							/>
						</div>
					)
				)}
			</div>

			<div className="relative mb-0 mt-4 flex w-full flex-col items-center justify-center gap-2 px-6 text-xs font-medium leading-[1.2]">
				<button
					className={`absolute bottom-1/2 left-1 lg:hidden ${
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
							stroke: 'var(--color-grayDark)',
						}}
						className="h-auto w-8 -rotate-180 lg:w-9"
					/>
				</button>

				<button
					className={`absolute bottom-1/2 right-1 lg:hidden ${
						navigationInfo.nextFilm ? 'opacity-100' : 'hidden'
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
							stroke: 'var(--color-grayDark)',
						}}
						className="h-auto w-8 lg:w-9"
					/>
				</button>

				{/* Film counter - only show if we have festival data */}
				{festival && sortedFilms.length > 0 && (
					<div className="mb-2 text-xs text-grayDark lg:hidden lg:text-lg">
						{navigationInfo.currentIndex + 1} / {navigationInfo.total}
					</div>
				)}

				<div className="flex flex-col gap-2 lg:mt-2 lg:flex-row lg:gap-1">
					<div className="flex items-center justify-center gap-1 lg:text-lg">
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

					<div className="flex items-center justify-center gap-1 lg:text-lg">
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
			</div>

			{film.synopsis && (
				<div className="relative px-2 py-6 lg:py-6">
					<p className="mx-auto py-2 text-left text-base leading-[1.2] tracking-tighter text-primary sm:py-4 lg:text-xl">
						{getLocalizedValue(film.synopsis, language)}
					</p>
				</div>
			)}

			<div className="mx-2 flex items-center justify-center gap-1 pb-32 lg:hidden">
				<span className="w-fit -rotate-2 rounded-md border-2 border-primary bg-primary px-2 text-sm font-medium text-dark lg:text-lg">
					Press link
				</span>
				<span className="w-fit rotate-3 rounded-md border-2 border-primary bg-primary px-2 text-sm font-medium text-dark lg:text-lg">
					Instagram
				</span>
				<span className="w-fit -rotate-3 rounded-md border-2 border-primary bg-primary px-2 text-sm font-medium text-dark lg:text-lg">
					Prod
				</span>
				<span className="w-fit rotate-3 rounded-md border-2 border-primary bg-primary px-2 text-sm font-medium text-dark lg:text-lg">
					Facebook
				</span>
			</div>

			<div className="mx-2 flex items-center justify-center gap-4 text-lg tracking-tighter text-primary underline underline-offset-2">
				<span className="">Press link</span>
				<span className="">Instagram</span>
				<span className="">Prod</span>
				<span className="">Facebook</span>
			</div>
		</div>
	)
}

export default FilmContent

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
