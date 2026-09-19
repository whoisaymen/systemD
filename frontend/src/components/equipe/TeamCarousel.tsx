'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Transition } from 'motion/react'
import Img from '@/ui/Img'
import RichText from '@/components/common/RichText'
import { localizedRichText, richTextToPlainText } from '@/lib/richText'
import CartoonLeftArrow from '../common/CartoonLeftArrow'
import {
	EDITORIAL_BODY_TEXT,
	EDITORIAL_COPY_WIDTH,
} from '@/components/common/editorialStyles'

interface TeamMember {
	id: string
	name: string
	description: any
	nameContent?: any
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

const getNamePillPose = (index: number, total: number, seed: string) => {
	const rotations = [-3.5, 2.5, -1.5, 3, -2.25]
	const yOffsets = [-2, 3, 0, 4, 1]
	const centerOffset = index - (total - 1) / 2
	const jitterX = getStableNoise(seed, index, 0) * 3
	const jitterY = getStableNoise(seed, index, 1) * 2
	const jitterRotate = getStableNoise(seed, index, 2) * 1.5
	return {
		rotate: rotations[index % rotations.length] + jitterRotate,
		x: centerOffset * 2 + jitterX,
		y: yOffsets[index % yOffsets.length] + jitterY,
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
				name: richTextToPlainText(person.name),
				nameContent: person.name,
				description: localizedRichText(person.biography, language),
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
	const useFormattedName = Boolean(
		activeMember?.nameContent &&
		(richTextToPlainText(activeMember.nameContent) !== activeMember.name ||
			activeMember.nameContent.some?.(
				(block: any) =>
					block.markDefs?.length ||
					block.children?.some((span: any) => span.marks?.length),
			)),
	)

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
	const stageHeight = Math.round(activeSize + 24)
	const visibleRange = isDesktop ? 2 : 1
	const slotSpacing = activeSize * (isDesktop ? 0.72 : 0.66)
	const shapeHeight = activeSize * (isDesktop ? 0.68 : 0.7)
	const centerX = viewportWidth / 2
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
						const targetX = centerX + slot * slotSpacing - cardWidth / 2
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
							? activeSize
							: isDesktop
								? member.shape.desktopWidth
								: member.shape.mobileWidth
						const cardHeight = isActive ? activeSize : shapeHeight
						const targetX =
							centerX + clampedOffset * slotSpacing - cardWidth / 2
						const inactiveY =
							(activeSize - shapeHeight) / 2 +
							member.shape.y * (isDesktop ? 1 : 0.62)
						const targetY = isActive ? 0 : Math.max(18, inactiveY + 18)
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
											alt=""
											imageWidth={900}
											className="h-full w-full object-cover"
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

			<div className="team-member-controls relative z-30 mx-auto -mt-8 grid w-[calc(100%-2rem)] max-w-[38rem] shrink-0 grid-cols-[3rem_minmax(0,1fr)_3rem] items-center gap-2 sm:gap-4">
				<button
					type="button"
					onClick={goToPrev}
					className="flex min-h-12 items-center justify-center rounded-sm transition-transform hover:-translate-x-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:invisible motion-reduce:transform-none"
					aria-label="Previous team member"
					disabled={totalMembers <= 1}
				>
					<CartoonLeftArrow className="h-auto w-11" />
				</button>
				<div
					className="flex min-h-16 items-center justify-center"
					aria-live="polite"
					aria-atomic="true"
				>
					<AnimatePresence mode="wait" initial={false}>
						<motion.h2
							key={activeMember.id}
							className="team-member-name flex flex-wrap items-center justify-center gap-x-1 gap-y-2 py-2 text-lg font-bold italic leading-none tracking-tight lg:text-[clamp(1rem,2.17cqw,1.5rem)]"
							initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -4 }}
							transition={{ duration: shouldReduceMotion ? 0.1 : 0.18, ease }}
						>
							{(useFormattedName ? ['formatted-name'] : activeNameParts).map(
								(namePart, index) => {
									const pose = getNamePillPose(
										index,
										activeNameParts.length,
										activeMember.id || activeMember.name,
									)
									return (
										<motion.span
											key={`${activeMember.id}-${index}`}
											className={`block max-w-full rounded-sm px-1.5 py-0.5 text-dark ${index % 2 ? 'bg-grayDark' : 'bg-primary'}`}
											initial={false}
											animate={{ rotate: pose.rotate, x: pose.x, y: pose.y }}
											transition={{
												duration: shouldReduceMotion ? 0 : 0.2,
												ease,
											}}
										>
											{useFormattedName ? (
												<RichText
													value={activeMember.nameContent}
													inline
													allowLinks={false}
												/>
											) : (
												namePart
											)}
										</motion.span>
									)
								},
							)}
						</motion.h2>
					</AnimatePresence>
				</div>
				<button
					type="button"
					onClick={goToNext}
					className="flex min-h-12 items-center justify-center rounded-sm transition-transform hover:translate-x-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:invisible motion-reduce:transform-none"
					aria-label="Next team member"
					disabled={totalMembers <= 1}
				>
					<CartoonLeftArrow className="h-auto w-11 rotate-180" />
				</button>
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
