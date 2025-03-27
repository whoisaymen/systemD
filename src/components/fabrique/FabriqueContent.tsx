'use client'
import Img from '@/ui/Img'
import { motion, useInView } from 'motion/react'
import { useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { FaTag } from 'react-icons/fa'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'

interface FabriqueContentProps {
	fabrique: any
	language: string
}

const FabriqueContent: React.FC<FabriqueContentProps> = ({
	fabrique,
	language,
}) => {
	if (!fabrique) return <p>No data available.</p>

	// Function to get localized values
	const getLocalizedValue = (array: any[], lang: string) => {
		if (!Array.isArray(array)) return ''
		const item = array.find((entry) => entry._key === lang)
		return item?.value || ''
	}

	// Function to get localized text (specifically for `biography`)
	const getLocalizedText = (array: any[], lang: string) => {
		if (!Array.isArray(array)) return ''
		const item = array.find((entry) => entry._key === lang)
		return item?.value || ''
	}

	// Function to render localized blocks (for `actions` and `vision`)
	const renderLocalizedBlock = (blocks: any[], lang: string) => {
		if (!Array.isArray(blocks)) return null
		const block = blocks.find((entry) => entry._key === lang)
		if (!block) return null

		return block.children.map((child: any, index: number) => (
			<p key={index} className="mt-2 text-base font-normal">
				{child.text}
			</p>
		))
	}

	const ref = useRef(null)

	// Use scroll and transform for each individual block
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start 00vh', 'end center'], // Animation starts when the block reaches the middle of the screen
	})

	// Transform the scroll progress into a border radius value
	const borderRadius = useTransform(scrollYProgress, [0, 1], [10, 120])

	return (
		<div
			ref={ref}
			className="no-scrollbar flex h-full w-full flex-col overflow-y-scroll rounded-md px-4 py-32 text-base font-medium leading-[1.2] tracking-tighter text-dark sm:space-y-0 sm:px-0 sm:pt-0"
		>
			<h1 className="mx-auto rounded-md border-2 border-primary bg-dark px-4 py-2 text-center text-2xl font-bold leading-[1.2] tracking-tighter text-primary sm:py-4 sm:text-4xl">
				{getLocalizedValue(fabrique.title, language) || 'No title available'}
			</h1>

			<div className="relative mt-2 rounded-full rounded-md border-2 border-dark bg-[#fff] px-4 py-10 shadow-sm dark:bg-secondary sm:py-10">
				<p className="mx-auto py-2 text-center text-xl font-bold leading-[1.2] tracking-tighter text-dark sm:py-4 sm:text-4xl">
					{getLocalizedText(fabrique.description, language) ||
						'No description available'}
				</p>
			</div>

			{/* Image */}
			{fabrique.image?.asset && (
				<Img
					image={fabrique.image}
					src={`/${fabrique.image.asset._ref.split('-')[1]}-${fabrique.image.asset._ref.split('-')[2]}.${fabrique.image.asset._ref.split('-')[3]}`}
					alt={fabrique.name}
					className="my-4 h-48 w-48 rounded-md object-cover"
				/>
			)}
			{/* Actions */}
			{fabrique.actions && (
				<div className="mt-6 space-y-8">
					{fabrique.actions.map((action: any, index: number) => (
						<div key={index}>
							<div className="relative mb-4 block h-auto overflow-hidden rounded-full border-2 border-dark shadow-md transition-shadow duration-300 hover:shadow-lg dark:border-primary">
								{/* Action Image */}
								{action.image?.asset && (
									<Img
										image={action.image}
										src={`/${action.image.asset._ref.split('-')[1]}-${action.image.asset._ref.split('-')[2]}.${action.image.asset._ref.split('-')[3]}`}
										alt={getLocalizedValue(action.title, language)}
										className="h-full w-full object-cover"
									/>
								)}
								<div className="absolute left-1/2 top-1/2 flex w-auto w-full -translate-x-1/2 flex-col items-center">
									<div
										className={`z-10 inline-block -rotate-2 rounded-md bg-primary px-2 text-3xl font-black tracking-tighter text-dark`}
									>
										<span className="text-center">
											{
												getLocalizedValue(action.title, language).split(
													' - ',
												)[0]
											}
										</span>
									</div>

									<div className="z-0 inline-block rotate-[2deg] rounded-md bg-grayDark px-2 text-xl font-bold tracking-tighter text-dark">
										<span>
											{
												getLocalizedValue(action.title, language).split(
													' - ',
												)[1]
											}
										</span>
									</div>
								</div>
							</div>
							{/* Action Text */}
							<div className="relative rounded-md border-2 border-dark bg-white px-4 py-4 shadow-sm dark:bg-primary sm:py-10">
								{action.text?.[language]?.map((block: any) => {
									// Check if the block is a list item
									if (block.listItem === 'bullet') {
										return (
											<ul key={block._key} className="list-disc pl-6">
												<li className="mt-4 text-lg font-normal leading-[1.25] tracking-tighter">
													{block.children
														.map((child: any) => child.text)
														.join('')}
												</li>
											</ul>
										)
									}

									// Render regular paragraphs for non-list items
									return (
										<p
											key={block._key}
											className="mt-4 text-justify text-lg font-normal leading-[1.25] tracking-tighter first:mt-0"
										>
											{block.children.map((child: any) => child.text).join('')}
										</p>
									)
								})}
							</div>{' '}
						</div>
					))}
				</div>
			)}

			{/* Vision */}
			{fabrique.vision && (
				<div className="mt-8 space-y-8">
					<h1 className="mx-auto rounded-md border-2 border-primary bg-dark px-2 py-2 text-center text-2xl font-bold leading-[1.2] tracking-tighter text-primary sm:py-4 sm:text-4xl">
						Our Vision
					</h1>
					{fabrique.vision.map((vision: any, index: number) => (
						<div key={index} className="space-y-4">
							{/* Vision Title */}
							<h2 className="mx-auto rounded-md border-2 border-primary bg-dark px-2 py-2 text-center text-2xl font-bold leading-[1.2] tracking-tighter text-primary sm:py-4 sm:text-4xl">
								{getLocalizedValue(vision.title, language)}
							</h2>

							<div className="relative mt-2 rounded-full rounded-md border-2 border-dark bg-[#fff] px-4 py-10 shadow-sm dark:bg-secondary sm:py-10">
								<p className="mx-auto py-2 text-center text-xl font-bold leading-[1.2] tracking-tighter text-dark sm:py-4 sm:text-4xl">
									{getLocalizedText(vision.text, language) ||
										'No description available'}
								</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default FabriqueContent
