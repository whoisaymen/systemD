'use client'

import { useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocale, useTranslations } from 'next-intl'
import Img, { getImageDimensions } from '@/ui/Img'
import { localizedRichText, richTextToPlainText } from '@/lib/richText'
import RichText from '@/components/common/RichText'
import {
	EDITORIAL_BODY_TEXT,
	EDITORIAL_COPY_WIDTH,
	EDITORIAL_RICH_TEXT_HEADINGS,
} from '@/components/common/editorialStyles'
import FestivalCarousel, { type GalleryRect } from './FestivalCarousel'
import styles from './ExhibitionCollage.module.css'
import ArtistCreditPills from './ArtistCreditPills'

interface Exhibition {
	_key?: string
	curatorName?: unknown
	description?: unknown
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
	const locale = useLocale()
	const collageRef = useRef<HTMLDivElement>(null)
	const [expandedPhoto, setExpandedPhoto] = useState<{
		initialIndex: number
		originRect: GalleryRect
		originSrc?: string
	} | null>(null)
	const groupedExhibitions = useMemo(
		() =>
			exhibitions.map((exhibition) => ({
				exhibition,
				photoGroups: groupPhotos(exhibition),
			})),
		[exhibitions],
	)
	const galleryPhotos = useMemo(
		() =>
			groupedExhibitions.flatMap(({ photoGroups }) =>
				photoGroups.flatMap(({ photos }) =>
					photos.map(({ photo, artistName }, index) => ({
						photo,
						artistName: richTextToPlainText(artistName),
						artistCreditSide: index % 2 ? 'right' as const : 'left' as const,
					})),
				),
			),
		[groupedExhibitions],
	)

	const enlargePhoto = (
		photo: Sanity.Image | undefined,
		trigger: HTMLButtonElement,
	) => {
		if (!photo) return
		const { left, top, width, height } = trigger.getBoundingClientRect()
		const thumbnail = trigger.querySelector('img')
		trigger.focus({ preventScroll: true })
		setExpandedPhoto({
			initialIndex: galleryPhotos.findIndex((entry) => entry.photo === photo),
			originRect: { left, top, width, height },
			originSrc:
				thumbnail?.complete && thumbnail.naturalWidth > 0
					? thumbnail.currentSrc || thumbnail.src
					: undefined,
		})
	}

	return (
		<div ref={collageRef} className="space-y-12 pb-6 lg:pt-2">
			{expandedPhoto &&
				createPortal(
					<FestivalCarousel
						photos={galleryPhotos}
						initialIndex={expandedPhoto.initialIndex}
						originRect={expandedPhoto.originRect}
						originSrc={expandedPhoto.originSrc}
						getThumbnail={(index) =>
							collageRef.current?.querySelector<HTMLButtonElement>(
								`[data-exhibition-thumbnail="${index}"]`,
							) ?? null
						}
						onClose={() => setExpandedPhoto(null)}
						variant="image"
						imageFit="contain"
					/>,
					document.body,
				)}
			{groupedExhibitions.map(
				({ exhibition, photoGroups }, exhibitionIndex) => {
					const description = localizedRichText(exhibition.description, locale)
					return (
						<section key={exhibition._key ?? exhibitionIndex}>
							{richTextToPlainText(description).trim() && (
								<RichText
									value={description}
									className={`exhibition-description ${EDITORIAL_BODY_TEXT} ${EDITORIAL_COPY_WIDTH} ${EDITORIAL_RICH_TEXT_HEADINGS} mx-auto mb-6 text-primary max-lg:px-0`}
								/>
							)}
							<div className="lg:px-6">
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
															data-exhibition-thumbnail={galleryPhotos.findIndex(
																(entry) => entry.photo === photo,
															)}
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
																loading="lazy"
																sizes="(min-width: 1024px) 28vw, 46vw"
																className={styles.photo}
															/>
															{artist && (
																<span className={styles.credit}>
																	<ArtistCreditPills
																		value={artistName}
																		compact
																	/>
																</span>
															)}
														</button>
													</li>
												)
											})}
										</ul>
									))}
							</div>
						</section>
					)
				},
			)}
		</div>
	)
}
