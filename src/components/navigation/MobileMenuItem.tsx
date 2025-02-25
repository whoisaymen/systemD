import { motion } from 'motion/react'
import Link from 'next/link'
import BigBangLogoMobile from '../bigbang/BigBangLogoMobile'
import FestivalLogoMobile from '../festival/FestivalLogoMobile'
import MemoireLogoMobile from '../memoire/MemoireLogoMobile'
import EquipeLogoMobile from '../equipe/EquipeLogoMobile'
import FabriqueLogoMobile from '../fabrique/FabriqueLogoMobile'
import { getRandomRotationClass } from '@/lib/utils'
import {
	FaFacebook,
	FaInstagram,
	FaSquareFacebook,
	FaYoutube,
} from 'react-icons/fa6'

import { AiFillInstagram } from 'react-icons/ai'
import LogoShortAnimated from '../svgs/LogoShortAnimated'

interface MenuItemProps {
	href: string
	Component: React.FC<LogoComponentProps>
	delay: number
	locale: string
	closeMenu: () => void
	totalItems: number
}

interface LogoComponentProps {
	theme: {
		fill: string
		stroke?: string
		icon?: string
	}
	className?: string
}

const theme = {
	dark: {
		fill: 'var(--color-dark)',
		stroke: 'var(--color-primary)',
		icon: 'var(--color-primary)',
	},
	logo: {
		fill: 'var(--color-primary)',
		stroke: 'var(--color-primary)',
		icon: 'var(--color-primary)',
	},
}

const menuItems: {
	href: string
	Component: React.FC<LogoComponentProps>
	delay: number
}[] = [
	{ href: '/', Component: LogoShortAnimated, delay: 0.05 },
	{ href: 'bigbang', Component: BigBangLogoMobile, delay: 0.05 },
	{ href: 'festival', Component: FestivalLogoMobile, delay: 0.1 },
	{ href: 'memoire', Component: MemoireLogoMobile, delay: 0.15 },
	{ href: 'equipe', Component: EquipeLogoMobile, delay: 0.2 },
	{ href: 'fabrique', Component: FabriqueLogoMobile, delay: 0.25 },
]

const MenuItem: React.FC<MenuItemProps> = ({
	href,
	Component,
	delay,
	locale,
	closeMenu,
	totalItems,
}) => {
	// Calculate reverse delay for exit animation
	const reverseDelay = totalItems * 0.05 - delay
	return (
		<Link
			href={`/${locale}/${href}`}
			className={`w-full ${getRandomRotationClass()}`}
			onClick={closeMenu}
		>
			<motion.div
				initial={{ opacity: 0, y: '50%' }}
				animate={{
					opacity: 1,
					y: 0,
					transition: { duration: 0.5, delay, ease: 'easeInOut' },
				}}
				exit={{
					opacity: 0,
					y: '50%',
					transition: {
						duration: 0.5,
						delay: reverseDelay,
						ease: 'easeInOut',
					},
				}}
				className="group w-full rounded-md border-dark px-6 py-[0.82rem]"
			>
				<Component
					className="h-full w-full overflow-visible text-primary group-hover:text-primary"
					theme={theme.dark}
				/>
			</motion.div>
		</Link>
	)
}

interface MenuProps {
	menuOpen: boolean
	locale: string
	closeMenu: () => void
}

const Menu: React.FC<MenuProps> = ({ menuOpen, locale, closeMenu }) => {
	if (!menuOpen) return null
	const footerDelay = Math.max(...menuItems.map((item) => item.delay)) + 0.1

	return (
		<motion.div
			className="fixed inset-0 z-50 flex h-dvh w-full flex-col items-center justify-start overflow-hidden bg-grayLight px-0 pt-8 dark:bg-dark"
			initial={{ y: '-100%' }}
			animate={{ y: '0%' }}
			transition={{
				duration: 0.5,
				ease: [0.76, 0, 0.24, 1],
			}}
			exit={{
				y: '-100%',
				transition: { duration: 0.5, delay: 0.25, ease: [0.76, 0, 0.24, 1] },
			}}
		>
			<div className="relative"></div>
			{/* <div className="flex w-full justify-start">
				<div className="group mx-4 flex h-auto w-[40vw] justify-start rounded-md border-2 border-dark bg-primary px-2 py-1 shadow-md dark:border-primary dark:bg-primary sm:hidden">
					<LogoShortAnimated
						className="h-full w-full !overflow-visible text-dark group-hover:text-primary dark:text-dark"
						theme={theme.logo}
					/>
				</div>
			</div> */}

			{menuItems.map(({ href, Component, delay }) => (
				<MenuItem
					key={href}
					href={href}
					Component={Component}
					delay={delay}
					locale={locale}
					closeMenu={closeMenu}
					totalItems={menuItems.length}
				/>
			))}

			<motion.div
				className="absolute top-[78%] flex h-full w-full items-start justify-center gap-4 pt-12 text-sm font-bold leading-[1.2] tracking-tighter text-dark underline dark:font-semibold dark:text-primary"
				initial={{ opacity: 0, y: 20 }}
				animate={{
					opacity: 1,
					y: 0,
					transition: {
						duration: 0.5,
						delay: footerDelay, // Show after all menu items
						ease: 'easeInOut',
					},
				}}
				exit={{
					opacity: 0,
					y: 20,
					transition: {
						duration: 0.3,
						delay: 0, // Exit first, before menu items
						ease: 'easeInOut',
					},
				}}
			>
				<Link href={`/${locale}/contact`}>Mentions légales</Link>
				<Link href={`/${locale}/contact`}>Contactez-nous</Link>
				<span>Instagram</span>
			</motion.div>
		</motion.div>
	)
}

export default Menu
