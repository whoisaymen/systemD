'use client'
import { motion } from 'motion/react'
import Img from '@/ui/Img'
import { useState, useEffect, useRef } from 'react'
import ArrowRight from '../common/ArrowRight'

interface EquipeContentProps {
	persons: any[]
	language: string
}

const getLocalizedValue = (array: any[], lang: string) => {
	const item = array.find((entry) => entry._key === lang)
	return item ? item.value : ''
}

const EquipeContent: React.FC<EquipeContentProps> = ({ persons, language }) => {
	const n = persons.length
	const [displayIndex, setDisplayIndex] = useState(n + 1) // Start at first real person (after left clones)
	const [cardWidth, setCardWidth] = useState(330)
	const containerRef = useRef<HTMLDivElement>(null)

	// Calculate responsive card width
	useEffect(() => {
		const updateCardWidth = () => {
			const screenWidth = window.innerWidth
			let newWidth = 330

			if (screenWidth < 480) {
				newWidth = Math.min(280, screenWidth - 80)
			} else if (screenWidth < 640) {
				newWidth = Math.min(320, screenWidth - 100)
			} else if (screenWidth < 768) {
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

	// Create infinite loop array with enough clones on both sides
	const cloneCount = Math.max(5, n) // At least 5 clones on each side
	const leftClones = Array(cloneCount)
		.fill(null)
		.map((_, i) => {
			const index = (n - cloneCount + i + n) % n // Ensure positive index
			return persons[index]
		})
	const rightClones = Array(cloneCount)
		.fill(null)
		.map((_, i) => {
			const index = i % n
			return persons[index]
		})

	const extended = [...leftClones, ...persons, ...rightClones]

	// compute center‐offset translateX
	const containerW = containerRef.current?.offsetWidth || window.innerWidth
	const translateX =
		-displayIndex * (cardWidth + CARD_GAP) + containerW / 2 - cardWidth / 2

	// when the spring finishes on a clone, immediately jump back to the real index
	const handleAnimationComplete = () => {
		if (displayIndex <= cloneCount - 1) {
			// We're in left clones, jump to corresponding right side
			setDisplayIndex(displayIndex + n)
		} else if (displayIndex >= cloneCount + n) {
			// We're in right clones, jump to corresponding left side
			setDisplayIndex(displayIndex - n)
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
							theme={{ fill: 'var(--color-primary)' }}
							className="h-9 w-9 rotate-180"
						/>
					</button>
					<button
						onClick={next}
						className="z-40 text-primary"
						aria-label="Next"
					>
						<ArrowRight
							theme={{ fill: 'var(--color-primary)' }}
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
								displayIndex <= cloneCount - 1 || displayIndex >= cloneCount + n
									? 0
									: undefined,
						}}
						onAnimationComplete={handleAnimationComplete}
					>
						{extended.map((person, idx) => {
							// map extended idx back to real 0..n-1
							const realIdx =
								idx < cloneCount
									? (((idx - cloneCount + n) % n) + n) % n // Double modulo to ensure positive
									: idx >= cloneCount + n
										? (((idx - cloneCount) % n) + n) % n // Double modulo to ensure positive
										: idx - cloneCount

							const isActive =
								realIdx === (((displayIndex - cloneCount) % n) + n) % n

							// Add safety check for person object
							if (!person) return null

							return (
								<motion.div
									key={`${person._id}-${idx}`}
									className="mt-4 flex-shrink-0 cursor-pointer"
									style={{ width: cardWidth }}
									animate={{
										scale: isActive ? 1 : 0.85,
									}}
									onClick={() => setDisplayIndex(idx)}
								>
									{isActive ? (
										<div className="pt-2">
											<div className="w-full overflow-hidden rounded-3xl border-2 border-primary">
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
													<p className="text-base leading-tight tracking-tighter text-primary sm:text-sm">
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
