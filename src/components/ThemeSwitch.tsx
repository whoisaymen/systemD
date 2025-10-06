'use client'
import { useState, useEffect } from 'react'
import ColorSwitch from './homepage/ColorSwitch'

const colorCombos = [
	{ primary: '#DEFE04', dark: '#123DA6', grayDark: '#8C8C8F' },
	{ primary: '#554FF1', dark: '#D0DCDC', grayDark: '#636363' },
	{ primary: '#8C8C8F', dark: '#222223', grayDark: '#8C8C8F' },
	// { primary: '#222223', dark: '#fff', grayDark: '#8C8C8F' },
	// { primary: '#222223', dark: '#FFED00', grayDark: '#222223' },
	{ primary: '#DE5325', dark: '#FAFAEC', grayDark: '#DE5325' },
]

// Key for localStorage
const THEME_STORAGE_KEY = 'system-d-theme-index'

const ThemeSwitch = () => {
	const [comboIndex, setComboIndex] = useState(0)
	const [isInitialized, setIsInitialized] = useState(false)

	// Load theme from localStorage on component mount
	useEffect(() => {
		// Only run in browser environment
		if (typeof window !== 'undefined') {
			try {
				const savedIndex = localStorage.getItem(THEME_STORAGE_KEY)
				// If a theme is saved and it's a valid index, use it
				if (savedIndex !== null) {
					const parsedIndex = parseInt(savedIndex, 10)
					if (
						!isNaN(parsedIndex) &&
						parsedIndex >= 0 &&
						parsedIndex < colorCombos.length
					) {
						setComboIndex(parsedIndex)
					}
				}
			} catch (error) {
				// Handle localStorage errors (e.g., in private browsing)
				console.error('Error accessing localStorage:', error)
			}
			setIsInitialized(true)
		}
	}, [])

	// Update localStorage when theme changes
	useEffect(() => {
		// Skip saving during the initial render
		if (!isInitialized) return

		// Save to localStorage
		if (typeof window !== 'undefined') {
			try {
				localStorage.setItem(THEME_STORAGE_KEY, comboIndex.toString())
			} catch (error) {
				// Handle localStorage errors
				console.error('Error saving to localStorage:', error)
			}
		}
	}, [comboIndex, isInitialized])

	function applyColors({
		primary,
		dark,
		grayDark,
	}: {
		primary: string
		dark: string
		grayDark: string
	}) {
		if (typeof window !== 'undefined') {
			const root = document.documentElement
			root.style.setProperty('--color-primary', primary)
			root.style.setProperty('--color-dark', dark)
			root.style.setProperty('--color-grayDark', grayDark)
		}
	}

	useEffect(() => {
		applyColors(colorCombos[comboIndex])
	}, [comboIndex])

	const handleToggle = () => {
		setComboIndex((prev) => (prev + 1) % colorCombos.length)
	}

	const commonClass =
		'bg-dark toggler flex aspect-square h-[2.25rem] cursor-pointer items-stretch justify-center border-primary p-1 sm:h-[2rem] sm:border-[3px] sm:border-primary sm:rounded-md sm:p-1.5 lg:border-0'

	return (
		<div onClick={handleToggle} className={commonClass}>
			<ColorSwitch
				theme={{
					left: colorCombos[comboIndex].dark,
					right: colorCombos[comboIndex].primary,
					stroke: colorCombos[comboIndex].primary,
				}}
				className="h-full w-full overflow-visible p-1 sm:p-0"
			/>
		</div>
	)
}

export default ThemeSwitch
