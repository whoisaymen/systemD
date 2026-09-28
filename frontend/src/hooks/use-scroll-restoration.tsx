'use client'
import { useRef } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'

export function useScrollRestoration() {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const scrollPositionRef = useRef<number>(0)
	const isRestoringRef = useRef(false)

	// Save scroll position before navigation
	const saveScrollPosition = () => {
		const scrollY = window.scrollY
		scrollPositionRef.current = scrollY
		sessionStorage.setItem('festival-scroll-position', scrollY.toString())
		sessionStorage.setItem('festival-scroll-pathname', pathname)
	}

	// Restore scroll position
	const restoreScrollPosition = () => {
		const savedPosition = sessionStorage.getItem('festival-scroll-position')
		const savedPathname = sessionStorage.getItem('festival-scroll-pathname')

		if (savedPosition && savedPathname === pathname) {
			isRestoringRef.current = true
			const position = Number.parseInt(savedPosition, 10)

			// Use requestAnimationFrame to ensure DOM is ready
			requestAnimationFrame(() => {
				window.scrollTo(0, position)
				// Clear the restoration flag after a short delay
				setTimeout(() => {
					isRestoringRef.current = false
				}, 100)
			})
		}
	}

	// Check if we should restore scroll position
	const shouldRestoreScroll = () => {
		const savedPathname = sessionStorage.getItem('festival-scroll-pathname')
		return (
			savedPathname === pathname &&
			sessionStorage.getItem('festival-scroll-position')
		)
	}

	return {
		saveScrollPosition,
		restoreScrollPosition,
		shouldRestoreScroll,
		isRestoring: isRestoringRef.current,
	}
}
