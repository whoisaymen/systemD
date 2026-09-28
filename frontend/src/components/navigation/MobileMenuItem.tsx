import { useEffect, useRef } from 'react'
import { containMobileMenuScroll } from '@/lib/mobile-menu-scroll'
import { mountMobileMenuTint } from '@/lib/mobile-menu-tint'

import { circOut, motion } from 'motion/react'
import Link from 'next/link'
import BigBangLogoMobile from '../bigbang/BigBangLogoMobile'
import FestivalLogoMobile from '../festival/FestivalLogoMobile'
import MemoireLogoMobile from '../memoire/MemoireLogoMobile'
import EquipeLogoMobile from '../equipe/EquipeLogoMobile'
import FabriqueLogoMobile from '../fabrique/FabriqueLogoMobile'

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
			className="min-h-0 w-full"
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
				className="group flex h-full min-h-0 w-full items-center justify-center px-6 py-3"
			>
				<Component
					className={`h-full w-full overflow-visible text-primary group-hover:text-primary ${rotation}`}
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
	const menuRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!menuOpen || !menuRef.current) return
		const releaseScroll = containMobileMenuScroll(menuRef.current)
		const releaseTint = mountMobileMenuTint(document.documentElement)
		return () => {
			releaseScroll()
			releaseTint()
		}
	}, [menuOpen])

	if (!menuOpen) return null

	return (
		<motion.div
			className="fixed inset-x-0 top-0 z-50 h-dvh w-full pb-[calc(5rem+env(safe-area-inset-bottom))] pt-[calc(2rem+env(safe-area-inset-top))] lg:hidden"
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
			{/* Keep the fixed shell transparent so it cannot override the edge strips.
			    The solid child bleeds past both viewport edges behind browser chrome. */}
			<div
				aria-hidden="true"
				data-mobile-menu-background
				className="pointer-events-none absolute inset-x-0 bottom-[calc(-12px-env(safe-area-inset-bottom))] top-[calc(-12px-env(safe-area-inset-top))] bg-dark"
			/>
			<div
				ref={menuRef}
				data-mobile-menu
				className="relative grid h-full w-full auto-rows-[minmax(4.5rem,1fr)] overflow-y-auto overflow-x-hidden overscroll-y-contain pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]"
			>
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
			</div>
		</motion.div>
	)
}

export default Menu
