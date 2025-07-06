'use client'
import { motion } from 'motion/react'
import Img from '@/ui/Img'
import { useState, useEffect, useRef } from 'react'
import ArrowRight from '../common/ArrowRight'

interface EquipeContentProps {
	persons: any[]
	language: string
}

const theme = {
	icon: 'var(--color-primary)',
	fill: 'var(--color-primary)',
	stroke: 'var(--color-grayDark)',
}

const getLocalizedValue = (array: any[], lang: string) => {
	const item = array.find((entry) => entry._key === lang)
	return item ? item.value : ''
}

const EquipeContent: React.FC<EquipeContentProps> = ({ persons, language }) => {
	const n = persons.length
	const [displayIndex, setDisplayIndex] = useState(1)
	const [cardWidth, setCardWidth] = useState(330)
	const containerRef = useRef<HTMLDivElement>(null)

	// Calculate responsive card width
	useEffect(() => {
		const updateCardWidth = () => {
			const screenWidth = window.innerWidth
			let newWidth = 330 // default desktop

			if (screenWidth < 480) {
				// Small phones
				newWidth = Math.min(280, screenWidth - 80) // Leave 40px padding on each side
			} else if (screenWidth < 640) {
				// Larger phones
				newWidth = Math.min(320, screenWidth - 100)
			} else if (screenWidth < 768) {
				// Small tablets
				newWidth = 330
			}

			setCardWidth(newWidth)
		}

		updateCardWidth()
		window.addEventListener('resize', updateCardWidth)
		return () => window.removeEventListener('resize', updateCardWidth)
	}, [])

	const CARD_GAP = 0

	// navigation
	const prev = () => setDisplayIndex((i) => i - 1)
	const next = () => setDisplayIndex((i) => i + 1)

	// build extended array
	const extended = [
		persons[n - 1], // clone last
		...persons,
		persons[0], // clone first
	]

	// compute center‐offset translateX
	const containerW = containerRef.current?.offsetWidth || window.innerWidth
	const translateX =
		-displayIndex * (cardWidth + CARD_GAP) + containerW / 2 - cardWidth / 2

	// when the spring finishes on a clone, immediately jump
	// (no transition) back to the real index
	const handleAnimationComplete = () => {
		if (displayIndex === 0) {
			setDisplayIndex(n)
		} else if (displayIndex === n + 1) {
			setDisplayIndex(1)
		}
	}

	return (
		<>
			<div className="relative flex h-full w-full flex-col items-center">
				<div className="absolute top-12 flex w-full items-center justify-between px-1 pt-4">
					<button
						onClick={prev}
						className="z-40 text-primary"
						aria-label="Previous"
					>
						<ArrowRight
							theme={{ fill: 'var(--color-primary' }}
							className="h-9 w-9 rotate-180"
						/>
					</button>
					<button
						onClick={next}
						className="z-40 text-primary"
						aria-label="Next"
					>
						<ArrowRight
							theme={{ fill: 'var(--color-primary' }}
							className="h-9 w-9"
						/>
					</button>
				</div>
				{/* Carousel Container */}
				<div
					ref={containerRef}
					className="relative flex w-full justify-center overflow-hidden"
				>
					<motion.div
						className="flex items-start"
						style={{ gap: CARD_GAP }}
						animate={{ x: translateX }}
						transition={{
							type: 'spring',
							stiffness: 300,
							damping: 30,
							// snap instantly if we're on a clone
							duration:
								displayIndex === 0 || displayIndex === n + 1 ? 0 : undefined,
						}}
						onAnimationComplete={handleAnimationComplete}
					>
						{extended.map((person, idx) => {
							// map extended idx back to real 0..n-1
							const realIdx = idx === 0 ? n - 1 : idx === n + 1 ? 0 : idx - 1
							const isActive = realIdx === (displayIndex - 1 + n) % n

							return (
								<motion.div
									key={`${person._id}-${idx}`}
									className="mt-4 flex-shrink-0 cursor-pointer"
									style={{ width: cardWidth }}
									animate={{
										scale: isActive ? 1 : 0.85,
										// opacity: isActive ? 1 : 0.7,
									}}
									onClick={() => setDisplayIndex(idx)}
								>
									{isActive ? (
										<div className="pt-2">
											<div className="w-full overflow-hidden rounded-3xl border-2 border-dark dark:border-primary">
												<Img
													image={person.image}
													src={
														person.image?.asset?._ref
															? `/${person.image.asset._ref.split('-')[1]}-${person.image.asset._ref.split('-')[2]}.${person.image.asset._ref.split('-')[3]}`
															: ''
													}
													alt={person.name}
													className="aspect-square h-full w-full object-cover"
												/>
											</div>

											<div className="mt-8">
												<div className="mb-4 flex flex-col">
													{person.name && (
														<h3 className="inline-block text-xl font-bold tracking-tighter text-primary sm:text-2xl">
															{person.name}
														</h3>
													)}
													{person.title && (
														<p className="mt-0 inline-block self-start rounded-md bg-grayDark px-1 text-left text-xs font-bold uppercase tracking-tighter text-dark">
															{getLocalizedValue(person.title, language)}
														</p>
													)}
												</div>
												{person.biography && (
													<p className="text-base leading-tight tracking-tighter text-dark dark:text-primary sm:text-sm">
														{getLocalizedValue(person.biography, language)}
													</p>
												)}
											</div>
										</div>
									) : (
										<div
											className="mt-20 aspect-square w-full cursor-pointer rounded-3xl bg-primary"
											title={person.name}
										/>
									)}
								</motion.div>
							)
						})}
					</motion.div>
				</div>
			</div>
		</>
	)
}

export default EquipeContent
