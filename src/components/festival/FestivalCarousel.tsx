import Img from '@/ui/Img'
import { motion } from 'motion/react'
import { useRef, useEffect, useState } from 'react'

const FestivalCarousel: React.FC<{
	photos: { photo: any; artistName?: string; curatorName?: string }[]
	initialIndex?: number
}> = ({ photos, initialIndex = 0 }) => {
	const [currentIndex, setCurrentIndex] = useState(initialIndex)
	const thumbContainerRef = useRef<HTMLDivElement>(null)
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

	const handleNext = () => {
		setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
	}

	const handlePrev = () => {
		setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
	}

	return (
		<div className="flex h-full items-center justify-center">
			{/* Curator Name (only for expoPhoto) */}
			{photos[currentIndex].curatorName && (
				<div className="absolute top-4 text-center text-2xl font-bold text-primary">
					{photos[currentIndex].curatorName}
				</div>
			)}

			{/* Main image */}
			<div className="relative w-full overflow-hidden">
				<div className="py-8">
					<div className="relative">
						<div className="absolute top-1 z-30 h-[5%] w-full rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:20px_12px] bg-center bg-repeat-x sm:w-full"></div>

						<div className="absolute bottom-1 z-30 h-[5%] w-full rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:20px_12px] bg-center bg-repeat-x sm:w-full"></div>
						<Img
							image={photos[currentIndex].photo}
							src={photos[currentIndex].photo.asset.url}
							alt={`Photo ${currentIndex + 1}`}
							className="h-auto w-full object-cover"
						/>
					</div>
				</div>

				{/* Artist Name (only for expoPhoto) */}
				{photos[currentIndex].artistName && (
					<div className="mt-4 text-center text-lg font-medium text-primary">
						{photos[currentIndex].artistName || 'Unknown Artist'}
					</div>
				)}

				{/* Navigation buttons */}
				{photos.length > 1 && (
					<>
						<button
							onClick={handlePrev}
							className="absolute left-4 top-1/2 z-10 -translate-y-1/2 px-2 py-1 text-3xl text-primary"
						>
							←
						</button>
						<button
							onClick={handleNext}
							className="absolute right-4 top-1/2 z-10 -translate-y-1/2 px-2 py-1 text-3xl text-primary"
						>
							→
						</button>
					</>
				)}
			</div>

			{/* Thumbnail preview bar */}
			<div
				ref={thumbContainerRef}
				className="no-scrollbar absolute inset-x-0 bottom-4 mt-4 flex w-full gap-2 overflow-x-auto bg-black"
			>
				<div className="absolute top-0.5 z-30 h-[5%] w-full rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:10px_6px] bg-center bg-repeat-x sm:w-full"></div>

				<div className="absolute bottom-0.5 z-30 h-[5%] w-full rounded-md bg-[url('/assets/svg/filmroll.svg')] bg-[length:10px_6px] bg-center bg-repeat-x sm:w-full"></div>
				{photos.map((photo, index) => {
					const isActive = index === currentIndex

					return (
						<button
							key={index}
							ref={isActive ? activeThumbRef : null}
							onClick={() => setCurrentIndex(index)}
							className={`aspect-square h-16 flex-shrink-0 ${
								isActive ? 'rounded-md border-2 border-primary' : ''
							}`}
						>
							<Img
								image={photo.photo}
								src={photo.photo.asset.url}
								alt={`Thumbnail ${index + 1}`}
								className="h-full w-full object-cover"
							/>
						</button>
					)
				})}
			</div>
		</div>
	)
}

export default FestivalCarousel
