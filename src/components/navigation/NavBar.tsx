'use client'
import { motion } from 'motion/react'
import Link from 'next/link'

import ThemeSwitch from '../ThemeSwitch'
import LocaleSwitcher from './LocaleSwitcher'
import MenuArrows from './MenuArrows'
import BigBangLogo from '../bigbang/BigBangLogo'
import FabriqueBracketsIcon from '../fabrique/FabriqueBracketsIcon'
import FestivalSparklesIcon from '../festival/FestivalSparklesIcon'
import HoverableItem from '../HoverableItem'
import EquipeLogo from '../equipe/EquipeLogo'
import MemoireLogo from '../memoire/MemoireLogo'
import LogoShortAnimated from '../svgs/LogoShortAnimated'
import FabriqueLogoDesktop from '../fabrique/FabriqueLogoDesktop'
import FestivalLogoDesktop from '../festival/FestivalLogoDesktop'

import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'
import { usePathname } from 'next/navigation'

// Theme configuration
const getThemeColors = (isHovered: boolean, isActive: boolean = false) => ({
	fill: isHovered ? 'var(--color-primary)' : 'var(--color-primary)',
	stroke: isHovered ? 'var(--color-dark)' : 'var(--color-dark)',
	icon: isActive
		? 'var(--color-primary)'
		: isHovered
			? 'var(--color-primary)'
			: 'var(--color-dark)',
})

// Type for render function
type RenderFunction = (isHovered: boolean, isActive: boolean) => React.ReactNode

// Reusable components
const NavItem = ({
	href,
	children,
	className = '',
	growClass = 'grow',
	isActive = false,
}: {
	href: string
	children: RenderFunction
	className?: string
	growClass?: string
	isActive?: boolean
}) => (
	<HoverableItem className={`flex h-auto w-full ${growClass}`}>
		{(isHovered) => (
			<Link
				href={href}
				className={`relative flex h-full w-full cursor-pointer items-center justify-center rounded-md shadow-inner ${
					isActive
						? 'shadowtest border-0 border-r-0 bg-dark lg:relative lg:z-50'
						: 'to-grayDark/25 shadowtest bg-gradient-to-b from-primary shadow-inner'
				} ${className}`}
			>
				{/* <MenuArrows className="absolute right-2 top-2 text-grayDark" /> */}
				{children(isHovered, isActive)}
			</Link>
		)}
	</HoverableItem>
)

const SocialIcons = ({ className = '' }: { className?: string }) => (
	<div className={`flex items-center gap-2 ${className}`}>
		<FaInstagram className="text-dark" />
		<FaFacebook className="text-dark" />
		<FaYoutube className="text-dark" />
	</div>
)

const NavBar = ({ locale }: { locale: string }) => {
	const pathname = usePathname()

	const isActive = (path: string) => {
		const routePath = `/${locale}/${path}`
		if (path === 'memoire') {
			// Active if on /[locale]/memoire or /[locale]/festival/[edition]
			const festivalEditionRegex = new RegExp(`^/${locale}/festival/\\d{4}$`)
			return pathname === routePath || festivalEditionRegex.test(pathname)
		}
		return pathname === routePath
	}

	return (
		<nav className="fixed left-0 top-0 hidden h-svh w-full items-start justify-between overflow-hidden bg-cover bg-center text-center text-xl font-black tracking-tighter text-dark lg:pointer-events-none lg:flex">
			{/* First Column */}
			<div className="flex h-full max-w-[var(--width-column-width)] flex-col space-y-1 p-1 lg:pointer-events-auto">
				{/* Logo */}
				<Link
					href="/"
					className="group h-auto w-full rounded-md border-0 border-dark hover:bg-dark"
				>
					<LogoShortAnimated className="m-1 mb-0 inline-block h-auto w-full rounded-md text-primary lg:w-[15rem]" />
				</Link>

				{/* Navigation Items */}
				<div className="no-scrollbar flex h-full w-full flex-col space-y-1 overflow-scroll rounded-md">
					{/* Festival */}
					<NavItem
						href={`/${locale}/festival`}
						growClass="grow-[4]"
						className="p-8"
						isActive={isActive('festival')}
					>
						{(isHovered, isActive) => (
							<FestivalLogoDesktop
								className="w-full overflow-visible"
								theme={getThemeColors(isHovered, isActive)}
							/>
						)}
					</NavItem>

					{/* BigBang */}
					<NavItem
						isActive={isActive('bigbang')}
						href={`/${locale}/bigbang`}
						className="py-1"
					>
						{(isHovered, isActive) => (
							<div className="w-full px-3">
								<BigBangLogo
									theme={getThemeColors(isHovered, isActive)}
									className="h-full w-full overflow-visible"
								/>
							</div>
						)}
					</NavItem>
				</div>

				{/* Bottom Controls */}
				<div className="flex h-auto w-full items-center justify-between rounded-md p-1 lg:gap-0">
					<div className="flex items-center justify-center">
						<ThemeSwitch />
						<LocaleSwitcher />
					</div>
					<div className="flex items-center justify-center">
						<FaInstagram size={30} className="text-primary lg:p-1" />
						<FaFacebook size={30} className="text-primary lg:p-1" />
						<FaYoutube size={30} className="text-primary lg:p-1" />
					</div>

					{/* <span className="w-fit -rotate-3 rounded-md border-2 border-primary bg-primary px-2 py-0 text-xl font-medium leading-snug tracking-tighter text-dark">
						Contact
					</span> */}
				</div>
			</div>

			{/* Second Column */}
			<div className="flex h-full max-w-[var(--width-column-width)] flex-col space-y-1 p-1">
				<div className="no-scrollbar flex h-full w-full flex-col space-y-1 overflow-scroll rounded-md lg:pointer-events-auto">
					<NavItem
						isActive={isActive('memoire')}
						href={`/${locale}/memoire`}
						className="py-1"
					>
						{(isHovered, isActive) => (
							<div className="w-full px-3 py-4">
								<MemoireLogo
									theme={getThemeColors(isHovered, isActive)}
									className="h-full w-full overflow-visible"
								/>
							</div>
						)}
					</NavItem>

					{/* Fabrique */}
					<NavItem
						isActive={isActive('fabrique')}
						href={`/${locale}/fabrique`}
						className="px-3 py-4"
					>
						{(isHovered, isActive) => (
							<>
								{/* <div className="z-0 text-grayDark">
									<FabriqueBracketsIcon
										theme={{ fill: 'currentColor' }}
										className="group-hover:text-dark"
									/>
								</div> */}
								<FabriqueLogoDesktop
									theme={getThemeColors(isHovered, isActive)}
									className="z-10 overflow-visible"
								/>
							</>
						)}
					</NavItem>

					<NavItem
						isActive={isActive('equipe')}
						href={`/${locale}/equipe`}
						className="py-1"
					>
						{(isHovered, isActive) => (
							<div className="w-full px-3 py-4">
								<EquipeLogo
									theme={getThemeColors(isHovered, isActive)}
									className="h-full w-full overflow-visible"
								/>
							</div>
						)}
					</NavItem>
				</div>

				{/* Bottom Social and Contact */}
				<div className="flex h-[2.5rem] w-full items-center justify-between px-2">
					<span className="rounded-md border-0 border-primary text-base font-medium tracking-tighter text-primary">
						Mentions légales
					</span>
					<span className="rounded-md border-0 border-primary text-base font-medium tracking-tighter text-primary">
						Contact
					</span>
				</div>
			</div>
		</nav>
	)
}

export default NavBar
