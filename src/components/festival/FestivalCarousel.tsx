import Img from '@/ui/Img'
import { motion } from 'motion/react'
import { useRef, useEffect, useState } from 'react'

const FestivalCarousel: React.FC<{ photos: any[]; initialIndex?: number }> = ({
	photos,
	initialIndex = 0,
}) => {
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

	const handleNext = () => {
		setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
	}

	const handlePrev = () => {
		setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
	}

	return (
		<div className="flex h-full items-center justify-center">
			{/* Main image */}
			<div className="relative w-full overflow-hidden">
				<div className="px-4">
					{' '}
					<Img
						image={photos[currentIndex]}
						src={photos[currentIndex].asset.url}
						alt={`Photo ${currentIndex + 1}`}
						className="h-auto w-full rounded-md border-4 border-primary object-cover"
					/>
				</div>

				{/* Navigation buttons */}
				{photos.length > 1 && (
					<>
						<button
							onClick={handlePrev}
							className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-3xl text-primary"
						>
							←
						</button>
						<button
							onClick={handleNext}
							className="absolute right-4 top-1/2 z-10 -translate-y-1/2 p-2 text-3xl text-primary"
						>
							→
						</button>
					</>
				)}
			</div>

			{/* Thumbnail preview bar */}
			<div
				ref={thumbContainerRef}
				className="no-scrollbar absolute inset-x-0 bottom-8 mt-4 flex w-full gap-2 overflow-x-auto px-4"
			>
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
								image={photo}
								src={photo.asset.url}
								alt={`Thumbnail ${index + 1}`}
								className="h-full w-full rounded-md object-cover"
							/>
						</button>
					)
				})}
			</div>
		</div>
	)
}

export default FestivalCarousel
