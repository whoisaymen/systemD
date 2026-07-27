'use client'

import { useState, useRef, useEffect } from 'react'
import Img from '@/ui/Img'
import { motion } from 'framer-motion'
import { IoChevronDownOutline, IoChevronUpOutline } from 'react-icons/io5'

interface FestivalPhotoGalleryProps {
	photos: any[]
}

const FestivalPhotoGallery: React.FC<FestivalPhotoGalleryProps> = ({
	photos,
}) => {
	const [open, setOpen] = useState(false)
	const [visibleCount, setVisibleCount] = useState(15) // load 15 photos at first
	const galleryRef = useRef<HTMLDivElement>(null)

	const handleToggle = () => {
		setOpen(!open)
		if (!open && galleryRef.current) {
			setTimeout(() => {
				galleryRef.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				})
			}, 150)
		}
	}

	const handleScroll = () => {
		if (!galleryRef.current) return
		const { scrollTop, scrollHeight, clientHeight } = galleryRef.current
		if (scrollTop + clientHeight >= scrollHeight - 100) {
			setVisibleCount((prev) => prev + 10) // Load 10 more
		}
	}

	useEffect(() => {
		const currentRef = galleryRef.current
		if (open && currentRef) {
			currentRef.addEventListener('scroll', handleScroll)
			return () => currentRef.removeEventListener('scroll', handleScroll)
		}
	}, [open])

	if (!photos || photos.length === 0) return null

	return (
		<div className="w-full">
			<button
				onClick={handleToggle}
				className="sticky top-16 mx-auto mb-4 flex items-center justify-center rounded-md border-2 border-primary bg-primary px-4 py-2 text-dark hover:opacity-80"
			>
				{open ? (
					<>
						Close Gallery <IoChevronUpOutline className="ml-2" />
					</>
				) : (
					<>
						View Photo Gallery <IoChevronDownOutline className="ml-2" />
					</>
				)}
			</button>

			{open && (
				<div ref={galleryRef} className="px-1 sm:px-4">
					<div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3">
						{photos.slice(0, visibleCount).map((photo: any, idx: number) => (
							<Img
								key={idx}
								image={photo}
								src={photo.asset.url}
								alt={`Photo ${idx + 1}`}
								className="h-auto w-full rounded-md object-cover"
							/>
						))}
					</div>
					{visibleCount < photos.length && (
						<p className="mt-4 text-center text-sm text-gray-500">
							Loading more photos...
						</p>
					)}
				</div>
			)}
		</div>
	)
}

export default FestivalPhotoGallery
