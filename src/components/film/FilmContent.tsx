'use client'
import { motion } from 'motion/react'
import { useTransition } from 'react'

import { getRandomRotationClass } from '@/lib/utils'
import Img from '@/ui/Img'
import { GoClockFill } from 'react-icons/go'
import { FaLocationDot, FaPlay, FaTag } from 'react-icons/fa6'
import { BiSolidCameraMovie } from 'react-icons/bi'
import ReactPlayer from 'react-player'
import { useState, useMemo } from 'react'
import ArrowRight from '../common/ArrowRight'
import { useRouter } from 'next/navigation'
import NewArrowRightSimple from '../common/NewArrowRightSimple'
import NewArrowRightFull from '../common/NewArrowRightFull'
import { useTranslations } from 'next-intl'
import LoadingOverlay from '../common/LoadingOverlay'

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
	const tFilmSelection = useTranslations('filmSelection')
	const [isPending, startTransition] = useTransition()

	const getLocalizedValue = (array: any[], lang: string) => {
		if (!Array.isArray(array)) {
			return ''
		}
		const item = array.find((entry) => entry._key === lang)
		return item ? item.value : ''
	}

	// Reconstruct the sorted films array based on current filters/sorting
	const sortedFilms = useMemo(() => {
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

	// const navigateToFilm = (targetFilm: any) => {
	// 	if (!targetFilm?.slug?.current) return

	// 	// Preserve search parameters
	// 	const params = new URLSearchParams(searchParams || {})
	// 	const queryString = params.toString()
	// 	const url = `/${language}/film/${targetFilm.slug.current}${queryString ? `?${queryString}` : ''}`

	// 	router.push(url)
	// }
	const navigateToFilm = (targetFilm: any) => {
		if (!targetFilm?.slug?.current) return

		const params = new URLSearchParams(searchParams || {})
		const queryString = params.toString()
		const url = `/${language}/film/${targetFilm.slug.current}${queryString ? `?${queryString}` : ''}`

		startTransition(() => {
			router.push(url)
		})
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

	return (
		<div className="lg:no-scrollbar lg:shadowtest relative flex h-full w-full flex-col rounded-md px-5 tracking-tighter lg:my-1 lg:h-[calc(100svh-10px)] lg:overflow-y-auto lg:px-32">
			<div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 mb-4 flex items-center justify-between px-8 lg:hidden">
				{navigationInfo.prevFilm ? (
					<button
						className="pointer-events-auto"
						onClick={() => navigateToFilm(navigationInfo.prevFilm)}
						aria-label="Previous film"
						title={`Previous: ${getLocalizedValue(navigationInfo.prevFilm.title, language)}`}
					>
						<NewArrowRightSimple
							theme={{ stroke: 'var(--color-dark)' }}
							className="h-[2.5rem] w-[2.5rem] -rotate-180 rounded-lg border-2 border-dark bg-grayDark p-2"
						/>
					</button>
				) : (
					<div className="w-[2.5rem]" />
				)}{' '}
				{/* Spacer for alignment */}
				{navigationInfo.nextFilm ? (
					<button
						className="pointer-events-auto"
						onClick={() => navigateToFilm(navigationInfo.nextFilm)}
						aria-label="Next film"
						title={`Next: ${getLocalizedValue(navigationInfo.nextFilm.title, language)}`}
					>
						<NewArrowRightSimple
							theme={{ stroke: 'var(--color-dark)' }}
							className="h-[2.5rem] w-[2.5rem] rounded-lg border-2 border-dark bg-grayDark p-2"
						/>
					</button>
				) : (
					<div className="w-[2.5rem]" />
				)}{' '}
				{/* Spacer for alignment */}
			</div>
			<div className="relative flex w-full items-start justify-between">
				<div
					className={`w-fit rounded-md bg-dark p-0.5 pr-2 text-3xl font-semibold text-primary lg:absolute lg:-left-28 lg:top-4 lg:flex`}
					onClick={goBack}
				>
					<div className="z-10 flex justify-center">
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
							className={`flex w-fit items-center justify-center gap-1 rounded-md border border-primary bg-dark px-2 pl-0 pr-2 text-center text-xl font-bold uppercase italic tracking-[-0.06em] text-primary shadow-sm transition-all dark:border-grayDark dark:bg-grayDark dark:text-dark lg:z-10 lg:border-[4px] lg:pl-1 lg:pr-3 lg:text-4xl`}
						>
							<button onClick={goBack} aria-label="Go back">
								<NewArrowRightFull
									theme={{ stroke: 'var(--color-dark)' }}
									className="ml-1 h-auto w-5 -rotate-180 lg:w-7"
								/>
							</button>
							<span>{tFilmSelection('title')}</span>
						</motion.div>
					</div>
				</div>

				<div className="mr-2 mt-2 flex items-center justify-center gap-x-2">
					{/* {navigationInfo.prevFilm && (
						<button
							className="z-10 opacity-100"
							onClick={() => navigateToFilm(navigationInfo.prevFilm)}
							aria-label="Previous film"
							title={`Previous: ${getLocalizedValue(navigationInfo.prevFilm.title, language)}`}
						>
							<NewArrowRightSimple
								theme={{ stroke: 'var(--color-grayDark)' }}
								className="w-2 -rotate-180 lg:w-7"
							/>
						</button>
					)} */}

					{festival && sortedFilms.length > 0 && (
						<div className="text-base text-grayDark lg:hidden lg:text-lg">
							{navigationInfo.currentIndex + 1}/{navigationInfo.total}
						</div>
					)}

					{/* Next Arrow (Desktop only) */}
					{/* {navigationInfo.nextFilm && (
						<button
							className="z-10 opacity-100"
							onClick={() => navigateToFilm(navigationInfo.nextFilm)}
							aria-label="Next film"
							title={`Next: ${getLocalizedValue(navigationInfo.nextFilm.title, language)}`}
						>
							<NewArrowRightSimple
								theme={{ stroke: 'var(--color-grayDark)' }}
								className="w-2 lg:w-7"
							/>
						</button>
					)} */}
				</div>

				<div className="z-50 hidden items-center justify-center rounded-b-md bg-grayLight px-2 dark:bg-dark lg:mt-28 lg:flex">
					<div className="absolute left-1/2 top-24 flex w-[90%] -translate-x-1/2 flex-col items-center lg:flex-row">
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
				{/* 
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
				</div> */}
			</div>
			<div className="relative">
				{/* Previous Arrow (Desktop only) */}
				{/* {navigationInfo.prevFilm && (
					<button
						className="absolute -bottom-14 left-1 z-10 opacity-100 lg:-left-12 lg:bottom-auto lg:top-1/2"
						onClick={() => navigateToFilm(navigationInfo.prevFilm)}
						aria-label="Previous film"
						title={`Previous: ${getLocalizedValue(navigationInfo.prevFilm.title, language)}`}
					>
						<NewArrowRightSimple
							theme={{ stroke: 'var(--color-grayDark)' }}
							className="h-auto w-5 -rotate-180 lg:w-7"
						/>
					</button>
				)} */}

				{/* Next Arrow (Desktop only) */}
				{/* {navigationInfo.nextFilm && (
					<button
						className="absolute -bottom-14 right-1 z-10 opacity-100 lg:-right-12 lg:bottom-auto lg:top-1/2"
						onClick={() => navigateToFilm(navigationInfo.nextFilm)}
						aria-label="Next film"
						title={`Next: ${getLocalizedValue(navigationInfo.nextFilm.title, language)}`}
					>
						<NewArrowRightSimple
							theme={{ stroke: 'var(--color-grayDark)' }}
							className="h-auto w-5 lg:w-7"
						/>
					</button>
				)} */}

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
						<div className="relative mx-1 flex h-full items-center justify-center overflow-hidden rounded-md border-2 border-primary bg-dark shadow-md lg:max-h-[60vh] lg:rounded-xl lg:border-[4px]">
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
						<div className="relative mx-1 flex h-auto items-center justify-center overflow-hidden rounded-md border-2 border-primary bg-dark shadow-md lg:max-h-[60vh] lg:border-[4px]">
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

			<div className="relative z-0 mb-0 mt-4 flex w-full flex-col items-center justify-center gap-2 px-6 text-sm font-medium leading-[1.2]">
				<div className="flex flex-col items-center lg:hidden lg:flex-row">
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
				{/* Film counter - only show if we have festival data */}
				{/* {festival && sortedFilms.length > 0 && (
					<div className="mb-2 text-xs text-grayDark lg:hidden lg:text-lg">
						{navigationInfo.currentIndex + 1} / {navigationInfo.total}
					</div>
				)} */}
				<div className="mt-2 flex flex-col gap-1 lg:mt-2 lg:flex-row lg:flex-wrap lg:gap-1">
					<div className="flex flex-wrap items-center justify-center gap-1 text-xs lg:text-lg">
						{film.length && (
							<span className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md border border-primary px-2 py-0.5 text-primary">
								<GoClockFill />
								<span>{film.length} minutes</span>
							</span>
						)}

						{film.city && (
							<span className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md border border-primary px-2 py-0.5 text-primary">
								<FaLocationDot />
								<span>{getLocalizedValue(film.city, language)}</span>
							</span>
						)}
					</div>

					<div className="flex flex-wrap items-center justify-center gap-1 text-xs lg:text-lg">
						{film.genre && film.genre.title && (
							<span className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md border border-primary px-2 py-0.5 text-primary">
								<FaTag />
								{getLocalizedValue(film.genre.title, language) ||
									(Array.isArray(film.genre.title) &&
										film.genre.title[0]?.value) ||
									''}
							</span>
						)}
						{film.production && (
							<span className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md border border-primary px-2 py-0.5 text-primary">
								<BiSolidCameraMovie />
								{film.production}
							</span>
						)}
					</div>
				</div>
			</div>

			{film.synopsis && (
				<div className="relative px-2 py-6 lg:py-6">
					<p className="mx-auto py-2 text-left text-base leading-[1.2] tracking-tight text-primary sm:py-4 lg:text-3xl">
						{getLocalizedValue(film.synopsis, language)}
					</p>
				</div>
			)}

			{/* <div className="mx-2 flex items-center justify-center gap-1 pb-32 lg:hidden">
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
			</div> */}

			<div className="mx-2 flex items-center justify-center gap-1 pb-16 text-lg tracking-tighter text-primary">
				<span className="rounded-md border-2 border-primary bg-primary px-2 py-0 text-sm font-medium text-dark lg:text-base">
					Press link
				</span>
				<span className="rounded-md border-2 border-primary bg-primary px-2 py-0 text-sm font-medium text-dark lg:text-base">
					Instagram
				</span>
				<span className="rounded-md border-2 border-primary bg-primary px-2 py-0 text-sm font-medium text-dark lg:text-base">
					Prod
				</span>
				<span className="rounded-md border-2 border-primary bg-primary px-2 py-0 text-sm font-medium text-dark lg:text-base">
					Facebook
				</span>
			</div>
			<LoadingOverlay isVisible={isPending} />
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
