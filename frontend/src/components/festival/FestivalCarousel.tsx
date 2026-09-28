import Img from '@/ui/Img'
import RichText from '@/components/common/RichText'
import {
	animate,
	motion,
	useMotionValue,
	useTransform,
	useReducedMotion,
	type MotionValue,
} from 'motion/react'
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from 'react'
import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight, Minimize2 } from 'lucide-react'
import ArtistCreditPills from './ArtistCreditPills'
import contactSheet from './FestivalContactSheet.module.css'
import ZoomablePhoto from './ZoomablePhoto'

import {
	getGalleryLayout,
	getActivePhotoRect,
	getGalleryFrames,
	getExhibitionFrames,
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
const PHOTO_PERSPECTIVE = 900
const PHOTO_TILT = 16
const PHOTO_DEPTH = 56

function GalleryPhotoFrame({
	page,
	index,
	position,
	rect,
	layout,
	drag,
	duration,
	reducedMotion,
	children,
}: {
	page: number
	index: number
	position: number
	rect: GalleryRect
	layout: GalleryLayout
	drag: MotionValue<number>
	duration: number
	reducedMotion: boolean
	children: ReactNode
}) {
	const { compactFilm, perforations } = layout
	const viewportWidth = layout.stage.width + layout.stage.left * 2
	const left = useMotionValue(rect.left)
	const frameLeft = useTransform(
		left,
		(value) => value - (compactFilm ? perforations.padding : 0),
	)
	// Follow the frame's actual position, so dragging and settling share one curve.
	const progress = useTransform(() =>
		compactFilm && !reducedMotion
			? Math.max(
					-1,
					Math.min(
						1,
						(left.get() + rect.width / 2 + drag.get() - viewportWidth / 2) /
							viewportWidth,
					),
				)
			: 0,
	)
	const rotateY = useTransform(progress, (value) => -value * PHOTO_TILT)
	const z = useTransform(progress, (value) => -Math.abs(value) * PHOTO_DEPTH)

	useLayoutEffect(() => {
		if (reducedMotion || duration === 0) {
			left.jump(rect.left)
			return
		}
		const animation = animate(left, rect.left, {
			duration,
			ease: [0.22, 1, 0.36, 1],
		})
		return () => animation.stop()
	}, [left, rect.left, duration, reducedMotion])

	return (
		<motion.div
			data-gallery-photo={index + 1}
			data-active={page === position}
			onClick={(event) => event.stopPropagation()}
			className={compactFilm ? contactSheet.strip : 'absolute overflow-hidden'}
			style={{
				position: 'absolute',
				left: frameLeft,
				rotateY,
				z,
				transformPerspective:
					compactFilm && !reducedMotion ? PHOTO_PERSPECTIVE : undefined,
				...(compactFilm
					? {
							'--frame-width': `${rect.width}px`,
							'--film-gap': `${perforations.padding}px`,
							'--rail': `${perforations.railHeight}px`,
							'--hole-height': `${perforations.height}px`,
						}
					: {}),
			}}
			initial={false}
			animate={{
				top:
					rect.top - (compactFilm ? perforations.railHeight : layout.stage.top),
				width: rect.width + (compactFilm ? perforations.padding * 2 : 0),
				height: rect.height + (compactFilm ? perforations.railHeight * 2 : 0),
				opacity: compactFilm || page === position ? 1 : 0.45,
			}}
			transition={{
				duration: reducedMotion ? 0 : duration,
				ease: [0.22, 1, 0.36, 1],
			}}
		>
			{children}
		</motion.div>
	)
}

function ExhibitionPhotoMotion({
	offset,
	step,
	drag,
	duration,
	reducedMotion,
	children,
}: {
	offset: number
	step: number
	drag: MotionValue<number>
	duration: number
	reducedMotion: boolean
	children: ReactNode
}) {
	const isMobile = step < 1024
	const frameOffset = useMotionValue(offset * step)
	const progress = useTransform(() =>
		Math.max(-1, Math.min(1, (frameOffset.get() + drag.get()) / step)),
	)
	const scale = useTransform(progress, (value) =>
		isMobile || reducedMotion ? 1 : 1 - Math.abs(value) * 0.06,
	)
	const opacity = useTransform(progress, (value) =>
		isMobile ? 1 : 1 - Math.abs(value) * 0.2,
	)
	const rotateY = useTransform(progress, (value) =>
		isMobile && !reducedMotion ? -value * PHOTO_TILT : 0,
	)
	const z = useTransform(progress, (value) =>
		isMobile && !reducedMotion ? -Math.abs(value) * PHOTO_DEPTH : 0,
	)

	useLayoutEffect(() => {
		if (reducedMotion || duration === 0) {
			frameOffset.jump(offset * step)
			return
		}
		const animation = animate(frameOffset, offset * step, {
			duration,
			ease: [0.22, 1, 0.36, 1],
		})
		return () => animation.stop()
	}, [frameOffset, offset, step, duration, reducedMotion])

	return (
		<motion.div
			className="relative h-full w-full shadow-2xl [container-type:inline-size]"
			style={{
				scale,
				opacity,
				rotateY,
				z,
				transformPerspective:
					isMobile && !reducedMotion ? PHOTO_PERSPECTIVE : undefined,
			}}
		>
			{children}
		</motion.div>
	)
}

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

const getViewportGalleryLayout = (
	fullscreenImage = false,
	compactMobileFilm = false,
) =>
	getGalleryLayout(
		{ width: window.innerWidth, height: window.innerHeight },
		fullscreenImage,
		compactMobileFilm,
	)

const FestivalCarousel: React.FC<{
	photos: {
		photo: any
		photographer?: any
		artistName?: string
		artistCreditSide?: 'left' | 'right'
		curatorName?: string
	}[]
	initialIndex?: number
	originRect?: GalleryRect | null
	originSrc?: string
	getThumbnail?: (index: number) => HTMLElement | null
	onClose?: () => void
	variant?: 'gallery' | 'image'
	imageFit?: 'cover' | 'contain'
}> = ({
	photos,
	initialIndex = 0,
	originRect,
	originSrc,
	getThumbnail,
	onClose,
	variant = 'gallery',
	imageFit = 'cover',
}) => {
	const isPlainImage = variant === 'image'
	const isExhibition = isPlainImage && imageFit === 'contain'
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
		return getViewportGalleryLayout(fillsViewport, !isPlainImage)
	})
	const [imageFrame, setImageFrame] = useState<GalleryRect | null>(() => {
		if (typeof window === 'undefined') return null
		return originRect ?? getFallbackOriginRect()
	})
	const [hasFrameTransition, setHasFrameTransition] = useState(false)
	const [backdropOpacity, setBackdropOpacity] = useState(0)
	const isClosingRef = useRef(false)
	const filmOffset = useMotionValue(0)
	const isSettlingRef = useRef(false)
	const didPanRef = useRef(false)
	const closeButtonRef = useRef<HTMLButtonElement>(null)
	const dialogRef = useRef<HTMLDivElement>(null)
	const returnFocusRef = useRef<HTMLElement | null>(null)
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

	useLayoutEffect(() => {
		filmOffset.jump(0)
	}, [position, filmOffset])

	useEffect(() => {
		if (!startRect) return

		const nextLayout = getViewportGalleryLayout(fillsViewport, !isPlainImage)
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
	}, [fillsViewport, isPlainImage, shouldReduceMotion, startRect])

	useEffect(() => {
		const trigger = document.activeElement
		return () => {
			const target = returnFocusRef.current ?? trigger
			if (target instanceof HTMLElement && target.isConnected) {
				target.focus({ preventScroll: true })
			}
		}
	}, [])

	useEffect(() => {
		if (isPlainImage && showChrome) {
			const closeButton = closeButtonRef.current
			const target = closeButton?.getClientRects().length
				? closeButton
				: dialogRef.current
			target?.focus({ preventScroll: true })
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

	const swipeDistance = (direction: number) => {
		if (!layout || !activeRect) return 0
		if (isExhibition) return layout.stage.width + layout.stage.left * 2
		const next = photos[getWrappedIndex(position + direction, photos.length)]
		const nextRect = getActivePhotoRect(layout, next.photo)
		return (activeRect.width + nextRect.width) / 2 + layout.gap
	}
	const finishSwipe = (offset: number, velocity: number) => {
		if (isSettlingRef.current || isClosingRef.current) return
		const threshold = Math.min(60, window.innerWidth * 0.15)
		const direction =
			hasNavigation &&
			(Math.abs(offset) > threshold || Math.abs(velocity) > 500)
				? offset < 0
					? 1
					: -1
				: 0
		isSettlingRef.current = true
		setNavigationDuration(0)
		animate(filmOffset, direction ? -direction * swipeDistance(direction) : 0, {
			duration: shouldReduceMotion ? 0 : 0.32,
			ease: [0.22, 1, 0.36, 1],
			onComplete: () => {
				if (direction) setPosition((previous) => previous + direction)
				isSettlingRef.current = false
			},
		})
	}
	const movePhoto = (offset: number) => {
		if (isSettlingRef.current || isClosingRef.current || !hasNavigation) return
		didPanRef.current = true
		filmOffset.stop()
		filmOffset.set(
			Math.max(-swipeDistance(1), Math.min(swipeDistance(-1), offset)),
		)
	}

	const handleClose = useCallback(() => {
		if (isClosingRef.current) return
		isClosingRef.current = true
		filmOffset.stop()
		filmOffset.jump(0)

		let returnRect =
			currentIndex === initialIndex && startRect
				? startRect
				: getFallbackOriginRect()
		const thumbnail = getThumbnail?.(currentIndex)
		if (thumbnail?.isConnected) {
			let rect = thumbnail.getBoundingClientRect()
			if (rect.width > 0 && rect.height > 0) {
				// Move the page underneath the opaque viewer before measuring the landing.
				if (
					rect.top < 24 ||
					rect.bottom > window.innerHeight - 24 ||
					rect.left < 0 ||
					rect.right > window.innerWidth
				) {
					thumbnail.scrollIntoView({
						behavior: 'instant',
						block: 'center',
						inline: 'nearest',
					})
					rect = thumbnail.getBoundingClientRect()
				}
				returnRect = {
					left: rect.left,
					top: rect.top,
					width: rect.width,
					height: rect.height,
				}
				returnFocusRef.current = thumbnail
			}
		}

		if (shouldReduceMotion) {
			onClose?.()
			return
		}

		const currentLayout = getViewportGalleryLayout(fillsViewport, !isPlainImage)
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
				setImageFrame(returnRect)
			})
		})

		return () => {
			window.cancelAnimationFrame(firstFrame)
			window.cancelAnimationFrame(secondFrame)
		}
	}, [
		currentIndex,
		filmOffset,
		fillsViewport,
		getThumbnail,
		initialIndex,
		isPlainImage,
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
				).filter((button) => button.getClientRects().length > 0)
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
			const nextLayout = getViewportGalleryLayout(fillsViewport, !isPlainImage)
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
		isPlainImage,
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
	const exhibitionFrames = isExhibition
		? getExhibitionFrames(layout, photos, position).filter(
				(frame) => showChrome || frame.page === position,
			)
		: []
	const stripBottom = layout.stage.top
	const { compactFilm, perforations } = layout
	const stageTop = compactFilm ? 0 : layout.stage.top

	return (
		<div
			ref={dialogRef}
			data-gallery-dialog
			className="group/fullscreen-image pointer-events-none fixed inset-0 z-[10000] outline-none"
			tabIndex={isPlainImage ? -1 : undefined}
			role={isPlainImage ? 'dialog' : undefined}
			aria-modal={isPlainImage ? true : undefined}
			aria-label={
				isPlainImage ? activePhoto.artistName || 'Fullscreen image' : undefined
			}
		>
			<div
				className="pointer-events-auto absolute inset-0"
				style={{
					backgroundColor:
						isPlainImage || compactFilm ? FILM_DARK : FILM_SURFACE,
					opacity: backdropOpacity,
					transition: shouldReduceMotion ? 'none' : GALLERY_BACKDROP_TRANSITION,
				}}
			/>

			{isExhibition && (
				<div
					data-exhibition-stage
					className="pointer-events-auto absolute inset-0 z-20 overflow-hidden"
					onPointerDownCapture={() => {
						didPanRef.current = false
					}}
					onClick={() => {
						if (showChrome && !didPanRef.current) handleClose()
					}}
				>
					<motion.div
						className="absolute inset-0 touch-none"
						style={{ x: filmOffset }}
					>
						{exhibitionFrames.map(({ page, index, rect }) => (
							<div
								key={page}
								data-exhibition-photo={index + 1}
								data-active={page === position}
								aria-hidden={page !== position}
								className="absolute"
								style={{
									...(showChrome ? rect : imageFrame),
									transition: shouldReduceMotion
										? 'none'
										: showChrome
											? navigationDuration > 0
												? 'left 550ms cubic-bezier(0.22, 1, 0.36, 1), top 550ms cubic-bezier(0.22, 1, 0.36, 1), width 550ms cubic-bezier(0.22, 1, 0.36, 1), height 550ms cubic-bezier(0.22, 1, 0.36, 1)'
												: 'none'
											: hasFrameTransition
												? GALLERY_FRAME_TRANSITION
												: 'none',
								}}
								onTransitionEnd={handleFrameTransitionEnd}
								onClick={(event) => event.stopPropagation()}
							>
								<ExhibitionPhotoMotion
									offset={page - position}
									step={layout.stage.width + layout.stage.left * 2}
									drag={filmOffset}
									duration={showChrome ? navigationDuration : 0}
									reducedMotion={shouldReduceMotion}
								>
									<ZoomablePhoto
										active={showChrome && page === position}
										onClose={handleClose}
										onSwipeMove={movePhoto}
										onSwipeEnd={finishSwipe}
									>
										{(resolutionScale) => (
											<Img
												image={photos[index].photo}
												alt={photos[index].artistName || `Photo ${index + 1}`}
												sizes={`${Math.ceil(rect.width * resolutionScale)}px`}
												previewSrc={
													index === initialIndex ? originSrc : undefined
												}
												placeholderFit="contain"
												fetchPriority={page === position ? 'high' : 'low'}
												className="h-full w-full object-contain"
												loading="eager"
												draggable={false}
											/>
										)}
									</ZoomablePhoto>
									{photos[index].artistName && (
										<div
											data-exhibition-credit
											className={`pointer-events-none absolute -bottom-2 z-30 flex max-w-[84%] items-start lg:bottom-auto lg:left-[8%] lg:right-auto lg:top-0 lg:-translate-y-1/2 lg:flex-col ${photos[index].artistCreditSide === 'right' ? 'right-[8%]' : 'left-[8%]'}`}
										>
											<ArtistCreditPills value={photos[index].artistName} compact />
										</div>
									)}
								</ExhibitionPhotoMotion>
							</div>
						))}
					</motion.div>
				</div>
			)}

			{showChrome && (
				<div
					className="pointer-events-auto absolute inset-0 overflow-hidden"
					onPointerDownCapture={() => {
						didPanRef.current = false
					}}
					onClick={() => {
						if ((isPlainImage || compactFilm) && !didPanRef.current)
							handleClose()
					}}
				>
					{!isPlainImage &&
						!compactFilm &&
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
							className="absolute z-40 hidden -translate-y-1/2 -rotate-2 rounded-md px-2 text-sm font-medium tracking-tighter sm:text-base lg:block"
							initial={false}
							animate={{
								left: compactFilm
									? activeRect.left - perforations.padding + 12
									: activeRect.left + activeRect.width * 0.05,
								top: compactFilm
									? activeRect.top - perforations.railHeight + 12
									: activeRect.top,
								maxWidth: Math.max(
									0,
									compactFilm
										? activeRect.width - 8
										: activeRect.width * 0.95 - 56,
								),
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
							style={{
								top: stageTop,
								height:
									layout.stage.height +
									(compactFilm ? layout.stage.top * 2 : 0),
							}}
						>
							<motion.div
								className="absolute inset-0"
								style={{
									x: filmOffset,
									touchAction: compactFilm ? 'none' : undefined,
								}}
							>
								{frames.map(({ page, index, rect }) => (
									<GalleryPhotoFrame
										key={page}
										page={page}
										index={index}
										position={position}
										rect={rect}
										layout={layout}
										drag={filmOffset}
										duration={navigationDuration}
										reducedMotion={shouldReduceMotion}
									>
										{compactFilm &&
											['top', 'bottom'].map((edge) => (
												<div
													key={edge}
													aria-hidden="true"
													data-gallery-perforations={edge}
													data-edge={edge}
													className={contactSheet.perforations}
												>
													{Array.from(
														{ length: perforations.count },
														(_, hole) => (
															<span key={hole} />
														),
													)}
												</div>
											))}
										<div className="relative h-full w-full">
											<ZoomablePhoto
												active={page === position}
												onClose={handleClose}
												onSwipeMove={movePhoto}
												onSwipeEnd={finishSwipe}
											>
												{(resolutionScale) => (
													<Img
														image={photos[index].photo}
														alt={`Photo ${index + 1}`}
														sizes={`${Math.ceil(rect.width * resolutionScale)}px`}
														placeholderFit="contain"
														draggable={false}
														fetchPriority={page === position ? 'high' : 'low'}
														className="h-full w-full object-contain"
														loading={
															Math.abs(page - position) <= 1 ? 'eager' : 'lazy'
														}
													/>
												)}
											</ZoomablePhoto>
											{compactFilm &&
												['top', 'bottom'].map((edge) => (
													<span
														key={edge}
														className={contactSheet.frameNumber}
														data-edge={edge}
														aria-hidden="true"
													>
														{String(index + 1).padStart(2, '0')}
													</span>
												))}
											{compactFilm && hasNavigation && (
												<span
													className={contactSheet.frameNumber}
													data-edge="bottom"
													data-side="right"
													aria-hidden="true"
												>
													{String(index + 1).padStart(2, '0')}/
													{String(photos.length).padStart(2, '0')}
												</span>
											)}
											{page !== position && (
												<button
													type="button"
													className="absolute inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
													onClick={() => {
														if (!didPanRef.current) {
															setNavigationDuration(0.55)
															setPosition(page)
														}
													}}
													aria-label={`Go to photo ${index + 1}`}
													tabIndex={Math.abs(page - position) === 1 ? 0 : -1}
												/>
											)}
										</div>
									</GalleryPhotoFrame>
								))}
							</motion.div>
						</div>
					)}

					{isPlainImage && !isExhibition && (
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

					{isPlainImage && !isExhibition && activePhoto.artistName && (
						<div
							className="pointer-events-none absolute z-30"
							style={activeRect}
						>
							<div className="absolute -bottom-2 left-[8%] flex max-w-[84%] items-start lg:bottom-auto lg:top-0 lg:-translate-y-1/2 lg:flex-col">
								<ArtistCreditPills value={activePhoto.artistName} />
							</div>
						</div>
					)}

					{hasNavigation && !isPlainImage && !compactFilm && (
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

					{hasNavigation && compactFilm && (
						<div
							aria-live="polite"
							aria-atomic="true"
							className="sr-only"
						>
							{String(currentIndex + 1).padStart(2, '0')} /{' '}
							{String(photos.length).padStart(2, '0')}
						</div>
					)}

					{hasNavigation && !isPlainImage && !compactFilm && (
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
							className={`pointer-events-none absolute right-8 top-8 z-50 flex h-8 w-8 items-center justify-center rounded-md border-2 border-primary bg-dark/90 text-[color:var(--color-primary)] opacity-0 shadow-md backdrop-blur transition-[color,background-color,opacity] duration-200 hover:bg-primary hover:text-dark focus:outline-none focus-visible:pointer-events-auto focus-visible:opacity-100 group-hover/fullscreen-image:pointer-events-auto group-hover/fullscreen-image:opacity-100 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:opacity-100 ${isExhibition ? 'max-lg:hidden' : ''}`}
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
					) : compactFilm ? null : (
						<motion.button
							type="button"
							onClick={handleClose}
							className="absolute right-8 top-8 z-50 flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border-2 shadow-md transition-opacity hover:opacity-80 focus:outline-none"
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
							}}
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

			{!showChrome && !isExhibition && (
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
