'use client'

import { useLocale } from 'next-intl'
import { routing } from '@/i18n/routing'
import { useParams } from 'next/navigation'
import { useTransition, useState, useRef, useEffect } from 'react'
import { Locale, usePathname, useRouter } from '@/i18n/routing'
import { motion, AnimatePresence } from 'motion/react'
import clsx from 'clsx'

export default function LocaleSwitcher() {
	const locale = useLocale()
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const pathname = usePathname()
	const params = useParams()
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	function onSelectChange(nextLocale: Locale) {
		setIsOpen(false)
		startTransition(() => {
			router.replace(
				// @ts-expect-error
				{ pathname, params },
				{ locale: nextLocale },
			)
		})
	}

	return (
		<div ref={dropdownRef} className="relative h-full">
			<button
				onClick={() => setIsOpen(!isOpen)}
				disabled={isPending}
				className={clsx(
					'flex h-full items-center justify-between gap-2 rounded-md bg-dark px-2 text-base font-bold tracking-tighter text-primary transition-all duration-200 sm:border-[0px] sm:border-primary sm:px-1.5 sm:text-2xl',
					isPending && 'opacity-30',
					// isOpen && 'border-2 border-primary',
				)}
			>
				<span>{locale.toUpperCase()}</span>
			</button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 10, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 10, scale: 0.95 }}
						transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
						className="absolute bottom-full left-0 right-0 z-50 mb-2 w-full rounded-md border-2 border-primary bg-dark shadow-lg"
					>
						{routing.locales.map((lang) => (
							<button
								key={lang}
								onClick={() => onSelectChange(lang)}
								className={clsx(
									'w-full text-center text-base font-bold tracking-tighter transition-all duration-150 hover:bg-primary hover:text-dark sm:text-xl',
									lang === locale ? 'bg-primary text-dark' : 'text-primary',
								)}
							>
								<div className="flex h-full items-center justify-center py-2">
									<span>{lang.toUpperCase()}</span>
								</div>
							</button>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
