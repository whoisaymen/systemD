import Img from '@/ui/Img'
import RichText from '@/components/common/RichText'
import { motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight, Minimize2 } from 'lucide-react'
import { FILM_LABEL_TEXT } from '../film/filmLabelStyles'
import { richTextLines } from '@/lib/richTextLines'
import { photoCreditRotation } from './photoCreditStyles'

import {
	getGalleryLayout,
	getActivePhotoRect,
	getGalleryFrames,
	getWrappedIndex,
	type GalleryLayout,
	type GalleryRect,
} from './festivalGalleryLayout'

export type { GalleryRect } from './festivalGalleryLayout'

const GALLERY_FRAME_TRANSITION =
	'left 800ms cubic-bezier(0.76, 0, 0.24, 1), top 800ms cubic-bezier(0.76, 0, 0.24, 1), width 800ms cubic-bezier(0.76, 0, 0.24, 1), height 800ms cubic-bezier(0.76, 0, 0.24, 1), border-radius 800ms cubic-bezier(0.76, 0, 0.24, 1)'
const GALLERY_BACKDROP_TRANSITION =
	'opacity 800ms cubic-bezier(0.76, 0, 0.24, 1)'
const PHOTO_TRANSITION_EASE = [0.76, 0, 0.24, 1] as const
const FILM_SURFACE = 'var(--color-grayDark)'
const FILM_DARK = 'var(--color-dark)'
const FILM_LIGHT = 'var(--color-primary)'

const getFallbackOriginRect = (): GalleryRect => {
	const width = Math.min(window.innerWidth * 0.65, 420)
	const height = Math.min(window.innerHeight * 0.5, 280)

	return {
		height,
		left: (window.innerWidth - width) / 2,
		top: (window.innerHeight - height) / 2,
		width,
	}
}

const getViewportGalleryLayout = (fullscreenImage = false) =>
	getGalleryLayout(
		{ width: window.innerWidth, height: window.innerHeight },
		fullscreenImage,
	)

const FestivalCarousel: React.FC<{
	photos: {
		photo: any
		photographer?: any
		artistName?: string
		curatorName?: string
	}[]
	initialIndex?: number
	originRect?: GalleryRect | null
	onClose?: () => void
	variant?: 'gallery' | 'image'
	imageFit?: 'cover' | 'contain'
}> = ({
	photos,
	initialIndex = 0,
	originRect,
	onClose,
	variant = 'gallery',
	imageFit = 'cover',
}) => {
	const isPlainImage = variant === 'image'
	const fillsViewport = isPlainImage && imageFit === 'cover'
	const shouldReduceMotion = useReducedMotion() === true
	const [position, setPosition] = useState(initialIndex)
	const [navigationDuration, setNavigationDuration] = useState(0)
	const currentIndex = getWrappedIndex(position, photos.length)
	const [overlayMode, setOverlayMode] = useState<
		'opening' | 'open' | 'closing'
	>('opening')
	const [layout, setLayout] = useState<GalleryLayout | null>(() => {
		if (typeof window === 'undefined') return null
		return getViewportGalleryLayout(fillsViewport)
	})
	const [imageFrame, setImageFrame] = useState<GalleryRect | null>(() => {
		if (typeof window === 'undefined') return null
		return originRect ?? getFallbackOriginRect()
	})
	const [hasFrameTransition, setHasFrameTransition] = useState(false)
	const [backdropOpacity, setBackdropOpacity] = useState(0)
	const isClosingRef = useRef(false)
	const closeButtonRef = useRef<HTMLButtonElement>(null)
	const dialogRef = useRef<HTMLDivElement>(null)
	const openingPhotoRef = useRef(photos[initialIndex]?.photo)
	const tPhotoGallery = useTranslations('photoGallery')

	const activePhoto = photos[currentIndex]
	const photographer = activePhoto?.photographer
	const startRect = useMemo(() => {
		if (typeof window === 'undefined') return null
		return originRect ?? getFallbackOriginRect()
	}, [originRect])
	const showChrome = overlayMode === 'open'
	const hasNavigation = photos.length > 1
	const activeRect =
		layout && activePhoto
			? getActivePhotoRect(layout, activePhoto.photo, fillsViewport)
			: null

	useEffect(() => {
		if (!startRect) return

		const nextLayout = getViewportGalleryLayout(fillsViewport)
		const nextActiveRect = getActivePhotoRect(
			nextLayout,
			openingPhotoRef.current,
			fillsViewport,
		)
		setLayout(nextLayout)
		setImageFrame(startRect)
		setHasFrameTransition(false)
		setBackdropOpacity(0)
		setOverlayMode('opening')

		if (shouldReduceMotion) {
			setImageFrame(nextActiveRect)
			setBackdropOpacity(1)
			setOverlayMode('open')
			return
		}

		let secondFrame = 0
		const firstFrame = window.requestAnimationFrame(() => {
			secondFrame = window.requestAnimationFrame(() => {
				setHasFrameTransition(true)
				setBackdropOpacity(1)
				setImageFrame(nextActiveRect)
			})
		})

		return () => {
			window.cancelAnimationFrame(firstFrame)
			window.cancelAnimationFrame(secondFrame)
		}
	}, [fillsViewport, shouldReduceMotion, startRect])

	useEffect(() => {
		if (!isPlainImage) return
		const trigger = document.activeElement
		return () => {
			if (trigger instanceof HTMLElement && trigger.isConnected) {
				trigger.focus({ preventScroll: true })
			}
		}
	}, [isPlainImage])

	useEffect(() => {
		if (isPlainImage && showChrome) {
			closeButtonRef.current?.focus({ preventScroll: true })
		}
	}, [isPlainImage, showChrome])

	useEffect(() => {
		const previousBodyOverflow = document.body.style.overflow
		const previousBodyPaddingRight = document.body.style.paddingRight
		const previousHtmlOverflow = document.documentElement.style.overflow
		const previousTouchAction = document.body.style.touchAction
		const scrollbarWidth = Math.max(
			0,
			window.innerWidth - document.documentElement.clientWidth,
		)
		const bodyPaddingRight =
			Number.parseFloat(window.getComputedStyle(document.body).paddingRight) ||
			0

		if (scrollbarWidth > 0) {
			document.body.style.paddingRight = `${bodyPaddingRight + scrollbarWidth}px`
		}
		document.body.style.overflow = 'hidden'
		document.documentElement.style.overflow = 'hidden'
		document.body.style.touchAction = 'none'

		return () => {
			document.body.style.overflow = previousBodyOverflow
			document.body.style.paddingRight = previousBodyPaddingRight
			document.documentElement.style.overflow = previousHtmlOverflow
			document.body.style.touchAction = previousTouchAction
		}
	}, [])

	const handleNext = useCallback(() => {
		setNavigationDuration(0.55)
		setPosition((previous) => previous + 1)
	}, [])

	const handlePrev = useCallback(() => {
		setNavigationDuration(0.55)
		setPosition((previous) => previous - 1)
	}, [])

	const handleClose = useCallback(() => {
		if (isClosingRef.current) return
		isClosingRef.current = true

		if (shouldReduceMotion) {
			onClose?.()
			return
		}

		const currentLayout = getViewportGalleryLayout(fillsViewport)
		const currentActiveRect = getActivePhotoRect(
			currentLayout,
			photos[currentIndex]?.photo,
			fillsViewport,
		)
		setLayout(currentLayout)
		setOverlayMode('closing')
		setImageFrame(currentActiveRect)
		setHasFrameTransition(false)
		setBackdropOpacity(1)

		let secondFrame = 0
		const firstFrame = window.requestAnimationFrame(() => {
			secondFrame = window.requestAnimationFrame(() => {
				setHasFrameTransition(true)
				setBackdropOpacity(0)
				setImageFrame(startRect ?? getFallbackOriginRect())
			})
		})

		return () => {
			window.cancelAnimationFrame(firstFrame)
			window.cancelAnimationFrame(secondFrame)
		}
	}, [
		currentIndex,
		fillsViewport,
		onClose,
		photos,
		shouldReduceMotion,
		startRect,
	])

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (isPlainImage && event.key === 'Tab') {
				const buttons = Array.from(
					dialogRef.current?.querySelectorAll<HTMLButtonElement>(
						'button:not([disabled])',
					) ?? [],
				)
				const first = buttons[0]
				const last = buttons[buttons.length - 1]
				const active = document.activeElement
				if (!first) event.preventDefault()
				else if (
					event.shiftKey &&
					(active === first || !buttons.includes(active as HTMLButtonElement))
				) {
					event.preventDefault()
					last.focus()
				} else if (
					!event.shiftKey &&
					(active === last || !buttons.includes(active as HTMLButtonElement))
				) {
					event.preventDefault()
					first.focus()
				}
			}

			if (event.key === 'ArrowRight' && overlayMode === 'open') {
				event.preventDefault()
				handleNext()
			}

			if (event.key === 'ArrowLeft' && overlayMode === 'open') {
				event.preventDefault()
				handlePrev()
			}

			if (event.key === 'Escape') {
				event.preventDefault()
				handleClose()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [handleClose, handleNext, handlePrev, isPlainImage, overlayMode])

	useEffect(() => {
		const handleResize = () => {
			const nextLayout = getViewportGalleryLayout(fillsViewport)
			setNavigationDuration(0)
			setLayout(nextLayout)
			if (overlayMode !== 'closing' && (showChrome || hasFrameTransition)) {
				setImageFrame(
					getActivePhotoRect(nextLayout, activePhoto?.photo, fillsViewport),
				)
			}
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [
		activePhoto?.photo,
		fillsViewport,
		overlayMode,
		showChrome,
		hasFrameTransition,
	])

	useEffect(() => {
		if (!hasFrameTransition || overlayMode === 'open') return
		// A width transition does not fire when the two widths already match.
		const timeout = window.setTimeout(() => {
			if (overlayMode === 'opening') setOverlayMode('open')
			else onClose?.()
		}, 850)
		return () => window.clearTimeout(timeout)
	}, [hasFrameTransition, overlayMode, onClose])

	const handleFrameTransitionEnd = (
		event: React.TransitionEvent<HTMLDivElement>,
	) => {
		if (
			event.target !== event.currentTarget ||
			!['width', 'height', 'top', 'left'].includes(event.propertyName)
		) {
			return
		}

		if (overlayMode === 'opening') {
			setOverlayMode('open')
			return
		}

		if (overlayMode === 'closing') {
			onClose?.()
		}
	}

	if (!activePhoto || !imageFrame || !activeRect || !layout) return null

	const frames = isPlainImage ? [] : getGalleryFrames(layout, photos, position)
	const stripBottom = layout.stage.top

	return (
		<div
			ref={dialogRef}
			data-gallery-dialog
			className="group/fullscreen-image pointer-events-none fixed inset-0 z-[10000]"
			role={isPlainImage ? 'dialog' : undefined}
			aria-modal={isPlainImage ? true : undefined}
			aria-label={
				isPlainImage ? activePhoto.artistName || 'Fullscreen image' : undefined
			}
		>
			<div
				className="pointer-events-auto absolute inset-0"
				style={{
					backgroundColor: isPlainImage ? 'var(--color-dark)' : FILM_SURFACE,
					opacity: backdropOpacity,
					transition: shouldReduceMotion ? 'none' : GALLERY_BACKDROP_TRANSITION,
				}}
			/>

			{showChrome && (
				<div
					className="pointer-events-auto absolute inset-0 overflow-hidden"
					onClick={isPlainImage ? handleClose : undefined}
				>
					{!isPlainImage &&
						['top', 'bottom'].map((edge) => (
							<div
								key={edge}
								aria-hidden="true"
								data-gallery-perforations={edge}
								className="absolute inset-x-0 z-30 flex justify-between"
								style={{
									[edge]: 0,
									padding: layout.perforations.padding,
									height: layout.perforations.railHeight,
								}}
							>
								{Array.from(
									{ length: layout.perforations.count },
									(_, index) => (
										<div
											key={index}
											className="shrink-0 rounded-[min(0.375rem,1vw)]"
											style={{
												backgroundColor: FILM_DARK,
												width: layout.perforations.width,
												height: layout.perforations.height,
											}}
										/>
									),
								)}
							</div>
						))}

					{photographer && (
						<motion.h3
							className="absolute z-40 -translate-y-1/2 -rotate-2 rounded-md px-2 text-sm font-medium tracking-tighter sm:text-base"
							initial={false}
							animate={{
								left: activeRect.left + activeRect.width * 0.05,
								top: activeRect.top,
								maxWidth: Math.max(0, activeRect.width * 0.95 - 56),
							}}
							transition={{
								duration: shouldReduceMotion ? 0 : navigationDuration,
								ease: [0.22, 1, 0.36, 1],
							}}
							style={{
								backgroundColor: FILM_LIGHT,
								color: FILM_DARK,
							}}
						>
							{tPhotoGallery('photosBy')}{' '}
							<RichText value={photographer} inline />
						</motion.h3>
					)}

					{!isPlainImage && (
						<div
							data-gallery-stage
							className="absolute inset-x-0 overflow-hidden"
							style={{ top: layout.stage.top, height: layout.stage.height }}
						>
							{frames.map(({ page, index, rect }) => (
								<motion.div
									key={page}
									data-gallery-photo={index + 1}
									data-active={page === position}
									className="absolute overflow-hidden"
									initial={false}
									animate={{
										...rect,
										top: rect.top - layout.stage.top,
										opacity: page === position ? 1 : 0.45,
									}}
									transition={{
										duration: shouldReduceMotion ? 0 : navigationDuration,
										ease: [0.22, 1, 0.36, 1],
									}}
								>
									<Img
										image={photos[index].photo}
										alt={`Photo ${index + 1}`}
										sizes={`${Math.ceil(rect.width)}px`}
										placeholderFit="contain"
										fetchPriority={page === position ? 'high' : 'low'}
										className="h-full w-full object-contain"
										loading={Math.abs(page - position) <= 1 ? 'eager' : 'lazy'}
									/>
									{page !== position && (
										<button
											type="button"
											className="absolute inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
											onClick={() => {
												setNavigationDuration(0.55)
												setPosition(page)
											}}
											aria-label={`Go to photo ${index + 1}`}
											tabIndex={Math.abs(page - position) === 1 ? 0 : -1}
										/>
									)}
								</motion.div>
							))}
						</div>
					)}

					{isPlainImage && (
						<motion.div
							key={currentIndex}
							initial={
								isPlainImage && imageFit === 'contain'
									? { opacity: 0, scale: 0.985 }
									: false
							}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
							className={`absolute z-20 overflow-hidden ${
								isPlainImage ? 'shadow-2xl' : ''
							}`}
							style={{ ...activeRect, boxSizing: 'border-box' }}
							onClick={(event) => event.stopPropagation()}
						>
							<Img
								image={activePhoto.photo}
								alt={activePhoto.artistName || `Photo ${currentIndex + 1}`}
								sizes={`${Math.ceil(activeRect.width)}px`}
								placeholderFit={fillsViewport ? 'cover' : 'contain'}
								fetchPriority="high"
								className={`h-full w-full ${fillsViewport ? 'object-cover object-[100%_45%]' : 'object-contain'}`}
								loading="eager"
							/>
						</motion.div>
					)}

					{isPlainImage && activePhoto.artistName && (
						<div
							className="pointer-events-none absolute z-30 flex -translate-y-1/2 flex-col items-start"
							style={{
								left: activeRect.left + activeRect.width * 0.08,
								maxWidth: activeRect.width * 0.84,
								top: activeRect.top,
							}}
						>
							{richTextLines(activePhoto.artistName, 26).map((line, index) => (
								<span
									key={index}
									style={{
										rotate: photoCreditRotation(activePhoto.artistName, index),
									}}
									className={`relative rounded-md border-2 border-dark bg-grayDark px-1.5 py-0 text-center text-dark ${FILM_LABEL_TEXT} ${index === 0 ? 'z-10' : '-mt-[0.15rem]'}`}
								>
									<RichText value={line} inline allowLinks={false} />
								</span>
							))}
						</div>
					)}

					{hasNavigation && !isPlainImage && (
						<>
							<button
								type="button"
								className="absolute left-4 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md border-2 shadow-md transition-opacity hover:opacity-80 focus:outline-none sm:left-10"
								style={{
									backgroundColor: FILM_LIGHT,
									borderColor: FILM_SURFACE,
									color: FILM_DARK,
								}}
								aria-label="Previous photo"
								onClick={handlePrev}
							>
								<ChevronLeft aria-hidden="true" className="h-6 w-6" />
							</button>

							<button
								type="button"
								className="absolute right-4 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md border-2 shadow-md transition-opacity hover:opacity-80 focus:outline-none sm:right-10"
								style={{
									backgroundColor: FILM_LIGHT,
									borderColor: FILM_SURFACE,
									color: FILM_DARK,
								}}
								aria-label="Next photo"
								onClick={handleNext}
							>
								<ChevronRight aria-hidden="true" className="h-6 w-6" />
							</button>
						</>
					)}

					{hasNavigation && !isPlainImage && (
						<div
							className="absolute left-1/2 z-40 -translate-x-1/2 rounded-md px-3 py-1 text-base font-medium"
							style={{
								backgroundColor: FILM_SURFACE,
								bottom: Math.max(4, (stripBottom - 32) / 2),
								color: FILM_DARK,
							}}
						>
							{currentIndex + 1} / {photos.length}
						</div>
					)}

					{isPlainImage ? (
						<motion.button
							ref={closeButtonRef}
							type="button"
							onClick={(event) => {
								event.stopPropagation()
								handleClose()
							}}
							className="pointer-events-none absolute right-8 top-8 z-50 flex h-8 w-8 items-center justify-center rounded-md border-2 border-primary bg-dark/90 text-[color:var(--color-primary)] opacity-0 shadow-md backdrop-blur transition-[color,background-color,opacity] duration-200 hover:bg-primary hover:text-dark focus:outline-none focus-visible:pointer-events-auto focus-visible:opacity-100 group-hover/fullscreen-image:pointer-events-auto group-hover/fullscreen-image:opacity-100 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:opacity-100"
							aria-label="Collapse fullscreen image"
							initial={{ scale: 0.8 }}
							animate={{ scale: 1 }}
							whileHover={{ scale: 1.06 }}
							transition={{
								duration: shouldReduceMotion ? 0 : 0.25,
								ease: PHOTO_TRANSITION_EASE,
							}}
						>
							<Minimize2 aria-hidden="true" className="h-5 w-5" />
						</motion.button>
					) : (
						<motion.button
							type="button"
							onClick={handleClose}
							className="absolute z-50 flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border-2 shadow-md transition-opacity hover:opacity-80 focus:outline-none"
							style={{
								backgroundColor: FILM_LIGHT,
								borderColor: FILM_SURFACE,
								color: FILM_DARK,
							}}
							aria-label="Close photo gallery"
							initial={{ opacity: 0, scale: 0.8, y: 8 }}
							animate={{
								opacity: 1,
								scale: 1,
								y: 0,
								left: activeRect.left + activeRect.width - 48,
								top: activeRect.top + 8,
							}}
							whileHover={{ scale: 1.06 }}
							transition={{
								duration: shouldReduceMotion ? 0 : 0.25,
								ease: PHOTO_TRANSITION_EASE,
								left: {
									duration: shouldReduceMotion ? 0 : navigationDuration,
									ease: [0.22, 1, 0.36, 1],
								},
								top: {
									duration: shouldReduceMotion ? 0 : navigationDuration,
									ease: [0.22, 1, 0.36, 1],
								},
							}}
						>
							<Minimize2 aria-hidden="true" className="h-5 w-5" />
						</motion.button>
					)}
				</div>
			)}

			{!showChrome && (
				<div
					className="pointer-events-auto fixed overflow-hidden"
					style={{
						borderRadius: 0,
						boxSizing: 'border-box',
						height: imageFrame.height,
						left: imageFrame.left,
						top: imageFrame.top,
						transition: hasFrameTransition ? GALLERY_FRAME_TRANSITION : 'none',
						width: imageFrame.width,
					}}
					onTransitionEnd={handleFrameTransitionEnd}
				>
					<Img
						image={activePhoto.photo}
						alt={activePhoto.artistName || `Photo ${currentIndex + 1}`}
						sizes={`${Math.ceil(activeRect.width)}px`}
						placeholderFit={fillsViewport ? 'cover' : 'contain'}
						fetchPriority="high"
						className={`h-full w-full ${fillsViewport ? 'object-cover object-[100%_45%]' : isPlainImage ? 'object-contain' : 'object-cover'}`}
						loading="eager"
					/>
				</div>
			)}
		</div>
	)
}

export default FestivalCarousel
