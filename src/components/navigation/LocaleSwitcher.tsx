// import { useLocale, useTranslations } from 'next-intl'
// import { routing } from '@/i18n/routing'
// import LocaleSwitcherSelect from './LocaleSwitcherSelect'
// import LocaleSwitcherDropdown from './LocaleSwitcherDropdown'

// export default function LocaleSwitcher() {
// 	const locale = useLocale()

// 	return (
// 		<LocaleSwitcherSelect defaultValue={locale} label="Select language">
// 			{routing.locales.map((cur) => (
// 				<option key={cur} value={cur}>
// 					{cur.toUpperCase()}
// 				</option>
// 			))}
// 		</LocaleSwitcherSelect>
// 	)
// }

// import { useLocale, useTranslations } from 'next-intl'
// import { routing } from '@/i18n/routing'
// import LocaleSwitcherDropdown from './LocaleSwitcherSelect'

// export default function LocaleSwitcher() {
// 	const locale = useLocale()

// 	const languageOptions = routing.locales.map((cur) => ({
// 		value: cur,
// 		label: cur.toUpperCase(),
// 	}))

// 	return (
// 		<LocaleSwitcherDropdown
// 			defaultValue={locale}
// 			label="Select language"
// 			options={languageOptions}
// 		>
// 			{routing.locales.map((cur) => (
// 				<option key={cur} value={cur}>
// 					{cur.toUpperCase()}
// 				</option>
// 			))}
// 		</LocaleSwitcherDropdown>
// 	)
// }

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
					'flex h-full items-center justify-between gap-2 rounded-md bg-grayDark px-3 text-base font-bold tracking-tighter text-dark transition-all duration-200 dark:bg-dark dark:text-primary sm:text-2xl',
					isPending && 'opacity-30',
					isOpen && 'ring-2 ring-primary',
				)}
			>
				<span>{locale.toUpperCase()}</span>
				{/* <motion.span
					className="text-current"
					animate={{ rotate: isOpen ? 0 : 180 }}
					transition={{ duration: 0.2 }}
				>
					↓
				</motion.span> */}
			</button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 10, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 10, scale: 0.95 }}
						transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
						className="absolute bottom-full left-0 right-0 z-50 mb-2 w-full overflow-hidden rounded-md border-2 border-dark bg-grayDark shadow-lg dark:border-primary dark:bg-dark"
					>
						{routing.locales.map((lang) => (
							<button
								key={lang}
								onClick={() => onSelectChange(lang)}
								className={clsx(
									'w-full text-center text-base font-bold tracking-tighter transition-all duration-150 hover:bg-primary hover:text-dark dark:hover:bg-primary dark:hover:text-dark sm:text-xl',
									lang === locale
										? 'bg-primary text-dark dark:bg-primary dark:text-dark'
										: 'text-dark dark:text-primary',
								)}
							>
								<div className="flex items-center justify-center py-2">
									<span>{lang.toUpperCase()}</span>
									{/* {lang === locale && (
										<motion.span
											className="text-current"
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{ delay: 0.1 }}
										>
											✓
										</motion.span>
									)} */}
								</div>
							</button>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
