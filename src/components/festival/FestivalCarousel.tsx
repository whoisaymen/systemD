import Img from '@/ui/Img'
import ArrowRight from '../common/ArrowRight'
import { motion } from 'motion/react'
import { useRef, useEffect, useState } from 'react'
import ArrowGallery from '../common/ArrowGallery'
import { useTranslations } from 'next-intl'

const FestivalCarousel: React.FC<{
	photos: {
		photo: any
		photographer?: string
		artistName?: string
		curatorName?: string
	}[]
	initialIndex?: number
}> = ({ photos, initialIndex = 0 }) => {
	const [currentIndex, setCurrentIndex] = useState(initialIndex)
	const thumbContainerRef = useRef<HTMLDivElement>(null)
	const [isLandscape, setIsLandscape] = useState(true)

	const activeThumbRef = useRef<HTMLButtonElement>(null)

	// Center the active thumbnail in the preview bar
	useEffect(() => {
		if (activeThumbRef.current && thumbContainerRef.current) {
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
		document.documentElement.style.overflow = 'hidden' // lock <html> too
		document.body.style.touchAction = 'none' // disable swipe scrolling on mobile

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
			setIsLandscape(true) // fallback
		}
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
			<button
				className="fixed bottom-1/2 left-4 z-50"
				aria-label="Go back"
				onClick={handlePrev}
			>
				<ArrowRight
					theme={{ stroke: 'var(--color-grayDark)' }}
					className="h-auto w-9 -rotate-180 lg:w-9"
				/>
			</button>

			<button
				className="fixed bottom-1/2 right-4 z-50"
				aria-label="Go back"
				onClick={handleNext}
			>
				<ArrowRight
					theme={{ stroke: 'var(--color-grayDark)' }}
					className="h-auto w-9 lg:w-9"
				/>
			</button>

			<div
				className={`pointer-events-none relative flex items-start justify-end px-0`}
			>
				<div className="relative flex flex-col items-center justify-center rounded-none bg-grayDark py-4">
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
						<h3
							className={`absolute -top-12 left-[1rem] -rotate-3 rounded-md border-[3px] border-dark bg-grayDark px-2 text-lg font-medium tracking-tighter text-dark sm:hidden`}
						>
							{tPhotoGallery('photosBy')} {photographer}
						</h3>
					</a>
				</div>
			</div>

			<div className="relative z-20 mt-2 w-full py-1">
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
