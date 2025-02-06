'use client'
import { motion } from 'motion/react'
import Image from 'next/image'
import vidPreview from '/public/assets/images/vid-preview.png'
import { LeFestival } from './svgs'

export default function LeFestivalContent({
	activeTab,
}: {
	activeTab: string
}) {
	return (
		<motion.div
			className="no-scrollbar relative z-10 h-full flex-shrink-0 overflow-scroll py-1"
			animate={{
				x: activeTab ? '100%' : '0%',
			}}
			transition={{
				duration: 0.6,
				ease: 'easeInOut',
				type: 'spring',
			}}
			style={{ width: '66%' }}
		>
			{/* Header Section */}
			<div className="flex h-[13vh] items-center justify-center rounded-t-md bg-[#767676] dark:bg-[#1E1E1E]">
				<div className="">
					<LeFestival
						className="w-full stroke-[#767676] stroke-[2px] text-[#D5D5D5] dark:stroke-[#1E1E1E] dark:text-[#DEFE04]"
						style={{ strokeLinejoin: 'round' }}
					/>
				</div>
			</div>

			{/* Film Roll Content Section */}
			<div className="relative h-auto w-full bg-[#767676] px-6 dark:bg-[#1E1E1E]">
				{/* Film Roll Edges */}
				<div className="absolute left-0 top-0 z-30 h-full w-[2%] bg-[url('/assets/svg/filmroll.svg')] bg-[length:12px_40px] bg-center bg-repeat-y"></div>
				<div className="absolute right-0 top-0 z-30 h-full w-[2%] bg-[url('/assets/svg/filmroll.svg')] bg-[length:12px_40px] bg-center bg-repeat-y"></div>

				{/* Main Festival Content */}
				<div className="relative z-10">
					{/* Video Section */}
					<Image
						className="w-full saturate-0 hover:saturate-100"
						src={vidPreview}
						alt="Video preview"
					/>

					{/* Highlighted Festival Info */}
					<div className="relative bg-[#fff] px-6 py-10 dark:bg-[#DEFE04]">
						{/* Camera Viewfinder Corners */}
						<div className="pointer-events-none absolute inset-0 px-4 py-4">
							{/* Top-left corner */}
							<div className="absolute left-6 top-6 h-[40px] w-[40px] border-l-4 border-t-4 border-black"></div>
							{/* Top-right corner */}
							<div className="absolute right-6 top-6 h-[40px] w-[40px] border-r-4 border-t-4 border-black"></div>
							{/* Bottom-left corner */}
							<div className="absolute bottom-6 left-6 h-[40px] w-[40px] border-b-4 border-l-4 border-black"></div>
							{/* Bottom-right corner */}
							<div className="absolute bottom-6 right-6 h-[40px] w-[40px] border-b-4 border-r-4 border-black"></div>
						</div>

						{/* Text Content */}
						<p className="mx-auto max-w-4xl py-4 text-center text-4xl font-bold tracking-tighter">
							System_D is the festival where the only conditions for
							participation are not to have attended film school and to have
							made your film in Brussels.
						</p>
					</div>

					{/* Call for Entry Section */}
					<div className="bg-[#767676] p-0 pt-2">
						<div className="rounded-xl bg-white py-10">
							<h2 className="text-center text-9xl font-black uppercase tracking-tighter">
								Call for entry
							</h2>
							<p className="text-center text-4xl font-bold tracking-tighter">
								Brussels creatives, this is your call! Ready to shape the
								future? Join the About writing a future, a cycle of writing
								workshops in the framework of CIRCUIT. If you’re 16-26, this is
								your chance to explore utopias, dystopias, and everything in
								between. Let’s create possible futures together.
							</p>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	)
}
