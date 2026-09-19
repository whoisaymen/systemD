// 'use client'
// import { motion } from 'motion/react'
// import Link from 'next/link'

// import ThemeSwitch from '../ThemeSwitch'
// import LocaleSwitcher from './LocaleSwitcher'
// import MenuArrows from './MenuArrows'
// import BigBangLogo from '../bigbang/BigBangLogo'
// import FabriqueBracketsIcon from '../fabrique/FabriqueBracketsIcon'
// import FestivalSparklesIcon from '../festival/FestivalSparklesIcon'
// import HoverableItem from '../HoverableItem'
// import EquipeLogo from '../equipe/EquipeLogo'
// import MemoireLogo from '../memoire/MemoireLogo'
// import LogoShortAnimated from '../svgs/LogoShortAnimated'
// import FabriqueLogoDesktop from '../fabrique/FabriqueLogoDesktop'
// import FestivalLogoDesktop from '../festival/FestivalLogoDesktop'
// import { useTransition, useState } from 'react'

// import { FaFacebook, FaInstagram, FaVimeo, FaYoutube } from 'react-icons/fa'
// import { usePathname } from 'next/navigation'

// // Theme configuration
// const getThemeColors = (isHovered: boolean, isActive: boolean = false) => ({
// 	fill: isHovered ? 'var(--color-primary)' : 'var(--color-primary)',
// 	stroke: isHovered ? 'var(--color-dark)' : 'var(--color-dark)',
// 	icon: isActive
// 		? 'var(--color-primary)'
// 		: isHovered
// 			? 'var(--color-primary)'
// 			: 'var(--color-dark)',
// })

// // Type for render function
// type RenderFunction = (isHovered: boolean, isActive: boolean) => React.ReactNode

// // Reusable components
// const NavItem = ({
// 	href,
// 	children,
// 	className = '',
// 	growClass = 'grow',
// 	isActive = false,
// }: {
// 	href: string
// 	children: RenderFunction
// 	className?: string
// 	growClass?: string
// 	isActive?: boolean
// }) => (
// 	<HoverableItem className={`flex h-auto w-full ${growClass}`}>
// 		{(isHovered) => (
// 			<Link
// 				href={href}
// 				className={`relative flex h-full w-full cursor-pointer items-center justify-center rounded-md shadow-inner ${
// 					isActive
// 						? 'shadowtest border-0 border-r-0 bg-dark lg:relative lg:z-50'
// 						: 'to-grayDark/25 shadowtest bg-gradient-to-b from-primary shadow-inner'
// 				} ${className}`}
// 			>
// 				{/* <MenuArrows className="absolute right-2 top-2 text-grayDark" /> */}
// 				{children(isHovered, isActive)}
// 			</Link>
// 		)}
// 	</HoverableItem>
// )

// const SocialIcons = ({ className = '' }: { className?: string }) => (
// 	<div className={`flex items-center gap-2 ${className}`}>
// 		<FaInstagram className="text-dark" />
// 		<FaFacebook className="text-dark" />
// 		<FaYoutube className="text-dark" />
// 	</div>
// )

// const NavBar = ({ locale }: { locale: string }) => {
// 	const pathname = usePathname()

// 	const isActive = (path: string) => {
// 		const routePath = `/${locale}/${path}`
// 		if (path === 'memoire') {
// 			// Active if on /[locale]/memoire or /[locale]/festival/[edition]
// 			const festivalEditionRegex = new RegExp(`^/${locale}/festival/\\d{4}$`)
// 			return pathname === routePath || festivalEditionRegex.test(pathname)
// 		}
// 		return pathname === routePath
// 	}

// 	return (
// 		<nav className="fixed left-0 top-0 hidden h-svh w-full items-start justify-between overflow-hidden bg-cover bg-center text-center text-xl font-black tracking-tighter text-dark lg:pointer-events-none lg:flex">
// 			{/* First Column */}
// 			<div className="flex h-full max-w-[var(--width-column-width)] flex-col space-y-1 p-1 lg:pointer-events-auto">
// 				{/* Logo */}
// 				<Link
// 					href="/"
// 					className="group h-auto w-full rounded-md border-0 border-dark hover:bg-dark"
// 				>
// 					<LogoShortAnimated className="m-1 mb-0 inline-block h-auto w-full rounded-md text-primary lg:w-[15rem]" />
// 				</Link>

// 				{/* Navigation Items */}
// 				<div className="no-scrollbar flex h-full w-full flex-col space-y-1 overflow-scroll rounded-md">
// 					{/* Festival */}
// 					<NavItem
// 						href={`/${locale}/festival`}
// 						growClass="grow-[4]"
// 						className="p-8 transition-all duration-300 [@media(max-height:900px)]:p-4"
// 						isActive={isActive('festival')}
// 					>
// 						{(isHovered, isActive) => (
// 							<FestivalLogoDesktop
// 								className="w-full overflow-visible"
// 								theme={getThemeColors(isHovered, isActive)}
// 							/>
// 						)}
// 					</NavItem>

// 					{/* BigBang */}
// 					<NavItem
// 						isActive={isActive('bigbang')}
// 						href={`/${locale}/bigbang`}
// 						className="py-1"
// 					>
// 						{(isHovered, isActive) => (
// 							<div className="w-full px-3">
// 								<BigBangLogo
// 									theme={getThemeColors(isHovered, isActive)}
// 									className="h-full w-full overflow-visible"
// 								/>
// 							</div>
// 						)}
// 					</NavItem>
// 				</div>

// 				{/* Bottom Controls */}
// 				<div className="flex h-auto w-full items-center justify-between rounded-md p-1 lg:gap-0 lg:px-2">
// 					{/* <div className="flex items-center justify-center"> */}
// 					<FaVimeo size={30} className="text-primary lg:p-1" />

// 					<FaYoutube size={36} className="text-primary lg:p-1" />
// 					<FaFacebook size={30} className="text-primary lg:p-1" />
// 					<FaInstagram size={30} className="text-primary lg:p-1" />

// 					<span className="rounded-md bg-primary px-1 py-0 text-base font-medium tracking-tight text-dark">
// 						Contact
// 					</span>
// 					{/* </div> */}
// 					{/* <span className="w-fit -rotate-3 rounded-md border-2 border-primary bg-primary px-2 py-0 text-xl font-medium leading-snug tracking-tighter text-dark">
// 						Contact
// 					</span> */}
// 				</div>
// 			</div>

// 			{/* Second Column */}
// 			<div className="flex h-full max-w-[var(--width-column-width)] flex-col space-y-1 p-1">
// 				<div className="no-scrollbar flex h-full w-full flex-col space-y-1 overflow-scroll rounded-md lg:pointer-events-auto">
// 					<NavItem
// 						isActive={isActive('memoire')}
// 						href={`/${locale}/memoire`}
// 						className="py-1"
// 					>
// 						{(isHovered, isActive) => (
// 							<div className="w-full px-3 py-4">
// 								<MemoireLogo
// 									theme={getThemeColors(isHovered, isActive)}
// 									className="h-full w-full overflow-visible"
// 								/>
// 							</div>
// 						)}
// 					</NavItem>

// 					{/* Fabrique */}
// 					<NavItem
// 						isActive={isActive('fabrique')}
// 						href={`/${locale}/fabrique`}
// 						className="px-3 py-4"
// 					>
// 						{(isHovered, isActive) => (
// 							<>
// 								{/* <div className="z-0 text-grayDark">
// 									<FabriqueBracketsIcon
// 										theme={{ fill: 'currentColor' }}
// 										className="group-hover:text-dark"
// 									/>
// 								</div> */}
// 								<FabriqueLogoDesktop
// 									theme={getThemeColors(isHovered, isActive)}
// 									className="z-10 overflow-visible"
// 								/>
// 							</>
// 						)}
// 					</NavItem>

// 					<NavItem
// 						isActive={isActive('equipe')}
// 						href={`/${locale}/equipe`}
// 						className="py-1"
// 					>
// 						{(isHovered, isActive) => (
// 							<div className="w-full px-3 py-4">
// 								<EquipeLogo
// 									theme={getThemeColors(isHovered, isActive)}
// 									className="h-full w-full overflow-visible"
// 								/>
// 							</div>
// 						)}
// 					</NavItem>
// 				</div>

// 				{/* Bottom Social and Contact */}
// 				<div className="flex h-[2.5rem] w-full items-center justify-between px-2 lg:pointer-events-auto">
// 					<span className="rounded-md bg-primary px-1 py-0 text-base font-medium tracking-tight text-dark">
// 						Legal label
// 					</span>
// 					{/* <div className="flex items-center justify-center"> */}
// 					<ThemeSwitch />
// 					<LocaleSwitcher />
// 					{/* </div> */}
// 				</div>
// 			</div>
// 		</nav>
// 	)
// }

// export default NavBar

'use client'

import type { ReactNode } from 'react'
import { useEffect, useState, useTransition } from 'react'
import { useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

import ThemeSwitch from '../ThemeSwitch'
import LocaleSwitcher from './LocaleSwitcher'
import BigBangLogo from '../bigbang/BigBangLogo'
import HoverableItem from '../HoverableItem'
import EquipeLogo from '../equipe/EquipeLogo'
import MemoireLogo from '../memoire/MemoireLogo'
import LogoShortAnimated from '../svgs/LogoShortAnimated'
import FabriqueLogoDesktop from '../fabrique/FabriqueLogoDesktop'
import FestivalLogoDesktop from '../festival/FestivalLogoDesktop'
import SocialLinks from '@/ui/SocialLinks'
import type { ThemeCombo } from '@/lib/theme'
import SectionFolderSurface, { type FolderSection } from './SectionFolderSurface'

import { MdContactSupport } from 'react-icons/md'
import Loading from '@/app/(frontend)/[locale]/loading'
import { SKIP_HOME_INTRO_KEY } from '@/components/homepage/HomepageVideoIntro'

// Theme configuration
const getThemeColors = (isHovered: boolean, isActive: boolean = false) => {
	const idleFill = 'var(--color-menu-item-idle-fill, var(--color-dark))'
	const idleStroke = 'var(--color-menu-item-idle-stroke, var(--color-dark))'
	const hoverFill = 'var(--color-menu-item-hover-fill, var(--color-primary))'
	const activeFill = 'var(--color-menu-item-active-fill, var(--color-primary))'
	const activeHoverFill = `var(--color-menu-item-active-hover-fill, ${hoverFill})`

	return {
		fill: 'var(--color-primary)',
		stroke: isActive ? 'var(--color-dark)' : idleStroke,
		iconStroke: 'var(--color-menu-item-icon-stroke, var(--color-dark))',
		icon: isHovered
			? isActive
				? activeHoverFill
				: hoverFill
			: isActive
				? activeFill
				: idleFill,
	}
}

const HOME_INTRO_EASE = 'cubic-bezier(0.76, 0, 0.24, 1)'
const HOME_VIDEO_EXPANDED_EVENT = 'homepage-video-expanded-change'

const normalizeNavHref = (href: string) => href.replace(/\/$/, '')

// Type for render function
type RenderFunction = (
	shouldAnimate: boolean,
	isActive: boolean,
	isHovered: boolean,
) => ReactNode

// NavBar component (contains a local NavItem that uses transition+router)
const NavBar = ({
	locale,
	social,
	themes,
}: {
	locale: string
	social?: Sanity.Navigation
	themes?: ThemeCombo[]
}) => {
	const router = useRouter()
	const pathname = usePathname()
	const tMenu = useTranslations('menu')
	const reduceMotion = useReducedMotion()
	const shouldReduceMotion = reduceMotion === true
	const normalizedPathname = pathname.replace(/\/$/, '')
	const isHomeRoute = normalizedPathname === `/${locale}`

	// transition + loading state
	const [, startTransition] = useTransition()
	const [isLoading, setIsLoading] = useState(false)
	const [pendingHref, setPendingHref] = useState<string | null>(null)
	const [isHomeVideoExpanded, setIsHomeVideoExpanded] = useState(true)
	const displayedPathname = pendingHref ?? normalizedPathname
	const isMemoireRoute =
		displayedPathname === `/${locale}/memoire` ||
		new RegExp(`^/${locale}/festival/\\d{4}$`).test(displayedPathname)
	const isFestivalRoute = displayedPathname === `/${locale}/festival`
	const isBigBangRoute = displayedPathname === `/${locale}/bigbang`
	const isFabriqueRoute = displayedPathname === `/${locale}/fabrique`
	const isEquipeRoute = displayedPathname === `/${locale}/equipe`

	// Keep the destination surface until that navigation has committed.
	useEffect(() => {
		if (pendingHref !== normalizedPathname) return
		setIsLoading(false)
		setPendingHref(null)
	}, [normalizedPathname, pendingHref])

	useEffect(() => {
		if (!isHomeRoute) {
			setIsHomeVideoExpanded(false)
			return
		}

		const homepageVideoExpanded =
			document.documentElement.dataset.homepageVideoExpanded
		setIsHomeVideoExpanded(homepageVideoExpanded !== 'false')

		const handleHomepageVideoState = (event: Event) => {
			setIsHomeVideoExpanded(
				(event as CustomEvent<{ expanded: boolean }>).detail.expanded,
			)
		}

		window.addEventListener(HOME_VIDEO_EXPANDED_EVENT, handleHomepageVideoState)

		return () => {
			window.removeEventListener(
				HOME_VIDEO_EXPANDED_EVENT,
				handleHomepageVideoState,
			)
		}
	}, [isHomeRoute])

	// Route active helper (kept identical to your logic)
	const isActive = (path: string) => {
		const routePath = `/${locale}/${path}`
		if (path === 'memoire') {
			const festivalEditionRegex = new RegExp(`^/${locale}/festival/\\d{4}$`)
			return pathname === routePath || festivalEditionRegex.test(pathname)
		}
		return pathname === routePath
	}

	// Local NavItem component (keeps same props and children API)
	const NavItem = ({
		href,
		label,
		children,
		className = '',
		isActive: active = false,
		folderTab,
	}: {
		href: string
		label: string
		children: RenderFunction
		className?: string
		isActive?: boolean
		folderTab?: FolderSection
	}) => {
		const navHref = normalizeNavHref(href)
		const effectiveActive = pendingHref ? pendingHref === navHref : active

		return (
			<HoverableItem className="flex min-h-0 w-full">
				{(isHovered) => {
					const shouldShowAnimatedState = isHovered || effectiveActive

					return (
						<Link
							href={href}
							aria-label={label}
							aria-current={effectiveActive ? 'page' : undefined}
							onClick={(event) => {
								if (
									event.metaKey ||
									event.ctrlKey ||
									event.shiftKey ||
									event.altKey
								) {
									return
								}

								event.preventDefault()
								if (navHref === normalizedPathname) return

								setPendingHref(navHref)
								setIsLoading(true)
								startTransition(() => {
									router.push(href)
								})
							}}
							className={`theme-menu-item relative flex h-full w-full cursor-pointer items-center justify-center rounded-md shadow-inner transition-colors duration-200 ${
								effectiveActive
									? `shadowtest ${folderTab ? `section-folder-tab section-folder-tab--${folderTab}` : ''} bg-dark lg:relative lg:z-50`
									: 'theme-menu-card-gradient shadowtest bg-dark bg-gradient-to-b from-primary to-grayDark/25 shadow-inner'
							} ${className}`}
						>
							{children(shouldShowAnimatedState, !!effectiveActive, isHovered)}
						</Link>
					)
				}}
			</HoverableItem>
		)
	}

	const shouldHideHomeNav = isHomeRoute && isHomeVideoExpanded
	const homeNavTransitionDuration =
		isHomeRoute && !shouldReduceMotion ? 'duration-[1000ms]' : 'duration-0'
	const folderSection: FolderSection | null = isFestivalRoute ? 'festival'
		: isBigBangRoute ? 'bigbang'
		: isMemoireRoute ? 'memoire'
		: isFabriqueRoute ? 'fabrique'
		: isEquipeRoute ? 'equipe' : null

	return (
		<>
			{folderSection && (
				<SectionFolderSurface key={folderSection} section={folderSection} />
			)}
			<nav className="desktop-navigation fixed left-0 top-0 hidden h-svh w-full items-start justify-between overflow-hidden bg-cover bg-center text-center text-xl font-black tracking-tighter text-dark lg:pointer-events-none lg:flex">
				{/* First Column */}
				<div
					style={{
						transformOrigin: 'left center',
						transitionTimingFunction: HOME_INTRO_EASE,
					}}
					className={`flex h-full min-h-0 w-[var(--width-column-width)] shrink-0 flex-col space-y-1 p-1 transition-[opacity,transform] lg:pointer-events-auto ${homeNavTransitionDuration} ${
						shouldHideHomeNav
							? '-translate-x-full opacity-0'
							: 'translate-x-0 opacity-100'
					}`}
				>
					{/* Logo */}
					<Link
						href="/"
						onClick={() => {
							if (!isHomeRoute) {
								window.sessionStorage.setItem(SKIP_HOME_INTRO_KEY, 'true')
								document.documentElement.dataset.homepageVideoExpanded = 'false'
								setIsHomeVideoExpanded(false)
							}
						}}
						className="group block w-full shrink-0 rounded-md border-0 border-dark px-2 py-1 transition-opacity hover:opacity-80"
					>
						<LogoShortAnimated className="block h-auto w-full rounded-md text-primary" />
					</Link>

					{/* Navigation Items */}
					<div className="desktop-menu-left grid min-h-0 flex-1 grid-rows-[minmax(0,2fr)_minmax(0,1fr)] gap-1 rounded-md">
						{/* Festival */}
						<NavItem
							href={`/${locale}/festival`}
							label="Festival"
							isActive={isActive('festival')}
							folderTab={isFestivalRoute ? 'festival' : undefined}
						>
							{(shouldAnimate, isActive, isHovered) => (
								<div className="menu-artwork">
									<FestivalLogoDesktop
										className="w-full overflow-visible"
										theme={getThemeColors(isHovered, isActive)}
										forceHovered={shouldAnimate}
									/>
								</div>
							)}
						</NavItem>

						{/* BigBang */}
						<NavItem
							isActive={isActive('bigbang')}
							href={`/${locale}/bigbang`}
							label="Big Bang"
							folderTab={isBigBangRoute ? 'bigbang' : undefined}
						>
							{(shouldAnimate, isActive, isHovered) => (
								<div className="menu-artwork">
									<BigBangLogo
										theme={getThemeColors(isHovered, isActive)}
										className="h-full w-full overflow-visible"
										forceHovered={shouldAnimate}
									/>
								</div>
							)}
						</NavItem>
					</div>
				</div>

				{/* Second Column */}
				<div
					style={{
						transformOrigin: 'right center',
						transitionTimingFunction: HOME_INTRO_EASE,
					}}
					className={`flex h-full min-h-0 w-[var(--width-column-width)] shrink-0 flex-col space-y-1 p-1 transition-[opacity,transform] ${homeNavTransitionDuration} ${
						shouldHideHomeNav
							? 'translate-x-full opacity-0'
							: 'translate-x-0 opacity-100'
					}`}
				>
					<div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1.2fr)_minmax(0,2.1fr)_minmax(0,1fr)] gap-1 rounded-md lg:pointer-events-auto">
						<NavItem
							isActive={isActive('memoire')}
							folderTab={isMemoireRoute ? 'memoire' : undefined}
							href={`/${locale}/memoire`}
							label="Mémoire"
						>
							{(shouldAnimate, isActive, isHovered) => (
								<div className="menu-artwork">
									<MemoireLogo
										theme={getThemeColors(isHovered, isActive)}
										className="h-full w-full overflow-visible"
										forceHovered={shouldAnimate}
									/>
								</div>
							)}
						</NavItem>

						{/* Fabrique */}
						<NavItem
							isActive={isActive('fabrique')}
							href={`/${locale}/fabrique`}
							label="Fabrique"
							folderTab={isFabriqueRoute ? 'fabrique' : undefined}
						>
							{(shouldAnimate, isActive, isHovered) => (
								<div className="menu-artwork">
									<FabriqueLogoDesktop
										theme={getThemeColors(isHovered, isActive)}
										className="z-10 overflow-visible"
										forceHovered={shouldAnimate}
									/>
								</div>
							)}
						</NavItem>

						<NavItem
							isActive={isActive('equipe')}
							href={`/${locale}/equipe`}
							label="Équipe"
							folderTab={isEquipeRoute ? 'equipe' : undefined}
						>
							{(shouldAnimate, isActive, isHovered) => (
								<div className="menu-artwork">
									<EquipeLogo
										theme={getThemeColors(isHovered, isActive)}
										className="h-full w-full overflow-visible"
										forceHovered={shouldAnimate}
									/>
								</div>
							)}
						</NavItem>
					</div>

					{/* Bottom links and controls */}
					<div className="desktop-menu-controls flex h-8 w-full shrink-0 items-center justify-between px-1 lg:pointer-events-auto">
						<div className="flex h-full items-center">
							<LocaleSwitcher />
							<ThemeSwitch themes={themes} />
							<Link
								href={`/${locale}/contact`}
								aria-label={tMenu('contact')}
								aria-current={isActive('contact') ? 'page' : undefined}
								className={`flex items-center justify-center text-primary transition-colors hover:text-grayDark ${
									isActive('contact') ? 'text-grayDark' : ''
								}`}
							>
								<MdContactSupport aria-hidden="true" className="h-7 w-7" />
							</Link>
						</div>
						<SocialLinks
							social={social}
							className="flex items-center text-primary"
							linkClassName="flex shrink-0 items-center justify-center text-primary transition-colors hover:text-grayDark"
							iconClassName="h-[22px] w-[22px]"
						/>
					</div>
				</div>
			</nav>

			{/* Global loader overlay (shows instantly when user clicks a NavItem) */}
			{isLoading && (
				<div className="navigation-loading-overlay fixed inset-0 z-[45] hidden lg:flex lg:items-center lg:justify-center lg:px-[var(--width-column-width)]" aria-busy="true">
					<Loading />
				</div>
			)}
		</>
	)
}

export default NavBar
