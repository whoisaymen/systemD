'use client'
import { motion } from 'motion/react'
export default function Loading() {
	return (
		<div className="relative z-50 h-dvh w-full items-center justify-center text-9xl font-black text-black">
			<div className="no-scrollbar flex h-full w-full flex-col space-y-4 overflow-y-scroll rounded-md px-4 py-24 text-base font-medium leading-tight tracking-tighter text-grayDark sm:space-y-0 sm:bg-white sm:px-0 sm:pt-0">
				<div className="-mb-12 h-[50vh] sm:h-[50vh]">
					<motion.div
						initial={{
							borderRadius: '0.375rem',
						}}
						animate={{ borderRadius: '15rem' }}
						transition={{
							duration: 2,
							ease: [0.76, 0, 0.24, 1],
							repeat: Infinity,
							repeatType: 'reverse',
						}}
						className="h-full w-full animate-pulse overflow-hidden border-2 border-dark/10 bg-dark/10 shadow-md dark:border-dark dark:bg-primary/10"
					></motion.div>
				</div>

				<div className="flex h-full w-full flex-col items-center justify-center">
					<div
						className={`z-10 h-12 w-40 rotate-3 animate-pulse rounded-md bg-dark px-2 text-6xl font-semibold text-dark sm:hidden`}
					></div>
					<div
						className={`relative z-10 h-10 w-16 -rotate-3 animate-pulse rounded-md bg-primary/10 px-2 text-4xl font-black text-dark sm:hidden`}
					>
						<span></span>
					</div>
				</div>

				<div className="relative mt-2 animate-pulse rounded-md border-2 border-dark bg-[#fff] px-4 py-10 shadow-sm dark:bg-primary/10 sm:py-10">
					<p
						className={`overflow-hidden' } mx-auto h-40 py-2 text-center text-xl font-bold leading-[1.2] tracking-tighter text-dark transition-all duration-300 sm:py-4 sm:text-4xl`}
					></p>
				</div>
			</div>
		</div>
	)
}
