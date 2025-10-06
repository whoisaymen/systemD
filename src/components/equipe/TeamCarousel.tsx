'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Img from '@/ui/Img'
import NewArrowRightSimple from '../common/NewArrowRightSimple'
import { motion } from 'motion/react'
interface TeamMember {
	id: string
	name: string
	description: string
	image: any // Sanity image object
	color: string
	width: string
}

interface TeamCarouselProps {
	persons: any[]
	language: string
}

const getLocalizedValue = (array: any[], lang: string) => {
	const item = array.find((entry) => entry._key === lang)
	return item ? item.value : ''
}

export default function TeamCarousel({ persons, language }: TeamCarouselProps) {
	const teamMembers: TeamMember[] = persons.map((person, index) => {
		const widths = ['w-28', 'w-32', 'w-20', 'w-44', 'w-36', 'w-48', 'w-24']
		const colors = ['bg-primary']

		return {
			id: person._id,
			name: person.name,
			description:
				getLocalizedValue(person.biography, language) ||
				'No description available',
			image: person.image,
			color: colors[index % colors.length], // Use varying colors
			width: widths[index % widths.length], // Assign varying widths based on index
		}
	})

	const [activeIndex, setActiveIndex] = useState(0)
	const [isTransitioning, setIsTransitioning] = useState(false)

	const goToNext = () => {
		if (isTransitioning) return
		setIsTransitioning(true)
		setActiveIndex((prev) => (prev + 1) % teamMembers.length)
	}

	const goToPrev = () => {
		if (isTransitioning) return
		setIsTransitioning(true)
		setActiveIndex(
			(prev) => (prev - 1 + teamMembers.length) % teamMembers.length,
		)
	}

	useEffect(() => {
		const timer = setTimeout(() => setIsTransitioning(false), 300)
		return () => clearTimeout(timer)
	}, [activeIndex])

	const getVisibleCards = () => {
		const cards = []
		const centerOffset = 3 // Number of cards to show on each side

		// const playfulOffsets = {
		// 	'-3': { marginTop: '2rem', scale: 'scale-75' },
		// 	'-2': { marginTop: '1rem', scale: 'scale-85' },
		// 	'-1': { marginTop: '0.5rem', scale: 'scale-95' },
		// 	'0': { marginTop: '0', scale: 'scale-110' },
		// 	'1': { marginTop: '0.75rem', scale: 'scale-90' },
		// 	'2': { marginTop: '1.5rem', scale: 'scale-80' },
		// 	'3': { marginTop: '2.5rem', scale: 'scale-70' },
		// }
		const playfulOffsets = {
			'-3': { marginTop: '-1rem', scale: 'scale-75' }, // Up
			'-2': { marginTop: '0.5rem', scale: 'scale-85' }, // Slightly down
			'-1': { marginTop: '-0.5rem', scale: 'scale-95' }, // Up
			'0': { marginTop: '0', scale: 'scale-110' }, // Center
			'1': { marginTop: '-3rem', scale: 'scale-90' }, // Down
			'2': { marginTop: '-0.75rem', scale: 'scale-80' }, // Up
			'3': { marginTop: '2rem', scale: 'scale-70' }, // Down
		}

		for (let i = -centerOffset; i <= centerOffset; i++) {
			const realIndex =
				(((activeIndex + i) % teamMembers.length) + teamMembers.length) %
				teamMembers.length
			const member = teamMembers[realIndex]
			const isActive = i === 0

			cards.push({
				member,
				isActive,
				offset: i,
				key: `${realIndex}-${activeIndex}-${i}`,
				playfulStyle: playfulOffsets[
					i.toString() as keyof typeof playfulOffsets
				] || {
					marginTop: '0',
					scale: 'scale-100',
				},
			})
		}

		return cards
	}

	const inactiveCardAnimations = [
		{
			animate: {
				scaleX: [1, 1.2, 0.9, 1],
				scaleY: [1, 0.8, 1.1, 1],
				x: [0, -2, 2, 0],
			},
			transition: {
				duration: 4,
				ease: [0.76, 0, 0.24, 1],
				repeat: Number.POSITIVE_INFINITY,
			},
		},
		{
			animate: {
				scaleX: [1, 0.8, 1.1, 1],
				scaleY: [1, 1.1, 0.9, 1],
				x: [0, 3, -3, 0],
			},
			transition: {
				duration: 5,
				ease: [0.76, 0, 0.24, 1],
				repeat: Number.POSITIVE_INFINITY,
			},
		},
		{
			animate: {
				scaleX: [1, 1.1, 0.9, 1],
				scaleY: [1, 0.9, 1.1, 1],
				x: [0, -1, 1, 0],
			},
			transition: {
				duration: 3.5,
				ease: [0.76, 0, 0.24, 1],
				repeat: Number.POSITIVE_INFINITY,
			},
		},
		{
			animate: {
				scaleX: [1, 1.2, 0.8, 1],
				scaleY: [1, 0.9, 1.1, 1],
				x: [0, 2, -2, 0],
			},
			transition: {
				duration: 4.2,
				ease: [0.76, 0, 0.24, 1],
				repeat: Number.POSITIVE_INFINITY,
			},
		},
		{
			animate: {
				scaleX: [1, 0.9, 1.1, 1],
				scaleY: [1, 1.2, 0.8, 1],
				x: [0, -2, 2, 0],
			},
			transition: {
				duration: 3.8,
				ease: [0.76, 0, 0.24, 1],
				repeat: Number.POSITIVE_INFINITY,
			},
		},
		{
			animate: {
				scaleX: [1, 1.3, 0.7, 1],
				scaleY: [1, 0.8, 1.2, 1],
				x: [0, 1, -1, 0],
			},
			transition: {
				duration: 4.5,
				ease: [0.76, 0, 0.24, 1],
				repeat: Number.POSITIVE_INFINITY,
			},
		},
	]

	return (
		<div className="lg:shadowtest no-scrollbar relative w-full lg:my-1 lg:h-[calc(100svh-10px)] lg:overflow-y-auto lg:rounded-xl lg:pt-32">
			{/* Navigation Arrows */}
			<button
				onClick={goToPrev}
				className="absolute bottom-[50%] left-4 z-30 md:left-4 lg:bottom-[30%]"
			>
				<NewArrowRightSimple
					theme={{
						stroke: 'var(--color-grayDark)',
					}}
					className="h-auto w-5 -rotate-180 lg:w-7"
				/>
			</button>

			<button
				onClick={goToNext}
				className="absolute bottom-[50%] right-4 z-30 md:right-4 lg:bottom-[30%]"
			>
				<NewArrowRightSimple
					theme={{
						stroke: 'var(--color-grayDark)',
					}}
					className="h-auto w-5 lg:w-7"
				/>
			</button>

			{/* Carousel Container */}
			<div className="overflow-hidden pb-8 pt-16 lg:pb-16 lg:pt-0">
				<div className="flex h-full items-start justify-center gap-2 md:gap-4 lg:items-start">
					{getVisibleCards().map(
						({ member, isActive, offset, key, playfulStyle }) => (
							<motion.div
								key={key}
								className={`flex-shrink-0 transition-all duration-300 ${playfulStyle.scale} ${
									isActive ? 'z-20' : ''
								}`}
								style={{
									marginTop: playfulStyle.marginTop,
								}}
								animate={{
									y: 0,
									...(isActive
										? {}
										: inactiveCardAnimations[
												Math.abs(offset) % inactiveCardAnimations.length
											]?.animate),
								}}
								transition={
									isActive
										? { duration: 0.5, ease: [0.76, 0, 0.24, 1] }
										: inactiveCardAnimations[
												Math.abs(offset) % inactiveCardAnimations.length
											]?.transition
								}
							>
								{isActive ? (
									<>
										<div className="relative mx-2 h-full">
											<div className="w-[70vw] overflow-hidden rounded-2xl lg:w-[30vw]">
												<div className="h-64 overflow-hidden rounded-3xl border-4 border-primary lg:h-full">
													<Img
														image={member.image}
														src={
															member.image?.asset?._ref
																? `/${member.image.asset._ref.split('-')[1]}-${member.image.asset._ref.split('-')[2]}.${member.image.asset._ref.split('-')[3]}`
																: '/placeholder.svg'
														}
														alt={member.name}
														className="aspect-square h-full w-full object-cover"
													/>
												</div>
												<div className="absolute -bottom-4 left-1/2 flex w-full -translate-x-1/2 -rotate-3 items-center justify-center">
													<span className="z-10 w-fit rounded-md border-[3px] border-dark bg-grayDark px-2 text-center text-2xl font-black italic text-dark dark:border-primary dark:bg-dark dark:text-primary lg:text-5xl">
														{member.name}
													</span>
												</div>
											</div>
										</div>
									</>
								) : (
									<motion.div
										className={`${member.color} ${member.width} h-64 rounded-2xl transition-all duration-300 md:h-80 lg:mt-36`}
										whileHover={{ scale: 1.05 }}
									/>
								)}
							</motion.div>
						),
					)}
				</div>
			</div>

			{/* Full-width description below the carousel */}
			<div className="mt-0 h-[17rem] overflow-y-auto px-4 pb-16 lg:px-16">
				<p className="text-base font-normal leading-[1.2] tracking-tight text-primary lg:text-xl lg:leading-[1.5rem]">
					{teamMembers[activeIndex].description}
				</p>
			</div>
		</div>
	)
}
