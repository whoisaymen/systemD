'use client'
import { motion } from 'framer-motion'

export default function Loading() {
	return (
		<div className="no-scrollbar mt-12 flex h-full w-full flex-col space-y-1 overflow-y-scroll rounded-md px-4 tracking-tighter sm:mt-0">
			<motion.div
				initial={{
					borderRadius: '0.375rem',
				}}
				animate={{ borderRadius: '5rem' }}
				transition={{
					duration: 2,
					ease: [0.76, 0, 0.24, 1],
					repeat: Infinity,
					repeatType: 'reverse',
				}}
				className="relative animate-pulse rounded-full border-2 border-dark/10 bg-[#fff]/10 px-4 py-10 shadow-sm dark:bg-secondary/10 sm:py-10"
			></motion.div>

			<div className="grid grid-cols-1 gap-4 pb-16 pt-4 sm:grid-cols-2 lg:grid-cols-3">
				{[1, 2, 3].map((index) => (
					<div
						key={index}
						className="relative block h-[40vh] animate-pulse overflow-hidden rounded-full border-2 border-primary/10 shadow-md transition-shadow duration-300 hover:shadow-lg"
					>
						<div className="absolute left-[30%] top-[32.5%] z-10 rounded-md bg-primary/10 px-2 text-5xl font-black text-dark"></div>
						<div className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 rounded-md bg-grayDark/10 px-2 text-xl font-semibold text-dark"></div>
						<div className="flex h-full w-full items-center justify-center rounded-md bg-dark/10 dark:bg-primary/10" />
					</div>
				))}
			</div>
		</div>
	)
}
