// 'use client'

// import clsx from 'clsx'
// import { useParams } from 'next/navigation'
// import { ChangeEvent, ReactNode, useTransition } from 'react'
// import { Locale, usePathname, useRouter } from '@/i18n/routing'

// type Props = {
// 	children: ReactNode
// 	defaultValue: string
// 	label: string
// }

// export default function LocaleSwitcherSelect({
// 	children,
// 	defaultValue,
// 	label,
// }: Props) {
// 	const router = useRouter()
// 	const [isPending, startTransition] = useTransition()
// 	const pathname = usePathname()
// 	const params = useParams()

// 	function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
// 		const nextLocale = event.target.value as Locale
// 		startTransition(() => {
// 			router.replace(
// 				// @ts-expect-error -- TypeScript will validate that only known `params`
// 				// are used in combination with a given `pathname`. Since the two will
// 				// always match for the current route, we can skip runtime checks.
// 				{ pathname, params },
// 				{ locale: nextLocale },
// 			)
// 		})
// 	}

// 	return (
// 		<label
// 			className={clsx(
// 				'relative text-gray-400',
// 				isPending && '!outline-none transition-opacity [&:disabled]:opacity-30',
// 			)}
// 		>
// 			<p className="sr-only">{label}</p>
// 			<select
// 				className="inline-flex h-full w-full appearance-none rounded-r-none bg-grayDark px-2 text-base font-bold tracking-tighter text-dark !outline-none dark:bg-dark dark:text-primary sm:text-2xl sm:dark:bg-transparent"
// 				defaultValue={defaultValue}
// 				disabled={isPending}
// 				onChange={onSelectChange}
// 			>
// 				{children}
// 			</select>
// 			{/* <span className="pointer-events-none absolute right-2 top-[8px]">⌄</span> */}
// 		</label>
// 	)
// }

'use client'

import clsx from 'clsx'
import { useParams } from 'next/navigation'
import { ReactNode, useTransition, useState, useRef, useEffect } from 'react'
import { Locale, usePathname, useRouter } from '@/i18n/routing'
import { motion, AnimatePresence } from 'motion/react'

type Props = {
	children: ReactNode
	defaultValue: string
	label: string
	options: { value: string; label: string }[]
}

export default function LocaleSwitcherDropdown({
	children,
	defaultValue,
	label,
	options,
}: Props) {
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
				// @ts-expect-error -- TypeScript will validate that only known `params`
				// are used in combination with a given `pathname`. Since the two will
				// always match for the current route, we can skip runtime checks.
				{ pathname, params },
				{ locale: nextLocale },
			)
		})
	}

	return (
		<div ref={dropdownRef} className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				disabled={isPending}
				className={clsx(
					'hover:bg-grayDark/80 dark:hover:bg-dark/80 flex items-center justify-between gap-2 rounded-md bg-grayDark px-3 py-2 text-base font-bold tracking-tighter text-dark transition-all duration-200 dark:bg-dark dark:text-primary sm:text-2xl',
					isPending && 'opacity-30',
					isOpen && 'ring-2 ring-primary',
				)}
			>
				<span>{defaultValue.toUpperCase()}</span>
				<motion.svg
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					className="text-current"
					animate={{ rotate: isOpen ? 180 : 0 }}
					transition={{ duration: 0.2 }}
				>
					<path
						d="M3 4.5L6 7.5L9 4.5"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</motion.svg>
			</button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -10, scale: 0.95 }}
						transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
						className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-md border-2 border-dark bg-grayDark shadow-lg dark:border-primary dark:bg-dark"
					>
						{options.map((option) => (
							<button
								key={option.value}
								onClick={() => onSelectChange(option.value as Locale)}
								className={clsx(
									'block w-full px-3 py-2 text-left text-base font-bold tracking-tighter transition-all duration-150 hover:bg-primary hover:text-dark dark:hover:bg-primary dark:hover:text-dark sm:text-xl',
									option.value === defaultValue
										? 'bg-primary text-dark dark:bg-primary dark:text-dark'
										: 'text-dark dark:text-primary',
								)}
							>
								<div className="flex items-center justify-between">
									<span>{option.label}</span>
									{option.value === defaultValue && (
										<motion.svg
											width="16"
											height="16"
											viewBox="0 0 16 16"
											fill="none"
											className="text-current"
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{ delay: 0.1 }}
										>
											<path
												d="M13.5 4.5L6 12L2.5 8.5"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</motion.svg>
									)}
								</div>
							</button>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
