import plugin from 'tailwindcss/plugin'
import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
	darkMode: 'class',
	content: ['./src/{app,ui,components}/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				ink: '#1d1d1f',
				canvas: '#fff',

				accent: '#1d1d1f',
			},
			maxHeight: {
				fold: 'calc(100svh - var(--header-height))',
			},
			fontFamily: {
				anisette: ['Anisette', ...fontFamily.mono],
				geist: ['var(--font-geist)', ...fontFamily.sans],
			},
		},

		lh: {
			DEFAULT: '1lh',
			2: '2lh',
			3: '3lh',
		},
	},
	plugins: [
		plugin(function ({ addVariant, matchUtilities, theme }) {
			addVariant('header-open', 'body:has(#header-open:checked) &')
			addVariant('header-closed', 'body:has(#header-open:not(:checked)) &')

			matchUtilities(
				{
					skeleton: (value) => ({
						height: value,
						backgroundColor: theme('colors.neutral.50'),
					}),
				},
				{
					values: theme('lh'),
				},
			)
		}),
	],
	safelist: [{ pattern: /action.*/ }, 'ghost'],
} satisfies Config
