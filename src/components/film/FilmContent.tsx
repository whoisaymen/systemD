'use client'
import { motion } from 'motion/react'

import { getRandomRotationClass } from '@/lib/utils'
import Img from '@/ui/Img'
import { GoClockFill } from 'react-icons/go'
import { FaLocationDot, FaPlay, FaTag } from 'react-icons/fa6'
import { BiSolidCameraMovie } from 'react-icons/bi'
import ReactPlayer from 'react-player'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ArrowRight from '../common/ArrowRight'

interface FilmContentProps {
	film: any
	language: string
}

const FilmContent: React.FC<FilmContentProps> = ({ film, language }) => {
	const getLocalizedValue = (array: any[], lang: string) => {
		if (!Array.isArray(array)) {
			return ''
		}
		const item = array.find((entry) => entry._key === lang)
		return item ? item.value : ''
	}

	if (!film) {
		return <div>No content available</div>
	}

	const [showPlayer, setShowPlayer] = useState(false)

	const isYoutubeOrVimeo =
		film.playFilmUrl &&
		(film.playFilmUrl.includes('youtube.com') ||
			film.playFilmUrl.includes('youtu.be') ||
			film.playFilmUrl.includes('vimeo.com'))

	const router = useRouter()

	return (
		<div className="no-scrollbar relative mt-1 flex min-h-screen w-full flex-col overflow-y-visible rounded-md px-5 tracking-tighter sm:mt-0 sm:min-h-screen sm:overflow-y-visible sm:py-1">
			<div className="relative mb-1 flex w-full items-start justify-between">
				<div
					className={`rounded-md bg-dark p-0.5 text-3xl font-semibold sm:hidden`}
				>
					<button
						onClick={() => router.back()}
						className=""
						aria-label="Go back"
					>
						<ArrowRight
							theme={{ fill: 'var(--color-primary)' }}
							className="h-auto w-9 -rotate-180 lg:w-9"
						/>
					</button>
				</div>
				<div className="flex items-center justify-start gap-2">
					{film.title && (
						<h1
							className={`z-10 rounded-md border-0 border-dark bg-primary p-0 text-3xl font-black italic text-dark dark:border-primary dark:bg-dark dark:text-primary`}
						>
							{getLocalizedValue(film.title, language)}
							<span className="font-normal italic">, ({film.year})</span>
						</h1>
					)}
				</div>

				{/* {film.director && (
					<p
						className={`z-10 -mt-1 inline-block w-auto rounded-md border-0 border-primary bg-dark px-1 py-0 text-center font-medium tracking-tight text-primary`}
					>
						{film.director}
					</p>
				)} */}

				{/* {film.year && (
					<p
						className={`z-10 rounded-md bg-grayDark px-1 text-xs font-black text-primary dark:bg-primary dark:text-dark sm:hidden`}
					>
						{film.year}
					</p>
				)} */}
			</div>
			<div className="absolute left-1 z-30 h-full w-[2.5%] rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:11px_30px] bg-center bg-repeat-y sm:-left-0 sm:h-full"></div>
			<div className="absolute right-1 z-30 h-full w-[2.5%] rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:11px_30px] bg-center bg-repeat-y sm:-right-0 sm:h-full"></div>

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

			<div className="my-6 flex w-full flex-wrap items-center justify-center gap-2 px-6 text-sm font-medium leading-[1.2]">
				{film.genre.title && (
					<span className="flex items-center justify-center gap-1 rounded-full border-2 px-2 text-dark dark:border-grayDark dark:bg-grayDark dark:text-dark">
						<FaTag />
						{getLocalizedValue(film.genre.title, language)}
					</span>
				)}

				{film.production && (
					<span className="flex items-center justify-center gap-1 rounded-full border-2 px-2 text-dark dark:border-grayDark dark:bg-grayDark dark:text-dark">
						<BiSolidCameraMovie />
						{film.production}
					</span>
				)}

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

			{film.synopsis && (
				<div className="relative mt-2 rounded-full rounded-md border-2 border-dark bg-[#fff] px-4 py-10 shadow-sm dark:bg-secondary sm:py-10">
					<p className="mx-auto py-2 text-center text-xl font-bold leading-[1.2] tracking-tighter text-dark sm:py-4 sm:text-4xl">
						{getLocalizedValue(film.synopsis, language)}
					</p>
				</div>
			)}
		</div>
	)
}

export default FilmContent
