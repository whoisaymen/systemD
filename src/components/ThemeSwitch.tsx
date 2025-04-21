'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import ColorSwitch from './homepage/ColorSwitch'

const ThemeSwitch = () => {
	const [mounted, setMounted] = useState(false)
	const { theme, setTheme } = useTheme()

	useEffect(() => {
		setMounted(true)
	}, [])

	const commonClass =
		'toggler flex aspect-square h-[2.25rem] cursor-pointer items-stretch justify-center border-primary p-1 sm:h-[2rem]'

	if (!mounted) {
		return (
			<div className={`${commonClass}`}>
				<ColorSwitch
					theme={{
						left: 'var(--color-dark)',
						right: 'var(--color-primary)',
						stroke: 'var(--color-dark)',
					}}
					className="h-full w-full p-1"
				/>
			</div>
		)
	}

	const toggleTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark')
	}

	return (
		<div
			onClick={toggleTheme}
			className={`${commonClass} ${
				theme === 'dark'
					? 'bg-dark sm:bg-transparent'
					: 'bg-primary sm:bg-transparent'
			}`}
		>
			<ColorSwitch
				theme={{
					left: theme === 'dark' ? 'var(--color-dark)' : 'var(--color-primary)',
					right:
						theme === 'dark' ? 'var(--color-primary)' : 'var(--color-dark)',
					stroke:
						theme === 'dark' ? 'var(--color-primary)' : 'var(--color-dark)',
				}}
				className="h-full w-full p-1"
			/>
		</div>
	)
}

export default ThemeSwitch
