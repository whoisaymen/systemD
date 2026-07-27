export const THEME_STORAGE_KEY = 'system-d-theme'

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
		primary: '#DFFF00',
		dark: '#10110B',
		grayDark: '#A855F7',
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

export function buildThemeInitializerScript(themes: ThemeCombo[]) {
	const serializedThemes = JSON.stringify(
		themes.length ? themes : FALLBACK_THEME_COMBOS,
	)

	return `
(function () {
	try {
		var combos = ${serializedThemes};
		var savedValue = window.localStorage.getItem('${THEME_STORAGE_KEY}');
		var savedNumber = Number.parseInt(savedValue || '', 10);
		var index = combos.findIndex(function (combo) {
			return combo.key === savedValue;
		});

		if (index < 0 && Number.isFinite(savedNumber) && combos[savedNumber]) {
			index = savedNumber;
		}

		var combo = combos[index >= 0 ? index : 0];
		var hexToRgb = function (hex) {
			var value = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
			return value
				? parseInt(value[1], 16) + ' ' + parseInt(value[2], 16) + ' ' + parseInt(value[3], 16)
				: '0 0 0';
		};
		var root = document.documentElement;
		root.style.setProperty('--color-primary', combo.primary);
		root.style.setProperty('--color-primary-rgb', hexToRgb(combo.primary));
		root.style.setProperty('--color-dark', combo.dark);
		root.style.setProperty('--color-dark-rgb', hexToRgb(combo.dark));
		root.style.setProperty('--color-grayDark', combo.grayDark);
		root.style.setProperty('--color-grayDark-rgb', hexToRgb(combo.grayDark));
		root.style.setProperty('--image-grade-gray', combo.imageGrade.gray);
		root.style.setProperty('--image-grade-sepia', combo.imageGrade.sepia);
		root.style.setProperty('--image-grade-saturate', combo.imageGrade.saturate);
		root.style.setProperty('--image-grade-hue', combo.imageGrade.hue);
		root.style.setProperty('--image-grade-contrast', combo.imageGrade.contrast);
		root.style.setProperty('--image-grade-brightness', combo.imageGrade.brightness);
	} catch (error) {}
})();
`
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
