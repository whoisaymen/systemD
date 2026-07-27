'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Transition } from 'motion/react'
import Img from '@/ui/Img'
import NewArrowRightSimple from '../common/NewArrowRightSimple'

interface TeamMember {
	id: string
	name: string
	description: string
	title: string
	image: any
	hasImage: boolean
	shape: ShapeProfile
}

interface TeamCarouselProps {
	persons: any[]
	language: string
}

interface ShapeProfile {
	desktopWidth: number
	mobileWidth: number
	y: number
	rotate: number
}

const ease = [0.76, 0, 0.24, 1] as const

const shapeProfiles: ShapeProfile[] = [
	{ desktopWidth: 118, mobileWidth: 72, y: 24, rotate: -1.5 },
	{ desktopWidth: 146, mobileWidth: 88, y: -2, rotate: 1 },
	{ desktopWidth: 92, mobileWidth: 58, y: 18, rotate: -0.5 },
	{ desktopWidth: 188, mobileWidth: 108, y: -36, rotate: 1.5 },
	{ desktopWidth: 158, mobileWidth: 94, y: 8, rotate: -1 },
	{ desktopWidth: 204, mobileWidth: 116, y: 34, rotate: 0.75 },
]

const shapePulse = [
	{
		animate: { scaleX: [1, 1.12, 0.94, 1], scaleY: [1, 0.9, 1.08, 1] },
		transition: { duration: 4.2, ease, repeat: Number.POSITIVE_INFINITY },
	},
	{
		animate: { scaleX: [1, 0.92, 1.08, 1], scaleY: [1, 1.1, 0.94, 1] },
		transition: { duration: 4.8, ease, repeat: Number.POSITIVE_INFINITY },
	},
	{
		animate: { scaleX: [1, 1.08, 0.96, 1], scaleY: [1, 0.95, 1.12, 1] },
		transition: { duration: 3.8, ease, repeat: Number.POSITIVE_INFINITY },
	},
]

const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max)

const wrapIndex = (index: number, total: number) =>
	((index % total) + total) % total

const getLocalizedValue = (array: any[] | undefined, lang: string) => {
	if (!Array.isArray(array)) return ''

	const item = array.find((entry) => entry.language === lang || entry._key === lang)
	return item ? item.value : ''
}

const getCircularOffset = (index: number, activeIndex: number, total: number) => {
	if (total <= 1) return 0

	let offset = index - activeIndex
	const half = total / 2

	if (offset > half) offset -= total
	if (offset < -half) offset += total

	return offset
}

const getInitialSlots = (total: number, activeIndex: number) =>
	Array.from({ length: total }, (_, index) =>
		getCircularOffset(index, activeIndex, total),
	)

const normalizeSlots = (slots: number[], total: number, visibleRange: number) => {
	if (total <= 0) return slots

	return slots.map((slot) => {
		let normalizedSlot = slot

		while (normalizedSlot > visibleRange) normalizedSlot -= total
		while (normalizedSlot < -visibleRange) normalizedSlot += total

		return normalizedSlot
	})
}

const getNameParts = (name: string) =>
	name
		.trim()
		.split(/\s+/)
		.filter(Boolean)

const getStableNoise = (seed: string, index: number, salt: number) => {
	let hash = 2166136261
	const value = `${seed}-${index}-${salt}`

	for (let i = 0; i < value.length; i += 1) {
		hash ^= value.charCodeAt(i)
		hash = Math.imul(hash, 16777619)
	}

	return ((hash >>> 0) % 1000) / 500 - 1
}

const getNamePillPose = (index: number, total: number, seed: string) => {
	const rotations = [-3.5, 2.5, -1.5, 3, -2.25]
	const yOffsets = [-2, 18, 4, 20, 6]
	const centerOffset = index - (total - 1) / 2
	const jitterX = getStableNoise(seed, index, 0) * 18
	const jitterY = getStableNoise(seed, index, 1) * 4
	const jitterRotate = getStableNoise(seed, index, 2) * 3.5
	const stampOrigins = [
		{ x: 0.22, y: 0.78 },
		{ x: 0.76, y: 0.35 },
		{ x: 0.44, y: 0.84 },
		{ x: 0.64, y: 0.24 },
		{ x: 0.32, y: 0.56 },
	]

	return {
		rotate: rotations[index % rotations.length] + jitterRotate,
		x: centerOffset * 4 + jitterX,
		y: yOffsets[index % yOffsets.length] + jitterY,
		enterX: centerOffset * 10 + (index % 2 === 0 ? -8 : 8),
		enterY: -10 - Math.abs(centerOffset) * 4,
		enterRotate:
			rotations[index % rotations.length] +
			jitterRotate +
			(index % 2 === 0 ? -8 : 8),
		origin: stampOrigins[index % stampOrigins.length],
		zIndex: 20 + Math.round(getStableNoise(seed, index, 3) * 5),
	}
}

export default function TeamCarousel({ persons, language }: TeamCarouselProps) {
	const shouldReduceMotion = useReducedMotion()
	const containerRef = useRef<HTMLDivElement>(null)
	const wheelLockRef = useRef(false)
	const transitionTimersRef = useRef<number[]>([])
	const [containerWidth, setContainerWidth] = useState(0)
	const [windowWidth, setWindowWidth] = useState(0)
	const [windowHeight, setWindowHeight] = useState(0)

	const teamMembers: TeamMember[] = useMemo(
		() =>
			persons.map((person, index) => ({
				id: person._id,
				name: person.name,
				title: getLocalizedValue(person.title, language),
				description:
					getLocalizedValue(person.biography, language) ||
					'No description available',
				image: person.image,
				hasImage: Boolean(person.image?.asset),
				shape: shapeProfiles[index % shapeProfiles.length],
			})),
		[language, persons],
	)

	const totalMembers = teamMembers.length
	const defaultActiveIndex = Math.max(
		0,
		teamMembers.findIndex((member) => member.hasImage),
	)
	const [activeIndex, setActiveIndex] = useState(defaultActiveIndex)
	const [animationPhase, setAnimationPhase] = useState<
		'idle' | 'closing' | 'opening'
	>('idle')
	const [isNormalizingSlots, setIsNormalizingSlots] = useState(false)
	const [slotPositions, setSlotPositions] = useState<number[]>(() =>
		getInitialSlots(totalMembers, defaultActiveIndex),
	)
	const activeMember = teamMembers[activeIndex]
	const activeNameParts = getNameParts(activeMember?.name || '')

	useEffect(() => {
		const element = containerRef.current
		if (!element) return

		const updateWidth = () => {
			setContainerWidth(element.offsetWidth)
			setWindowWidth(window.innerWidth)
			setWindowHeight(window.innerHeight)
		}
		updateWidth()

		const observer = new ResizeObserver(updateWidth)
		observer.observe(element)
		window.addEventListener('resize', updateWidth)

		return () => {
			observer.disconnect()
			window.removeEventListener('resize', updateWidth)
		}
	}, [])

	useEffect(() => {
		if (!totalMembers) {
			setActiveIndex(0)
			return
		}

		setActiveIndex((index) => wrapIndex(index, totalMembers))
		setSlotPositions((slots) =>
			slots.length === totalMembers
				? slots
				: getInitialSlots(totalMembers, wrapIndex(activeIndex, totalMembers)),
		)
	}, [activeIndex, totalMembers])

	useEffect(
		() => () => {
			transitionTimersRef.current.forEach((timer) => window.clearTimeout(timer))
		},
		[],
	)

	const navigateTo = useCallback(
		(nextIndex: number, visibleRange: number) => {
			if (
				totalMembers <= 1 ||
				animationPhase !== 'idle' ||
				isNormalizingSlots
			) {
				return
			}

			const normalizedNextIndex = wrapIndex(nextIndex, totalMembers)
			if (normalizedNextIndex === activeIndex) return
			const targetSlot =
				slotPositions[normalizedNextIndex] ??
				getCircularOffset(normalizedNextIndex, activeIndex, totalMembers)
			if (targetSlot === 0) return

			transitionTimersRef.current.forEach((timer) => window.clearTimeout(timer))
			const closeDuration = shouldReduceMotion ? 80 : 320
			const travelDuration = shouldReduceMotion ? 120 : 470

			setAnimationPhase('closing')

			const moveTimer = window.setTimeout(() => {
				setActiveIndex(normalizedNextIndex)
				setSlotPositions((slots) => slots.map((slot) => slot - targetSlot))
				setAnimationPhase('opening')
			}, closeDuration)

			const openTimer = window.setTimeout(() => {
				setIsNormalizingSlots(true)
				setSlotPositions((slots) =>
					normalizeSlots(slots, totalMembers, visibleRange),
				)
				setAnimationPhase('idle')
				window.setTimeout(() => {
					setIsNormalizingSlots(false)
				}, 60)
			}, closeDuration + travelDuration)

			transitionTimersRef.current = [moveTimer, openTimer]
		},
		[
			activeIndex,
			animationPhase,
			isNormalizingSlots,
			shouldReduceMotion,
			slotPositions,
			totalMembers,
		],
	)

	if (!activeMember) {
		return null
	}

	const viewportWidth = containerWidth || windowWidth || 960
	const viewportHeight = windowHeight || 820
	const isDesktop = (windowWidth || viewportWidth) >= 1024
	const desktopActiveMinSize = viewportHeight < 650 ? 280 : 330
	const activeSize = isDesktop
		? clamp(
				Math.min(viewportWidth * 0.5, viewportHeight * 0.48),
				desktopActiveMinSize,
				560,
			)
		: clamp(viewportWidth * 0.72, 236, 330)
	const stageHeight = Math.round(activeSize + (isDesktop ? 74 : 82))
	const bioPanelHeight = isDesktop
		? clamp(viewportHeight * 0.2, 150, 220)
		: 272
	const visibleRange = isDesktop ? 2 : 1
	const slotSpacing = activeSize * (isDesktop ? 0.72 : 0.66)
	const shapeHeight = activeSize * (isDesktop ? 0.68 : 0.7)
	const centerX = viewportWidth / 2
	const travelTransition: Transition = shouldReduceMotion
		? { duration: 0.2, ease }
		: { type: 'spring', stiffness: 150, damping: 20, mass: 0.8 }
	const ringSlots = Array.from({ length: visibleRange * 2 }, (_, index) =>
		index < visibleRange
			? index - visibleRange
			: index - visibleRange + 1,
	)
	const occupiedSlots = new Set(
		slotPositions
			.filter((_, index) => index !== activeIndex)
			.filter((slot) => Math.abs(slot) <= visibleRange && slot !== 0)
			.map((slot) => Math.round(slot)),
	)
	const bufferShapes = ringSlots
		.filter((slot) => !occupiedSlots.has(slot))
		.map((slot) => ({
			slot,
			member: teamMembers[wrapIndex(activeIndex + slot, totalMembers)],
		}))
		.filter(
			(bufferShape): bufferShape is { slot: number; member: TeamMember } =>
				Boolean(bufferShape.member),
		)

	const navigate = (direction: number) => {
		navigateTo(activeIndex + direction, visibleRange)
	}

	const goToPrev = () => navigate(-1)
	const goToNext = () => navigate(1)

	const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
		if (totalMembers <= 1 || animationPhase !== 'idle' || wheelLockRef.current) {
			return
		}

		const horizontalDelta = event.deltaX
		const verticalDelta = event.deltaY

		if (
			Math.abs(horizontalDelta) < 34 ||
			Math.abs(horizontalDelta) < Math.abs(verticalDelta) * 1.35
		) {
			return
		}

		wheelLockRef.current = true
		navigate(horizontalDelta > 0 ? 1 : -1)

		window.setTimeout(() => {
			wheelLockRef.current = false
		}, shouldReduceMotion ? 240 : 850)
	}

	return (
		<div className="lg:shadowtest no-scrollbar relative flex w-full flex-col lg:my-1 lg:h-[calc(100svh-10px)] lg:justify-center lg:overflow-y-auto lg:rounded-xl lg:py-6">
			<button
				onClick={goToPrev}
				className="pointer-events-auto fixed bottom-4 left-8 z-40 lg:hidden"
				aria-label="Previous team member"
				disabled={totalMembers <= 1}
			>
				<NewArrowRightSimple
					theme={{
						stroke: 'var(--color-dark)',
					}}
					className="h-[2.50rem] w-[2.50rem] -rotate-180 rounded-lg border-2 border-primary bg-grayDark p-2 lg:h-auto lg:w-7"
				/>
			</button>
			<button
				onClick={goToNext}
				className="pointer-events-auto fixed bottom-4 right-8 z-40 lg:hidden"
				aria-label="Next team member"
				disabled={totalMembers <= 1}
			>
				<NewArrowRightSimple
					theme={{
						stroke: 'var(--color-dark)',
					}}
					className="h-[2.50rem] w-[2.50rem] rounded-lg border-2 border-primary bg-grayDark p-2 lg:h-auto lg:w-7"
				/>
			</button>

			<button
				onClick={goToPrev}
				className="absolute bottom-[50%] left-4 z-30 hidden md:left-4 lg:bottom-[30%] lg:block"
				aria-label="Previous team member"
				disabled={totalMembers <= 1}
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
				className="absolute bottom-[50%] right-4 z-30 hidden md:right-4 lg:bottom-[30%] lg:block"
				aria-label="Next team member"
				disabled={totalMembers <= 1}
			>
				<NewArrowRightSimple
					theme={{
						stroke: 'var(--color-grayDark)',
					}}
					className="h-auto w-5 lg:w-7"
				/>
			</button>

			<div
				ref={containerRef}
				className="shrink-0 overflow-hidden pb-2 pt-16 lg:pb-1 lg:pt-0"
				onWheel={handleWheel}
			>
				<div
					className="relative w-full"
					style={{ height: stageHeight }}
					aria-live="polite"
				>
					{bufferShapes.map(({ member, slot }) => {
						const cardWidth = isDesktop
							? member.shape.desktopWidth
							: member.shape.mobileWidth
						const targetX = centerX + slot * slotSpacing - cardWidth / 2
						const inactiveY =
							(activeSize - shapeHeight) / 2 +
							member.shape.y * (isDesktop ? 1 : 0.62)
						const targetY = Math.max(18, inactiveY + 18)
						const pulse = shapePulse[wrapIndex(activeIndex + slot, shapePulse.length)]
						const shouldPulse = animationPhase === 'idle' && !shouldReduceMotion

						return (
							<motion.div
								key={`buffer-${slot}-${member.id}`}
								aria-hidden="true"
								className="pointer-events-none absolute left-0 top-0"
								style={{ zIndex: 0 }}
								initial={false}
								animate={{
									x: targetX,
									y: targetY,
									width: cardWidth,
									height: shapeHeight,
									opacity: 1,
									rotate: member.shape.rotate,
								}}
								transition={isNormalizingSlots ? { duration: 0 } : travelTransition}
							>
								<motion.div
									className="h-full w-full rounded-[18px] bg-primary shadow-[0_14px_34px_rgba(0,0,0,0.16)]"
									style={{ transformOrigin: 'center' }}
									animate={{
										scaleX: shouldPulse ? pulse.animate.scaleX : 1,
										scaleY: shouldPulse ? pulse.animate.scaleY : 1,
									}}
									transition={{
										scaleX: shouldPulse
											? pulse.transition
											: { duration: 0.24, ease },
										scaleY: shouldPulse
											? pulse.transition
											: { duration: 0.24, ease },
									}}
								/>
							</motion.div>
						)
					})}

					{teamMembers.map((member, index) => {
						const slot =
							slotPositions[index] ??
							getCircularOffset(index, activeIndex, totalMembers)
						const distance = Math.abs(slot)
						const isActive = index === activeIndex
						const isPortraitOpen = isActive && animationPhase === 'idle'
						const isVisible = distance <= visibleRange
						const shouldPulse =
							!isActive &&
							isVisible &&
							animationPhase === 'idle' &&
							!shouldReduceMotion
						const clampedOffset = clamp(slot, -visibleRange - 1, visibleRange + 1)
						const cardWidth = isActive
							? activeSize
							: isDesktop
								? member.shape.desktopWidth
								: member.shape.mobileWidth
						const cardHeight = isActive ? activeSize : shapeHeight
						const targetX = centerX + clampedOffset * slotSpacing - cardWidth / 2
						const inactiveY =
							(activeSize - shapeHeight) / 2 + member.shape.y * (isDesktop ? 1 : 0.62)
						const targetY = isActive ? 0 : Math.max(18, inactiveY + 18)
						const pulse = shapePulse[index % shapePulse.length]

						return (
							<motion.article
								key={member.id}
								className="absolute left-0 top-0 cursor-pointer overflow-visible"
								style={{
									zIndex: isActive ? 30 : Math.max(1, 18 - distance),
									pointerEvents: isVisible ? 'auto' : 'none',
								}}
								initial={false}
								animate={{
									x: targetX,
									y: targetY,
									width: cardWidth,
									height: cardHeight,
									opacity: isVisible ? 1 : 0,
									scale: isVisible ? 1 : 0.82,
									rotate: isActive ? 0 : member.shape.rotate,
								}}
								transition={{
									...(isNormalizingSlots
										? { duration: 0 }
										: travelTransition),
									opacity: {
										duration: isNormalizingSlots ? 0 : 0.24,
										ease,
									},
								}}
								onClick={() => {
									if (!isActive) navigateTo(index, visibleRange)
								}}
								aria-hidden={!isVisible}
							>
								<motion.div
									className={`relative h-full w-full overflow-hidden border-primary bg-primary ${
										isActive
											? 'shadow-[0_8px_20px_rgba(0,0,0,0.09)]'
											: 'shadow-[0_14px_34px_rgba(0,0,0,0.16)]'
									}`}
									style={{ transformOrigin: 'center' }}
									animate={{
										borderRadius: isActive ? 30 : 18,
										borderWidth: isActive ? 4 : 0,
										scaleX: shouldPulse ? pulse.animate.scaleX : 1,
										scaleY: shouldPulse ? pulse.animate.scaleY : 1,
									}}
									transition={{
										borderRadius: {
											duration: shouldReduceMotion ? 0.12 : 0.34,
											ease,
										},
										borderWidth: {
											duration: shouldReduceMotion ? 0.12 : 0.28,
											ease,
										},
										scaleX: shouldPulse
											? pulse.transition
											: { duration: 0.24, ease },
										scaleY: shouldPulse
											? pulse.transition
											: { duration: 0.24, ease },
									}}
								>
									<motion.div
										className="absolute inset-0 bg-primary"
										animate={{
											opacity: isPortraitOpen ? 0 : 1,
										}}
										transition={{ duration: 0.2, ease }}
									/>

									<motion.div
										className="absolute inset-0"
										style={{
											clipPath: 'none',
											filter: 'none',
										}}
										animate={{
											opacity: isPortraitOpen ? 1 : 0,
										}}
										transition={{
											duration: shouldReduceMotion ? 0.16 : 0.34,
											ease,
										}}
									>
										<Img
											image={member.image}
											alt={member.name}
											imageWidth={900}
											className="h-full w-full object-cover"
										/>
										<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,transparent_44%,rgba(0,0,0,0.2)_100%)]" />
									</motion.div>

									<motion.div
										className="pointer-events-none absolute inset-0 border-primary"
										animate={{
											borderRadius: isActive ? 26 : 18,
											borderWidth: isActive ? 0 : 2,
											opacity: isActive ? 0 : 0.18,
										}}
										transition={{ duration: 0.25, ease }}
									/>
								</motion.div>

								<AnimatePresence>
									{isPortraitOpen && (
										<motion.div
											key={`${member.id}-label`}
											className="absolute -bottom-7 left-1/2 z-20 flex w-[116%] flex-wrap items-center justify-center gap-0 lg:-bottom-9"
											initial={{
												opacity: 0,
												x: '-50%',
												y: 10,
											}}
											animate={{
												opacity: 1,
												x: '-50%',
												y: 0,
											}}
											exit={{
												opacity: 0,
												x: '-50%',
												y: 12,
											}}
											transition={{
												duration: shouldReduceMotion ? 0.12 : 0.22,
												ease,
											}}
										>
											{activeNameParts.map((namePart, namePartIndex) => {
												const pose = getNamePillPose(
													namePartIndex,
													activeNameParts.length,
													activeMember.id || activeMember.name,
												)

												return (
													<motion.span
														key={`${member.id}-${namePart}-${namePartIndex}`}
														className="-ml-2 block max-w-full rounded-md border-[3px] border-primary bg-dark px-2 text-center text-2xl font-black italic leading-[0.92] tracking-tight text-primary shadow-[0_4px_12px_rgba(0,0,0,0.14)] first:ml-0 sm:-ml-3 sm:text-3xl lg:-ml-4 lg:px-3 lg:text-5xl"
														style={{
															transformOrigin: `${pose.origin.x * 100}% ${pose.origin.y * 100}%`,
															zIndex: pose.zIndex,
														}}
														initial={
															shouldReduceMotion
																? { opacity: 0 }
																: {
																		opacity: 0,
																		x: pose.enterX,
																		y: pose.enterY,
																		rotate: pose.enterRotate,
																		scale: 1.65,
																	}
														}
														animate={
															shouldReduceMotion
																? { opacity: 1 }
																: {
																		opacity: [0, 1, 1, 1],
																		x: [pose.enterX, pose.x, pose.x + 2, pose.x],
																		y: [pose.enterY, pose.y, pose.y + 1, pose.y],
																		rotate: [
																			pose.enterRotate,
																			pose.rotate,
																			pose.rotate + (namePartIndex % 2 === 0 ? 1 : -1),
																			pose.rotate,
																		],
																		scale: [1.65, 0.9, 1.04, 1],
																		boxShadow: [
																			'0 28px 38px rgba(0,0,0,0)',
																			'0 1px 0 rgba(0,0,0,0.16)',
																			'0 6px 12px rgba(0,0,0,0.13)',
																			'0 4px 12px rgba(0,0,0,0.14)',
																		],
																	}
														}
														exit={
															shouldReduceMotion
																? { opacity: 0 }
																: {
																		opacity: 0,
																		scale: 0.86,
																		y: pose.y + 8,
																		rotate:
																			pose.rotate +
																			(namePartIndex % 2 === 0 ? -5 : 5),
																	}
														}
														transition={{
															duration: shouldReduceMotion ? 0.12 : 0.36,
															delay: shouldReduceMotion
																? 0
																: 0.08 + namePartIndex * 0.075,
															times: [0, 0.34, 0.62, 1],
															ease,
														}}
													>
														{namePart}
													</motion.span>
												)
											})}
										</motion.div>
									)}
								</AnimatePresence>
							</motion.article>
						)
					})}
				</div>
			</div>

			<div
				className="relative mx-4 mt-1 shrink-0 overflow-hidden rounded-[1.75rem] bg-primary px-4 py-4 text-dark shadow-[0_14px_34px_rgba(0,0,0,0.14)] sm:mx-8 lg:mx-auto lg:mt-0 lg:w-[78%] lg:max-w-[48rem] lg:rounded-[2rem] lg:px-6 lg:py-5"
				style={{ height: bioPanelHeight }}
			>
				<AnimatePresence mode="wait">
					<motion.div
						key={activeMember.id}
						className="no-scrollbar h-full overflow-y-auto pr-1"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: shouldReduceMotion ? 0.12 : 0.22, ease }}
					>
						<motion.p
							className="text-base font-normal leading-[1.18] tracking-tight text-dark lg:text-xl lg:leading-[1.3]"
							initial={{
								opacity: 0,
								y: shouldReduceMotion ? 0 : 16,
								filter: shouldReduceMotion ? 'blur(0px)' : 'blur(6px)',
							}}
							animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
							exit={{
								opacity: 0,
								y: shouldReduceMotion ? 0 : -10,
								filter: shouldReduceMotion ? 'blur(0px)' : 'blur(4px)',
							}}
							transition={{
								duration: shouldReduceMotion ? 0.12 : 0.34,
								ease,
							}}
						>
							{activeMember.description}
						</motion.p>
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	)
}
