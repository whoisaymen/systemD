import Img from '@/ui/Img'
import RichText from '@/components/common/RichText'
import { motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight, Minimize2 } from 'lucide-react'

export type GalleryRect = {
	height: number
	left: number
	top: number
	width: number
}

type GalleryLayout = {
	gap: number
	sideMaxWidth: number
	stage: GalleryRect
}

const GALLERY_FRAME_TRANSITION =
	'left 800ms cubic-bezier(0.76, 0, 0.24, 1), top 800ms cubic-bezier(0.76, 0, 0.24, 1), width 800ms cubic-bezier(0.76, 0, 0.24, 1), height 800ms cubic-bezier(0.76, 0, 0.24, 1), border-radius 800ms cubic-bezier(0.76, 0, 0.24, 1)'
const GALLERY_BACKDROP_TRANSITION =
	'opacity 800ms cubic-bezier(0.76, 0, 0.24, 1)'
const PHOTO_TRANSITION_EASE = [0.76, 0, 0.24, 1] as const
const FILM_SURFACE = '#8c8c8f'
const FILM_DARK = '#222223'
const FILM_LIGHT = '#d8d8d8'
const FALLBACK_PHOTO_RATIO = 3 / 2

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

const getGalleryLayout = (fullscreenImage = false): GalleryLayout => {
	const isDesktop = window.innerWidth >= 1024
	const verticalInset = isDesktop
		? Math.max(72, window.innerHeight * 0.1)
		: Math.max(84, window.innerHeight * 0.16)
	const stageHeight = Math.max(260, window.innerHeight - verticalInset * 2)
	const horizontalInset = isDesktop ? 24 : 16
	const gap = isDesktop
		? Math.max(28, window.innerWidth * 0.02)
		: Math.max(16, window.innerWidth * 0.04)
	const sideMaxWidth = isDesktop
		? Math.min(window.innerWidth * 0.26, 520)
		: Math.min(window.innerWidth * 0.62, 320)

	return {
		gap,
		sideMaxWidth,
		stage: fullscreenImage ? {
			height: window.innerHeight,
			left: 0,
			top: 0,
			width: window.innerWidth,
		} : {
			height: stageHeight,
			left: horizontalInset,
			top: verticalInset,
			width: window.innerWidth - horizontalInset * 2,
		},
	}
}

const getWrappedIndex = (index: number, length: number) =>
	((index % length) + length) % length

const getImageDimensions = (photo: any) => {
	const dimensions = photo?.asset?.metadata?.dimensions

	if (
		typeof dimensions?.width === 'number' &&
		typeof dimensions?.height === 'number' &&
		dimensions.width > 0 &&
		dimensions.height > 0
	) {
		return {
			height: dimensions.height,
			width: dimensions.width,
		}
	}

	const candidates = [
		photo?.asset?.url,
		photo?.asset?._ref,
		photo?.asset?._id,
		photo?._ref,
		photo?._id,
	].filter((value): value is string => typeof value === 'string')

	for (const candidate of candidates) {
		const match = candidate.match(/-(\d+)x(\d+)(?:[.-])/)

		if (!match) continue

		const width = Number(match[1])
		const height = Number(match[2])

		if (width > 0 && height > 0) {
			return { height, width }
		}
	}

	return null
}

const getImageAspectRatio = (photo: any) => {
	const dimensions = getImageDimensions(photo)

	if (!dimensions) return FALLBACK_PHOTO_RATIO

	return dimensions.width / dimensions.height
}

const getContainedRect = (
	area: GalleryRect,
	aspectRatio: number,
	maxWidth = area.width,
	maxHeight = area.height,
): GalleryRect => {
	const safeAspectRatio = aspectRatio > 0 ? aspectRatio : FALLBACK_PHOTO_RATIO
	let width = Math.min(maxWidth, maxHeight * safeAspectRatio)
	let height = width / safeAspectRatio

	if (height > maxHeight) {
		height = maxHeight
		width = height * safeAspectRatio
	}

	return {
		height,
		left: area.left + (area.width - width) / 2,
		top: area.top + (area.height - height) / 2,
		width,
	}
}

const getActivePhotoRect = (layout: GalleryLayout, photo: any, fillStage = false) =>
	fillStage ? layout.stage : getContainedRect(layout.stage, getImageAspectRatio(photo))

const getSidePhotoRect = (
	layout: GalleryLayout,
	activeRect: GalleryRect,
	side: 'previous' | 'next',
): GalleryRect => {
	return {
		height: layout.stage.height,
		left:
			side === 'previous'
				? activeRect.left - layout.gap - layout.sideMaxWidth
				: activeRect.left + activeRect.width + layout.gap,
		top: layout.stage.top,
		width: layout.sideMaxWidth,
	}
}

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
}> = ({
	photos,
	initialIndex = 0,
	originRect,
	onClose,
	variant = 'gallery',
}) => {
	const isPlainImage = variant === 'image'
	const shouldReduceMotion = useReducedMotion() === true
	const [currentIndex, setCurrentIndex] = useState(initialIndex)
	const [overlayMode, setOverlayMode] = useState<
		'opening' | 'open' | 'closing'
	>('opening')
	const [layout, setLayout] = useState<GalleryLayout | null>(() => {
		if (typeof window === 'undefined') return null
		return getGalleryLayout(isPlainImage)
	})
	const [imageFrame, setImageFrame] = useState<GalleryRect | null>(() => {
		if (typeof window === 'undefined') return null
		return originRect ?? getFallbackOriginRect()
	})
	const [hasFrameTransition, setHasFrameTransition] = useState(false)
	const [backdropOpacity, setBackdropOpacity] = useState(0)
	const isClosingRef = useRef(false)
	const closeButtonRef = useRef<HTMLButtonElement>(null)
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
	const previousIndex = getWrappedIndex(currentIndex - 1, photos.length)
	const nextIndex = getWrappedIndex(currentIndex + 1, photos.length)
	const activeRect =
		layout && activePhoto ? getActivePhotoRect(layout, activePhoto.photo, isPlainImage) : null

	useEffect(() => {
		if (!startRect) return

		const nextLayout = getGalleryLayout(isPlainImage)
		const nextActiveRect = getActivePhotoRect(
			nextLayout,
			openingPhotoRef.current,
			isPlainImage,
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
	}, [isPlainImage, shouldReduceMotion, startRect])

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
		setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
	}, [photos.length])

	const handlePrev = useCallback(() => {
		setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
	}, [photos.length])

	const handleClose = useCallback(() => {
		if (isClosingRef.current) return
		isClosingRef.current = true

		if (shouldReduceMotion) {
			onClose?.()
			return
		}

		const currentLayout = getGalleryLayout(isPlainImage)
		const currentActiveRect = getActivePhotoRect(
			currentLayout,
			photos[currentIndex]?.photo,
			isPlainImage,
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
	}, [currentIndex, isPlainImage, onClose, photos, shouldReduceMotion, startRect])

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (isPlainImage && event.key === 'Tab') {
				event.preventDefault()
				closeButtonRef.current?.focus()
			}

			if (event.key === 'ArrowRight') {
				event.preventDefault()
				handleNext()
			}

			if (event.key === 'ArrowLeft') {
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
	}, [handleClose, handleNext, handlePrev, isPlainImage])

	useEffect(() => {
		if (overlayMode !== 'open') return

		const handleResize = () => {
			const nextLayout = getGalleryLayout(isPlainImage)
			setLayout(nextLayout)
			setImageFrame(getActivePhotoRect(nextLayout, activePhoto.photo, isPlainImage))
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [activePhoto?.photo, isPlainImage, overlayMode])

	const handleFrameTransitionEnd = (
		event: React.TransitionEvent<HTMLDivElement>,
	) => {
		if (
			event.target !== event.currentTarget ||
			event.propertyName !== 'width'
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

	const previousRect = getSidePhotoRect(layout, activeRect, 'previous')
	const nextRect = getSidePhotoRect(layout, activeRect, 'next')
	const stripBottom = Math.max(
		16,
		window.innerHeight - layout.stage.top - layout.stage.height,
	)

	return (
		<div
			className="group/fullscreen-image pointer-events-none fixed inset-0 z-[10000]"
			role={isPlainImage ? 'dialog' : undefined}
			aria-modal={isPlainImage ? true : undefined}
			aria-label={isPlainImage ? 'Fullscreen image' : undefined}
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
					{!isPlainImage && (
						<>
							<div className="absolute left-0 top-0 z-20 flex w-full justify-between px-4 py-4">
								{[...Array(20)].map((_, i) => (
									<div
										key={`top-${i}`}
										className="h-12 w-10 rounded-md sm:h-16 sm:w-12"
										style={{ backgroundColor: FILM_DARK }}
									/>
								))}
							</div>
							<div className="absolute bottom-0 left-0 z-20 flex w-full justify-between px-4 py-4">
								{[...Array(20)].map((_, i) => (
									<div
										key={`bottom-${i}`}
										className="h-12 w-10 rounded-md sm:h-16 sm:w-12"
										style={{ backgroundColor: FILM_DARK }}
									/>
								))}
							</div>
						</>
					)}

					{photographer && (
						<h3
							className="absolute left-12 z-30 -rotate-2 rounded-md px-2 text-base font-medium tracking-tighter sm:text-xl"
							style={{
								backgroundColor: FILM_LIGHT,
								color: FILM_DARK,
								top: Math.max(84, activeRect.top - 40),
							}}
						>
							{tPhotoGallery('photosBy')}{' '}
							<RichText value={photographer} inline />
						</h3>
					)}

					{hasNavigation && (
						<button
							type="button"
							onClick={() => setCurrentIndex(previousIndex)}
							className="absolute z-10 overflow-hidden transition-opacity duration-300 hover:opacity-70"
							style={previousRect}
							aria-label={`Go to photo ${previousIndex + 1}`}
						>
							<Img
								image={photos[previousIndex].photo}
								alt={`Photo ${previousIndex + 1}`}
								className="h-full w-full object-cover opacity-45"
								loading="lazy"
							/>
						</button>
					)}

					<div
						className={`absolute z-20 overflow-hidden ${
							isPlainImage ? 'shadow-2xl' : ''
						}`}
						style={{ ...activeRect, boxSizing: 'border-box' }}
						onClick={(event) => event.stopPropagation()}
					>
						<Img
							image={activePhoto.photo}
							alt={`Photo ${currentIndex + 1}`}
							className={`h-full w-full ${isPlainImage ? 'object-cover object-[100%_45%]' : 'object-contain'}`}
							loading="eager"
						/>
					</div>

					{hasNavigation && (
						<button
							type="button"
							onClick={() => setCurrentIndex(nextIndex)}
							className="absolute z-10 overflow-hidden transition-opacity duration-300 hover:opacity-70"
							style={nextRect}
							aria-label={`Go to photo ${nextIndex + 1}`}
						>
							<Img
								image={photos[nextIndex].photo}
								alt={`Photo ${nextIndex + 1}`}
								className="h-full w-full object-cover opacity-45"
								loading="lazy"
							/>
						</button>
					)}

					{hasNavigation && (
						<>
							<button
								type="button"
								className="absolute left-10 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md border-2 shadow-md transition-opacity hover:opacity-80 focus:outline-none"
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
								className="absolute right-10 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md border-2 shadow-md transition-opacity hover:opacity-80 focus:outline-none"
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

					{hasNavigation && (
						<div
							className="absolute left-1/2 z-40 -translate-x-1/2 rounded-md px-3 py-1 text-base font-medium"
							style={{
								backgroundColor: FILM_SURFACE,
								bottom: Math.max(56, stripBottom * 0.54),
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
							className="absolute right-10 z-50 flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border-2 shadow-md transition-opacity hover:opacity-80 focus:outline-none"
							style={{
								backgroundColor: FILM_LIGHT,
								borderColor: FILM_SURFACE,
								bottom: Math.max(86, stripBottom + 18),
								color: FILM_DARK,
							}}
							aria-label="Close photo gallery"
							initial={{ opacity: 0, scale: 0.8, y: 8 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							whileHover={{ scale: 1.06 }}
							transition={{
								duration: shouldReduceMotion ? 0 : 0.25,
								ease: PHOTO_TRANSITION_EASE,
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
						alt={`Photo ${currentIndex + 1}`}
						className={`h-full w-full object-cover ${
							isPlainImage ? 'object-[100%_45%]' : ''
						}`}
						loading="eager"
					/>
				</div>
			)}
		</div>
	)
}

export default FestivalCarousel
