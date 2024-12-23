'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'

const ThemeSwitch = () => {
	const [mounted, setMounted] = useState(false)
	const { theme, setTheme } = useTheme()

	// useEffect only runs on the client, so now we can safely show the UI
	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return null
	}
	const toggleTheme = () => {
		console.log(theme)
		setTheme(theme === 'dark' ? 'light' : 'dark')
	}

	return (
		<div
			className="toggler my-1 h-8 w-16 cursor-pointer rounded-3xl bg-black dark:bg-white"
			onClick={toggleTheme}
		>
			<motion.div
				className="h-8 w-8 scale-75 rounded-3xl bg-white transition-transform dark:bg-black"
				layout
				transition={{ type: 'spring', stiffness: 200, damping: 30 }}
				style={{
					transform: theme === 'dark' ? 'translateX(100%)' : 'translateX(0%)',
				}}
			></motion.div>
		</div>
	)
}

export default ThemeSwitch
