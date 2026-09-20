'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Transition } from 'motion/react'
import Img, { getImageDimensions } from '@/ui/Img'
import RichText from '@/components/common/RichText'
import { localizedRichText, richTextToPlainText } from '@/lib/richText'
import NewArrowRightFull from '../common/NewArrowRightFull'
import { FILM_LABEL_TEXT } from '../film/filmLabelStyles'
import {
	EDITORIAL_BODY_TEXT,
	EDITORIAL_COPY_WIDTH,
} from '@/components/common/editorialStyles'

interface TeamMember {
	id: string
	name: string
	role: string
	description: any
	image: any
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
const shapeRadius = 6

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

const getCircularOffset = (
	index: number,
	activeIndex: number,
	total: number,
) => {
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

const normalizeSlots = (
	slots: number[],
	total: number,
	visibleRange: number,
) => {
	if (total <= 0) return slots

	return slots.map((slot) => {
		let normalizedSlot = slot

		while (normalizedSlot > visibleRange) normalizedSlot -= total
		while (normalizedSlot < -visibleRange) normalizedSlot += total

		return normalizedSlot
	})
}

const getNameParts = (name: string) => name.trim().split(/\s+/).filter(Boolean)

const getStableNoise = (seed: string, index: number, salt: number) => {
	let hash = 2166136261
	const value = `${seed}-${index}-${salt}`

	for (let i = 0; i < value.length; i += 1) {
		hash ^= value.charCodeAt(i)
		hash = Math.imul(hash, 16777619)
	}

	return ((hash >>> 0) % 1000) / 500 - 1
}

const getNamePillRotation = (index: number, seed: string) => {
	const rotations = [-3.5, 2.5, -1.5, 3, -2.25]
	const jitterRotate = getStableNoise(seed, index, 2) * 1.5
	return rotations[index % rotations.length] + jitterRotate
}

export default function TeamCarousel({ persons, language }: TeamCarouselProps) {
	const shouldReduceMotion = useReducedMotion()
	const containerRef = useRef<HTMLDivElement>(null)
	const wheelLockRef = useRef(false)
	const transitionTimersRef = useRef<number[]>([])
	const [containerWidth, setContainerWidth] = useState(0)
	const [windowWidth, setWindowWidth] = useState(0)
	const [windowHeight, setWindowHeight] = useState(0)
	const [nameHeight, setNameHeight] = useState(0)
	const measureName = useCallback((element: HTMLHeadingElement | null) => {
		if (!element) return
		const updateHeight = () => setNameHeight(element.offsetHeight)
		updateHeight()
		const observer = new ResizeObserver(updateHeight)
		observer.observe(element)
		return () => observer.disconnect()
	}, [])

	const teamMembers: TeamMember[] = useMemo(
		() =>
			persons.map((person, index) => ({
				id: person._id,
				name: richTextToPlainText(person.name),
				role: richTextToPlainText(localizedRichText(person.role, language)),
				description: localizedRichText(person.biography, language),
				image: person.image,
				shape: shapeProfiles[index % shapeProfiles.length],
			})),
		[language, persons],
	)

	const totalMembers = teamMembers.length
	const [activeIndex, setActiveIndex] = useState(0)
	const [animationPhase, setAnimationPhase] = useState<
		'idle' | 'closing' | 'opening'
	>('idle')
	const [isNormalizingSlots, setIsNormalizingSlots] = useState(false)
	const [slotPositions, setSlotPositions] = useState<number[]>(() =>
		getInitialSlots(totalMembers, 0),
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
	const desktopActiveMinSize = viewportHeight < 650 ? 240 : 280
	const activeSize = isDesktop
		? clamp(
				Math.min(viewportWidth * 0.45, viewportHeight * 0.42),
				desktopActiveMinSize,
				440,
			)
		: clamp(viewportWidth * 0.72, 236, 330)
	const imageDimensions = activeMember.image
		? getImageDimensions(activeMember.image)
		: undefined
	const imageRatio = imageDimensions
		? imageDimensions.width / imageDimensions.height
		: 1
	// Fit the photo at its native ratio, with room for the 2px frame.
	const activeWidth = (activeSize - 4) * Math.min(1, imageRatio) + 4
	const activeHeight = (activeSize - 4) / Math.max(1, imageRatio) + 4
	const stageHeight = activeSize
	const visibleRange = isDesktop ? 2 : 1
	const shapeHeight = activeSize * (isDesktop ? 0.68 : 0.7)
	const centerX = viewportWidth / 2
	const cardGap = isDesktop ? 10 : 8
	const slotCenters = new Map([[0, centerX]])
	for (const direction of [-1, 1]) {
		let edge = centerX + direction * (activeWidth / 2)
		for (let distance = 1; distance <= visibleRange + 1; distance += 1) {
			const slot = direction * distance
			const memberIndex = slotPositions.indexOf(slot)
			const member = teamMembers[
				memberIndex >= 0 ? memberIndex : wrapIndex(activeIndex + slot, totalMembers)
			]
			const width = isDesktop ? member.shape.desktopWidth : member.shape.mobileWidth
			const slotCenter = edge + direction * (cardGap + width / 2)
			slotCenters.set(slot, slotCenter)
			edge = slotCenter + direction * (width / 2)
		}
	}
	const travelTransition: Transition = shouldReduceMotion
		? { duration: 0.2, ease }
		: { type: 'spring', stiffness: 150, damping: 20, mass: 0.8 }
	const ringSlots = Array.from({ length: visibleRange * 2 }, (_, index) =>
		index < visibleRange ? index - visibleRange : index - visibleRange + 1,
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
		if (
			totalMembers <= 1 ||
			animationPhase !== 'idle' ||
			wheelLockRef.current
		) {
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

		window.setTimeout(
			() => {
				wheelLockRef.current = false
			},
			shouldReduceMotion ? 240 : 850,
		)
	}

	return (
		<div
			className="team-carousel lg:shadowtest section-folder-content section-folder-content--equipe theme-equipe-main-content no-scrollbar relative flex w-full flex-col pb-28 text-primary [container-type:inline-size] lg:my-1 lg:h-[calc(100svh-8px)] lg:overflow-y-auto lg:rounded-xl lg:py-10"
			onKeyDown={(event) => {
				if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
					event.preventDefault()
					navigate(event.key === 'ArrowLeft' ? -1 : 1)
				}
			}}
		>
			<div
				ref={containerRef}
				className="shrink-0 overflow-hidden pt-12 lg:mt-auto lg:pt-3"
				onWheel={handleWheel}
			>
				<div className="relative w-full" style={{ height: stageHeight }}>
					{bufferShapes.map(({ member, slot }) => {
						const cardWidth = isDesktop
							? member.shape.desktopWidth
							: member.shape.mobileWidth
						const targetX = slotCenters.get(slot)! - cardWidth / 2
						const inactiveY =
							(activeSize - shapeHeight) / 2 +
							member.shape.y * (isDesktop ? 1 : 0.62)
						const targetY = Math.max(18, inactiveY + 18)
						const pulse =
							shapePulse[wrapIndex(activeIndex + slot, shapePulse.length)]
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
								transition={
									isNormalizingSlots ? { duration: 0 } : travelTransition
								}
							>
								<motion.div
									className="h-full w-full rounded-md bg-grayDark shadow-[0_14px_34px_rgba(0,0,0,0.16)]"
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
						const clampedOffset = clamp(
							slot,
							-visibleRange - 1,
							visibleRange + 1,
						)
						const cardWidth = isActive
							? activeWidth
							: isDesktop
								? member.shape.desktopWidth
								: member.shape.mobileWidth
						const cardHeight = isActive ? activeHeight : shapeHeight
						const targetX = slotCenters.get(clampedOffset)! - cardWidth / 2
						const inactiveY =
							(activeSize - shapeHeight) / 2 +
							member.shape.y * (isDesktop ? 1 : 0.62)
						const targetY = isActive
							? activeSize - activeHeight
							: Math.max(18, inactiveY + 18)
						const pulse = shapePulse[index % shapePulse.length]

						return (
							<motion.button
								key={member.id}
								type="button"
								aria-label={member.name}
								aria-pressed={isActive}
								tabIndex={isVisible ? 0 : -1}
								className="absolute left-0 top-0 cursor-pointer rounded-md border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
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
									...(isNormalizingSlots ? { duration: 0 } : travelTransition),
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
									className={`relative h-full w-full overflow-hidden rounded-md border-primary bg-grayDark ${
										isActive
											? 'shadow-[0_8px_20px_rgba(0,0,0,0.09)]'
											: 'shadow-[0_14px_34px_rgba(0,0,0,0.16)]'
									}`}
									style={{ transformOrigin: 'center' }}
									animate={{
										borderRadius: shapeRadius,
										borderWidth: isActive ? 2 : 0,
										scaleX: shouldPulse ? pulse.animate.scaleX : 1,
										scaleY: shouldPulse ? pulse.animate.scaleY : 1,
									}}
									transition={{
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
										className="absolute inset-0 bg-grayDark"
										initial={false}
										animate={{
											opacity: isPortraitOpen ? 0 : 1,
										}}
										transition={{ duration: 0.2, ease }}
									/>

									<motion.div
										className="absolute inset-0"
										initial={false}
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
											draggable={false}
											alt=""
											imageWidth={900}
											className="h-full w-full object-contain"
											placeholderFit="contain"
										/>
									</motion.div>

									<motion.div
										className="pointer-events-none absolute inset-0 rounded-md border-grayDark"
										animate={{
											borderRadius: shapeRadius,
											borderWidth: isActive ? 0 : 2,
											opacity: isActive ? 0 : 0.18,
										}}
										transition={{ duration: 0.25, ease }}
									/>
								</motion.div>
							</motion.button>
						)
					})}
				</div>
			</div>

			<div
				className="team-member-controls relative z-30 mx-auto w-[calc(100%-2rem)] max-w-[38rem] shrink-0"
				style={{ marginTop: -nameHeight / 2 }}
			>
				<div
					className="min-w-0"
					aria-live="polite"
					aria-atomic="true"
				>
					<AnimatePresence mode="wait" initial={false}>
						<motion.div
							key={activeMember.id}
							className="min-w-0"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: shouldReduceMotion ? 0.1 : 0.18, ease }}
						>
							<h2
								ref={measureName}
								className="team-member-name flex flex-wrap items-center justify-center text-lg font-bold italic leading-none tracking-tight lg:text-[clamp(1rem,2.17cqw,1.5rem)]"
							>
								{activeNameParts.map((namePart, index) => {
									const rotation = getNamePillRotation(
										index,
										activeMember.id || activeMember.name,
									)
									return (
										<motion.span
											key={`${activeMember.id}-${index}`}
											className={`block max-w-full rounded-md border-2 border-current py-0.5 pl-1.5 pr-2.5 text-dark ${index > 0 ? '-ml-1.5' : ''} ${index % 2 ? 'bg-grayDark' : 'bg-primary'}`}
											initial={false}
											animate={{ rotate: rotation }}
											transition={{
												duration: shouldReduceMotion ? 0 : 0.2,
												ease,
											}}
										>
											{namePart}
										</motion.span>
									)
								})}
							</h2>
						</motion.div>
					</AnimatePresence>
				</div>
				<div className="team-member-role-controls mx-auto mt-1 flex w-fit max-w-full items-center justify-center gap-2">
					<button
						type="button"
						onClick={goToPrev}
						className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-sm transition-transform before:absolute before:-inset-1.5 hover:-translate-x-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:invisible motion-reduce:transform-none"
						aria-label="Previous team member"
						disabled={totalMembers <= 1}
					>
						<NewArrowRightFull
							theme={{ stroke: 'var(--color-primary)' }}
							strokeWidth={8}
							className="h-auto w-6 rotate-180"
						/>
					</button>
					<AnimatePresence mode="wait" initial={false}>
						{activeMember.role && (
							<motion.p
								key={activeMember.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: shouldReduceMotion ? 0.1 : 0.18, ease }}
								className={`team-member-role relative z-10 min-w-0 -rotate-3 rounded-md border-2 border-primary bg-dark px-1.5 py-0 text-center text-primary ${FILM_LABEL_TEXT}`}
							>
								{activeMember.role}
							</motion.p>
						)}
					</AnimatePresence>
					<button
						type="button"
						onClick={goToNext}
						className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-sm transition-transform before:absolute before:-inset-1.5 hover:translate-x-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:invisible motion-reduce:transform-none"
						aria-label="Next team member"
						disabled={totalMembers <= 1}
					>
						<NewArrowRightFull
							theme={{ stroke: 'var(--color-primary)' }}
							strokeWidth={8}
							className="h-auto w-6"
						/>
					</button>
				</div>
			</div>

			<div
				className={`theme-equipe-bio mx-auto mt-5 min-h-36 shrink-0 text-primary lg:mb-auto lg:mt-6 ${EDITORIAL_COPY_WIDTH}`}
			>
				<AnimatePresence mode="wait" initial={false}>
					<motion.div
						key={activeMember.id}
						className={`mx-auto max-w-[60ch] ${EDITORIAL_BODY_TEXT}`}
						initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						transition={{ duration: shouldReduceMotion ? 0.1 : 0.18, ease }}
					>
						<RichText value={activeMember.description} />
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	)
}
