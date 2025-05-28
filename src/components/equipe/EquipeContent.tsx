'use client'
import { motion, AnimatePresence } from 'motion/react'
import Img from '@/ui/Img'
import { useState } from 'react'

interface EquipeContentProps {
	persons: any[]
	language: string
}

const theme = {
	icon: '#FFD600',
	fill: '#FFD600',
	stroke: '#222',
}

const AnimatedRect: React.FC<{ className?: string }> = ({ className }) => (
	<svg
		className={className}
		viewBox="0 0 24 56"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<motion.path
			d="M2 5C2 2.23858 4.239 0 7 0H17C19.7614 0 22 2.23858 22 5V51C22 53.7614 19.7614 56 17 56H7C4.239 56 2 53.7614 2 51V5Z"
			stroke="currentColor"
			strokeWidth="0"
			fill={theme.icon}
			style={{ originX: 1.3 }}
			animate={{
				scaleX: [1, 1.2, 0.9, 1],
				scaleY: [1, 0.8, 1.1, 1],
				x: [0, -2, 2, 0],
				transition: {
					duration: 4,
					ease: [0.76, 0, 0.24, 1],
					repeat: Infinity,
				},
			}}
		/>
	</svg>
)

const getLocalizedValue = (array: any[], lang: string) => {
	const item = array.find((entry) => entry._key === lang)
	return item ? item.value : ''
}

const CARD_WIDTH = 290

const EquipeContent: React.FC<EquipeContentProps> = ({ persons, language }) => {
	const [active, setActive] = useState(0)
	const [direction, setDirection] = useState(0) // -1 for left, 1 for right

	const prev = () => {
		setDirection(-1)
		setActive((i) => (i - 1 + persons.length) % persons.length)
	}
	const next = () => {
		setDirection(1)
		setActive((i) => (i + 1) % persons.length)
	}

	const getIdx = (offset: number) =>
		(active + offset + persons.length) % persons.length

	return (
		<div className="relative flex h-full w-full flex-col items-center justify-center">
			<div className="relative flex h-full w-full max-w-5xl items-start justify-end">
				{/* Cards */}
				<AnimatePresence initial={false} custom={direction}>
					{[-1, 0, 1].map((offset) => {
						const idx = getIdx(offset)
						const person = persons[idx]
						const isActive = offset === 0
						const isPrev = offset === -1
						const isNext = offset === 1

						return (
							<motion.div
								key={person._id}
								className="absolute m-4 flex flex-col items-center justify-center pr-8"
								style={{
									width: isActive ? CARD_WIDTH : CARD_WIDTH * 0.7,
									zIndex: isActive ? 30 : 20,
									cursor: isActive ? 'default' : 'pointer',
								}}
								initial={{
									x: offset * 320,
									scale: isActive ? 1 : 0.85,
									opacity: 1,
									filter: isActive ? 'none' : 'blur(1px)',
								}}
								animate={{
									x: offset * 320,
									scale: isActive ? 1 : 0.85,
									opacity: 1,
									filter: isActive ? 'none' : 'blur(1px)',
									skewY: isPrev ? 8 : isNext ? -8 : 0,
								}}
								exit={{
									x: direction === 1 ? -320 : 320,
									opacity: 0,
									scale: 0.8,
								}}
								transition={{ type: 'spring', stiffness: 300, damping: 30 }}
								onClick={() => !isActive && setActive(idx)}
							>
								{isActive ? (
									<>
										<div className="w-full overflow-hidden rounded-3xl border-2 border-dark bg-white dark:border-primary dark:bg-dark">
											<Img
												image={person.image}
												src={
													person.image?.asset?._ref
														? `/${person.image.asset._ref.split('-')[1]}-${person.image.asset._ref.split('-')[2]}.${person.image.asset._ref.split('-')[3]}`
														: ''
												}
												alt={person.name}
												className="h-full w-full object-cover"
											/>
										</div>
										<div className="relative mt-8">
											{person.biography && (
												<p className="mt-2 text-base leading-tight tracking-tighter text-dark dark:text-primary">
													{getLocalizedValue(person.biography, language)}
												</p>
											)}
											{person.title && (
												<p className="mt-4 text-center text-xl font-bold uppercase tracking-tighter text-primary">
													{getLocalizedValue(person.title, language)}
												</p>
											)}
											{person.name && (
												<p
													className="absolute -left-12 top-2.5 z-30 inline-block rotate-90 text-2xl font-bold uppercase leading-[0] tracking-tighter text-primary"
													style={{
														transformOrigin: 'left bottom',
													}}
												>
													{person.name}
												</p>
											)}
										</div>
									</>
								) : (
									<>
										<div className="flex aspect-square w-full items-center justify-center">
											<AnimatedRect className="h-full w-full" />
										</div>
										{person.title && (
											<p className="mt-4 text-center text-xl font-bold uppercase tracking-tighter text-primary">
												{getLocalizedValue(person.title, language)}
											</p>
										)}
									</>
								)}
							</motion.div>
						)
					})}
				</AnimatePresence>
				{/* Navigation arrows */}
			</div>
			<button
				onClick={prev}
				className="fixed bottom-1/2 left-2 z-40 rounded-md bg-primary/80 px-3 py-1 text-2xl font-bold text-dark shadow hover:bg-primary"
				aria-label="Previous"
			>
				‹
			</button>
			<button
				onClick={next}
				className="fixed bottom-1/2 right-2 z-40 rounded-md bg-primary/80 px-3 py-1 text-2xl font-bold text-dark shadow hover:bg-primary"
				aria-label="Next"
			>
				›
			</button>
		</div>
	)
}

export default EquipeContent
