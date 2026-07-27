import { useTranslations } from 'next-intl'

import { circOut, motion } from 'motion/react'
import Link from 'next/link'
import BigBangLogoMobile from '../bigbang/BigBangLogoMobile'
import FestivalLogoMobile from '../festival/FestivalLogoMobile'
import MemoireLogoMobile from '../memoire/MemoireLogoMobile'
import EquipeLogoMobile from '../equipe/EquipeLogoMobile'
import FabriqueLogoMobile from '../fabrique/FabriqueLogoMobile'
import { MdContactSupport } from 'react-icons/md'
import SocialLinks from '@/ui/SocialLinks'

import LogoShortAnimated from '../svgs/LogoShortAnimated'

interface MenuItemProps {
	href: string
	Component: React.FC<LogoComponentProps>
	delay: number
	locale: string
	closeMenu: () => void
	totalItems: number
	rotation: string // Add rotation property
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
	rotation: string // Add rotation property
}[] = [
	{
		href: '/',
		Component: LogoShortAnimated,
		delay: 0.15,
		rotation: '-rotate-6',
	},
	// {
	// 	href: 'bigbang',
	// 	Component: BigBangLogoMobile,
	// 	delay: 0.2,
	// 	rotation: 'rotate-3',
	// },
	{
		href: 'festival',
		Component: FestivalLogoMobile,
		delay: 0.2,
		rotation: 'rotate-1',
	},
	{
		href: 'bigbang',
		Component: BigBangLogoMobile,
		delay: 0.25,
		rotation: '-rotate-3',
	},
	{
		href: 'memoire',
		Component: MemoireLogoMobile,
		delay: 0.3,
		rotation: 'rotate-3',
	},
	{
		href: 'fabrique',
		Component: FabriqueLogoMobile,
		delay: 0.35,
		rotation: '-rotate-3',
	},
	{
		href: 'equipe',
		Component: EquipeLogoMobile,
		delay: 0.4,
		rotation: 'rotate-2',
	},
]

const MenuItem: React.FC<MenuItemProps> = ({
	href,
	Component,
	delay,
	locale,
	closeMenu,
	totalItems,
	rotation,
}) => {
	// Calculate reverse delay for exit animation
	const reverseDelay = totalItems * 0.05 - delay
	return (
		<Link
			href={`/${locale}/${href}`}
			className={`w-full ${rotation}`}
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
	social?: Sanity.Navigation
}

const Menu: React.FC<MenuProps> = ({ menuOpen, locale, closeMenu, social }) => {
	const t = useTranslations('menu')

	if (!menuOpen) return null
	const footerDelay = Math.max(...menuItems.map((item) => item.delay)) + 0.1

	return (
		<motion.div
			className="fixed inset-0 z-50 flex w-full flex-col items-center justify-start overflow-y-auto overflow-x-hidden bg-dark px-0 pt-8 md:w-[30%]"
			initial={{ y: '-100%' }}
			animate={{ y: '0%' }}
			transition={{
				duration: 0.5,
				type: 'tween',
				ease: circOut,
			}}
			exit={{
				y: '-100%',
				transition: {
					duration: 0.5,
					delay: 0.2,
					type: 'tween',
					ease: circOut,
				},
			}}
		>
			<div className="relative"></div>

			{menuItems.map(({ href, Component, delay, rotation }) => (
				<MenuItem
					key={href}
					href={href}
					Component={Component}
					delay={delay}
					locale={locale}
					closeMenu={closeMenu}
					totalItems={menuItems.length}
					rotation={rotation}
				/>
			))}

			<motion.div
				className="mx-2 mt-4 flex items-center justify-center gap-1 tracking-tighter"
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
				<Link
					className="flex items-center justify-center text-primary"
					href={`/${locale}/contact`}
					onClick={closeMenu}
					aria-label={t('contact')}
				>
					<MdContactSupport aria-hidden="true" className="h-8 w-8" />
				</Link>
				<SocialLinks
					social={social}
					className="flex items-center gap-1"
					linkClassName="flex aspect-square h-9 items-center justify-center rounded-md border-2 border-primary bg-primary text-dark"
					iconClassName="h-5 w-5"
				/>
			</motion.div>
		</motion.div>
	)
}

export default Menu
