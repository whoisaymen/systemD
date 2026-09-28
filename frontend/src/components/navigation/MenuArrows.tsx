'use client'
import { motion } from 'motion/react'

interface MenuArrowsProps {
	className?: string
}

const MenuArrows: React.FC<MenuArrowsProps> = ({ className }) => {
	return (
		<svg
			width="26"
			height="27"
			viewBox="0 0 26 27"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			{/* <path
				d="M0.272136 26.2279L8.6373 23.9864L2.51357 17.8627L0.272136 26.2279ZM5.57544 21.9852L10.702 16.8587L9.6413 15.798L4.51478 20.9246L5.57544 21.9852Z"
				fill="currentColor"
			/> */}
			<path
				d="M25.7279 0.772137L17.3627 3.01357L23.4864 9.1373L25.7279 0.772137ZM20.4246 5.01478L15.298 10.1413L16.3587 11.202L21.4852 6.07544L20.4246 5.01478Z"
				fill="currentColor"
			/>
		</svg>
	)
}

// const MenuArrows: React.FC<MenuArrowsProps> = ({ className }) => {
// 	return (
// 		<svg
// 			width="26"
// 			height="27"
// 			viewBox="0 0 26 27"
// 			fill="none"
// 			xmlns="http://www.w3.org/2000/svg"
// 			className={`transition-all duration-200 ease-in-out ${className}`}
// 		>
// 			<path
// 				d="M0.272136 26.2279L8.6373 23.9864L2.51357 17.8627L0.272136 26.2279Z"
// 				fill="currentColor"
// 				className="transition-all duration-200 ease-in-out group-hover:translate-y-[3px]"
// 			/>
// 			<path
// 				d="M5.57544 21.9852L10.702 16.8587L9.6413 15.798L4.51478 20.9246L5.57544 21.9852Z"
// 				fill="currentColor"
// 				className="transition-all duration-200 ease-in-out group-hover:translate-x-[3px]"
// 			/>
// 			<path
// 				d="M25.7279 0.772137L17.3627 3.01357L23.4864 9.1373L25.7279 0.772137Z"
// 				fill="currentColor"
// 				className="transition-all duration-200 ease-in-out group-hover:-translate-y-[3px]"
// 			/>
// 			<path
// 				d="M20.4246 5.01478L15.298 10.1413L16.3587 11.202L21.4852 6.07544L20.4246 5.01478Z"
// 				fill="currentColor"
// 				className="transition-all duration-200 ease-in-out group-hover:-translate-x-[3px]"
// 			/>
// 		</svg>
// 	)
// }

export default MenuArrows
