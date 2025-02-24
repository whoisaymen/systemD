'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'

const ThemeSwitch = () => {
	const [mounted, setMounted] = useState(false)
	const { theme, setTheme } = useTheme()

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null

	const toggleTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark')
	}

	return (
		<div
			onClick={toggleTheme}
			className={`toggler flex aspect-square h-[2.25rem] cursor-pointer items-stretch justify-center border-primary p-1 ${
				theme === 'dark' ? 'bg-dark' : 'bg-primary'
			}`}
		>
			<div className="h-full w-1/2 rounded-l-full border-2 border-dark dark:border-primary dark:bg-dark" />

			<div className="h-full w-1/2 rounded-r-full bg-dark dark:bg-primary" />
		</div>
	)
}

export default ThemeSwitch
