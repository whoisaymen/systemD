'use client'
import { useTransition } from 'react'

import { getRandomRotationClass } from '@/lib/utils'
import Img from '@/ui/Img'
import RichText from '@/components/common/RichText'
import {
	EDITORIAL_BODY_TEXT,
	EDITORIAL_DESKTOP_TAB_STYLE,
} from '@/components/common/editorialStyles'
import { filmTextLines } from './filmTextLines'
import { FILM_LABEL_TEXT, FILM_TITLE_TEXT } from './filmLabelStyles'
import { localizedRichText, richTextToPlainText } from '@/lib/richText'
import { sortFilmSelection } from '@/lib/filmSelection'
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

	const getLocalizedValue = (value: any, lang: string) =>
		richTextToPlainText(localizedRichText(value, lang))

	const sortedFilms = useMemo(
		() =>
			sortFilmSelection(festival?.filmSelection ?? [], {
				language,
				sort: searchParams?.sort,
				order: searchParams?.order,
				winnersOnly: searchParams?.winners === '1',
			}),
		[festival?.filmSelection, searchParams, language],
	)

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
		<div className="relative w-full lg:[container-type:inline-size]">
			<div className="theme-main-content-surface section-folder-content section-folder-content--memoire lg:no-scrollbar lg:shadowtest relative flex h-full w-full flex-col rounded-md px-5 tracking-tighter lg:my-1 lg:h-[calc(100svh-8px)] lg:overflow-y-auto lg:rounded-xl lg:rounded-tr-none lg:bg-dark lg:px-32 lg:pb-20">
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
					<div className="flex shrink-0 flex-col items-start gap-1 pb-4 lg:absolute lg:-left-[6.5rem] lg:top-0 lg:pb-0">
						<button
							type="button"
							onClick={goBack}
							aria-label="Go back"
							className="relative aspect-[76/61] w-10 rounded-md transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:w-14"
						>
							<NewArrowRightFull
								theme={{ stroke: 'var(--color-primary)' }}
								strokeWidth={8}
								className="absolute inset-0 h-full w-full translate-y-1 rotate-180 scale-[0.55] lg:-translate-x-1/4"
							/>
						</button>
						<button
							type="button"
							onClick={goBack}
							className={`relative -rotate-3 rounded-md border-2 border-grayDark bg-grayDark px-2 py-0 text-center text-xl font-bold uppercase italic leading-none tracking-tighter text-dark shadow-sm transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${EDITORIAL_DESKTOP_TAB_STYLE}`}
						>
							{tFilmSelection('title')}
						</button>
					</div>

					<div className="mr-2 mt-2 flex items-center justify-center gap-x-2">
						{festival && sortedFilms.length > 0 && (
							<div className="text-base text-grayDark lg:hidden lg:text-lg">
								{navigationInfo.currentIndex + 1}/{navigationInfo.total}
							</div>
						)}
					</div>

					<div className="z-50 hidden items-center justify-center rounded-b-md bg-dark px-2 lg:mt-28 lg:flex">
						<div className="absolute left-1/2 top-24 flex w-[90%] -translate-x-1/2 flex-col items-center lg:flex-row lg:flex-wrap lg:justify-center">
							{film.title && (
								<>
									{filmTextLines(localizedRichText(film.title, language), 20).map(
										(line, index) => (
											<h1
												key={index}
												className={`z-10 max-w-full shrink-0 rounded-md border-2 border-primary bg-dark px-2 text-center text-primary ${FILM_TITLE_TEXT} ${index % 2 === 0 ? '-rotate-1 lg:-rotate-3' : 'rotate-1 lg:rotate-3'} ${index ? '-mt-1' : ''}`}
											>
												<RichText value={line} inline />
											</h1>
										),
									)}
								</>
							)}

							{film.director && (
								<>
									{filmTextLines(film.director, 26).map((line, index) => (
										<p
											key={index}
											className={`z-10 mt-0 inline-block w-auto max-w-full shrink-0 rounded-md border-2 border-dark bg-grayDark px-1.5 py-0 text-center text-dark ${FILM_LABEL_TEXT} ${index % 2 === 0 ? '-rotate-1 lg:-rotate-3' : 'rotate-1 lg:rotate-3'}`}
										>
											<RichText value={line} inline />
										</p>
									))}
								</>
							)}

							{film.year && (
								<p
									className={`z-0 mt-0 -rotate-6 rounded-md bg-primary px-2 text-xl font-black text-dark sm:hidden`}
								>
									{film.year}
								</p>
							)}
						</div>
					</div>
				</div>
				<div className="relative">
					{isYoutubeOrVimeo ? (
						showPlayer ? (
							<div className="relative mx-auto flex max-h-[60vh] min-h-[30vh] w-full items-center justify-center overflow-hidden rounded-md border-2 border-primary bg-dark shadow-md lg:min-h-[60vh]">
								<ReactPlayer
									src={film.playFilmUrl}
									playing
									muted
									controls
									width="100%"
									height="100%"
									style={{ position: 'absolute', top: 0, left: 0 }}
									config={{
										youtube: { rel: 0 },
										vimeo: {},
									}}
								/>
							</div>
						) : (
							<div className="relative mx-1 flex h-full items-center justify-center overflow-hidden rounded-md border-2 border-primary bg-dark shadow-md lg:max-h-[60vh] lg:rounded-xl lg:border-[4px]">
								<Img
									image={film.affiche}
									sizes="(min-width: 1024px) 60vw, calc(100vw - 48px)"
									loading="eager"
									fetchPriority="high"
									alt={getLocalizedValue(film.title, language)}
									className="h-auto w-full object-cover"
								/>
								<button
									onClick={() => setShowPlayer(true)}
									className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-primary text-4xl"
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
									sizes="(min-width: 1024px) 60vw, calc(100vw - 48px)"
									loading="eager"
									fetchPriority="high"
									alt={getLocalizedValue(film.title, language)}
									className="h-auto w-full object-cover"
								/>
							</div>
						)
					)}
				</div>

				<div className="relative z-0 mb-0 mt-2 flex w-full flex-col items-center justify-center gap-2 px-6 text-sm font-medium leading-[1.2]">
					<div className="flex flex-col items-center lg:hidden lg:flex-row">
						{film.title && (
							<>
								{filmTextLines(localizedRichText(film.title, language), 20).map(
									(line, index) => (
										<h1
											key={index}
											className={`z-10 max-w-full rounded-md border-2 border-primary bg-dark px-2 text-center text-primary ${FILM_TITLE_TEXT} ${index % 2 === 0 ? '-rotate-1 lg:-rotate-3' : 'rotate-1 lg:rotate-3'} ${index ? '-mt-1' : ''}`}
										>
											<RichText value={line} inline />
										</h1>
									),
								)}
							</>
						)}

						{film.director && (
							<>
								{filmTextLines(film.director, 26).map((line, index) => (
									<p
										key={index}
										className={`z-10 mt-0 inline-block w-auto rounded-md border-2 border-dark bg-grayDark px-1.5 py-0 text-center text-dark ${FILM_LABEL_TEXT} ${index % 2 === 0 ? '-rotate-1 lg:-rotate-3' : 'rotate-1 lg:rotate-3'}`}
									>
										<RichText value={line} inline />
									</p>
								))}
							</>
						)}

						{film.year && (
							<p
								className={`z-0 mt-0 -rotate-6 rounded-md bg-primary px-2 text-xl font-black text-dark sm:hidden`}
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
					<div className={`${EDITORIAL_BODY_TEXT} mt-2 flex flex-col gap-x-4 gap-y-1.5 lg:mt-0 lg:flex-row lg:flex-wrap`}>
						<div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
							{film.length && (
								<span className="flex items-center justify-center gap-1 whitespace-nowrap text-grayDark">
									<GoClockFill className="size-[1cap] shrink-0 text-primary" />
									<span>{film.length} minutes</span>
								</span>
							)}

							{film.city && (
								<span className="flex items-center justify-center gap-1 whitespace-nowrap text-grayDark">
									<FaLocationDot className="size-[1cap] shrink-0 text-primary" />
									<span>
										<RichText
											value={localizedRichText(film.city, language)}
											inline
										/>
									</span>
								</span>
							)}
						</div>

						<div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
							{film.genre && film.genre.title && (
								<span className="flex items-center justify-center gap-1 whitespace-nowrap text-grayDark">
									<FaTag className="size-[1cap] shrink-0 text-primary" />
									<RichText
										value={localizedRichText(film.genre.title, language)}
										inline
									/>
								</span>
							)}
							{film.production && (
								<span className="flex items-center justify-center gap-1 whitespace-nowrap text-grayDark">
									<BiSolidCameraMovie className="size-[1cap] shrink-0 text-primary" />
									<RichText value={film.production} inline />
								</span>
							)}
						</div>
					</div>
				</div>

				{film.synopsis && (
					<div className="relative px-2 pb-6 pt-3">
						<RichText
							value={localizedRichText(film.synopsis, language)}
							className={`${EDITORIAL_BODY_TEXT} mx-auto py-2 text-left text-primary sm:py-4`}
						/>
					</div>
				)}

				<LoadingOverlay isVisible={isPending} />
			</div>

			{navigationInfo.currentIndex >= 0 && (
				<nav
					aria-label="Film navigation"
					className="absolute bottom-8 left-1/2 z-50 hidden -translate-x-1/2 items-center rounded-md bg-dark px-2 text-primary lg:flex"
				>
					<button
						type="button"
						onClick={() => navigateToFilm(navigationInfo.prevFilm)}
						disabled={!navigationInfo.prevFilm || isPending}
						aria-label="Previous film"
						title={
							navigationInfo.prevFilm
								? getLocalizedValue(navigationInfo.prevFilm.title, language)
								: undefined
						}
						className="relative aspect-[76/61] w-10 rounded-md transition-opacity enabled:hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:opacity-30"
					>
						<NewArrowRightFull
							theme={{ stroke: 'var(--color-primary)' }}
							strokeWidth={8}
							className="absolute inset-0 h-full w-full translate-y-1 rotate-180 scale-[0.55]"
						/>
					</button>
					<span className="translate-y-1 text-base tabular-nums">
						{navigationInfo.currentIndex + 1}/{navigationInfo.total}
					</span>
					<button
						type="button"
						onClick={() => navigateToFilm(navigationInfo.nextFilm)}
						disabled={!navigationInfo.nextFilm || isPending}
						aria-label="Next film"
						title={
							navigationInfo.nextFilm
								? getLocalizedValue(navigationInfo.nextFilm.title, language)
								: undefined
						}
						className="relative aspect-[76/61] w-10 rounded-md transition-opacity enabled:hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:opacity-30"
					>
						<NewArrowRightFull
							theme={{ stroke: 'var(--color-primary)' }}
							strokeWidth={8}
							className="absolute inset-0 h-full w-full translate-y-1 scale-[0.55]"
						/>
					</button>
				</nav>
			)}
		</div>
	)
}

export default FilmContent
