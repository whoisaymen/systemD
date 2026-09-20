'use client'

import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import { useTransition, useState, useRef, useEffect, useId } from 'react'
import type { KeyboardEvent } from 'react'
import { routing, type Locale, usePathname, useRouter } from '@/i18n/routing'
import styles from './LocaleSwitcher.module.css'

const LANGUAGES = {
	fr: { name: 'Français', action: 'Changer de langue' },
	en: { name: 'English', action: 'Change language' },
	nl: { name: 'Nederlands', action: 'Taal wijzigen' },
} satisfies Record<Locale, { name: string; action: string }>

export default function LocaleSwitcher() {
	const locale = useLocale() as Locale
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const pathname = usePathname()
	const params = useParams()
	const [isOpen, setIsOpen] = useState(false)
	const switcherRef = useRef<HTMLDivElement>(null)
	const triggerRef = useRef<HTMLButtonElement>(null)
	const optionRefs = useRef<(HTMLButtonElement | null)[]>([])
	const menuId = useId()
	const language = LANGUAGES[locale]
	const alternatives = routing.locales.filter((language) => language !== locale)

	useEffect(() => {
		if (!isOpen) return

		optionRefs.current[0]?.focus({ preventScroll: true })
		const handleClickOutside = (event: PointerEvent) => {
			if (!switcherRef.current?.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		document.addEventListener('pointerdown', handleClickOutside)
		return () => document.removeEventListener('pointerdown', handleClickOutside)
	}, [isOpen, locale])

	function closeMenu() {
		setIsOpen(false)
		triggerRef.current?.focus()
	}

	function onSelectChange(nextLocale: Locale) {
		closeMenu()
		if (nextLocale === locale) return

		startTransition(() => {
			router.replace(
				// @ts-expect-error -- The pathname and params belong to the same current route.
				{ pathname, params },
				{ locale: nextLocale, scroll: false },
			)
		})
	}

	function onOptionKeyDown(
		event: KeyboardEvent<HTMLButtonElement>,
		index: number,
	) {
		let nextIndex: number
		switch (event.key) {
			case 'ArrowRight':
			case 'ArrowDown':
				nextIndex = (index + 1) % alternatives.length
				break
			case 'ArrowLeft':
			case 'ArrowUp':
				nextIndex =
					(index - 1 + alternatives.length) % alternatives.length
				break
			case 'Home':
				nextIndex = 0
				break
			case 'End':
				nextIndex = alternatives.length - 1
				break
			default:
				return
		}
		event.preventDefault()
		optionRefs.current[nextIndex]?.focus({ preventScroll: true })
	}

	return (
		<div
			ref={switcherRef}
			className={styles.switcher}
			data-open={isOpen}
			onBlur={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false)
			}}
			onKeyDown={(event) => {
				if (event.key === 'Escape' && isOpen) {
					event.preventDefault()
					event.stopPropagation()
					closeMenu()
				}
			}}
		>
			<button
				ref={triggerRef}
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				onKeyDown={(event) => {
					if (
						['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(
							event.key,
						)
					) {
						event.preventDefault()
						setIsOpen(true)
					}
				}}
				disabled={isPending}
				aria-label={`${language.action} (${language.name})`}
				aria-haspopup="menu"
				aria-expanded={isOpen}
				aria-controls={isOpen ? menuId : undefined}
				className={styles.trigger}
			>
				{locale.toUpperCase()}
			</button>

			<div
				className={styles.drawer}
				data-language-drawer
				inert={!isOpen}
				aria-hidden={!isOpen}
			>
				<div
					id={menuId}
					role="menu"
					aria-label={language.action}
					aria-orientation="horizontal"
					className={styles.menu}
				>
					{alternatives.map((lang, index) => (
						<button
							key={lang}
							ref={(element) => {
								optionRefs.current[index] = element
							}}
							type="button"
							role="menuitem"
							aria-label={LANGUAGES[lang].name}
							lang={lang}
							title={LANGUAGES[lang].name}
							tabIndex={-1}
							onClick={() => onSelectChange(lang)}
							onKeyDown={(event) => onOptionKeyDown(event, index)}
							className={styles.option}
						>
							{lang.toUpperCase()}
						</button>
					))}
				</div>
			</div>
		</div>
	)
}
