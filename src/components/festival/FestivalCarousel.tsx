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

	const handleNext = () => {
		setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
	}

	const handlePrev = () => {
		setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
	}

	const photographer = photos[currentIndex]?.photographer
	const tPhotoGallery = useTranslations('photoGallery')

	const getPrevPhoto = () => {
		const prevIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1
		return photos[prevIndex]
	}

	const getNextPhoto = () => {
		const nextIndex = currentIndex === photos.length - 1 ? 0 : currentIndex + 1
		return photos[nextIndex]
	}

	return (
		<div className="relative flex h-full w-full flex-col items-center justify-center">
			{/* Navigation Arrows */}
			<button
				className="fixed bottom-1/2 left-4 z-50"
				aria-label="Previous photo"
				onClick={handlePrev}
			>
				<ArrowRight
					theme={{ stroke: 'var(--color-grayDark)' }}
					className="h-auto w-9 -rotate-180 lg:w-9"
				/>
			</button>

			<button
				className="fixed bottom-1/2 right-4 z-50"
				aria-label="Next photo"
				onClick={handleNext}
			>
				<ArrowRight
					theme={{ stroke: 'var(--color-grayDark)' }}
					className="h-auto w-9 lg:w-9"
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
					<h3 className="absolute left-16 top-8 z-20 -rotate-3 rounded-md border-[3px] border-dark bg-primary px-2 py-0 text-xl font-medium tracking-tighter text-dark">
						{tPhotoGallery('photosBy')} {photographer}
					</h3>

					{/* Film strip - all photos in a row */}
					<div
						className="flex h-full items-stretch transition-transform duration-500 ease-out"
						style={{
							transform: `translateX(calc(50vw - ${currentIndex * 408}px - 204px))`, // Updated calculation
							height: '100vh',
						}}
					>
						{photos.map((photo, index) => {
							const isActive = index === currentIndex

							return (
								<div
									key={index}
									className={`flex h-full flex-shrink-0 items-center justify-center transition-all duration-500 ${
										isActive ? 'opacity-100' : 'opacity-70'
									}`}
									style={{
										width: isActive ? 'auto' : '400px',
										height: '100vh',
										marginRight: '32px',
										minWidth: isActive ? '0' : '400px',
									}}
								>
									<div className="flex h-full w-full items-center justify-center">
										{' '}
										{/* Added wrapper div */}
										<button
											onClick={() => setCurrentIndex(index)}
											className="relative h-full w-auto"
											aria-label={`Go to photo ${index + 1}`}
										>
											<Img
												image={photo.photo}
												src={photo.photo.asset.url}
												alt={`Photo ${index + 1}`}
												className={`h-full w-auto ${
													isActive ? 'object-contain' : 'object-cover'
												}`}
											/>
										</button>
									</div>
								</div>
							)
						})}
					</div>
				</div>

				{/* Photo counter */}
				<div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 rounded-md border-[0px] border-primary bg-grayDark px-3 py-1 text-xl font-medium text-dark">
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
