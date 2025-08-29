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

import ThemeSwitch from '../ThemeSwitch'
import LocaleSwitcher from './LocaleSwitcher'

import BigBangLogoMobile from '../bigbang/BigBangLogoMobile'
import FestivalLogoMobile from '../festival/FestivalLogoMobile'
import MemoireLogoMobile from '../memoire/MemoireLogoMobile'
import EquipeLogoMobile from '../equipe/EquipeLogoMobile'
import FabriqueLogoMobile from '../fabrique/FabriqueLogoMobile'
import LogoShortAnimated from '../svgs/LogoShortAnimated'

import Menu from './MobileMenuItem'
import LogoShortTsx from '../svgs/LogoShort'

const parentVariants = {
	visible: { y: 0 },
	hidden: { y: '-120%' },
}

const parentVariantsFooter = {
	visible: { y: 0 },
	hidden: { y: '200%' },
}
const childVariants = {
	visible: { opacity: 1, y: 0 },
	hidden: { opacity: 0, y: '-2rem' },
}

const NavBarMobile = ({ locale }: { locale: string }) => {
	const [menuOpen, setMenuOpen] = useState(false)
	const pathname = usePathname()
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
		setMenuOpen(!menuOpen)
		if (!menuOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'auto'
		}
	}

	const closeMenu = () => {
		setMenuOpen(false)
		document.body.style.overflow = ''
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
					className="mt-6 overflow-visible text-dark"
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
		} else if (pathname.includes('/contact')) {
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
					<div className="fixed left-1 top-0 z-30 h-screen w-[2.5%] rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:11px_30px] bg-center bg-repeat-y lg:hidden"></div>
					<div className="fixed right-1 top-0 z-30 h-screen w-[2.5%] rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:11px_30px] bg-center bg-repeat-y lg:hidden"></div>
				</>
			)}
			{/* <div className="fixed left-1 top-0 z-30 h-screen w-[2.5%] rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:11px_30px] bg-center bg-repeat-y"></div>
			<div className="fixed right-1 top-0 z-30 h-screen w-[2.5%] rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:11px_30px] bg-center bg-repeat-y"></div> */}
			<div className="z-50 w-full lg:hidden" id="navbar-mobile">
				{/* <div className="absolute inset-0 -z-10 h-28">
					<div className="absolute inset-0 backdrop-blur-sm [-webkit-mask-image:linear-gradient(to_top,transparent_0%,white_20%,white_40%,transparent_50%)]" />
					<div className="absolute inset-0 backdrop-blur-md [-webkit-mask-image:linear-gradient(to_top,transparent_20%,white_40%,white_50%,transparent_75%)]" />
					<div className="absolute inset-0 backdrop-blur-md [-webkit-mask-image:linear-gradient(to_top,transparent_50%,white_60%,white_75%,transparent_100%)]" />
				</div> */}
				<nav
					// variants={parentVariants}
					// animate={hidden ? 'hidden' : 'visible'}
					// transition={{
					// 	duration: 0.2,
					// }}
					className="mt-2 flex h-auto w-full items-start justify-center gap-2 pl-4 pr-4 text-center text-xl font-black tracking-tighter text-black lg:hidden"
				>
					<div className="h-full w-full">{renderLogo()}</div>
				</nav>
			</div>

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
				animate={hidden ? 'hidden' : 'visible'}
				transition={{
					duration: 0.2,
				}}
				className="fixed bottom-0 z-50 mb-4 flex h-auto w-full items-center justify-center gap-1 lg:hidden"
			>
				<div className="h-[2.5rem] w-fit rounded-lg border-2 border-dark bg-primary shadow-md dark:border-primary">
					<LocaleSwitcher />
				</div>
				<div className="flex items-stretch justify-center gap-1">
					<div className="flex aspect-square h-full overflow-hidden rounded-md border-2 border-dark dark:border-primary">
						<ThemeSwitch />
					</div>
					<button
						onClick={toggleMenu}
						className="relative aspect-square min-h-[2.25rem] rounded-md border-2 border-dark bg-grayDark bg-none text-dark focus:outline-none dark:border-primary dark:bg-dark dark:text-primary"
					>
						<span className="sr-only">Open main menu</span>
						<div className="absolute left-1/2 top-1/2 block w-6 -translate-x-1/2 -translate-y-1/2 transform">
							<span
								aria-hidden="true"
								className={`absolute block h-0.5 w-6 transform bg-current transition duration-500 ease-in-out ${
									menuOpen ? 'rotate-45' : '-translate-y-1.5'
								}`}
							></span>
							<span
								aria-hidden="true"
								className={`absolute block h-0.5 w-6 transform bg-current transition duration-500 ease-in-out ${
									menuOpen ? 'opacity-0' : ''
								}`}
							></span>
							<span
								aria-hidden="true"
								className={`absolute block h-0.5 w-6 transform bg-current transition duration-500 ease-in-out ${
									menuOpen ? '-rotate-45' : 'translate-y-1.5'
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
