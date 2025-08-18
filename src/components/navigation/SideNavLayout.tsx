'use client'

import NavBarMobile from './NavBarMobile'

const SideNavLayout = ({
	locale,
	children,
}: {
	locale: string
	children: React.ReactNode
}) => {
	return (
		<div className="flex h-screen w-screen overflow-hidden">
			{/* Side nav */}
			<div className="relative z-50 flex w-[80px] flex-col bg-grayDark sm:w-[120px] md:w-[220px]">
				<NavBarMobile locale={locale} />
			</div>
			{/* Main content */}
			<div className="flex-1 overflow-y-auto bg-grayLight p-4 dark:bg-dark">
				{children}
			</div>
		</div>
	)
}

export default SideNavLayout
