'use client'
import { motion } from 'motion/react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { renderParagraph } from '../common/RenderParagraph'
import BackToTopButton from '../common/BackToTop'

interface LongStoryProps {
	content: any[]
	lang: string
}

const LongStory: React.FC<LongStoryProps> = ({ content, lang }) => {
	const getLocalizedValue = (array: any[], lang: string) =>
		array?.find((v) => v?._key === lang)?.value

	return (
		<div className="space-y-0 pb-16" id="long-story">
			<div className="fixed bottom-4 right-12 z-50">
				<BackToTopButton targetId="navbar-mobile" />
			</div>
			{content.map((block, index) => {
				switch (block._type) {
					case 'internationalizedCitationBlock':
						// Handle cases where text or author is null
						if (!block.text && !block.author) return null
						return (
							<div
								key={block._key || index}
								className="relative flex flex-wrap items-center justify-center gap-2 rounded-none px-5 py-8 lg:px-32"
							>
								<span className="inline-block text-2xl font-bold leading-[1.2] tracking-tighter text-dark dark:text-primary lg:text-7xl">
									"
								</span>
								{getLocalizedValue(block.text, lang)
									.split(' ')
									.map((word: string, index: number) => {
										// Generate random rotation and position
										const randomRotation = Math.floor(Math.random() * 21) - 10 // Random rotation between -5 and 5 degrees
										const randomMarginTop = Math.floor(Math.random() * 10) - 5 // Random margin-top between -5px and 5px
										const randomMarginLeft = Math.floor(Math.random() * 10) - 5 // Random margin-left between -5px and 5px

										return (
											<span
												key={index}
												className="inline-block text-2xl font-bold leading-[1.2] tracking-tighter text-dark dark:text-primary lg:text-7xl"
												style={{
													transform: `rotate(${randomRotation}deg)`,
													marginTop: `${randomMarginTop}px`,
													marginLeft: `${randomMarginLeft}px`,
												}}
											>
												{word}
											</span>
										)
									})}
								<span className="inline-block text-3xl font-bold leading-[1.2] tracking-tighter text-dark dark:text-primary lg:text-9xl">
									"
								</span>
								{block.author && (
									<div className="w-full pr-4 pt-0 text-right text-sm font-normal tracking-tighter text-dark dark:text-grayDark lg:text-base">
										{block.author}
									</div>
								)}
							</div>
						)

					case 'internationalizedParagraphBlock':
						// Handle cases where text is null
						if (!block.text) return null
						return (
							<div
								key={index}
								className="flex flex-col items-center justify-center"
							>
								<div
									className="px-4 text-base leading-[1.2] tracking-tighter text-dark dark:text-primary lg:max-w-[50vw] lg:text-xl"
									style={{ whiteSpace: 'pre-wrap' }} // Preserve spaces and line breaks
								>
									{block.text
										.filter((paragraph: any) => paragraph._key === lang)
										.map((paragraph: any, idx: number) => (
											<p key={idx}>
												{renderParagraph(
													paragraph,
													[],
													'bg-grayDark text-dark',
													'!w-[5rem] !md:w-[10rem] !px-1 !py-0.5 !rounded-[0.15rem]',
												)}
											</p>
										))}
								</div>
							</div>
						)

					case 'internationalizedImageBlock':
						// Handle cases where video or image is provided
						if (block.video) {
							return (
								<div key={index} className="relative mx-auto w-full max-w-4xl">
									<video
										controls
										className="w-full rounded-md"
										src={block.video}
									>
										Your browser does not support the video tag.
									</video>
									{block.caption && (
										<p className="mt-2 text-center text-sm italic text-dark dark:text-primary">
											{getLocalizedValue(block.caption, lang)}
										</p>
									)}
								</div>
							)
						}

						if (block.uploadedVideo?.asset) {
							const uploadedVideoUrl = `/${block.uploadedVideo.asset._ref.split('-')[1]}-${block.uploadedVideo.asset._ref.split('-')[2]}.${block.uploadedVideo.asset._ref.split('-')[3]}`
							return (
								<div key={index} className="relative mx-auto w-full max-w-4xl">
									<video
										controls
										className="w-full rounded-md"
										src={uploadedVideoUrl}
									>
										Your browser does not support the video tag.
									</video>
									{block.caption && (
										<p className="mt-2 text-center text-sm italic text-dark dark:text-primary">
											{getLocalizedValue(block.caption, lang)}
										</p>
									)}
								</div>
							)
						}

						if (block.file?.asset) {
							return (
								<div
									key={index}
									className="mx-4 overflow-hidden rounded-xl border-2 border-primary shadow-md sm:h-[65vh] sm:border-0"
								>
									<Image
										src={block.file.asset.url}
										alt={getLocalizedValue(block.caption, lang) || 'Image'}
										width={block.file.asset.metadata.dimensions.width}
										height={block.file.asset.metadata.dimensions.height}
										className="h-full w-full object-cover"
									/>
									{block.caption && (
										<p className="mt-2 text-center text-sm italic text-dark dark:text-primary">
											{getLocalizedValue(block.caption, lang)}
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
