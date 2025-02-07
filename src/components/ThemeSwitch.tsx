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
		setTheme(theme === 'dark' ? 'light' : 'dark')
	}

	return (
		<div
			className="toggler my-1 h-full w-16 cursor-pointer rounded-md bg-[#DEFE04]"
			onClick={toggleTheme}
		>
			<motion.div
				className={`h-8 w-8 scale-75 rounded-md transition-transform ${
					theme === 'dark'
						? 'bg-gradient-to-r from-[#DEFE04] to-[#1C1C1E]'
						: 'bg-gradient-to-r from-[#D3D3D3] to-[#A9A9A9]'
				}`}
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
