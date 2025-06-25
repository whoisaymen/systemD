'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface NavigationState {
	films: Array<{
		_id: string
		slug: { current: string } | null
		title: any[]
		director: string
		year: number
	}>
	sortField: 'year' | 'title' | 'director'
	sortOrder: 'asc' | 'desc'
	showWinnersOnly: boolean
	scrollPosition: number
	isFilmSectionOpen: boolean
	festivalYear: string
}

export function useFilmNavigation(currentFilmSlug: string, language: string) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [navigationState, setNavigationState] =
		useState<NavigationState | null>(null)

	useEffect(() => {
		// Try to get navigation state from localStorage
		const storedState = localStorage.getItem('festival-navigation-state')
		if (storedState) {
			try {
				const parsed = JSON.parse(storedState)
				setNavigationState(parsed)
			} catch (error) {
				console.error('Error parsing navigation state:', error)
			}
		}
	}, [])

	const currentIndex =
		navigationState?.films.findIndex(
			(film) => film.slug?.current === currentFilmSlug,
		) ?? -1

	const hasPrevious = currentIndex > 0
	const hasNext = currentIndex < (navigationState?.films.length ?? 0) - 1

	const navigateToFilm = (direction: 'prev' | 'next') => {
		if (!navigationState) return

		const targetIndex =
			direction === 'prev' ? currentIndex - 1 : currentIndex + 1
		const targetFilm = navigationState.films[targetIndex]

		if (targetFilm?.slug?.current) {
			const params = new URLSearchParams({
				fromFestival: 'true',
				year: navigationState.festivalYear,
			})
			router.push(
				`/${language}/film/${targetFilm.slug.current}?${params.toString()}`,
			)
		}
	}

	const goBackToFestival = () => {
		if (!navigationState) {
			router.push(`/${language}/memoire`)
			return
		}

		const params = new URLSearchParams({
			restore: 'true',
		})
		router.push(
			`/${language}/memoire/${navigationState.festivalYear}?${params.toString()}`,
		)
	}

	return {
		navigationState,
		currentIndex,
		hasPrevious,
		hasNext,
		navigateToFilm,
		goBackToFestival,
		totalFilms: navigationState?.films.length ?? 0,
	}
}

export function saveNavigationState(state: NavigationState) {
	localStorage.setItem('festival-navigation-state', JSON.stringify(state))
}

export function getNavigationState(): NavigationState | null {
	try {
		const stored = localStorage.getItem('festival-navigation-state')
		return stored ? JSON.parse(stored) : null
	} catch {
		return null
	}
}
