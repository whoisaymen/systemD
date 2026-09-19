import {
	FALLBACK_THEME_COMBOS,
	THEME_STORAGE_KEY,
	type ThemeCombo,
} from '@/lib/theme'

const root = document.documentElement

try {
	const serializedThemes = root.dataset.themeConfig
	const parsedThemes = serializedThemes
		? (JSON.parse(serializedThemes) as ThemeCombo[])
		: null
	const themes =
		Array.isArray(parsedThemes) && parsedThemes.length
			? parsedThemes
			: FALLBACK_THEME_COMBOS
	const savedValue = window.localStorage.getItem(THEME_STORAGE_KEY)
	const savedNumber = Number.parseInt(savedValue || '', 10)
	let index = themes.findIndex((theme) => theme.key === savedValue)

	if (index < 0 && Number.isFinite(savedNumber) && themes[savedNumber]) {
		index = savedNumber
	}

	const theme = themes[index >= 0 ? index : 0]

	if (theme) {
		applyTheme(theme)
	}
} catch {
	applyTheme(FALLBACK_THEME_COMBOS[0])
}

function applyTheme({ key, primary, dark, grayDark, imageGrade }: ThemeCombo) {
	root.dataset.theme = key
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

function hexToRgb(hex: string) {
	const value = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

	return value
		? `${Number.parseInt(value[1], 16)} ${Number.parseInt(value[2], 16)} ${Number.parseInt(value[3], 16)}`
		: '0 0 0'
}
