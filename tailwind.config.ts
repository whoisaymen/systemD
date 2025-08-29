import plugin from 'tailwindcss/plugin'
import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
	darkMode: 'class',
	content: ['./src/{app,ui,components}/**/*.{ts,tsx}'],
	theme: {
		extend: {
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
			colors: {
				ink: '#1d1d1f',
				canvas: '#fff',
				accent: '#1d1d1f',
				// primary: '#DEFE04',
				primary: 'var(--color-primary)',
				secondary: '#DEFE04',
				tertiary: '#222223',
				// dark: '#123DA6',
				dark: 'var(--color-dark)',

				// dark: '#2c1',
				// dark: '#222223',

				// dark: '#000',
				grayLight: '#DADADA',
				// grayDark: '#8C8C8F',
				grayDark: 'var(--color-grayDark)',
				// grayDark: '#DEFE04',
			},
			maxHeight: {
				fold: 'calc(100svh - var(--header-height))',
			},
			fontFamily: {
				anisette: ['Anisette', ...fontFamily.mono],
				geist: ['var(--font-geist)', ...fontFamily.sans],
			},
			width: {
				'column-width': '16rem',
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
		require('@butterfail/tailwindcss-inverted-radius'),
		require('tailwindcss-text-fill-stroke'),
	],
	safelist: [
		{ pattern: /action.*/ },
		'ghost',
		'rotate-1',
		'rotate-3',
		'rotate-6',
		'-rotate-1',
		'-rotate-2',
		'-rotate-3',
		'-rotate-6',
	],
} satisfies Config
