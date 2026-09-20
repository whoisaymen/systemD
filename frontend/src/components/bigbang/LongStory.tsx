'use client'
import Image from 'next/image'
import RichText from '@/components/common/RichText'
import {
	EDITORIAL_BODY_TEXT,
	EDITORIAL_COPY_WIDTH,
} from '@/components/common/editorialStyles'
import { localizedRichText, richTextToPlainText } from '@/lib/richText'
import { renderParagraph } from '../common/RenderParagraph'
import BackToTopButton from '../common/BackToTop'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Maximize2 } from 'lucide-react'
import FestivalCarousel, {
	type GalleryRect,
} from '../festival/FestivalCarousel'

interface LongStoryProps {
	content: any[]
	lang: string
}

type FullscreenImage = {
	image: any
	originRect: GalleryRect
}

const getStableNumber = (seed: string, minimum: number, maximum: number) => {
	let hash = 2166136261

	for (let index = 0; index < seed.length; index += 1) {
		hash ^= seed.charCodeAt(index)
		hash = Math.imul(hash, 16777619)
	}

	return minimum + ((hash >>> 0) % (maximum - minimum + 1))
}

const quoteWords = (value: any): any[] => {
	if (typeof value === 'string') return value.split(/\s+/).filter(Boolean)
	if (!Array.isArray(value)) return []
	return value.flatMap((block) =>
		(block.children ?? []).flatMap((child: any) =>
			(typeof child.text === 'string'
				? child.text.split(/\s+/).filter(Boolean)
				: []
			).map((word: string, index: number) => [
				{
					...block,
					style: 'normal',
					children: [{ ...child, _key: `${child._key}-${index}`, text: word }],
				},
			]),
		),
	)
}

const LongStory: React.FC<LongStoryProps> = ({ content, lang }) => {
	const [fullscreenImage, setFullscreenImage] =
		useState<FullscreenImage | null>(null)

	return (
		<div className={`${EDITORIAL_COPY_WIDTH} pb-8`} id="long-story">
			<div className="fixed bottom-4 right-4 z-50 sm:hidden">
				<BackToTopButton targetId="navbar-mobile" />
			</div>

			{fullscreenImage && createPortal(
				<FestivalCarousel
					photos={[{ photo: fullscreenImage.image }]}
					originRect={fullscreenImage.originRect}
					onClose={() => setFullscreenImage(null)}
					variant="image"
				/>,
				document.body,
			)}
			{/* 
			<SectionTitle className="lg:py-8" text="Big Bang" /> */}

			{content.map((block, index) => {
				switch (block._type) {
					case 'internationalizedCitationBlock':
						// Handle cases where text or author is null
						if (!block.text && !block.author) return null
						return (
							<div
								key={block._key || index}
								className="relative flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 rounded-none py-4 sm:gap-x-3 lg:-mx-[6cqw]"
							>
								<span className="inline-block text-[1.05rem] font-bold leading-none tracking-tight text-primary lg:text-[3.15rem]">
									"
								</span>
								{quoteWords(localizedRichText(block.text, lang)).map(
									(word: any, wordIndex: number) => {
										const seed = `${block._key ?? index}-${lang}-${wordIndex}-${richTextToPlainText(word)}`
										const rotation = getStableNumber(seed, -10, 10)
										const marginTop = getStableNumber(`${seed}-top`, -5, 5)
										const marginLeft = getStableNumber(`${seed}-left`, -5, 5)

										return (
											<span
												key={wordIndex}
												className="inline-block text-[1.05rem] font-bold leading-[1.1] tracking-tight text-primary lg:text-[2.1rem]"
												style={{
													transform: `rotate(${rotation}deg)`,
													marginTop: `${marginTop}px`,
													marginLeft: `${marginLeft}px`,
												}}
											>
												<RichText value={word} inline />
											</span>
										)
									},
								)}
								<span className="inline-block text-[1.3125rem] font-bold leading-none tracking-tight text-primary lg:text-[3.15rem]">
									"
								</span>
								{block.author && (
									<span className="pl-4 pt-0 text-right font-mono text-sm font-normal tracking-[-0.1em] text-grayDark lg:mt-0 lg:text-base">
										<RichText
											value={localizedRichText(block.author, lang)}
											inline
										/>
									</span>
								)}
							</div>
						)

					case 'internationalizedParagraphBlock':
						// Handle cases where text is null
						if (!block.text) return null
						return (
							<div
								key={index}
								className={`flex flex-col items-center justify-center lg:pb-8 ${index > 0 ? 'lg:pt-8' : ''}`}
							>
								<div
									className={`${EDITORIAL_BODY_TEXT} w-full text-primary`}
									style={{ whiteSpace: 'pre-wrap' }} // Preserve spaces and line breaks
								>
									{renderParagraph(
										{ value: localizedRichText(block.text, lang) },
										[],
										'bg-primary text-dark',
									)}
								</div>
							</div>
						)

					case 'internationalizedImageBlock':
						// Handle cases where video or image is provided
						if (block.video) {
							return (
								<div
									key={index}
									className="relative mx-auto w-full"
								>
									<video
										controls
										className="w-full rounded-md"
										src={block.video}
									>
										Your browser does not support the video tag.
									</video>
									{block.caption && (
										<p className="mt-2 text-center text-sm italic text-primary">
											<RichText
												value={localizedRichText(block.caption, lang)}
												inline
											/>
										</p>
									)}
								</div>
							)
						}

						if (block.uploadedVideo?.asset) {
							const uploadedVideoUrl = block.uploadedVideo.asset.url
							return (
								<div
									key={index}
									className="relative mx-auto w-full"
								>
									<video
										controls
										className="w-full rounded-md"
										src={uploadedVideoUrl}
									>
										Your browser does not support the video tag.
									</video>
									{block.caption && (
										<p className="mt-2 text-center text-sm italic text-primary">
											<RichText
												value={localizedRichText(block.caption, lang)}
												inline
											/>
										</p>
									)}
								</div>
							)
						}

						if (block.file?.asset) {
							return (
								<div
									key={index}
									className="relative mx-auto w-full lg:mt-8"
								>
									<button
										type="button"
										className="group/story-image relative block w-full overflow-hidden shadow-md"
										aria-expanded={Boolean(fullscreenImage?.image === block.file)}
										onClick={(event) => {
											const rect = event.currentTarget.getBoundingClientRect()

											setFullscreenImage({
												image: block.file,
												originRect: {
													height: rect.height,
													left: rect.left,
													top: rect.top,
													width: rect.width,
												},
											})
										}}
										aria-label="Open image fullscreen"
									>
										<Image
											src={block.file.asset.url}
											alt={
												richTextToPlainText(
													localizedRichText(block.caption, lang),
												) || 'Image'
											}
											width={block.file.asset.metadata.dimensions.width}
											height={block.file.asset.metadata.dimensions.height}
											className="aspect-video h-full w-full object-cover object-[100%_45%]"
										/>
										<span
											aria-hidden="true"
											className="absolute right-8 top-8 flex h-8 w-8 items-center justify-center rounded-md border-2 border-primary bg-dark/90 text-[color:var(--color-primary)] opacity-0 shadow-md backdrop-blur transition-[color,background-color,opacity] duration-200 hover:bg-primary hover:text-dark group-hover/story-image:opacity-100 group-focus-visible/story-image:opacity-100 [@media(hover:none)]:opacity-100"
										>
											<Maximize2 className="h-5 w-5" />
										</span>
									</button>
									{block.caption && (
										<p className="mt-2 text-center text-sm italic text-primary">
											<RichText
												value={localizedRichText(block.caption, lang)}
												inline
											/>
										</p>
									)}
								</div>
							)
						}

						// Skip block if neither video nor image is provided
						return null

					default:
						// Skip unknown block types
						return null
				}
			})}
		</div>
	)
}

export default LongStory
