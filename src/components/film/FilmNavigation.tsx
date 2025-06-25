'use client'
import type React from 'react'

import ArrowRight from '../common/ArrowRight'
import { useFilmNavigation } from '@/hooks/use-navigation-context'

interface FilmNavigationProps {
	currentFilmSlug: string
	language: string
}

const FilmNavigation: React.FC<FilmNavigationProps> = ({
	currentFilmSlug,
	language,
}) => {
	const {
		navigationState,
		currentIndex,
		hasPrevious,
		hasNext,
		navigateToFilm,
		goBackToFestival,
		totalFilms,
	} = useFilmNavigation(currentFilmSlug, language)

	return (
		<div className="flex w-full items-center justify-between">
			{/* Back to Festival */}
			<button
				onClick={goBackToFestival}
				className="flex h-full items-center justify-center"
				aria-label="Go back to festival"
			>
				<ArrowRight
					theme={{ fill: 'var(--color-grayDark)' }}
					className="h-auto w-8 -rotate-180 lg:w-9"
				/>
			</button>

			{/* Film Navigation */}
			{navigationState && currentIndex >= 0 ? (
				<div className="flex items-center gap-2">
					<button
						onClick={() => navigateToFilm('prev')}
						disabled={!hasPrevious}
						className={`flex h-full items-center justify-center ${!hasPrevious ? 'cursor-not-allowed opacity-30' : ''}`}
						aria-label="Previous film"
					>
						<ArrowRight
							theme={{
								fill: hasPrevious
									? 'var(--color-primary)'
									: 'var(--color-grayDark)',
							}}
							className="h-auto w-6 -rotate-180 lg:w-7"
						/>
					</button>

					<span className="px-2 text-sm text-grayDark">
						{currentIndex + 1} / {totalFilms}
					</span>

					<button
						onClick={() => navigateToFilm('next')}
						disabled={!hasNext}
						className={`flex h-full items-center justify-center ${!hasNext ? 'cursor-not-allowed opacity-30' : ''}`}
						aria-label="Next film"
					>
						<ArrowRight
							theme={{
								fill: hasNext
									? 'var(--color-primary)'
									: 'var(--color-grayDark)',
							}}
							className="h-auto w-6 lg:w-7"
						/>
					</button>
				</div>
			) : (
				<div className="flex gap-2">
					<span className="text-sm text-grayDark">Direct access</span>
				</div>
			)}
		</div>
	)
}

export default FilmNavigation
