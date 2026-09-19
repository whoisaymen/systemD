'use client'
import { motion } from 'motion/react'
import RichText from '@/components/common/RichText'
import { localizedRichText } from '@/lib/richText'
import FabriqueBracketsIcon from '../fabrique/FabriqueBracketsIcon'

interface VisionBlockProps {
	vision: any[]
	visionTitle: any[]
	language: string
}

const VisionBlock: React.FC<VisionBlockProps> = ({
	vision,
	visionTitle,
	language,
}) => {
	return (
		<motion.div
			className="mt-20 lg:flex"
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<div className="relative mb-12 lg:w-full">
				<div className="flex items-center justify-center">
					<FabriqueBracketsIcon
						className="w-[75vw] sm:w-1/4 lg:hidden"
						theme={{ fill: 'var(--color-primary)' }}
					/>
				</div>
				<h1 className="absolute left-1/2 top-1/2 mx-auto max-w-64 -translate-x-1/2 -translate-y-1/2 px-2 py-24 text-center text-5xl font-bold leading-[1] tracking-tighter text-primary sm:py-4 sm:text-4xl">
					<RichText value={localizedRichText(visionTitle, language)} inline />
				</h1>
			</div>

			<div className="pt-2">
				{vision.map((visionItem: any, index: number) => (
					<motion.div
						key={index}
						className="mt-8"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: index * 0.2 }}
					>
						<div className="relative rounded-t-3xl px-4">
							<h2 className="text-lg font-bold leading-[1.2] tracking-tighter text-primary lg:px-32 lg:text-xl">
								<RichText
									value={localizedRichText(visionItem.title, language)}
									inline
								/>
							</h2>
							<RichText
								className="mx-auto py-2 text-base font-normal leading-[1.2] tracking-tighter text-primary lg:px-32 lg:text-xl"
								value={localizedRichText(visionItem.text, language)}
							/>
						</div>
					</motion.div>
				))}
			</div>
		</motion.div>
	)
}

export default VisionBlock
