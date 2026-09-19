export const THEME_STORAGE_KEY = 'system-d-theme'
export const THEME_CHANGE_EVENT = 'system-d-theme-change'

type ThemeImageGradeInput = Partial<{
	gray: number | string
	sepia: number | string
	saturate: number | string
	hue: number | string
	contrast: number | string
	brightness: number | string
}>

export type ThemeCombo = {
	key: string
	name: string
	primary: string
	dark: string
	grayDark: string
	imageGrade: {
		gray: string
		sepia: string
		saturate: string
		hue: string
		contrast: string
		brightness: string
	}
}

export function applyThemeColors(
	{ key, primary, dark, grayDark, imageGrade }: ThemeCombo,
	root: HTMLElement,
) {
	// These optional Noir Lab overrides must never leak into another palette.
	for (const property of [
		'--color-theme-content',
		'--color-theme-content-rgb',
		'--color-theme-text',
		'--color-theme-box-edge',
	]) {
		root.style.removeProperty(property)
	}
	root.dataset.theme = key
	for (const [name, color] of Object.entries({ primary, dark, grayDark })) {
		const hex = color.replace('#', '')
		const rgb = [0, 2, 4].map(offset => parseInt(hex.slice(offset, offset + 2), 16)).join(' ')
		root.style.setProperty(`--color-${name}`, color)
		root.style.setProperty(`--color-${name}-rgb`, rgb)
	}
	for (const [name, value] of Object.entries(imageGrade)) {
		root.style.setProperty(`--image-grade-${name}`, value)
	}
}

export const FALLBACK_THEME_COMBOS: ThemeCombo[] = [
	{
		key: 'system-d-yellow-blue',
		name: 'Jaune / Bleu',
		primary: '#DEFE04',
		dark: '#123DA6',
		grayDark: '#8C8C8F',
		imageGrade: {
			gray: '1',
			sepia: '0.72',
			saturate: '2',
			hue: '174deg',
			contrast: '0.92',
			brightness: '1.08',
		},
	},
	{
		key: 'system-d-violet-ice',
		name: 'Violet / Ice',
		primary: '#554FF1',
		dark: '#D0DCDC',
		grayDark: '#636363',
		imageGrade: {
			gray: '1',
			sepia: '0.68',
			saturate: '1.85',
			hue: '180deg',
			contrast: '0.92',
			brightness: '1.09',
		},
	},
	{
		key: 'system-d-gray-black',
		name: 'Gris / Noir',
		primary: '#8C8C8F',
		dark: '#222223',
		grayDark: '#8C8C8F',
		imageGrade: {
			gray: '1',
			sepia: '0',
			saturate: '0.85',
			hue: '0deg',
			contrast: '0.9',
			brightness: '1.06',
		},
	},
	{
		key: 'system-d-orange-cream',
		name: 'Orange / Crème',
		primary: '#DE5325',
		dark: '#FAFAEC',
		grayDark: '#DE5325',
		imageGrade: {
			gray: '1',
			sepia: '0.64',
			saturate: '1.55',
			hue: '-18deg',
			contrast: '0.9',
			brightness: '1.1',
		},
	},
	{
		key: 'system-d-neon-black',
		name: 'Noir / Néon',
		primary: '#FF9D4D',
		dark: '#253237',
		grayDark: '#7C6E6E',
		imageGrade: {
			gray: '0.25',
			sepia: '0.18',
			saturate: '1.65',
			hue: '150deg',
			contrast: '1.08',
			brightness: '0.9',
		},
	},
]

const HEX_COLOR = /^#[0-9a-f]{6}$/i

export function resolveThemeCombos(site?: Pick<Sanity.Site, 'themes'> | null) {
	const themes = (site?.themes ?? [])
		.filter(Boolean)
		.reduce<Sanity.SiteTheme[]>((uniqueThemes, theme) => {
			if (!theme) return uniqueThemes

			const key = getThemeKey(theme)
			if (!uniqueThemes.some((item) => getThemeKey(item) === key)) {
				uniqueThemes.push(theme)
			}

			return uniqueThemes
		}, [])

	if (!themes.length) return FALLBACK_THEME_COMBOS

	return themes.map((theme, index) =>
		normalizeTheme(
			theme,
			FALLBACK_THEME_COMBOS[index] ?? FALLBACK_THEME_COMBOS[0],
		),
	)
}

function normalizeTheme(
	theme: Sanity.SiteTheme,
	fallback: ThemeCombo,
): ThemeCombo {
	return {
		key: getThemeKey(theme),
		name: theme.title || fallback.name,
		primary: normalizeHex(theme.primary, fallback.primary),
		dark: normalizeHex(theme.dark, fallback.dark),
		grayDark: normalizeHex(theme.grayDark, fallback.grayDark),
		imageGrade: normalizeImageGrade(theme.imageGrade, fallback.imageGrade),
	}
}

function getThemeKey(theme: Sanity.SiteTheme) {
	return theme.slug?.current || theme._id || theme.title
}

function normalizeHex(value: string | undefined, fallback: string) {
	return value && HEX_COLOR.test(value) ? value.toUpperCase() : fallback
}

function normalizeImageGrade(
	imageGrade: ThemeImageGradeInput | undefined,
	fallback: ThemeCombo['imageGrade'],
) {
	return {
		gray: normalizeCssNumber(imageGrade?.gray, fallback.gray),
		sepia: normalizeCssNumber(imageGrade?.sepia, fallback.sepia),
		saturate: normalizeCssNumber(imageGrade?.saturate, fallback.saturate),
		hue: normalizeHue(imageGrade?.hue, fallback.hue),
		contrast: normalizeCssNumber(imageGrade?.contrast, fallback.contrast),
		brightness: normalizeCssNumber(imageGrade?.brightness, fallback.brightness),
	}
}

function normalizeCssNumber(
	value: number | string | undefined,
	fallback: string,
) {
	return value === undefined || value === null ? fallback : String(value)
}

function normalizeHue(value: number | string | undefined, fallback: string) {
	if (value === undefined || value === null) return fallback

	const stringValue = String(value)
	return stringValue.endsWith('deg') ? stringValue : `${stringValue}deg`
}
