'use client'
import Menu from './MobileMenuItem'

const DesktopSideMenu = ({ locale }: { locale: string }) => (
	<aside className="fixed left-0 top-0 z-40 hidden h-screen w-[90px] flex-col bg-grayDark pt-4 sm:flex md:w-[160px]">
		<Menu menuOpen={true} locale={locale} closeMenu={() => {}} />
	</aside>
)

export default DesktopSideMenu
