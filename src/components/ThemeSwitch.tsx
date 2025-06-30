// 'use client'
// import { useState, useEffect } from 'react'
// import { useTheme } from 'next-themes'
// import { motion } from 'framer-motion'
// import ColorSwitch from './homepage/ColorSwitch'

// const ThemeSwitch = () => {
// 	const [mounted, setMounted] = useState(false)
// 	const { theme, setTheme } = useTheme()

// 	useEffect(() => {
// 		setMounted(true)
// 	}, [])

// 	const commonClass =
// 		'toggler flex aspect-square h-[2.25rem] cursor-pointer items-stretch justify-center border-primary p-1 sm:h-[2rem]'

// 	if (!mounted) {
// 		return (
// 			<div className={`${commonClass}`}>
// 				<ColorSwitch
// 					theme={{
// 						left: 'var(--color-dark)',
// 						right: 'var(--color-primary)',
// 						stroke: 'var(--color-dark)',
// 					}}
// 					className="h-full w-full p-1"
// 				/>
// 			</div>
// 		)
// 	}

// 	const toggleTheme = () => {
// 		setTheme(theme === 'dark' ? 'light' : 'dark')
// 	}

// 	return (
// 		<div
// 			onClick={toggleTheme}
// 			className={`${commonClass} ${
// 				theme === 'dark'
// 					? 'bg-dark sm:bg-transparent'
// 					: 'bg-grayDark sm:bg-transparent'
// 			}`}
// 		>
// 			<ColorSwitch
// 				theme={{
// 					left: theme === 'dark' ? 'var(--color-dark)' : 'var(--color-primary)',
// 					right:
// 						theme === 'dark' ? 'var(--color-primary)' : 'var(--color-dark)',
// 					stroke:
// 						theme === 'dark' ? 'var(--color-primary)' : 'var(--color-dark)',
// 				}}
// 				className="h-full w-full p-1"
// 			/>
// 		</div>
// 	)
// }

// export default ThemeSwitch

'use client'
import { useState, useEffect } from 'react'
import ColorSwitch from './homepage/ColorSwitch'

const colorCombos = [
	{ primary: '#DEFE04', dark: '#123DA6', grayDark: '#8C8C8F' },
	{ primary: '#554FF1', dark: '#D0DCDC', grayDark: '#8C8C8F' },
	// { primary: '#FF5E30', dark: '#85343A', grayDark: '#8C8C8F' },
	{ primary: '#8C8C8F', dark: '#222223', grayDark: '#8C8C8F' },
	// ...add more combos
]

const ThemeSwitch = () => {
	const [comboIndex, setComboIndex] = useState(0)

	function applyColors({
		primary,
		dark,
		grayDark,
	}: {
		primary: string
		dark: string
		grayDark?: string
	}) {
		if (typeof window !== 'undefined') {
			const root = document.documentElement
			root.style.setProperty('--color-primary', primary)
			root.style.setProperty('--color-dark', dark)
			root.style.setProperty('--color-grayDark', grayDark) // Default grayDark
		}
	}

	useEffect(() => {
		applyColors(colorCombos[comboIndex])
	}, [comboIndex])

	const handleToggle = () => {
		setComboIndex((prev) => (prev + 1) % colorCombos.length)
		// For random: use the random version from above
	}

	const commonClass =
		'bg-dark toggler flex aspect-square h-[2.25rem] cursor-pointer items-stretch justify-center border-primary p-1 sm:h-[2rem]'

	return (
		<div onClick={handleToggle} className={commonClass}>
			<ColorSwitch
				theme={{
					left: colorCombos[comboIndex].dark,
					right: colorCombos[comboIndex].primary,
					stroke: colorCombos[comboIndex].primary,
				}}
				className="h-full w-full p-1"
			/>
		</div>
	)
}

export default ThemeSwitch
