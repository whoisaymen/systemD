import { motion } from 'framer-motion'
import Link from 'next/link'
import BigBangLogoMobile from '../bigbang/BigBangLogoMobile'
import FestivalLogoMobile from '../festival/FestivalLogoMobile'
import MemoireLogoMobile from '../memoire/MemoireLogoMobile'
import EquipeLogoMobile from '../equipe/EquipeLogoMobile'
import FabriqueLogoMobile from '../fabrique/FabriqueLogoMobile'

interface MenuItemProps {
	href: string
	Component: React.FC<LogoComponentProps>
	delay: number
	locale: string
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
}

const menuItems: {
	href: string
	Component: React.FC<LogoComponentProps>
	delay: number
}[] = [
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
}) => (
	<Link href={`/${locale}/${href}`} className="group h-auto w-full rounded-md">
		<motion.div
			initial={{ opacity: 0, x: '-20%' }}
			animate={{
				opacity: 1,
				x: 0,
				transition: { duration: 0.1, delay, ease: 'easeInOut' },
			}}
			className="w-full px-2 py-3"
		>
			<Component
				className="w-full text-dark group-hover:text-primary"
				theme={theme.dark}
			/>
		</motion.div>
	</Link>
)

interface MenuProps {
	menuOpen: boolean
	locale: string
}

const Menu: React.FC<MenuProps> = ({ menuOpen, locale }) => {
	if (!menuOpen) return null

	return (
		<motion.div className="absolute left-0 top-0 z-50 flex h-dvh w-full flex-col items-center justify-start overflow-hidden bg-grayLight px-8 pt-16 dark:bg-dark">
			{menuItems.map(({ href, Component, delay }) => (
				<MenuItem
					key={href}
					href={href}
					Component={Component}
					delay={delay}
					locale={locale}
				/>
			))}
		</motion.div>
	)
}

export default Menu
