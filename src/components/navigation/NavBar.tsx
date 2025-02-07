'use client'
import { LaFabrique, LaFabriqueLa, Logo } from '../svgs'
import HoverableItem from '../HoverableItem'
import BigBangTsx from '../svgs/BigBang'

import { motion } from 'framer-motion'
import ThemeSwitch from '../ThemeSwitch'
import LaFabriqueFabriqueTsx from '../svgs/LaFabriqueFabrique'
import LEquipeTsx from '../svgs/LEquipe'
import LaMemoireTsx from '../svgs/LaMemoire'
import LeFestivalTsx from '../svgs/LeFestival'
import LogoTsx from '../svgs/Logo'
import Link from 'next/link'
import LocaleSwitcher from './LocaleSwitcher'
import { useTheme } from 'next-themes'
import { FaInstagram } from 'react-icons/fa'

const NavBar = ({ locale }: { locale: string }) => {
	const { theme } = useTheme()
	const isDarkMode = theme === 'dark'

	return (
		<nav className="fixed left-0 top-0 z-20 flex h-screen w-full items-start justify-between overflow-hidden bg-cover bg-center text-center text-xl font-black tracking-tighter text-black">
			<div className="flex h-full w-[16rem] flex-col">
				<div className="flex w-full flex-grow flex-col items-center space-y-1 p-1">
					{/* Logo */}
					<Link
						href="/"
						className="h-[3rem] w-full rounded-md bg-[#DEFE04] hover:bg-[#1C1C1E]"
					>
						<HoverableItem>
							{(isHovered) => (
								<div className="w-full px-2 py-3">
									<LogoTsx fillColor={isHovered ? '#DEFE04' : '#1C1C1E'} />
								</div>
							)}
						</HoverableItem>
					</Link>
					<div className="no-scrollbar flex h-[calc(100svh-6.5rem)] w-full flex-col space-y-1 overflow-scroll rounded-md">
						{/* Big Bang */}
						<Link
							href={`/${locale}/bigbang`}
							className="group h-auto w-full cursor-pointer rounded-md"
						>
							<HoverableItem>
								{(isHovered) => (
									<div className="relative flex cursor-pointer items-center justify-center rounded-md py-1 dark:bg-[#8C8C8C] hover:dark:bg-[#DEFE04]">
										<div className="h-auto w-auto items-center">
											<BigBangTsx
												fillColor={
													isDarkMode
														? isHovered
															? '#1C1C1E'
															: '#1C1C1E'
														: isHovered
															? '#DEFE04'
															: '#DEFE04'
												}
												strokeColor={
													isDarkMode
														? isHovered
															? '#DEFE04'
															: '#8C8C8F'
														: isHovered
															? '#1C1C1E'
															: '#8C8C8F'
												}
												iconColor={
													isDarkMode
														? isHovered
															? '#8C8C8F'
															: '#1C1C1E'
														: isHovered
															? '#1C1C1E'
															: '#8C8C8F'
												}
											/>
										</div>
									</div>
								)}
							</HoverableItem>
						</Link>

						{/* La Fabrique */}
						<Link
							href={`/${locale}/fabrique`}
							className="min-h-[47vh] w-full cursor-pointer rounded-md"
						>
							<div className="group relative flex h-full w-full items-center justify-center rounded-md bg-transparent shadow-inner dark:bg-[#1E1E1E]">
								<div className="absolute top-10 hidden stroke-[#767676] stroke-[2px] text-[#97989B] dark:block dark:stroke-[#1E1E1E]">
									<LaFabriqueLa />
								</div>
								<div className="relative z-0 text-[#97989B] group-hover:text-[#DEFE04]">
									<LaFabrique />
								</div>
								<div className="absolute bottom-6 z-10 hidden text-[#DEFE04] dark:block">
									<HoverableItem>
										{(isHovered) => (
											<LaFabriqueFabriqueTsx
												fillColor={isHovered ? '#8C8C8F' : '#8C8C8F'}
												strokeColor={isHovered ? '#1C1C1E' : '#1C1C1E'}
												iconColor={isHovered ? '#8C8C8F' : '#1C1C1E'}
											/>
										)}
									</HoverableItem>
								</div>
							</div>
						</Link>

						<Link
							href={`/${locale}/equipe`}
							className="group h-auto w-full cursor-pointer rounded-md"
						>
							<HoverableItem>
								{(isHovered) => (
									<div className="flex items-center justify-center rounded-md border bg-[#8C8C8F] py-12">
										<LEquipeTsx
											fillColor={isHovered ? '#DEFE04' : '#1C1C1E'}
											iconColor={isHovered ? '#1C1C1E' : '#1C1C1E'}
										/>
									</div>
								)}
							</HoverableItem>
						</Link>
					</div>
					<div className="flex h-[2.5rem] w-full items-center justify-between rounded-md bg-[#1C1C1E] p-1">
						<ThemeSwitch />
						<LocaleSwitcher />
					</div>
				</div>

				{/* Theme and Locale Switcher at the bottom */}
			</div>

			<div className="flex h-full w-[16rem] flex-col p-1">
				<div className="no-scrollbar flex h-[20vh] flex-grow flex-col items-center space-y-1 overflow-scroll rounded-md">
					<Link
						href={`/${locale}/festival`}
						className="flex w-full flex-grow items-start justify-center"
					>
						<HoverableItem>
							{(isHovered) => (
								<div className="relative flex h-full w-full cursor-pointer items-center justify-center rounded-md px-2 pb-4 pt-8 dark:bg-[#1C1C1E]">
									<div className="h-auto w-auto items-center">
										<LeFestivalTsx
											fillColor={isHovered ? '#DEFE04' : '#8C8C8C'}
											strokeColor={isHovered ? '#1C1C1E' : '#1C1C1E'}
										/>
									</div>
								</div>
							)}
						</HoverableItem>
					</Link>
				</div>
				<div className="flex max-h-[22rem] w-full flex-col items-center justify-between space-y-1 rounded-md">
					<Link
						href={`/${locale}/memoire`}
						className="group flex w-full flex-grow cursor-pointer items-center justify-center rounded-md"
					>
						<HoverableItem>
							{(isHovered) => (
								<div className="relative flex h-full cursor-pointer items-center justify-center rounded-md px-4 py-8 dark:bg-[#8C8C8C] hover:dark:bg-[#DEFE04]">
									<div className="h-auto w-auto items-center">
										<LaMemoireTsx
											fillColor={isHovered ? '#1C1C1E' : '#1C1C1E'}
											strokeColor={isHovered ? '#DEFE04' : '#8C8C8F'}
										/>
									</div>
								</div>
							)}
						</HoverableItem>
					</Link>

					<div className="flex h-[2.5rem] w-full items-center justify-between rounded-md bg-[#1C1C1E] px-2">
						<div>
							<FaInstagram className="text-[#DEFE04]" />
						</div>
						<a
							href="mailto:info@systemd.brussels"
							className="text-sm font-bold lowercase text-[#8C8C8F]"
						>
							info<span className="text-[#DEFE04]">@</span>systemd.brussels
						</a>
					</div>
				</div>
			</div>
		</nav>
	)
}

export default NavBar
