'use client'
import { LaFabrique, LaFabriqueLa, Logo } from '../svgs'
import HoverableItem from '../HoverableItem'
import BigBangTsx from '../svgs/BigBang'

import { motion } from 'framer-motion'
import ThemeSwitch from '../ThemeChanger'
import LaFabriqueFabriqueTsx from '../svgs/LaFabriqueFabrique'
import LEquipeTsx from '../svgs/LEquipe'
import LaMemoireTsx from '../svgs/LaMemoire'
import LeFestivalTsx from '../svgs/LeFestival'
import LogoTsx from '../svgs/Logo'
import Link from 'next/link'
import LocaleSwitcher from './LocaleSwitcher'

const NavBar = ({ locale }: { locale: string }) => {
	console.log('NAV LOCALE', locale)
	return (
		<nav className="fixed left-0 top-0 z-20 flex h-screen w-full justify-between overflow-hidden bg-cover bg-center text-center text-xl font-black tracking-tighter text-black">
			<div className="w-[16rem]">
				<div className="flex flex-shrink-0 flex-col items-center justify-between space-y-1 p-1">
					<Link
						href="/"
						className="h-auto w-full rounded-md bg-[#DEFE04] hover:bg-[#1C1C1E]"
					>
						<HoverableItem>
							{(isHovered) => (
								<div className="w-full px-2 py-3">
									<LogoTsx fillColor={isHovered ? '#DEFE04' : '#1C1C1E'} />
								</div>
							)}
						</HoverableItem>
					</Link>

					<Link
						href={`/${locale}/bigbang`}
						className="group h-auto w-full cursor-pointer rounded-md"
					>
						<HoverableItem>
							{(isHovered) => (
								<div className="relative flex cursor-pointer items-center justify-center rounded-md py-1 dark:bg-[#8C8C8C] hover:dark:bg-[#DEFE04]">
									<div className="h-auto w-auto items-center">
										<BigBangTsx
											fillColor={isHovered ? '#1C1C1E' : '#1C1C1E'}
											strokeColor={isHovered ? '#DEFE04' : '#8C8C8F'}
											iconColor={isHovered ? '#8C8C8F' : '#1C1C1E'}
										/>
									</div>
								</div>
							)}
						</HoverableItem>
					</Link>

					<Link
						href={`/${locale}/fabrique`}
						className="h-[47vh] w-full cursor-pointer rounded-md bg-black"
					>
						<div className="group relative flex h-full w-full items-center justify-center rounded-md bg-[#97989B] shadow-inner dark:bg-[#1E1E1E]">
							{/* La */}
							<div className="absolute top-10 hidden stroke-[#767676] stroke-[2px] text-[#97989B] dark:block dark:stroke-[#1E1E1E]">
								<LaFabriqueLa />
							</div>

							{/* Focus trails */}
							<div className="relative z-0 text-[#97989B] group-hover:text-[#DEFE04]">
								<LaFabrique />
							</div>

							{/* Fabrique */}
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
						className="h-[20vh] w-full cursor-pointer rounded-md bg-black"
					>
						<div className="relative flex h-full w-full flex-col items-center justify-center rounded-md bg-[#8C8C8C]">
							<HoverableItem>
								{(isHovered) => (
									<LEquipeTsx
										fillColor={isHovered ? '#DEFE04' : '#1C1C1E'}
										iconColor={isHovered ? '#1C1C1E' : '#1C1C1E'}
									/>
								)}
							</HoverableItem>
						</div>
					</Link>
				</div>

				<div className="sticky bottom-1 left-1 flex w-[15.5rem] justify-between rounded-md bg-[#1C1C1E] px-2">
					<ThemeSwitch />
					<LocaleSwitcher />

					<button className="text-3xl">
						EN <span className="font-extralight text-black/25">|</span> FR
					</button>
				</div>
			</div>

			<div className="w-[16rem]">
				<div className="z-20 flex h-full w-full flex-shrink-0 flex-col items-center justify-between space-y-1 p-1 text-center text-xl font-black tracking-tighter text-black">
					<Link
						href={`/${locale}/festival`}
						className="flex w-full flex-grow items-center justify-center"
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
					<Link
						href={`/${locale}/memoire`}
						className="group flex h-auto w-full flex-grow cursor-pointer items-center justify-center rounded-md"
					>
						<HoverableItem>
							{(isHovered) => (
								<div className="relative flex h-full cursor-pointer items-center justify-center rounded-md px-4 py-12 dark:bg-[#8C8C8C] hover:dark:bg-[#DEFE04]">
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
				</div>
			</div>
		</nav>
	)
}

export default NavBar
