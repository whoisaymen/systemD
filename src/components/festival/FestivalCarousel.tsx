import Img from '@/ui/Img'
import ArrowRight from '../common/ArrowRight'
import { motion } from 'motion/react'
import { useRef, useEffect, useState } from 'react'
import ArrowGallery from '../common/ArrowGallery'
import { useTranslations } from 'next-intl'
import NewArrowRightSimple from '../common/NewArrowRightSimple'
import NewArrowRightFull from '../common/NewArrowRightFull'

const FestivalCarousel: React.FC<{
	photos: {
		photo: any
		photographer?: string
		artistName?: string
		curatorName?: string
	}[]
	initialIndex?: number
	onClose?: () => void
}> = ({ photos, initialIndex = 0, onClose }) => {
	const [currentIndex, setCurrentIndex] = useState(initialIndex)
	const thumbContainerRef = useRef<HTMLDivElement>(null)
	const [isLandscape, setIsLandscape] = useState(true)
	const photoRefs = useRef<(HTMLDivElement | null)[]>([])
	const [transformX, setTransformX] = useState(
		`translateX(calc(50vw - ${currentIndex * 408}px - 204px))`,
	)

	const activeThumbRef = useRef<HTMLButtonElement>(null)

	// Center the active thumbnail in the preview bar (mobile only)
	useEffect(() => {
		if (
			window.innerWidth < 1024 &&
			activeThumbRef.current &&
			thumbContainerRef.current
		) {
			const container = thumbContainerRef.current
			const active = activeThumbRef.current

			const containerCenter = container.offsetWidth / 2
			const activeOffset = active.offsetLeft + active.offsetWidth / 2

			container.scrollTo({
				left: activeOffset - containerCenter,
				behavior: 'smooth',
			})
		}
	}, [currentIndex])

	useEffect(() => {
		document.body.style.overflow = 'hidden'
		document.documentElement.style.overflow = 'hidden'
		document.body.style.touchAction = 'none'

		return () => {
			document.body.style.overflow = ''
			document.documentElement.style.overflow = ''
			document.body.style.touchAction = ''
		}
	}, [])

	useEffect(() => {
		const img = photos[currentIndex]?.photo
		if (img?.asset?.metadata?.dimensions) {
			const { width, height } = img.asset.metadata.dimensions
			setIsLandscape(width >= height)
		} else {
			setIsLandscape(true)
		}
	}, [currentIndex, photos])

	// Update transform to center the active image based on actual widths
	useEffect(() => {
		setTimeout(() => {
			let totalWidth = 0
			for (let i = 0; i < currentIndex; i++) {
				if (photoRefs.current[i]) {
					totalWidth += photoRefs.current[i]!.offsetWidth + 32
				}
			}
			const activeWidth = photoRefs.current[currentIndex]?.offsetWidth || 0
			const centerPosition = totalWidth + activeWidth / 2
			setTransformX(`translateX(calc(50vw - ${centerPosition}px))`)
		}, 0)
	}, [currentIndex, photos])

	const handleNext = () => {
		setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
	}

	const handlePrev = () => {
		setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
	}

	const photographer = photos[currentIndex]?.photographer
	const tPhotoGallery = useTranslations('photoGallery')

	return (
		<div className="relative flex h-full w-full flex-col items-center justify-center">
			{/* Navigation Arrows */}
			<div
				className="absolute left-8 top-8 z-10 -mt-5 flex justify-center lg:left-16 lg:top-36 lg:z-20"
				onClick={onClose}
			>
				<motion.div
					initial={{ rotate: -3 }}
					animate={{
						rotate: 1,
						transition: {
							duration: 0.3,
							repeat: Infinity,
							delay: 5,
							repeatType: 'reverse',
							ease: 'easeInOut',
						},
					}}
					className={`flex w-fit items-center justify-center gap-1 rounded-md border-[0px] border-grayDark bg-grayDark py-0 pl-1 pr-3 text-center text-3xl font-bold uppercase italic tracking-[-0.06em] text-dark shadow-sm transition-all lg:z-10 lg:text-4xl`}
				>
					<button aria-label="Go back">
						<NewArrowRightFull
							theme={{ stroke: 'var(--color-dark)' }}
							className="ml-1 h-auto w-5 -rotate-180 lg:w-7"
						/>
					</button>
					<span>{tPhotoGallery('title')}</span>
				</motion.div>
			</div>
			<button
				className="fixed bottom-1/2 left-3 z-50 lg:left-8"
				aria-label="Previous photo"
				onClick={handlePrev}
			>
				<NewArrowRightSimple
					theme={{ stroke: 'var(--color-grayDark)' }}
					className="h-auto w-5 -rotate-180 lg:w-7"
				/>
			</button>

			<button
				className="fixed bottom-1/2 right-3 z-50 lg:right-8"
				aria-label="Next photo"
				onClick={handleNext}
			>
				<NewArrowRightSimple
					theme={{ stroke: 'var(--color-grayDark)' }}
					className="h-auto w-5 lg:w-7"
				/>
			</button>

			{/* Mobile Version - Current Layout */}
			<div className="pointer-events-none relative flex items-start justify-end px-0 lg:hidden">
				<div className="relative flex flex-col items-center justify-center rounded-none bg-grayDark py-4">
					{/* Film perforations */}
					<div className="absolute left-0 top-1 flex w-full justify-between px-2">
						{[...Array(12)].map((_, i) => (
							<div key={i} className="h-2 w-4 rounded-sm bg-dark" />
						))}
					</div>
					<div className="absolute bottom-1 left-0 flex w-full justify-between px-2">
						{[...Array(12)].map((_, i) => (
							<div key={i} className="h-2 w-4 rounded-sm bg-dark" />
						))}
					</div>

					<a
						href={photos[currentIndex].photo.asset.url}
						target="_blank"
						rel="noopener noreferrer"
						className="pointer-events-auto relative block w-full"
						tabIndex={0}
						aria-label="Open image in new tab"
					>
						<Img
							image={photos[currentIndex].photo}
							src={photos[currentIndex].photo.asset.url}
							alt={`Photo ${currentIndex + 1}`}
							className="max-h-[60vh] w-full object-cover object-top"
						/>
						<h3 className="absolute -top-12 left-[1rem] -rotate-3 rounded-md border-[3px] border-dark bg-grayDark px-2 text-lg font-medium tracking-tighter text-dark">
							{tPhotoGallery('photosBy')} {photographer}
						</h3>
					</a>
				</div>
			</div>

			{/* Desktop Version - Full Screen Film Roll */}
			<div className="m-2 hidden rounded-xl py-24 lg:relative lg:flex lg:h-screen lg:w-screen lg:items-center lg:justify-center lg:overflow-hidden lg:bg-grayDark">
				{/* Film perforations - top */}
				<div className="absolute left-0 top-0 z-10 flex w-full justify-between px-4 py-2">
					{[...Array(20)].map((_, i) => (
						<div key={i} className="h-16 w-12 rounded-lg bg-dark" />
					))}
				</div>
				{/* Film perforations - bottom */}
				<div className="absolute bottom-0 left-0 z-10 flex w-full justify-between px-4 py-2">
					{[...Array(20)].map((_, i) => (
						<div key={i} className="h-16 w-12 rounded-lg bg-dark" />
					))}
				</div>

				{/* Film roll container - horizontal scrolling strip */}
				<div className="relative flex h-full w-full items-center justify-center overflow-hidden">
					{/* Photographer label */}
					<h3 className="absolute left-28 top-[4.1rem] z-20 -rotate-2 rounded-md border-[0px] border-dark bg-primary px-2 py-0 text-xl font-medium tracking-tighter text-dark">
						{tPhotoGallery('photosBy')} {photographer}
					</h3>

					{/* Film strip - all photos in a row */}
					<div
						className="flex items-stretch transition-transform duration-500 ease-out"
						style={{
							transform: transformX,
							height: 'calc(100vh - 2rem)',
						}}
					>
						{photos.map((photo, index) => {
							const isActive = index === currentIndex

							return (
								<div
									key={index}
									ref={(el) => {
										photoRefs.current[index] = el
									}}
									className={`flex flex-shrink-0 items-center justify-center transition-all duration-500 ${
										isActive ? 'opacity-100' : 'opacity-70'
									}`}
									style={{
										width: 'auto', // All containers auto-width for aspect ratio
										height: 'calc(100vh - 2rem)',
										marginRight: '32px',
									}}
								>
									<button
										onClick={() => setCurrentIndex(index)}
										className="relative flex h-full w-full items-center justify-center"
										aria-label={`Go to photo ${index + 1}`}
									>
										<Img
											image={photo.photo}
											src={photo.photo.asset.url}
											alt={`Photo ${index + 1}`}
											className="w-auto object-contain"
											style={{ height: 'calc(100vh - 2rem)' }}
										/>
									</button>
								</div>
							)
						})}
					</div>
				</div>

				{/* Photo counter */}
				<div className="absolute bottom-12 left-1/2 z-20 -translate-x-1/2 rounded-md bg-grayDark px-3 py-1 font-medium text-dark">
					{currentIndex + 1} / {photos.length}
				</div>
			</div>

			{/* Mobile Thumbnail Navigation */}
			<div className="relative z-20 mt-2 w-full py-1 lg:hidden">
				<div className="pointer-events-none absolute left-0 top-3.5 z-10 flex w-full justify-between px-2">
					{[...Array(12)].map((_, i) => (
						<div key={i} className="h-2 w-4 rounded-sm bg-dark" />
					))}
				</div>
				<div
					ref={thumbContainerRef}
					className="no-scrollbar pointer-events-none mt-2 flex h-[5.25rem] w-full items-center justify-center gap-1 overflow-visible overflow-x-auto bg-grayDark"
				>
					{photos.map((photo, index) => {
						const isActive = index === currentIndex

						return (
							<button
								key={index}
								ref={isActive ? activeThumbRef : null}
								onClick={() => setCurrentIndex(index)}
								className={`pointer-events-auto relative z-20 aspect-square h-14 flex-shrink-0 ${
									isActive
										? 'relative z-20 scale-100 overflow-visible rounded-md border-2 border-primary'
										: ''
								}`}
							>
								<Img
									image={photo.photo}
									src={photo.photo.asset.url}
									alt={`Thumbnail ${index + 1}`}
									className="h-full w-full overflow-visible rounded-md object-cover"
								/>
							</button>
						)
					})}
				</div>
				<div className="pointer-events-none absolute bottom-2 left-0 z-0 flex w-full justify-between px-2">
					{[...Array(12)].map((_, i) => (
						<div key={i} className="h-2 w-4 rounded-sm bg-dark" />
					))}
				</div>
			</div>
		</div>
	)
}

export default FestivalCarousel
