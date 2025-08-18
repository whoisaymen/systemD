// 'use client'
// import { motion } from 'motion/react'
// import Link from 'next/link'

// import ThemeSwitch from '../ThemeSwitch'
// import LocaleSwitcher from './LocaleSwitcher'

// import MenuArrows from './MenuArrows'
// import Logo from './Logo'
// import BigBangLogo from '../bigbang/BigBangLogo'
// import FabriqueBracketsIcon from '../fabrique/FabriqueBracketsIcon'
// import FabriqueLogo from '../fabrique/FabriqueLogo'
// import FestivalSparklesIcon from '../festival/FestivalSparklesIcon'
// import HoverableItem from '../HoverableItem'
// import EquipeLogo from '../equipe/EquipeLogo'
// import FestivalLogo from '../festival/FestivalLogo'
// import MemoireLogo from '../memoire/MemoireLogo'

// import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'
// import MemoireLogoMobile from '../memoire/MemoireLogoMobile'
// import LogoShortAnimated from '../svgs/LogoShortAnimated'
// import FabriqueLogoMobile from '../fabrique/FabriqueLogoMobile'
// import FestivalLogoDesktop from '../festival/FestivalLogoDesktop'
// import FabriqueLogoDesktop from '../fabrique/FabriqueLogoDesktop'

// const NavBar = ({ locale }: { locale: string }) => {
// 	return (
// 		<nav className="fixed left-0 top-0 hidden h-svh w-full items-start justify-between overflow-hidden bg-cover bg-center text-center text-xl font-black tracking-tighter text-black lg:flex">
// 			<div className="flex h-full max-w-[var(--width-column-width)] flex-col space-y-1 p-1">
// 				<Link
// 					href="/"
// 					className="group h-auto w-full rounded-md border-0 border-dark hover:bg-dark"
// 				>
// 					{/* <Logo className="text-dark group-hover:text-primary" /> */}
// 					<LogoShortAnimated
// 						// theme={{ fill: 'var(--color-dark)' }}
// 						className={`m-1 mb-0 inline-block h-auto w-full -rotate-0 rounded-md text-primary lg:w-[15rem]`}
// 					/>
// 				</Link>

// 				<div className="no-scrollbar flex h-full w-full flex-col space-y-1 overflow-scroll rounded-md">
// 					<HoverableItem className="flex h-full w-full grow-[4] px-1">
// 						{(isHovered) => {
// 							const themeColors = {
// 								dark: {
// 									fill: isHovered
// 										? 'var(--color-grayDark)'
// 										: 'var(--color-grayDark)',
// 									stroke: isHovered ? 'var(--color-dark)' : 'var(--color-dark)',
// 									icon: 'var(--color-primary)',
// 								},
// 								light: {
// 									fill: isHovered
// 										? 'var(--color-primary)'
// 										: 'var(--color-primary)',
// 									stroke: isHovered
// 										? 'var(--color-dark)'
// 										: 'var(--color-grayDark)',
// 								},
// 							}

// 							const themeColorsIcon = {
// 								dark: {
// 									fill: isHovered
// 										? 'var(--color-primary)'
// 										: 'var(--color-grayDark)',
// 									icon: 'var(--color-grayDark)',
// 									// stroke: isHovered ? 'var(--color-dark)' : 'var(--color-dark)',
// 								},
// 								light: {
// 									fill: isHovered
// 										? 'var(--color-dark)'
// 										: 'var(--color-grayDark)',
// 								},
// 							}

// 							return (
// 								<Link
// 									href={`/${locale}/festival`}
// 									className="to-grayDark/25 dark:to-grayDark/25 relative flex h-auto w-full cursor-pointer items-center justify-center rounded-md bg-gradient-to-b from-grayLight p-8 shadow-inner dark:bg-grayDark dark:from-dark"
// 								>
// 									<MenuArrows className="absolute right-2 top-2 text-grayDark" />
// 									<div className="">
// 										<FestivalLogoDesktop
// 											className="z-0 hidden w-full dark:block"
// 											theme={themeColors.dark}
// 										/>
// 										{/* <FestivalLogo
// 											className="z-0 w-full dark:hidden"
// 											theme={themeColors.light}
// 										/> */}
// 									</div>

// 									{/* <div className="z-0 text-grayDark">
// 										<FestivalSparklesIcon
// 											theme={themeColorsIcon.dark}
// 											className="z-50 hidden dark:block"
// 										/>
// 										<FestivalSparklesIcon
// 											theme={themeColorsIcon.light}
// 											className="z-50 dark:hidden"
// 										/>
// 									</div> */}
// 								</Link>
// 							)
// 						}}
// 					</HoverableItem>

// 					<HoverableItem className="flex h-full w-full grow">
// 						{(isHovered) => {
// 							const themeColors = {
// 								dark: {
// 									fill: isHovered
// 										? 'var(--color-grayDark)'
// 										: 'var(--color-grayDark)',
// 									stroke: isHovered ? 'var(--color-dark)' : 'var(--color-dark)',
// 									icon: isHovered
// 										? 'var(--color-primary)'
// 										: 'var(--color-grayDark)',
// 								},
// 								light: {
// 									fill: isHovered
// 										? 'var(--color-primary)'
// 										: 'var(--color-primary)',
// 									stroke: isHovered
// 										? 'var(--color-dark)'
// 										: 'var(--color-grayDark)',
// 									icon: isHovered
// 										? 'var(--color-dark)'
// 										: 'var(--color-grayDark)',
// 								},
// 							}

// 							return (
// 								<Link
// 									href={`/${locale}/bigbang`}
// 									className="to-grayDark/25 dark:to-grayDark/25 flex h-full w-full cursor-pointer overflow-hidden rounded-md bg-gradient-to-b from-grayLight py-1 shadow-inner dark:bg-grayDark dark:from-dark"
// 								>
// 									<div className="relative flex cursor-pointer items-center justify-center rounded-md border-dark">
// 										<MenuArrows className="absolute right-2 top-2 text-grayDark" />
// 										<div className="h-auto w-auto w-full items-center px-3">
// 											<BigBangLogo
// 												theme={themeColors.dark}
// 												className="hidden h-full w-full dark:block"
// 											/>
// 											<BigBangLogo
// 												theme={themeColors.light}
// 												className="w-full dark:hidden"
// 											/>
// 										</div>
// 									</div>
// 								</Link>
// 							)
// 						}}
// 					</HoverableItem>
// 				</div>
// 				<div className="flex h-auto w-full items-center justify-start rounded-md p-1 lg:gap-1">
// 					<ThemeSwitch />
// 					<LocaleSwitcher />
// 					<FaInstagram size={40} className="text-primary" />
// 					<span className="rounded-md border-[3px] border-primary bg-dark px-2 py-0 pr-6 text-2xl font-bold uppercase italic tracking-tighter text-primary">
// 						Contact
// 					</span>
// 				</div>
// 			</div>

// 			{/* Second Column */}
// 			<div className="flex h-full max-w-[var(--width-column-width)] flex-col space-y-1 p-1">
// 				<div className="no-scrollbar flex h-full w-full flex-col space-y-1 overflow-scroll rounded-md">
// 					<Link
// 						href={`/${locale}/memoire`}
// 						className="group flex grow cursor-pointer rounded-md"
// 					>
// 						<HoverableItem>
// 							{(isHovered) => {
// 								const themeColors = {
// 									dark: {
// 										fill: isHovered
// 											? 'var(--color-grayDark)'
// 											: 'var(--color-grayDark)',
// 										icon: isHovered
// 											? 'var(--color-primary)'
// 											: 'var(--color-grayDark)',
// 										stroke: isHovered
// 											? 'var(--color-dark)'
// 											: 'var(--color-dark)',
// 									},
// 									light: {
// 										fill: isHovered
// 											? 'var(--color-primary)'
// 											: 'var(--color-primary)',
// 										icon: isHovered
// 											? 'var(--color-dark)'
// 											: 'var(--color-grayDark)',
// 										stroke: isHovered
// 											? 'var(--color-dark)'
// 											: 'var(--color-grayDark)',
// 									},
// 								}
// 								return (
// 									<div className="to-grayDark/25 dark:to-grayDark/25 relative h-full w-full cursor-pointer rounded-md bg-primary bg-gradient-to-b from-grayLight px-2 py-4 shadow-inner dark:from-dark">
// 										<MenuArrows className="absolute right-2 top-2 z-50 text-grayDark hover:scale-105" />
// 										<div className="flex h-full items-center justify-center">
// 											<MemoireLogo
// 												theme={themeColors.dark}
// 												className="w-full"
// 											/>
// 											{/* <MemoireLogo
// 												theme={themeColors.light}
// 												className="w-full"
// 											/> */}
// 										</div>
// 									</div>
// 								)
// 							}}
// 						</HoverableItem>
// 					</Link>

// 					<HoverableItem className="flex h-full w-full grow">
// 						{(isHovered) => {
// 							const themeColors = {
// 								dark: {
// 									fill: isHovered
// 										? 'var(--color-grayDark)'
// 										: 'var(--color-grayDark)',
// 									stroke: isHovered ? 'var(--color-dark)' : 'var(--color-dark)',
// 									icon: isHovered
// 										? 'var(--color-primary)'
// 										: 'var(--color-grayDark)',
// 								},
// 								light: {
// 									fill: isHovered
// 										? 'var(--color-primary)'
// 										: 'var(--color-primary)',
// 									stroke: isHovered
// 										? 'var(--color-dark)'
// 										: 'var(--color-grayDark)',
// 								},
// 							}

// 							return (
// 								<Link
// 									href={`/${locale}/fabrique`}
// 									className="to-grayDark/25 dark:to-grayDark/25 relative flex h-auto w-full cursor-pointer items-center justify-center rounded-md bg-gradient-to-b from-grayLight p-1 px-3 shadow-inner dark:bg-grayDark dark:from-dark"
// 								>
// 									<MenuArrows className="absolute right-2 top-2 text-grayDark" />
// 									<div className="z-0 text-grayDark">
// 										<FabriqueBracketsIcon
// 											theme={{
// 												fill: 'currentColor',
// 											}}
// 											className="group-hover:text-dark group-hover:dark:text-primary"
// 										/>
// 									</div>
// 									<FabriqueLogoDesktop
// 										theme={themeColors.dark}
// 										className="z-10"
// 									/>
// 									{/* <FabriqueLogo
// 										theme={themeColors.dark}
// 										className="z-10 hidden w-[45%] dark:block"
// 									/> */}
// 								</Link>
// 							)
// 						}}
// 					</HoverableItem>

// 					<Link
// 						href={`/${locale}/equipe`}
// 						className="group relative w-full grow cursor-pointer rounded-md"
// 					>
// 						<HoverableItem className="to-grayDark/25 flex h-full w-full items-center justify-center rounded-md border-0 border-primary bg-primary bg-gradient-to-b from-dark py-1 py-12 shadow-inner">
// 							{(isHovered) => {
// 								const themeColors = {
// 									dark: {
// 										fill: isHovered
// 											? 'var(--color-grayDark)'
// 											: 'var(--color-grayDark)',
// 										icon: isHovered
// 											? 'var(--color-primary)'
// 											: 'var(--color-grayDark)',
// 										text: isHovered ? '' : '',
// 										stroke: 'var(--color-dark)',
// 									},
// 									light: {
// 										fill: isHovered
// 											? 'var(--color-primary)'
// 											: 'var(--color-primary)',
// 										stroke: isHovered
// 											? 'var(--color-dark)'
// 											: 'var(--color-grayDark)',
// 										icon: isHovered
// 											? 'var(--color-dark)'
// 											: 'var(--color-grayDark)',
// 										text: isHovered
// 											? 'var(--color-dark)'
// 											: 'var(--color-grayDark',
// 									},
// 								}
// 								return (
// 									<div className="flex items-center justify-center rounded-md p-4">
// 										<MenuArrows className="absolute right-2 top-2 text-grayDark" />
// 										<EquipeLogo theme={themeColors.dark} className="w-full" />
// 										{/* <EquipeLogo
// 											theme={themeColors.light}
// 											className="w-full dark:hidden"
// 										/> */}
// 									</div>
// 								)
// 							}}
// 						</HoverableItem>
// 					</Link>
// 				</div>

// 				<div className="flex h-[2.5rem] w-full items-center justify-between rounded-md bg-grayDark px-2">
// 					<div className="flex items-center gap-2">
// 						<FaInstagram className="text-dark" />
// 						<FaFacebook className="text-dark" />
// 						<FaYoutube className="text-dark" />
// 					</div>
// 					<Link
// 						href={`/${locale}/contact`}
// 						className="bg-primary px-2 text-center text-base font-semibold tracking-tighter text-dark shadow-sm"
// 					>
// 						Contact
// 					</Link>
// 				</div>
// 			</div>
// 		</nav>
// 	)
// }

// export default NavBar

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

// Theme configuration
const getThemeColors = (isHovered: boolean) => ({
	fill: isHovered ? 'var(--color-primary)' : 'var(--color-primary)',
	stroke: isHovered ? 'var(--color-dark)' : 'var(--color-dark)',
	icon: isHovered ? 'var(--color-primary)' : 'var(--color-dark)',
})

// Type for render function
type RenderFunction = (isHovered: boolean) => React.ReactNode

// Reusable components
const NavItem = ({
	href,
	children,
	className = '',
	growClass = 'grow',
}: {
	href: string
	children: RenderFunction
	className?: string
	growClass?: string
}) => (
	<HoverableItem className={`flex h-auto w-full ${growClass}`}>
		{(isHovered) => (
			<Link
				href={href}
				className={`to-grayDark/25 relative flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-gradient-to-b from-primary shadow-inner ${className}`}
			>
				<MenuArrows className="absolute right-2 top-2 text-grayDark" />
				{children(isHovered)}
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
					>
						{(isHovered) => (
							<FestivalLogoDesktop
								className="w-full"
								theme={getThemeColors(isHovered)}
							/>
						)}
					</NavItem>

					{/* BigBang */}
					<NavItem href={`/${locale}/bigbang`} className="py-1">
						{(isHovered) => (
							<div className="w-full px-3">
								<BigBangLogo
									theme={getThemeColors(isHovered)}
									className="h-full w-full"
								/>
							</div>
						)}
					</NavItem>
				</div>

				{/* Bottom Controls */}
				<div className="flex h-auto w-full items-center justify-start rounded-md p-1 lg:gap-0">
					<ThemeSwitch />
					<LocaleSwitcher />
					<FaInstagram size={40} className="text-primary lg:p-1" />
					<span className="w-fit -rotate-3 rounded-md border-2 border-primary bg-primary px-2 py-0 text-xl font-medium leading-snug tracking-tighter text-dark">
						Contact
					</span>
				</div>
			</div>

			{/* Second Column */}
			<div className="flex h-full max-w-[var(--width-column-width)] flex-col space-y-1 p-1">
				<div className="no-scrollbar flex h-full w-full flex-col space-y-1 overflow-scroll rounded-md lg:pointer-events-auto">
					{/* Memoire */}
					{/* <Link
						href={`/${locale}/memoire`}
						className="group flex grow cursor-pointer rounded-md"
					>
						<HoverableItem>
							{(isHovered) => (
								<div className="to-grayDark/25 relative h-full w-full cursor-pointer rounded-md bg-primary bg-gradient-to-b from-grayLight px-2 py-4 shadow-inner">
									<MenuArrows className="absolute right-2 top-2 z-50 text-grayDark hover:scale-105" />
									<div className="flex h-full items-center justify-center">
										<MemoireLogo
											theme={getThemeColors(isHovered)}
											className="w-full"
										/>
									</div>
								</div>
							)}
						</HoverableItem>
					</Link> */}
					<NavItem href={`/${locale}/memoire`} className="py-1">
						{(isHovered) => (
							<div className="w-full px-3 py-4">
								<MemoireLogo
									theme={getThemeColors(isHovered)}
									className="h-full w-full"
								/>
							</div>
						)}
					</NavItem>

					{/* Fabrique */}
					<NavItem href={`/${locale}/fabrique`} className="px-3 py-4">
						{(isHovered) => (
							<>
								<div className="z-0 text-grayDark">
									<FabriqueBracketsIcon
										theme={{ fill: 'currentColor' }}
										className="group-hover:text-dark"
									/>
								</div>
								<FabriqueLogoDesktop
									theme={getThemeColors(isHovered)}
									className="z-10"
								/>
							</>
						)}
					</NavItem>

					{/* Equipe */}
					{/* <Link
						href={`/${locale}/equipe`}
						className="group relative w-full grow cursor-pointer rounded-md"
					>
						<HoverableItem className="to-grayDark/25 flex h-full w-full items-center justify-center rounded-md border-0 border-primary bg-primary bg-gradient-to-b from-dark py-12 shadow-inner">
							{(isHovered) => (
								<div className="flex items-center justify-center rounded-md p-4">
									<MenuArrows className="absolute right-2 top-2 text-grayDark" />
									<EquipeLogo
										theme={getThemeColors(isHovered)}
										className="w-full"
									/>
								</div>
							)}
						</HoverableItem>
					</Link> */}
					<NavItem href={`/${locale}/equipe`} className="py-1">
						{(isHovered) => (
							<div className="w-full px-3 py-4">
								<EquipeLogo
									theme={getThemeColors(isHovered)}
									className="h-full w-full"
								/>
							</div>
						)}
					</NavItem>
				</div>

				{/* Bottom Social and Contact */}
				<div className="flex h-[2.5rem] w-full items-center justify-between px-2">
					{/* <SocialIcons />
					<Link
						href={`/${locale}/contact`}
						className="bg-primary px-2 text-center text-base font-semibold tracking-tighter text-dark shadow-sm"
					>
						Contact
					</Link> */}

					<FaInstagram size={40} className="text-primary" />
					<span className="w-fit -rotate-3 rounded-md border-2 border-primary bg-primary px-2 text-xl font-medium tracking-tighter text-dark">
						Contact
					</span>
				</div>
			</div>
		</nav>
	)
}

export default NavBar
