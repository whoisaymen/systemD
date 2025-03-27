'use client'
import { motion } from 'motion/react'
import Link from 'next/link'

import ThemeSwitch from '../ThemeSwitch'
import LocaleSwitcher from './LocaleSwitcher'

import MenuArrows from './MenuArrows'
import Logo from './Logo'
import BigBangLogo from '../bigbang/BigBangLogo'
import FabriqueBracketsIcon from '../fabrique/FabriqueBracketsIcon'
import FabriqueLogo from '../fabrique/FabriqueLogo'
import FestivalSparklesIcon from '../festival/FestivalSparklesIcon'
import HoverableItem from '../HoverableItem'
import EquipeLogo from '../equipe/EquipeLogo'
import FestivalLogo from '../festival/FestivalLogo'
import MemoireLogo from '../memoire/MemoireLogo'

import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'

const NavBar = ({ locale }: { locale: string }) => {
	return (
		<nav className="fixed left-0 top-0 hidden h-svh w-full items-start justify-between overflow-hidden bg-cover bg-center text-center text-xl font-black tracking-tighter text-black sm:flex">
			<div className="flex h-full w-[var(--width-column-width)] flex-col">
				<div className="flex w-full flex-grow flex-col items-center space-y-1 p-1">
					<Link
						href="/"
						className="group h-auto w-full rounded-md border-0 border-dark bg-primary hover:bg-dark"
					>
						<div className="w-full p-2">
							<Logo className="text-dark group-hover:text-primary" />
						</div>
					</Link>
					<div className="no-scrollbar flex h-[calc(100svh-6.5rem)] w-full flex-col space-y-1 overflow-scroll rounded-md">
						<Link
							href={`/${locale}/bigbang`}
							className="h-auto w-full cursor-pointer rounded-md"
						>
							<HoverableItem>
								{(isHovered) => {
									const themeColors = {
										dark: {
											fill: isHovered
												? 'var(--color-grayDark)'
												: 'var(--color-grayDark)',
											stroke: isHovered
												? 'var(--color-dark)'
												: 'var(--color-dark)',
											icon: isHovered
												? 'var(--color-primary)'
												: 'var(--color-grayDark)',
										},
										light: {
											fill: isHovered
												? 'var(--color-primary)'
												: 'var(--color-primary)',
											stroke: isHovered
												? 'var(--color-dark)'
												: 'var(--color-grayDark)',
											icon: isHovered
												? 'var(--color-dark)'
												: 'var(--color-grayDark)',
										},
									}

									return (
										<div className="relative flex cursor-pointer items-center justify-center rounded-md border-dark py-1 dark:border-0 dark:bg-dark">
											<MenuArrows className="absolute right-2 top-2 text-grayDark" />
											<div className="h-auto w-auto items-center px-3">
												<BigBangLogo
													theme={themeColors.dark}
													className="hidden w-full dark:block"
												/>
												<BigBangLogo
													theme={themeColors.light}
													className="w-full dark:hidden"
												/>
											</div>
										</div>
									)
								}}
							</HoverableItem>
						</Link>

						{/* La Fabrique */}

						<div className="no-scrollbar flex h-auto flex-col items-center space-y-1 rounded-md">
							<Link
								href={`/${locale}/fabrique`}
								className="h-full w-full cursor-pointer rounded-md"
							>
								<HoverableItem className="dark:bg-gray group relative flex h-full w-full items-center justify-center rounded-md border-grayLight bg-transparent py-6 shadow-inner dark:border-0">
									{(isHovered) => {
										const themeColors = {
											dark: {
												fill: isHovered
													? 'var(--color-grayDark)'
													: 'var(--color-grayDark)',
												stroke: isHovered
													? 'var(--color-dark)'
													: 'var(--color-dark)',
											},
											light: {
												fill: isHovered
													? 'var(--color-primary)'
													: 'var(--color-primary)',
												stroke: isHovered
													? 'var(--color-dark)'
													: 'var(--color-grayDark)',
											},
										}

										return (
											<>
												<MenuArrows className="absolute right-2 top-2 text-grayDark" />
												<div className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 transform text-grayDark">
													<FabriqueBracketsIcon
														theme={{
															fill: 'currentColor',
														}}
														className="group-hover:text-dark group-hover:dark:text-primary"
													/>
												</div>
												<FabriqueLogo
													theme={themeColors.light}
													className="z-10 w-[40%] dark:hidden"
												/>
												<FabriqueLogo
													theme={themeColors.dark}
													className="z-10 hidden w-[45%] dark:block"
												/>
											</>
										)
									}}
								</HoverableItem>
							</Link>
						</div>
						<Link
							href={`/${locale}/equipe`}
							className="group relative h-auto w-full cursor-pointer rounded-md"
						>
							<HoverableItem className="flex max-h-40 min-h-32 items-center justify-center rounded-md border-0 border-primary dark:bg-grayDark sm:dark:bg-dark">
								{(isHovered) => {
									const themeColors = {
										dark: {
											fill: isHovered
												? 'var(--color-grayDark)'
												: 'var(--color-grayDark)',
											icon: isHovered
												? 'var(--color-primary)'
												: 'var(--color-grayDark)',
											text: isHovered ? '' : '',
										},
										light: {
											fill: isHovered
												? 'var(--color-primary)'
												: 'var(--color-primary)',
											stroke: isHovered
												? 'var(--color-dark)'
												: 'var(--color-grayDark)',
											icon: isHovered
												? 'var(--color-dark)'
												: 'var(--color-grayDark)',
											text: isHovered
												? 'var(--color-dark)'
												: 'var(--color-grayDark',
										},
									}
									return (
										<div className="flex items-center justify-center rounded-md px-4 pb-6 pt-12">
											<MenuArrows className="absolute right-2 top-2 text-grayDark" />
											<EquipeLogo
												theme={themeColors.dark}
												className="hidden w-full dark:block"
											/>
											<EquipeLogo
												theme={themeColors.light}
												className="w-full dark:hidden"
											/>
										</div>
									)
								}}
							</HoverableItem>
						</Link>
					</div>
					<div className="flex h-auto w-full items-center justify-start rounded-md p-1">
						<ThemeSwitch />
						<LocaleSwitcher />
					</div>
				</div>
				{/* Theme and Locale Switcher at the bottom */}
			</div>

			{/* Second Column */}
			<div className="flex h-full w-[var(--width-column-width)] flex-col">
				<div className="flex w-full flex-grow flex-col items-center space-y-1 p-1">
					<div className="no-scrollbar flex h-[calc(100svh-3.25rem)] w-full flex-col space-y-1 overflow-scroll rounded-md">
						<Link href={`/${locale}/festival`}>
							<HoverableItem>
								{(isHovered) => {
									const themeColors = {
										dark: {
											fill: isHovered
												? 'var(--color-grayDark)'
												: 'var(--color-grayDark)',
											stroke: isHovered
												? 'var(--color-dark)'
												: 'var(--color-dark)',
										},
										light: {
											fill: isHovered
												? 'var(--color-primary)'
												: 'var(--color-primary)',
											stroke: isHovered
												? 'var(--color-dark)'
												: 'var(--color-grayDark)',
										},
									}

									const themeColorsIcon = {
										dark: {
											fill: isHovered
												? 'var(--color-primary)'
												: 'var(--color-grayDark)',
											stroke: isHovered
												? 'var(--color-dark)'
												: 'var(--color-dark)',
										},
										light: {
											fill: isHovered
												? 'var(--color-dark)'
												: 'var(--color-grayDark)',
										},
									}

									return (
										<div className="relative flex h-full w-full cursor-pointer items-center justify-center rounded-md pt-4 dark:bg-dark">
											<MenuArrows className="absolute right-2 top-2 text-grayDark" />
											<FestivalLogo
												className="z-0 hidden w-[85%] dark:block"
												theme={themeColors.dark}
											/>
											<FestivalLogo
												className="z-0 w-[85%] dark:hidden"
												theme={themeColors.light}
											/>
											<div className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 transform text-grayDark">
												<FestivalSparklesIcon
													theme={themeColorsIcon.dark}
													className="z-50 hidden dark:block"
												/>
												<FestivalSparklesIcon
													theme={themeColorsIcon.light}
													className="z-50 dark:hidden"
												/>
											</div>
										</div>
									)
								}}
							</HoverableItem>
						</Link>
						<Link
							href={`/${locale}/memoire`}
							className="group flex flex-grow cursor-pointer rounded-md"
						>
							<HoverableItem>
								{(isHovered) => {
									const themeColors = {
										dark: {
											fill: isHovered
												? 'var(--color-grayDark)'
												: 'var(--color-grayDark)',
											icon: isHovered
												? 'var(--color-primary)'
												: 'var(--color-grayDark)',
											stroke: isHovered
												? 'var(--color-dark)'
												: 'var(--color-dark)',
										},
										light: {
											fill: isHovered
												? 'var(--color-primary)'
												: 'var(--color-primary)',
											icon: isHovered
												? 'var(--color-dark)'
												: 'var(--color-grayDark)',
											stroke: isHovered
												? 'var(--color-dark)'
												: 'var(--color-grayDark)',
										},
									}
									return (
										<div className="relative h-full w-full cursor-pointer rounded-md px-2 py-8 dark:bg-dark">
											<MenuArrows className="absolute right-2 top-2 z-50 text-grayDark hover:scale-105" />
											<div className="flex h-full items-center justify-center">
												<MemoireLogo
													theme={themeColors.dark}
													className="hidden w-full dark:block"
												/>
												<MemoireLogo
													theme={themeColors.light}
													className="w-full dark:hidden"
												/>
											</div>
										</div>
									)
								}}
							</HoverableItem>
						</Link>
					</div>
					<div className="flex h-[2.5rem] w-full items-center justify-between rounded-md px-2">
						<div className="flex items-center gap-2">
							<FaInstagram className="text-primary" />
							<FaFacebook className="text-primary" />
							<FaYoutube className="text-primary" />
						</div>
						<Link
							href={`/${locale}/contact`}
							className="text-medium rounded-full border-0 border-transparent px-2 text-2xl font-bold uppercase text-grayDark hover:border-grayDark"
						>
							Contact
						</Link>
					</div>
				</div>
			</div>
		</nav>
	)
}

export default NavBar
