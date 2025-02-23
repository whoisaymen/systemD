'use client'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'

import ThemeSwitch from '../ThemeSwitch'
import LocaleSwitcher from './LocaleSwitcher'

import BigBangLogoMobile from '../bigbang/BigBangLogoMobile'
import FestivalLogoMobile from '../festival/FestivalLogoMobile'
import MemoireLogoMobile from '../memoire/MemoireLogoMobile'
import EquipeLogoMobile from '../equipe/EquipeLogoMobile'
import FabriqueLogoMobile from '../fabrique/FabriqueLogoMobile'
import { useState } from 'react'
import LogoShortAnimated from '../svgs/LogoShortAnimated'

import { usePathname, useSearchParams } from 'next/navigation'
import Menu from './MobileMenuItem'

const menuItems = [
	{ href: 'bigbang', Component: BigBangLogoMobile, delay: 0.1 },
	{ href: 'festival', Component: FestivalLogoMobile, delay: 0.2 },
	{ href: 'memoire', Component: MemoireLogoMobile, delay: 0.3 },
	{ href: 'equipe', Component: EquipeLogoMobile, delay: 0.4 },
	{ href: 'fabrique', Component: FabriqueLogoMobile, delay: 0.5 },
]

const NavBarMobile = ({ locale }: { locale: string }) => {
	const [menuOpen, setMenuOpen] = useState(false)
	const pathname = usePathname()

	const toggleMenu = () => {
		setMenuOpen(!menuOpen)
	}

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
			<nav className="fixed left-0 top-0 z-50 mt-2 flex h-auto w-full items-start justify-center gap-2 pl-2 pr-3 text-center text-xl font-black tracking-tighter text-black sm:hidden">
				<Link href="/" className="h-auto w-full">
					<div className="w-full">{renderLogo()}</div>
				</Link>
				{/* <Link
						href="/"
						className="bg-primary hover:bg-dark group flex h-auto w-[50%] rounded-lg"
					>
						<div className="w-full px-2 py-1">
							
							<LogoShortAnimated
								className="text-dark group-hover:text-primary !overflow-visible"
								fillColor="var(--color-dark)"
							/>
						</div>
					</Link> */}
				<div className="flex w-auto items-center justify-end">
					<LocaleSwitcher />
				</div>
			</nav>

			{/* {menuOpen && (
				<div className="absolute left-0 top-0 z-50 flex h-dvh w-full flex-col items-center justify-start overflow-hidden bg-grayLight px-8 pt-16 dark:bg-dark">
					<Link
						href={`/${locale}/bigbang`}
						className="group h-auto w-full overflow-hidden rounded-md"
					>
						<motion.div
							initial={{ opacity: 0, y: '100%' }}
							animate={{
								opacity: 1,
								y: 0,
								transition: { duration: 0.5, delay: 0.1, ease: 'easeInOut' },
							}}
							className="w-full px-2 py-3"
						>
							<BigBangLogoMobile
								theme={themeColors.dark}
								className="w-full text-dark group-hover:text-primary"
							/>
						</motion.div>
					</Link>
					<Link
						href={`/${locale}/festival`}
						className="group h-auto w-full rounded-md"
					>
						<div className="w-full px-2 py-3">
							<FestivalLogoMobile
								theme={themeColors.dark}
								className="text-dark group-hover:text-primary"
							/>
						</div>
					</Link>
					<Link
						href={`/${locale}/memoire`}
						className="group h-auto w-full rounded-md"
					>
						<div className="w-full px-2 py-3">
							<MemoireLogoMobile
								theme={themeColors.dark}
								className="text-dark group-hover:text-primary"
							/>
						</div>
					</Link>
					<Link
						href={`/${locale}/equipe`}
						className="group h-auto w-full rounded-md"
					>
						<div className="w-full px-2 py-3">
							<EquipeLogoMobile
								theme={themeColors.dark}
								className="text-dark group-hover:text-primary"
							/>
						</div>
					</Link>
					<Link
						href={`/${locale}/fabrique`}
						className="group h-auto w-full rounded-md"
					>
						<div className="w-full px-2 py-3">
							<FabriqueLogoMobile
								theme={themeColors.dark}
								className="text-dark group-hover:text-primary"
							/>
						</div>
					</Link>
				</div>
			)} */}

			<AnimatePresence>
				{menuOpen && <Menu key="modal" menuOpen={menuOpen} locale={locale} />}
			</AnimatePresence>
			<div className="fixed bottom-8 left-1/2 z-50 flex h-auto w-full -translate-x-1/2 items-center justify-center gap-1">
				<ThemeSwitch />
				<div
					onClick={toggleMenu}
					className="group flex h-auto w-[50%] rounded-lg border-2 border-dark bg-primary shadow-md sm:hidden"
				>
					<div className="w-full px-2 py-1">
						{/* <Logo className="text-dark group-hover:text-primary" /> */}
						<LogoShortAnimated
							className="!overflow-visible text-dark group-hover:text-primary"
							fillColor="var(--color-dark)"
						/>
					</div>
				</div>
				<button
					onClick={toggleMenu}
					className="relative h-[2.6rem] w-14 rounded-md border-2 border-dark bg-primary text-dark focus:outline-none"
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
	)
}

export default NavBarMobile
