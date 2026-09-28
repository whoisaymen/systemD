'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import {
	AnimatePresence,
	motion,
	useMotionValueEvent,
	useScroll,
} from 'motion/react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import ThemeSwitch from '../ThemeSwitch'
import LocaleSwitcher from './LocaleSwitcher'
import type { ThemeCombo } from '@/lib/theme'

import BigBangLogoMobile from '../bigbang/BigBangLogoMobile'
import FestivalLogoMobile from '../festival/FestivalLogoMobile'
import MemoireLogoMobile from '../memoire/MemoireLogoMobile'
import EquipeLogoMobile from '../equipe/EquipeLogoMobile'
import FabriqueLogoMobile from '../fabrique/FabriqueLogoMobile'
import LogoShortAnimated from '../svgs/LogoShortAnimated'
import AboutInfo from '../svgs/AboutInfo.svg'

import Menu from './MobileMenuItem'

const parentVariants = {
	visible: { y: 0 },
	hidden: { y: '-120%' },
}

const parentVariantsFooter = {
	visible: { y: 0, visibility: 'visible' as const },
	hidden: {
		y: '200%',
		// Safari can extend the color of offscreen fixed controls into its toolbar.
		transitionEnd: { visibility: 'hidden' as const },
	},
}
const childVariants = {
	visible: { opacity: 1, y: 0 },
	hidden: { opacity: 0, y: '-2rem' },
}

const NavBarMobile = ({
	locale,
	themes,
}: {
	locale: string
	themes?: ThemeCombo[]
}) => {
	const tMenu = useTranslations('menu')
	const [menuOpen, setMenuOpen] = useState(false)
	const pathname = usePathname()
	const aboutHref = `/${locale}/about`
	const isAboutPage = pathname === aboutHref || pathname.startsWith(`${aboutHref}/`)
	const [hidden, setHidden] = useState(false)
	const [prevScroll, setPrevScroll] = useState(0)

	const { scrollY } = useScroll()

	useMotionValueEvent(scrollY, 'change', (latest) => {
		const isScrollingDown = latest > prevScroll
		const isScrollingUp = latest < prevScroll
		const maxScroll = document.body.scrollHeight - window.innerHeight

		if (latest >= maxScroll - 10) {
			// you're at the bottom, do nothing
			return
		}

		if (isScrollingUp) {
			setHidden(false)
		} else if (latest > 50 && isScrollingDown) {
			setHidden(true)
		}

		setPrevScroll(latest)
	})

	const toggleMenu = () => {
		setMenuOpen((prev) => !prev)
	}

	const closeMenu = () => {
		setMenuOpen(false)
	}

	const themeColors = {
		dark: {
			fill: 'var(--color-dark)',
			stroke: 'var(--color-primary)',
			icon: 'var(--color-primary)',
		},
		fabrique: {
			fill: 'var(--color-dark)',
			stroke: 'var(--color-primary)',
			icon: 'var(--color-primary)',
		},
		sparkle: {
			fill: 'var(--color-primary)',
			stroke: 'var(--color-dark)',
		},
		festival: {
			fill: 'var(--color-dark)',
			stroke: 'var(--color-primary)',
			icon: 'var(--color-primary)',
		},
		memoire: {
			fill: 'var(--color-dark)',
			stroke: 'var(--color-primary)',
			icon: 'var(--color-primary)',
		},
	}

	const renderLogo = () => {
		const localizedFestivalPath = `/${locale}/festival`

		if (pathname.includes('/bigbang')) {
			return (
				<BigBangLogoMobile
					theme={themeColors.dark}
					containAnimation
					className="mt-2 overflow-visible text-dark"
				/>
			)
		} else if (pathname === localizedFestivalPath) {
			return (
				<FestivalLogoMobile
					theme={themeColors.festival}
					className="overflow-visible text-dark"
				/>
			)
		} else if (pathname.startsWith(localizedFestivalPath)) {
			return (
				<MemoireLogoMobile
					theme={themeColors.memoire}
					className="overflow-visible text-dark"
				/>
			)
		} else if (pathname.includes('/memoire') || pathname.includes('film')) {
			return (
				<MemoireLogoMobile
					theme={themeColors.memoire}
					className="overflow-visible text-dark"
				/>
			)
		} else if (pathname.includes('/equipe')) {
			return (
				<EquipeLogoMobile
					theme={themeColors.dark}
					className="mt-2 overflow-visible text-dark"
				/>
			)
		} else if (pathname.includes('/fabrique')) {
			return (
				<FabriqueLogoMobile
					theme={themeColors.fabrique}
					className="overflow-visible text-dark"
				/>
			)
		} else if (pathname.includes('/about')) {
			return (
				<LogoShortAnimated
					theme={themeColors.sparkle}
					className={`my-4 mb-0 inline-block h-auto w-full -rotate-2 rounded-md px-2 py-1 text-primary lg:w-[15rem]`}
				/>
			)
		} else {
			return
		}
	}

	const isFilmPage = pathname.includes('/film')

	return (
		<>
			{isFilmPage && (
				<>
					{/* <div className="fixed left-1 top-0 z-30 h-screen w-[2.5%] rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:11px_30px] bg-center bg-repeat-y lg:hidden"></div>
					<div className="fixed right-1 top-0 z-30 h-screen w-[2.5%] rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:11px_30px] bg-center bg-repeat-y lg:hidden"></div> */}
					<div
						className="fixed left-1 top-0 z-30 h-screen w-[2.5%] rounded-md lg:hidden"
						style={{
							maskImage: `url(/assets/svg/filmroll.svg)`,
							WebkitMaskImage: `url(/assets/svg/filmroll.svg)`,
							maskRepeat: 'repeat-y',
							WebkitMaskRepeat: 'repeat-y',
							maskPosition: 'center',
							WebkitMaskPosition: 'center',
							maskSize: '11px 30px',
							WebkitMaskSize: '11px 30px',
							backgroundColor: 'var(--color-grayDark)',
						}}
					/>
					<div
						className="fixed right-1 top-0 z-30 h-screen w-[2.5%] rounded-md lg:hidden"
						style={{
							maskImage: `url(/assets/svg/filmroll.svg)`,
							WebkitMaskImage: `url(/assets/svg/filmroll.svg)`,
							maskRepeat: 'repeat-y',
							WebkitMaskRepeat: 'repeat-y',
							maskPosition: 'center',
							WebkitMaskPosition: 'center',
							maskSize: '11px 30px',
							WebkitMaskSize: '11px 30px',
							backgroundColor: 'var(--color-grayDark)',
						}}
					/>
				</>
			)}
			{renderLogo() && (
				<div
					className={`relative w-full pt-[env(safe-area-inset-top)] lg:hidden ${pathname.includes('/bigbang') || pathname.includes('/memoire') ? 'z-[45]' : 'z-30'}`}
					id="navbar-mobile"
				>
					<nav className="mt-2 flex h-auto w-full items-start justify-center gap-2 pl-4 pr-4 text-center text-xl font-black tracking-tighter text-black lg:hidden">
						<div className="h-full w-full">{renderLogo()}</div>
					</nav>
				</div>
			)}

			<AnimatePresence mode="wait">
				{menuOpen && (
					<Menu
						key="modal"
						menuOpen={menuOpen}
						closeMenu={closeMenu}
						locale={locale}
					/>
				)}
			</AnimatePresence>

			<motion.div
				variants={parentVariantsFooter}
				animate={hidden && !menuOpen ? 'hidden' : 'visible'}
				transition={{
					duration: 0.2,
				}}
				className="pointer-events-none fixed bottom-0 left-0 z-50 mb-[calc(1rem+env(safe-area-inset-bottom))] flex h-auto w-full items-center justify-center gap-1 lg:hidden"
			>
				<div className="pointer-events-auto h-10 w-fit rounded-lg shadow-md">
					<LocaleSwitcher orientation="vertical" />
				</div>
				<div className="pointer-events-auto flex items-stretch justify-center gap-1">
					<div className="flex h-10 w-10 overflow-hidden rounded-lg border-2 border-primary">
						<ThemeSwitch themes={themes} framed={false} />
					</div>
					<Link
						href={aboutHref}
						onClick={closeMenu}
						aria-label={tMenu('about')}
						aria-current={isAboutPage ? 'page' : undefined}
						className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 border-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
							isAboutPage ? 'bg-primary text-dark' : 'bg-dark text-primary'
						}`}
					>
						<AboutInfo aria-hidden="true" focusable="false" className="h-5 w-5" />
					</Link>
					<button
						onClick={toggleMenu}
						aria-expanded={menuOpen}
						className="relative h-10 w-10 rounded-lg border-2 border-primary bg-dark bg-none text-primary focus:outline-none"
					>
						<span className="sr-only">{tMenu('openMainMenu')}</span>
						<div className="absolute left-1/2 top-1/2 block h-[3px] w-[18px] -translate-x-1/2 -translate-y-1/2 transform">
							<span
								aria-hidden="true"
								className={`absolute block h-[3px] w-[18px] transform bg-current transition duration-500 ease-in-out ${
									menuOpen ? 'rotate-45' : '-translate-y-[5px]'
								}`}
							></span>
							<span
								aria-hidden="true"
								className={`absolute block h-[3px] w-[18px] transform bg-current transition duration-500 ease-in-out ${
									menuOpen ? 'opacity-0' : ''
								}`}
							></span>
							<span
								aria-hidden="true"
								className={`absolute block h-[3px] w-[18px] transform bg-current transition duration-500 ease-in-out ${
									menuOpen ? '-rotate-45' : 'translate-y-[5px]'
								}`}
							></span>
						</div>
					</button>
				</div>
			</motion.div>
		</>
	)
}

export default NavBarMobile
