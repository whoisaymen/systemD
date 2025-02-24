'use client'

import { useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
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

const NavBarMobile = ({ locale }: { locale: string }) => {
	const [menuOpen, setMenuOpen] = useState(false)
	const pathname = usePathname()

	const toggleMenu = () => {
		setMenuOpen(!menuOpen)
	}

	const closeMenu = () => setMenuOpen(false)

	const themeColors = {
		dark: {
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
			icon: 'var(--color-grayDark)',
		},
		memoire: {
			fill: 'var(--color-dark)',
			stroke: 'var(--color-primary)',
			icon: 'var(--color-grayDark)',
		},
	}

	const renderLogo = () => {
		if (pathname.includes('/bigbang')) {
			return (
				<BigBangLogoMobile theme={themeColors.dark} className="text-dark" />
			)
		} else if (pathname.includes('/festival')) {
			return (
				<FestivalLogoMobile
					theme={themeColors.festival}
					className="text-dark"
				/>
			)
		} else if (pathname.includes('/memoire') || pathname.includes('film')) {
			return (
				<MemoireLogoMobile theme={themeColors.memoire} className="text-dark" />
			)
		} else if (pathname.includes('/equipe')) {
			return <EquipeLogoMobile theme={themeColors.dark} className="text-dark" />
		} else if (pathname.includes('/fabrique')) {
			return (
				<FabriqueLogoMobile theme={themeColors.dark} className="text-dark" />
			)
		} else {
			return
		}
	}

	return (
		<div className="relative z-50 h-full">
			<nav className="fixed left-0 top-0 z-50 mt-2 flex h-auto w-full items-start justify-center gap-2 !overflow-visible pl-2 pr-3 text-center text-xl font-black tracking-tighter text-black sm:hidden">
				<Link href="/" className="h-full w-full overflow-visible">
					<div className="w-full overflow-visible">{renderLogo()}</div>
				</Link>
			</nav>

			{menuOpen && (
				<Menu
					key="modal"
					menuOpen={menuOpen}
					closeMenu={closeMenu}
					locale={locale}
				/>
			)}

			<div className="fixed bottom-8 left-1/2 z-50 flex h-auto w-full -translate-x-1/2 items-center justify-center gap-1">
				<div className="h-[2.5rem] overflow-hidden rounded-md border-2 border-dark shadow-md dark:border-primary">
					<LocaleSwitcher />
				</div>
				{/* <div onClick={toggleMenu} className="">
					<div className="group flex h-[2.50rem] w-full rounded-lg border-2 border-dark bg-primary px-2 py-1 shadow-md dark:border-primary dark:bg-dark sm:hidden">

						<LogoShortAnimated
							className="h-full !overflow-visible text-dark group-hover:text-primary dark:text-primary"
							theme={themeColors.dark}
						/>
					</div>
				</div> */}
				<div className="flex items-stretch justify-center gap-1">
					<div className="flex aspect-square h-full overflow-hidden rounded-md border-2 border-dark dark:border-primary">
						<ThemeSwitch />
					</div>
					<button
						onClick={toggleMenu}
						className="relative aspect-square min-h-[2.25rem] rounded-md border-2 border-dark bg-primary bg-none text-dark focus:outline-none dark:border-primary dark:bg-dark dark:text-primary"
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
			</div>
		</div>
	)
}

export default NavBarMobile
