'use client'
import { motion } from 'motion/react'

import { getRandomRotationClass } from '@/lib/utils'
import Img from '@/ui/Img'
import { GoClockFill } from 'react-icons/go'
import { FaLocationDot, FaPlay, FaTag } from 'react-icons/fa6'
import { BiSolidCameraMovie } from 'react-icons/bi'

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

	return (
		<div className="no-scrollbar flex h-full w-full flex-col overflow-y-scroll rounded-md px-5 py-28 tracking-tighter sm:bg-white">
			<div className="absolute left-1 z-30 h-[90vh] w-[2.5%] rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:11px_30px] bg-center bg-repeat-y"></div>
			<div className="absolute right-1 z-30 h-[90vh] w-[2.5%] rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:11px_30px] bg-center bg-repeat-y"></div>

			{film.affiche && (
				<div className="relative">
					{film.playFilmUrl && (
						<a
							href={film.playFilmUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-0 border-grayLight bg-grayLight/70 text-4xl dark:border-primary"
						>
							<FaPlay className="pl-2 text-grayDark" />
							{/* {film.playFilmUrl.includes('youtube')
								? 'Watch Trailer'
								: film.playFilmUrl.includes('instagram')
									? 'Visit Instagram'
									: 'Link'} */}
						</a>
					)}
					{/* <div className="absolute -left-3 top-0 z-30 h-full w-[2.5%] rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:12px_32px] bg-center bg-repeat-y"></div>
					<div className="absolute -right-3 top-0 z-30 h-full w-[2.5%] rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:12px_32px] bg-center bg-repeat-y"></div> */}

					<div className="mx-1 overflow-hidden rounded-md border-2 border-primary shadow-md">
						<Img
							image={film.affiche}
							src={film.affiche.asset.url}
							alt={getLocalizedValue(film.title, language)}
							className="h-auto w-full object-cover"
						/>
					</div>
				</div>
			)}

			<div className="relative -mt-4 mb-8 flex flex-col items-center">
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
			</div>

			<div className="mb-6 flex w-full flex-wrap items-center justify-center gap-2 px-6 text-sm font-medium leading-[1.2]">
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
				<motion.div
					initial={{
						borderRadius: '0.375rem',
					}}
					animate={{ borderRadius: '5rem' }}
					transition={{
						duration: 2,
						ease: [0.76, 0, 0.24, 1],
						repeat: Infinity,
						repeatType: 'reverse',
					}}
					className="relative mt-2 rounded-full border-2 border-dark bg-[#fff] px-4 py-10 shadow-sm dark:bg-secondary sm:py-10"
					// style={{ backgroundColor: block.color?.hex || '#DEFE04' }}
					style={{
						backgroundColor: 'var(--color-secondary)',
					}}
				>
					<p className="mx-auto py-2 text-center text-xl font-bold leading-[1.2] tracking-tighter text-dark sm:py-4 sm:text-4xl">
						{getLocalizedValue(film.synopsis, language)}
					</p>
				</motion.div>
			)}
		</div>
	)
}

export default FilmContent
