'use client'
import { motion } from 'motion/react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { renderParagraph } from '../common/RenderParagraph'

interface LongStoryProps {
	content: any[]
	lang: string
}

const LongStory: React.FC<LongStoryProps> = ({ content, lang }) => {
	const getLocalizedValue = (array: any[], lang: string) =>
		array?.find((v) => v?._key === lang)?.value

	return (
		<div className="space-y-8 px-4 py-4">
			{content.map((block, index) => {
				switch (block._type) {
					case 'internationalizedCitationBlock':
						// Handle cases where text or author is null
						if (!block.text && !block.author) return null
						return (
							<div className="relative mt-4 h-full py-0">
								<blockquote key={index} className="relative px-8">
									<span className="absolute left-0 top-0 text-[8rem] italic leading-[1] text-primary dark:text-primary/10">
										“
									</span>
									{block.text && (
										<p className="px-6 pt-8 text-2xl font-bold leading-[1] text-dark dark:text-primary">
											{getLocalizedValue(block.text, lang)}
										</p>
									)}
									{block.author && (
										<footer className="mt-2 pb-8 pr-4 text-right text-sm font-normal italic text-dark dark:text-primary">
											{block.author}
										</footer>
									)}
								</blockquote>
								{/* Recording frame corners */}
								<div className="absolute left-0 top-0 z-30 h-8 w-8 border-l-[2px] border-t-[2px] border-[#fff] mix-blend-overlay"></div>
								<div className="absolute right-0 top-0 z-30 h-8 w-8 border-r-[2px] border-t-[2px] border-[#fff] mix-blend-overlay"></div>
								<div className="absolute bottom-2 left-0 z-30 h-8 w-8 border-b-[2px] border-l-[2px] border-[#fff] mix-blend-overlay"></div>
								<div className="absolute bottom-2 right-0 z-30 h-8 w-8 border-b-[2px] border-r-[2px] border-[#fff] mix-blend-overlay"></div>
							</div>
						)

					case 'internationalizedParagraphBlock':
						// Handle cases where text is null
						if (!block.text) return null
						return (
							<div
								key={index}
								className="text-xl leading-[1.2] tracking-tighter text-dark dark:text-primary"
								style={{ whiteSpace: 'pre-wrap' }} // Preserve spaces and line breaks
							>
								{block.text
									.filter((paragraph: any) => paragraph._key === lang)
									.map((paragraph: any, idx: number) => (
										<p key={idx}>
											{renderParagraph(paragraph, [], 'bg-primary text-dark')}
										</p>
									))}
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
								<motion.div
									key={index}
									className="overflow-hidden rounded-md border-4 border-primary shadow-md sm:h-[65vh] sm:border-0"
									initial={{
										borderRadius: '0.375rem',
									}}
									animate={{ borderRadius: '15rem' }}
									transition={{
										duration: 3.4,
										ease: [0.76, 0, 0.24, 1],
										repeat: Infinity,
										repeatType: 'reverse',
									}}
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
								</motion.div>
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
