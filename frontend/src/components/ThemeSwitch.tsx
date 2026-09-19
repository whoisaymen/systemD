'use client'
import { useState, useEffect } from 'react'
import ColorSwitch from './homepage/ColorSwitch'
import {
	FALLBACK_THEME_COMBOS,
	applyThemeColors,
	THEME_CHANGE_EVENT,
	THEME_STORAGE_KEY,
	type ThemeCombo,
} from '@/lib/theme'

const ThemeSwitch = ({
	themes = FALLBACK_THEME_COMBOS,
	framed = true,
}: {
	themes?: ThemeCombo[]
	framed?: boolean
}) => {
	const colorCombos = themes.length ? themes : FALLBACK_THEME_COMBOS
	const [comboIndex, setComboIndex] = useState(0)
	const activeCombo = colorCombos[comboIndex] ?? colorCombos[0]

	useEffect(() => {
		// Desktop and mobile controls reflect the same active palette.
		const syncTheme = () => {
			const index = colorCombos.findIndex(combo => combo.key === document.documentElement.dataset.theme)
			if (index >= 0) setComboIndex(index)
		}
		window.addEventListener(THEME_CHANGE_EVENT, syncTheme)
		let initialIndex = 0
		try {
			initialIndex = getStoredThemeIndex(localStorage.getItem(THEME_STORAGE_KEY), colorCombos) ?? 0
		} catch {
			// Theme changes still work when storage is unavailable.
		}
		activateTheme(colorCombos[initialIndex])
		return () => window.removeEventListener(THEME_CHANGE_EVENT, syncTheme)
	}, [colorCombos])

	const handleToggle = () => {
		const currentIndex = colorCombos.findIndex(combo => combo.key === document.documentElement.dataset.theme)
		const nextCombo = colorCombos[(currentIndex + 1) % colorCombos.length]
		try {
			localStorage.setItem(THEME_STORAGE_KEY, nextCombo.key)
		} catch {
			// Theme changes still work when storage is unavailable.
		}
		activateTheme(nextCombo)
	}

	const commonClass = framed ?
		'bg-dark toggler flex aspect-square h-[2.25rem] cursor-pointer items-stretch justify-center border-primary p-1 sm:h-[2rem] sm:border-[3px] sm:border-primary sm:rounded-md sm:p-1.5 lg:border-0 lg:bg-transparent' : 'toggler flex h-full w-full items-center justify-center bg-dark p-2'

	return (
		<button type="button" onClick={handleToggle} aria-label={`Change color theme (current: ${activeCombo.name})`} className={`${commonClass} transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}>
			<ColorSwitch
				theme={{
					left: activeCombo.dark,
					right: activeCombo.primary,
					stroke: activeCombo.primary,
				}}
				className="h-full w-full overflow-visible p-1 sm:p-0"
			/>
		</button>
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

function activateTheme(theme: ThemeCombo) {
	applyThemeColors(theme, document.documentElement)
	window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: { key: theme.key } }))
}
