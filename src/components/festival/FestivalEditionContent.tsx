import React from 'react'
import Img from '@/ui/Img'
import Link from 'next/link'

interface FestivalEditionContentProps {
	festival: any
	language: string
}

const FestivalEditionContent: React.FC<FestivalEditionContentProps> = ({
	festival,
	language,
}) => {
	const getLocalizedValue = (array: any[], lang: string) => {
		if (!Array.isArray(array)) {
			return ''
		}
		const item = array.find((entry) => entry._key === lang)
		return item ? item.value : ''
	}

	if (!festival) {
		return <div>No content available</div>
	}

	console.log(festival, 'festival')

	return (
		<div className="no-scrollbar flex h-full w-full flex-col space-y-4 overflow-y-scroll rounded-md bg-white p-6">
			{/* {festival.visual && (
				<Img
					image={festival.visual}
					src={festival.visual.asset.url}
					alt={
						festival.title
							? getLocalizedValue(festival.title, language)
							: 'Festival image'
					}
					className="h-auto w-full rounded-md"
				/>
			)} */}
			{festival.title && (
				<h1 className="text-3xl font-bold">
					{getLocalizedValue(festival.title, language)}
				</h1>
			)}
			{festival.description && (
				<p>{getLocalizedValue(festival.description, language)}</p>
			)}
			<p className="text-lg font-semibold">{festival.year}</p>
			<p className="text-lg">{festival.venue}</p>
			{festival.pressLink && (
				<a
					href={festival.pressLink}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-500 underline"
				>
					Press Link
				</a>
			)}
			{festival.filmSelection && festival.filmSelection.length > 0 && (
				<div>
					<h2 className="text-2xl font-bold">Film Selection</h2>
					<ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{festival.filmSelection.map((film: any, index: number) => (
							<li key={index} className="rounded-md border p-4 shadow-md">
								{film.slug?.current ? (
									<Link href={`/${language}/film/${film.slug.current}`}>
										<h3 className="text-xl font-semibold">
											{getLocalizedValue(film.title, language)}
										</h3>
										<p>{getLocalizedValue(film.description, language)}</p>
										<p className="text-sm">Director: {film.director}</p>
										<p className="text-sm">Release Year: {film.releaseYear}</p>
										{/* {film.poster && (
											<Img
												image={film.poster}
												src={film.poster.asset.url}
												alt={getLocalizedValue(film.title, language)}
												className="h-auto w-full rounded-md"
											/>
										)} */}
									</Link>
								) : (
									<div>
										<h3 className="text-xl font-semibold">
											{getLocalizedValue(film.title, language)}
										</h3>
										<p>{getLocalizedValue(film.description, language)}</p>
										<p className="text-sm">Director: {film.director}</p>
										<p className="text-sm">Release Year: {film.releaseYear}</p>
										{/* {film.poster && (
											<Img
												image={film.poster}
												src={film.poster.asset.url}
												alt={getLocalizedValue(film.title, language)}
												className="h-auto w-full rounded-md"
											/>
										)} */}
									</div>
								)}
							</li>
						))}
					</ul>
				</div>
			)}
			{festival.photoGallery && festival.photoGallery.length > 0 && (
				<div>
					<h2 className="text-2xl font-bold">Photo Gallery</h2>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{/* {festival.photoGallery.map((photo: any, index: number) => (
							<Img
								key={index}
								image={photo}
								src={photo.asset.url}
								alt={`Photo ${index + 1}`}
								className="h-auto w-full rounded-md"
							/>
						))} */}
					</div>
				</div>
			)}
			{festival.expoPhoto && festival.expoPhoto.length > 0 && (
				<div>
					<h2 className="text-2xl font-bold">Expo Photo</h2>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{/* {festival.expoPhoto.map((photo: any, index: number) => (
							<Img
								key={index}
								image={photo}
								src={photo.asset.url}
								alt={`Expo Photo ${index + 1}`}
								className="h-auto w-full rounded-md"
							/>
						))} */}
					</div>
				</div>
			)}
		</div>
	)
}

export default FestivalEditionContent
