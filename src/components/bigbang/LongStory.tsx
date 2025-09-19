'use client'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { renderParagraph } from '../common/RenderParagraph'
import BackToTopButton from '../common/BackToTop'
import { useState } from 'react'
import CloseIcon from '../common/CloseIcon'
import SectionTitle from '../ui/SectionTitle'

interface LongStoryProps {
	content: any[]
	lang: string
}

const LongStory: React.FC<LongStoryProps> = ({ content, lang }) => {
	const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)

	const getLocalizedValue = (array: any[], lang: string) =>
		array?.find((v) => v?._key === lang)?.value

	return (
		<div className="space-y-0 py-8" id="long-story">
			<div className="fixed bottom-4 right-4 z-50 sm:hidden">
				<BackToTopButton targetId="navbar-mobile" />
			</div>

			<AnimatePresence>
				{fullscreenImage && (
					<motion.div
						className="fixed inset-0 z-50 flex items-center justify-center bg-dark"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25 }}
						onClick={() => setFullscreenImage(null)}
					>
						<motion.img
							src={fullscreenImage}
							alt="Fullscreen"
							className="max-h-[95vh] max-w-[95vw] rounded-lg border-[3px] border-primary shadow-2xl"
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.95, opacity: 0 }}
							transition={{ duration: 0.25 }}
							onClick={(e) => e.stopPropagation()}
						/>
						<motion.button
							className="z-60 bg-dark/80 absolute right-4 top-4 rounded-full p-2 text-primary"
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.2 }}
							onClick={(e) => {
								e.stopPropagation()
								setFullscreenImage(null)
							}}
						>
							<CloseIcon
								theme={{ fill: 'var(--color-primary)' }}
								className="h-auto w-5 -rotate-180 lg:w-9"
							/>
						</motion.button>
					</motion.div>
				)}
			</AnimatePresence>
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
								className="relative flex flex-wrap items-center justify-center gap-2 rounded-none px-5 py-4 sm:gap-4 lg:px-20"
							>
								<span className="inline-block text-2xl font-bold leading-[1.2] tracking-tight text-dark dark:text-primary lg:text-7xl">
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
												className="inline-block text-2xl font-bold leading-[1.2] tracking-tight text-dark dark:text-primary lg:text-5xl"
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
								<span className="inline-block text-3xl font-bold leading-[1.2] tracking-tight text-dark dark:text-primary lg:text-7xl">
									"
								</span>
								{block.author && (
									<span className="pl-4 pt-0 text-right font-mono text-sm font-normal tracking-[-0.1em] text-dark dark:text-grayDark lg:mt-0 lg:text-base">
										{block.author}
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
								className="flex flex-col items-center justify-center lg:py-8"
							>
								<div
									className="px-4 text-base leading-[1.2] tracking-tight text-dark dark:text-primary lg:px-16 lg:text-xl"
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
													'!w-[6rem] !md:w-[100rem] !px-1 !py-0.5 !rounded-[0.15rem]',
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
									className="relative mx-4 overflow-hidden rounded-xl border-2 border-primary shadow-md sm:mx-0 sm:h-auto sm:border-[3px] lg:mx-16"
									onClick={() => setFullscreenImage(block.file.asset.url)}
								>
									{/* <div className="absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-primary opacity-75 mix-blend-screen" /> */}
									<Image
										src={block.file.asset.url}
										alt={getLocalizedValue(block.caption, lang) || 'Image'}
										width={block.file.asset.metadata.dimensions.width}
										height={block.file.asset.metadata.dimensions.height}
										className="aspect-video h-full w-full object-cover object-[100%_45%]"
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
