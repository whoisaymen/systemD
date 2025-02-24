import { motion } from 'framer-motion'
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
}) => (
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
			className="group w-full rounded-md border-dark px-6 py-3"
		>
			<Component
				className="w-full overflow-visible text-primary group-hover:text-primary"
				theme={theme.dark}
			/>
		</motion.div>
	</Link>
)

interface MenuProps {
	menuOpen: boolean
	locale: string
	closeMenu: () => void
}

const Menu: React.FC<MenuProps> = ({ menuOpen, locale, closeMenu }) => {
	if (!menuOpen) return null

	return (
		<motion.div className="absolute left-0 top-0 z-50 flex h-dvh w-full flex-col items-center justify-start overflow-hidden bg-grayLight px-0 pt-8 dark:bg-dark">
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
				/>
			))}

			<div className="flex h-full w-full items-center justify-center px-2 text-4xl">
				{/* <div className="flex items-center justify-center gap-2 text-grayDark">
					<AiFillInstagram className="text-[2.5rem]" />
					<FaSquareFacebook />
					<FaYoutube className="text-[2.75rem]" />
				</div> */}

				{/* <Link
					href={`/${locale}/contact`}
					className="text-medium rounded-full border-2 border-transparent px-2 text-base font-bold text-grayDark hover:border-grayDark"
				>
					Contact
				</Link> */}
			</div>
		</motion.div>
	)
}

export default Menu
