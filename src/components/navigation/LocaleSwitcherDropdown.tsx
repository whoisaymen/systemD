'use client'

import { useState } from 'react'
import { Locale, usePathname, useRouter } from '@/i18n/routing'
import clsx from 'clsx'

type Props = {
	children: { value: string; label: string }[]
	defaultValue: string
}

export default function LocaleSwitcherDropdown({
	children,
	defaultValue,
}: Props) {
	const [isOpen, setIsOpen] = useState(false)
	const [selected, setSelected] = useState(defaultValue)
	const router = useRouter()

	function handleSelect(locale: string) {
		setSelected(locale)
		setIsOpen(false)
		router.replace('/', { locale: locale as Locale })
	}

	return (
		<div className="relative inline-block text-left">
			{/* Trigger Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center justify-between rounded-md border-2 border-primary bg-dark px-4 py-2 text-lg font-bold text-primary shadow-md hover:bg-primary hover:text-dark dark:bg-primary dark:text-dark dark:hover:bg-dark dark:hover:text-primary"
			>
				{selected.toUpperCase()}
				<span className="ml-2 transform transition-transform duration-300">
					{isOpen ? '▲' : '▼'}
				</span>
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
				<ul className="absolute left-0 z-10 mt-2 w-full rounded-md border-2 border-primary bg-dark py-2 shadow-lg dark:bg-primary">
					{children.map((locale) => (
						<li key={locale.value}>
							<button
								onClick={() => handleSelect(locale.value)}
								className={clsx(
									'block w-full px-4 py-2 text-left text-lg font-bold text-primary hover:bg-primary hover:text-dark dark:text-dark dark:hover:bg-dark dark:hover:text-primary',
									selected === locale.value && 'bg-primary text-dark',
								)}
							>
								{locale.label}
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
