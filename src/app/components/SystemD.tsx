'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import vidPreview from '/public/assets/images/vid-preview.png'
import {
	Logo,
	BigBang,
	BigBangBig,
	BigBangBang,
	LaFabrique,
	LaFabriqueLa,
	LaFabriqueFabrique,
	LEquipe,
	LEquipeText,
	LeFestival,
	LaMemoire,
	LaMemoireText,
} from './svgs'

import festivalPrev1 from '/public/assets/images/festivalprev1.png'
import festivalPrev2 from '/public/assets/images/festivalprev2.png'
import festivalPrev3 from '/public/assets/images/festivalprev3.png'
import ThemeChanger from './ThemeChanger'
import FilmGrid from './FilmGrid'

const images = [festivalPrev1, festivalPrev2, festivalPrev3]

// Create an array of 10 images for testing purposes
const repeatedImages = Array.from(
	{ length: 10 },
	(_, index) => images[index % images.length],
)

interface SystemDProps {
	initialTab?: string | null
}

export default function SystemD({ initialTab }: SystemDProps) {
	const router = useRouter()
	const [activeTab, setActiveTab] = useState<string | null>(null)

	useEffect(() => {
		if (initialTab) {
			setActiveTab(initialTab)
		}
	}, [initialTab])

	const handleTabClick = (tab: string) => {
		const newTab = activeTab === tab ? null : tab
		setActiveTab(newTab)
		router.push(newTab ? `/${newTab}` : '/', { shallow: true } as any)
	}

	const handleCloseClick = () => {
		setActiveTab(null)
		router.push('/', { shallow: true } as any)
	}

	const bigBangVariants = {
		rest: { scale: 1, zIndex: 10, y: 0, opacity: 1 },
		hover: { scale: 0.87, zIndex: 10 },
	}

	const bigBangBigVariants = {
		rest: { scale: 1, zIndex: 0 },
		hover: { scale: 1.7, zIndex: 20, y: 10 },
	}

	const bigBangBangVariants = {
		rest: { scaleY: 1, zIndex: 10, y: 0 },
		hover: { scaleY: 0.75, zIndex: 0, y: 10 },
	}

	const laFabriqueVariants = {
		rest: { scaleY: 1, scaleX: 1, zIndex: 10, y: 0, opacity: 1 },
		hover: { scaleY: 1.2, scaleX: 1.1, zIndex: 10 },
	}

	const laFabriqueLaVariants = {
		rest: { scaleY: 1, zIndex: 10, y: 0 },
		hover: { scaleY: 0.75, zIndex: 0, y: -10 },
	}

	const laFabriqueFabriqueVariants = {
		rest: { scale: 1, zIndex: 0 },
		hover: { scale: 1.2, zIndex: 20, y: -20 },
	}

	return (
		<div className="relative flex h-screen overflow-hidden bg-[#DADADA]">
			{/* Sidebar */}
			<div className="z-20 flex w-[17%] flex-shrink-0 flex-col items-center justify-between space-y-1 p-1 text-center text-xl font-black tracking-tighter text-black">
				<div className="h-auto w-full rounded-md bg-[#DADADA] dark:bg-transparent">
					<Logo className="w-full px-2 py-3 text-[#1E1E1E]" />
				</div>

				{/* <div
          className='bg-black rounded-md h-[25vh] w-full cursor-pointer group'
          onClick={() => handleTabClick('big-bang')}
        >
          <div className='w-full h-full bg-gradient-to-b from-[#727171] to-[#9B9C9F] dark:from-[#1E1E1E] dark:to-[#1E1E1E] rounded-md shadow-inner relative flex items-center justify-center'>
            <div
              className='absolute inset-0 rounded-md'
              style={{
                boxShadow: `
            inset -2px -2px 4px rgba(241, 241, 241, 0.3),
            inset 4px 4px 4px rgba(25, 23, 23, 0.2)
          `,
              }}
            />
            <BigBangBig className='absolute z-0 top-3 w-auto text-[#DEFE04] stroke-[#767676] dark:stroke-[#1E1E1E] stroke-[2px] group-hover:scale-[170%] group-hover:z-20 group-hover:top-6 transition-all duration-100' />
            <BigBang className='w-auto text-[#D5D5D5] stroke-[#767676] dark:stroke-[#1E1E1E] stroke-[4px] z-10 group-hover:scale-90 group-hover:z-10 transition-transform duration-300' />
            <BigBangBang className='absolute z-10 bottom-4 w-auto text-[#DEFE04] stroke-[#767676] dark:stroke-[#1E1E1E] stroke-[2px] group-hover:scale-y-75 group-hover:z-0 transition-all duration-100 transform origin-bottom' />
          </div>
        </div> */}

				<motion.div
					className="h-[25vh] w-full cursor-pointer rounded-md bg-black"
					initial="rest"
					whileHover="hover"
					animate="rest"
					onClick={() => handleTabClick('big-bang')}
				>
					<div className="relative flex h-full w-full items-center justify-center rounded-md bg-gradient-to-b from-[#727171] to-[#9B9C9F] shadow-inner dark:from-[#1E1E1E] dark:to-[#1E1E1E]">
						<div
							className="absolute inset-0 rounded-md"
							style={{
								boxShadow: `
            inset -2px -2px 4px rgba(241, 241, 241, 0.3),
            inset 4px 4px 4px rgba(25, 23, 23, 0.2)
          `,
							}}
						/>
						{/* Big */}
						<motion.div
							className="absolute top-2 hidden w-[50%] stroke-[#767676] stroke-[2px] text-[#DEFE04] hover:block dark:block dark:stroke-[#1E1E1E]"
							variants={bigBangBigVariants}
						>
							<BigBangBig />
						</motion.div>

						{/* Circle */}
						<motion.div
							className="relative w-[75%] stroke-[#767676] stroke-[0px] text-[#D5D5D5] dark:stroke-[#1E1E1E] dark:stroke-[6px]"
							variants={bigBangVariants}
						>
							<BigBang />
						</motion.div>

						{/* Bang */}
						<motion.div
							className="absolute bottom-4 hidden w-[85%] stroke-[#767676] stroke-[10px] text-[#DEFE04] dark:block dark:stroke-[#1E1E1E]"
							variants={bigBangBangVariants}
						>
							<BigBangBang />
						</motion.div>
					</div>
				</motion.div>

				<motion.div
					className="h-[47vh] w-full cursor-pointer rounded-md bg-black"
					onClick={() => handleTabClick('la-fabrique')}
					initial="rest"
					whileHover="hover"
					animate="rest"
				>
					<div className="relative flex h-full w-full items-center justify-center rounded-md bg-[#97989B] shadow-inner dark:bg-[#1E1E1E]">
						<div
							className="absolute inset-0 rounded-md"
							style={{
								boxShadow: `
            inset -2px -2px 4px rgba(241, 241, 241, 0.3),
            inset 4px 4px 4px rgba(25, 23, 23, 0.2)
          `,
							}}
						/>
						{/* La */}
						<motion.div
							className="absolute top-10 hidden stroke-[#767676] stroke-[2px] text-[#DEFE04] dark:block dark:stroke-[#1E1E1E]"
							variants={laFabriqueLaVariants}
						>
							<LaFabriqueLa />
						</motion.div>

						{/* Focus trails */}
						{/* <LaFabrique className='text-[#D5D5D5]' /> */}
						<motion.div
							className="relative text-[#D5D5D5]"
							variants={laFabriqueVariants}
						>
							<LaFabrique />
						</motion.div>

						{/* Fabrique */}
						<motion.div
							className="absolute bottom-6 hidden stroke-[#767676] stroke-[3px] text-[#DEFE04] dark:block dark:stroke-[#1E1E1E]"
							variants={laFabriqueFabriqueVariants}
						>
							<LaFabriqueFabrique />
						</motion.div>
					</div>
				</motion.div>

				<motion.div
					className="h-[20vh] w-full cursor-pointer rounded-md bg-black"
					onClick={() => handleTabClick('l-equipe')}
					initial="rest"
					whileHover="hover"
					animate="rest"
				>
					<div className="relative flex h-full w-full flex-col items-center justify-center rounded-md bg-gradient-to-b from-[#9B9C9F] to-[#727171] shadow-inner dark:from-[#1E1E1E] dark:to-[#1E1E1E]">
						<div
							className="absolute inset-0 rounded-md"
							style={{
								boxShadow: `
          inset -2px -2px 4px rgba(241, 241, 241, 0.3),
          inset 4px 4px 4px rgba(25, 23, 23, 0.2)
        `,
							}}
						/>

						{/* LEquipe */}
						<motion.div
							className="w-auto text-[#D5D5D5]"
							variants={{
								rest: { y: 0 },
								hover: { y: 45 },
							}}
							transition={{ type: 'spring', stiffness: 200 }}
						>
							<LEquipe />
						</motion.div>

						{/* LEquipeText */}
						<motion.div
							className="hidden w-auto text-[#D5D5D5] dark:block"
							variants={{
								rest: { y: 0 },
								hover: { y: -45 },
							}}
							transition={{ type: 'spring', stiffness: 200 }}
						>
							<LEquipeText className="text-[#DEFE04]" />
						</motion.div>
					</div>
				</motion.div>

				<div className="flex w-full justify-between px-2">
					{/* <button className='text-sm'>Dark Theme</button> */}
					<ThemeChanger />

					<button className="text-3xl">
						EN <span className="font-extralight text-black/25">|</span> FR
					</button>
				</div>
			</div>

			{/* Tab Content */}
			<AnimatePresence>
				{activeTab && (
					<motion.div
						className="absolute inset-0 h-full w-[66%] p-1"
						initial={{ x: '-100%' }}
						animate={{ x: '25.5%' }}
						exit={{ x: '-100%' }}
						transition={{ duration: 0.6, ease: 'easeInOut', type: 'spring' }}
						// style={{ width: '100%' }}
					>
						<div className="h-full w-full rounded-md bg-white p-4">
							<button className="mb-4" onClick={handleCloseClick}>
								Close
							</button>
							<h1>{activeTab}</h1>
							<p>
								Content for <strong>{activeTab}</strong>.
							</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Main Content */}
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
									workshops in the framework of CIRCUIT. If you’re 16-26, this
									is your chance to explore utopias, dystopias, and everything
									in between. Let’s create possible futures together.
								</p>
							</div>
						</div>
					</div>
				</div>
			</motion.div>

			{/* La Memoire */}
			<motion.div
				className=""
				animate={{
					x: activeTab ? '100%' : '0%',
				}}
				transition={{
					duration: 0.6,
					ease: 'easeInOut',
				}}
				style={{ width: '16.6%' }}
			>
				<div className="no-scrollbar group relative m-1 flex h-[95vh] flex-shrink-0 flex-col items-center justify-start overflow-scroll rounded-md bg-gradient-to-b from-[#727171] to-[#9B9C9F] text-white shadow-inner dark:from-[#1E1E1E] dark:to-[#1E1E1E]">
					<div
						className="absolute inset-0 rounded-md"
						style={{
							boxShadow: `
        inset -2px -2px 4px rgba(241, 241, 241, 0.3),
        inset 4px 4px 4px rgba(25, 23, 23, 0.2)
      `,
						}}
					/>
					<div className="sticky inset-0 z-20 bg-[#727171] pb-4 dark:bg-[#1E1E1E]">
						<div className="relative flex h-full w-full flex-col items-center justify-center">
							<LaMemoire className="w-[90%] p-4 text-[#D5D5D5]" />
							<motion.div
								className="absolute bottom-0 hidden text-[#DEFE04] dark:block"
								initial={{ y: 0 }}
								whileHover={{ y: -10 }}
								transition={{ type: 'spring', stiffness: 200 }}
							>
								<LaMemoireText />
							</motion.div>
						</div>
						{/* Filter Menu */}
						<div className="absolute left-0 right-0 top-20 rounded-md bg-black p-2 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
							<p>Filter Menu</p>
						</div>
					</div>

					{/* List of Images */}
					<div className="flex w-full flex-col space-y-2 p-2">
						{repeatedImages.map((image, index) => (
							<div key={index} className="group relative">
								<Image
									className="w-full rounded-md saturate-0 hover:saturate-100"
									src={image}
									alt={`Festival Preview ${index + 1}`}
								/>
								<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 hover:opacity-100">
									<p className="text-white">Festival Preview {index + 1}</p>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="flex w-full justify-between px-2">
					<span className="text-3xl font-black tracking-tighter">Contact</span>
				</div>
			</motion.div>
		</div>
	)
}
