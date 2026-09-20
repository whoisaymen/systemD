'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslations } from 'next-intl'
import Img, { getImageDimensions } from '@/ui/Img'
import RichText from '@/components/common/RichText'
import { richTextToPlainText } from '@/lib/richText'
import { richTextLines } from '@/lib/richTextLines'
import { FILM_LABEL_TEXT } from '../film/filmLabelStyles'
import FestivalCarousel, { type GalleryRect } from './FestivalCarousel'
import styles from './ExhibitionCollage.module.css'
import { photoCreditRotation } from './photoCreditStyles'

interface Exhibition {
	_key?: string
	curatorName?: unknown
	photos?: {
		_key?: string
		photo?: Sanity.Image
		artistName?: unknown
	}[]
}

function groupPhotos(exhibition: Exhibition) {
	const photos = (exhibition.photos ?? []).filter(({ photo }) => photo?.asset)
	const photoGroups: {
		orientation: 'portrait' | 'landscape'
		photos: typeof photos
	}[] = [
		{ orientation: 'portrait', photos: [] },
		{ orientation: 'landscape', photos: [] },
	]
	for (const entry of photos) {
		const dimensions = entry.photo && getImageDimensions(entry.photo)
		const isPortrait = dimensions && dimensions.height > dimensions.width
		photoGroups[isPortrait ? 0 : 1].photos.push(entry)
	}
	return photoGroups
}

export default function ExhibitionCollage({
	exhibitions,
}: {
	exhibitions: Exhibition[]
}) {
	const tExpo = useTranslations('expo')
	const [expandedPhoto, setExpandedPhoto] = useState<{
		initialIndex: number
		originRect: GalleryRect
	} | null>(null)
	const groupedExhibitions = exhibitions.map((exhibition) => ({
		exhibition,
		photoGroups: groupPhotos(exhibition),
	}))
	const galleryPhotos = groupedExhibitions.flatMap(({ photoGroups }) =>
		photoGroups.flatMap(({ photos }) =>
			photos.map(({ photo, artistName }) => ({
				photo,
				artistName: richTextToPlainText(artistName),
			})),
		),
	)

	const enlargePhoto = (
		photo: Sanity.Image | undefined,
		trigger: HTMLButtonElement,
	) => {
		if (!photo) return
		const { left, top, width, height } = trigger.getBoundingClientRect()
		trigger.focus({ preventScroll: true })
		setExpandedPhoto({
			initialIndex: galleryPhotos.findIndex((entry) => entry.photo === photo),
			originRect: { left, top, width, height },
		})
	}

	return (
		<div className="space-y-12 py-6 lg:pt-2">
			{expandedPhoto &&
				createPortal(
					<FestivalCarousel
						photos={galleryPhotos}
						initialIndex={expandedPhoto.initialIndex}
						originRect={expandedPhoto.originRect}
						onClose={() => setExpandedPhoto(null)}
						variant="image"
						imageFit="contain"
					/>,
					document.body,
				)}
			{groupedExhibitions.map(
				({ exhibition, photoGroups }, exhibitionIndex) => {
					return (
						<section key={exhibition._key ?? exhibitionIndex}>
							{photoGroups
								.filter(({ photos }) => photos.length > 0)
								.map(({ orientation, photos }) => (
									<ul
										className={styles.collage}
										key={orientation}
										data-orientation={orientation}
									>
										{photos.map(({ photo, artistName, _key }, photoIndex) => {
											const artist = richTextToPlainText(artistName)
											return (
												<li
													className={styles.item}
													key={
														_key ??
														`${photo?.asset?._id ?? photoIndex}-${photoIndex}`
													}
												>
													<button
														className={styles.print}
														type="button"
														aria-haspopup="dialog"
														onClick={(event) =>
															enlargePhoto(photo, event.currentTarget)
														}
														aria-label={
															artist
																? tExpo('enlargePhotoBy', { artist })
																: tExpo('enlargePhoto')
														}
													>
														<Img
															image={photo}
															alt={artist}
															imageWidth={1000}
															sizes="(min-width: 1024px) 28vw, (min-width: 640px) 40vw, 70vw"
															className={styles.photo}
														/>
														{artist && (
															<span className={styles.credit}>
																{richTextLines(artistName, 26).map(
																	(line, lineIndex) => (
																		<span
																			key={lineIndex}
																			style={{
																				rotate: photoCreditRotation(
																					artistName,
																					lineIndex,
																				),
																			}}
																			className={`relative max-w-full rounded-md border-2 border-dark bg-grayDark px-1.5 py-0 text-center text-dark ${FILM_LABEL_TEXT} ${lineIndex === 0 ? 'z-10' : 'z-0 -mt-[0.15rem]'}`}
																		>
																			<RichText
																				value={line}
																				inline
																				allowLinks={false}
																			/>
																		</span>
																	),
																)}
															</span>
														)}
													</button>
												</li>
											)
										})}
									</ul>
								))}
						</section>
					)
				},
			)}
		</div>
	)
}
