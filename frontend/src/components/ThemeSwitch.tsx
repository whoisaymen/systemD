'use client'
import { useState, useEffect } from 'react'
import ColorSwitch from './homepage/ColorSwitch'
import {
	FALLBACK_THEME_COMBOS,
	THEME_STORAGE_KEY,
	type ThemeCombo,
} from '@/lib/theme'

const ThemeSwitch = ({
	themes = FALLBACK_THEME_COMBOS,
}: {
	themes?: ThemeCombo[]
}) => {
	const colorCombos = themes.length ? themes : FALLBACK_THEME_COMBOS
	const [comboIndex, setComboIndex] = useState(0)
	const [isInitialized, setIsInitialized] = useState(false)
	const activeCombo = colorCombos[comboIndex] ?? colorCombos[0]

	// Load theme from localStorage on component mount
	useEffect(() => {
		// Only run in browser environment
		if (typeof window !== 'undefined') {
			try {
				const savedValue = localStorage.getItem(THEME_STORAGE_KEY)

				const nextIndex = getStoredThemeIndex(savedValue, colorCombos)
				setComboIndex(nextIndex ?? 0)
			} catch (error) {
				// Handle localStorage errors (e.g., in private browsing)
				console.error('Error accessing localStorage:', error)
			}
			setIsInitialized(true)
		}
	}, [colorCombos])

	useEffect(() => {
		if (!isInitialized) return

		applyColors(activeCombo)
	}, [activeCombo, isInitialized])

	const handleToggle = () => {
		setComboIndex((prev) => {
			const nextIndex = (prev + 1) % colorCombos.length
			const nextCombo = colorCombos[nextIndex]

			if (typeof window !== 'undefined' && nextCombo) {
				try {
					localStorage.setItem(THEME_STORAGE_KEY, nextCombo.key)
				} catch (error) {
					console.error('Error saving to localStorage:', error)
				}
			}

			return nextIndex
		})
	}

	const commonClass =
		'bg-dark toggler flex aspect-square h-[2.25rem] cursor-pointer items-stretch justify-center border-primary p-1 sm:h-[2rem] sm:border-[3px] sm:border-primary sm:rounded-md sm:p-1.5 lg:border-0'

	return (
		<div onClick={handleToggle} className={commonClass}>
			<ColorSwitch
				theme={{
					left: activeCombo.dark,
					right: activeCombo.primary,
					stroke: activeCombo.primary,
				}}
				className="h-full w-full overflow-visible p-1 sm:p-0"
			/>
		</div>
	)
}

export default ThemeSwitch

function getStoredThemeIndex(
	savedValue: string | null,
	colorCombos: ThemeCombo[],
) {
	if (savedValue === null) return undefined

	const savedThemeIndex = colorCombos.findIndex(
		(combo) => combo.key === savedValue,
	)
	const parsedIndex = parseInt(savedValue, 10)

	if (savedThemeIndex >= 0) return savedThemeIndex

	if (
		!isNaN(parsedIndex) &&
		parsedIndex >= 0 &&
		parsedIndex < colorCombos.length
	) {
		return parsedIndex
	}
}

function hexToRgb(hex: string): string {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	return result
		? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
		: '0 0 0'
}

function applyColors({ primary, dark, grayDark, imageGrade }: ThemeCombo) {
	if (typeof window !== 'undefined') {
		const root = document.documentElement
		root.style.setProperty('--color-primary', primary)
		root.style.setProperty('--color-primary-rgb', hexToRgb(primary))

		root.style.setProperty('--color-dark', dark)
		root.style.setProperty('--color-dark-rgb', hexToRgb(dark))

		root.style.setProperty('--color-grayDark', grayDark)
		root.style.setProperty('--color-grayDark-rgb', hexToRgb(grayDark))

		root.style.setProperty('--image-grade-gray', imageGrade.gray)
		root.style.setProperty('--image-grade-sepia', imageGrade.sepia)
		root.style.setProperty('--image-grade-saturate', imageGrade.saturate)
		root.style.setProperty('--image-grade-hue', imageGrade.hue)
		root.style.setProperty('--image-grade-contrast', imageGrade.contrast)
		root.style.setProperty('--image-grade-brightness', imageGrade.brightness)
	}
}
