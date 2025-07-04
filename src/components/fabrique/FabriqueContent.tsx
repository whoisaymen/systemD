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
import { renderParagraph } from '../common/RenderParagraph'
import BrusselsMap from './BrusselsMap'
import FabriqueAnimated from '../homepage/FabriqueAnimated'
import LogoShortTsx from '../svgs/LogoShort'

interface FabriqueContentProps {
	fabrique: any
	language: string
}

const capitalizeFirstLetter = (str: string) => {
	if (!str) return ''
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
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

	const triggerRotations = [
		'-rotate-6',
		'rotate-3',
		'-rotate-3',
		'rotate-1',
		'-rotate-2',
		'rotate-3',
	]

	// Transform the scroll progress into a border radius value
	const borderRadius = useTransform(scrollYProgress, [0, 1], [10, 120])

	return (
		<div
			ref={ref}
			className="no-scrollbar flex h-full w-full flex-col overflow-y-scroll py-32 pt-0 text-base font-medium leading-[1.2] tracking-tighter text-dark sm:space-y-0 sm:px-0 sm:pt-0"
		>
			{/* <div className="relative mt-2 h-full rounded-full bg-primary p-6 py-32">
				<p className="text-left text-3xl font-bold leading-[1.2] tracking-tighter text-dark">
					{getLocalizedValue(fabrique.title, language) || 'No title available'}
		
				</p>
			</div> */}
			<div className="relative mt-4 px-4 lg:mt-1 lg:px-1">
				{/* <BrusselsMap
					className="w-full rounded-3xl border-[3px] border-dark bg-grayDark fill-current text-dark dark:border-primary dark:text-primary lg:w-1/2 lg:dark:border-grayDark lg:dark:text-dark"
				/> */}

				<div className="relative z-50 hidden w-full flex-wrap items-center justify-center gap-2 rounded-none px-4 py-12 lg:absolute lg:left-1/2 lg:top-1/2 lg:flex lg:-translate-x-1/2 lg:-translate-y-1/2 lg:px-16">
					{(getLocalizedValue(fabrique.title, language) || 'No title available')
						.split(' ')
						.map((word: string, index: number) => {
							// Generate random rotation and position
							const randomRotation = Math.floor(Math.random() * 21) - 10 // Random rotation between -5 and 5 degrees
							const randomMarginTop = Math.floor(Math.random() * 10) - 5 // Random margin-top between -5px and 5px
							const randomMarginLeft = Math.floor(Math.random() * 10) - 5 // Random margin-left between -5px and 5px

							return (
								<span
									key={index}
									className="inline-block text-3xl font-bold leading-[1.2] tracking-tighter text-primary dark:text-primary lg:text-8xl"
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
				</div>
			</div>

			{/* Description */}
			{/* <div className="relative px-0 pb-8 sm:py-10"> */}
			<div className="relative mx-4 mb-12 rounded-md bg-primary p-6 sm:py-10">
				<p className="mx-auto py-2 text-center text-xl font-semibold leading-[1.2] tracking-tighter text-dark dark:text-dark sm:py-4 sm:text-4xl">
					{fabrique.description
						? renderParagraph(
								{ value: getLocalizedValue(fabrique.description, language) },
								[],
								'bg-dark text-primary',
							)
						: 'No description available'}
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

			{fabrique.actions && (
				<div className="">
					{fabrique.actions.map((action: any, index: number) => (
						<div key={index} className="mb-0">
							<Accordion type="single" collapsible>
								<AccordionItem
									value={`action-${index}`}
									className="flex flex-col items-center justify-center"
								>
									{/* Accordion Trigger for Action Title */}
									<AccordionTrigger
										className={`${triggerRotations[index % triggerRotations.length]} sm:text-3xl`}
									>
										<div className="flex flex-col items-center">
											<div
												className={`z-10 inline-block w-fit text-3xl tracking-tighter`}
											>
												<span className="text-center">
													{capitalizeFirstLetter(
														getLocalizedValue(action.title, language).split(
															' - ',
														)[0],
													)}
												</span>
											</div>
										</div>
									</AccordionTrigger>

									{/* Accordion Content for Action Text */}
									<AccordionContent>
										<div className="relative px-0 py-4 text-primary sm:py-10">
											<div className="mb-4 flex h-auto items-center justify-center px-8">
												{/* Action Image */}
												{action.image?.asset && (
													<>
														{/* <Img
															image={action.image}
															src={`/${action.image.asset._ref.split('-')[1]}-${action.image.asset._ref.split('-')[2]}.${action.image.asset._ref.split('-')[3]}`}
															alt={getLocalizedValue(action.title, language)}
															className="h-full w-full rounded-none object-cover"
														/> */}
														{/* <span
															className={`text-left text-xl font-bold leading-[1.2] tracking-tighter text-dark dark:text-primary`}
														>
															{
																getLocalizedValue(action.title, language).split(
																	' - ',
																)[1]
															}
														</span> */}
													</>
												)}
											</div>
											{/* <p
												className="absolute bottom-0 left-6 z-30 inline-block -rotate-90 text-xl font-bold uppercase leading-[0] tracking-tighter text-primary"
												style={{
													transformOrigin: 'left bottom',
												}}
											>
												<span>
													{
														getLocalizedValue(action.title, language).split(
															' - ',
														)[1]
													}
												</span>
											</p> */}
											{/* <h2 className="px-4 text-xl font-bold leading-[1.2] tracking-tighter text-dark dark:text-primary"> */}
											<div className="flex items-center justify-center">
												<h2 className="-z-10 -mt-8 inline-block -rotate-1 rounded-md border-2 border-dark bg-primary px-2 py-0 text-center text-lg font-medium tracking-tighter text-dark">
													{
														getLocalizedValue(action.title, language).split(
															' - ',
														)[1]
													}
												</h2>
											</div>

											{action.text?.[language]?.map((block: any) => {
												// Render h6 blocks as bold paragraphs
												if (block.style === 'h6' && !block.listItem) {
													return (
														<div className="flex justify-start">
															{' '}
															<p
																key={block._key}
																className="-z-10 m-4 -mb-4 -rotate-1 rounded-md border-2 border-dark bg-grayDark px-2 py-0 text-center text-lg font-medium tracking-tighter text-dark"
															>
																{block.children.map(
																	(child: any, idx: number) => (
																		<span key={child._key || idx}>
																			{child.text}
																		</span>
																	),
																)}
															</p>
														</div>
													)
												}

												// Render bullet list items, bold if style is h6, with custom bullet
												if (block.listItem === 'bullet') {
													const isBold = block.style === 'h6'
													return (
														<ul key={block._key} className="px-10">
															<li
																className={`relative mt-4 text-lg font-normal leading-[1.2] tracking-tighter ${isBold ? 'font-bold' : ''}`}
															>
																{block.children.map(
																	(child: any, idx: number) => (
																		<span key={child._key || idx}>
																			{child.text}
																		</span>
																	),
																)}
																<div className="absolute -left-5 top-2 h-2 w-2 rounded-sm bg-primary"></div>
															</li>
														</ul>
													)
												}

												// Render regular paragraphs for other blocks
												return (
													<p
														key={block._key}
														className="mt-4 px-4 text-lg font-normal leading-[1.2] tracking-tighter first:mt-0"
													>
														{block.children.map((child: any, idx: number) => (
															<span key={child._key || idx}>{child.text}</span>
														))}
													</p>
												)
											})}

											{/* {action.text?.[language]?.map((block: any) => {
												// Check if the block is a list item
												if (block.listItem === 'bullet') {
													return (
														<ul key={block._key} className="px-10">
															<li className="relative mt-4 text-lg font-normal leading-[1.2] tracking-tighter">
																{block.children
																	.map((child: any) => child.text)
																	.join('')}
																<div className="absolute -left-5 top-2 h-2 w-2 rounded-sm bg-primary"></div>
															</li>
														</ul>
													)
												}

												// Render regular paragraphs for non-list items
												return (
													<p
														key={block._key}
														className="mt-4 px-4 text-lg font-normal leading-[1.2] tracking-tighter first:mt-0"
													>
														{block.children
															.map((child: any) => child.text)
															.join('')}
													</p>
												)
											})} */}
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</div>
					))}
				</div>
			)}

			{/* Vision */}
			{fabrique.vision && (
				<div className="mt-16">
					<div className="relative mb-12">
						<FabriqueAnimated
							theme={{
								icon: 'var(--color-primary)',
							}}
							className="h-auto w-full"
						/>
						<h1 className="absolute left-1/2 top-1/2 mx-auto max-w-64 -translate-x-1/2 -translate-y-1/2 px-2 py-24 text-center text-5xl font-black uppercase leading-[1] tracking-tighter text-dark dark:text-primary sm:py-4 sm:text-4xl">
							Our Vision
						</h1>
					</div>

					<div className="relative z-50 mt-16 flex flex-wrap items-center justify-center gap-2 rounded-none px-4 py-12 lg:hidden">
						{(
							getLocalizedValue(fabrique.title, language) ||
							'No title available'
						)
							.split(' ')
							.map((word: string, index: number) => {
								// Generate random rotation and position
								const randomRotation = Math.floor(Math.random() * 21) - 10 // Random rotation between -5 and 5 degrees
								const randomMarginTop = Math.floor(Math.random() * 10) - 5 // Random margin-top between -5px and 5px
								const randomMarginLeft = Math.floor(Math.random() * 10) - 5 // Random margin-left between -5px and 5px

								return (
									<span
										key={index}
										className="inline-block text-3xl font-bold leading-[1.2] tracking-tighter text-dark dark:text-primary lg:text-9xl"
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
					</div>
					{fabrique.vision.map((vision: any, index: number) => (
						<div key={index} className="mt-8">
							<div className="relative rounded-t-3xl px-4">
								<h2 className="text-xl font-bold leading-[1.2] tracking-tighter text-dark dark:text-primary">
									{getLocalizedValue(vision.title, language)}
								</h2>
								<p className="mx-auto py-2 text-lg font-normal leading-[1.2] tracking-tighter text-dark dark:text-primary sm:py-4 sm:text-4xl">
									{getLocalizedText(vision.text, language) ||
										'No description available'}
								</p>
							</div>
						</div>
					))}
				</div>
			)}

			<div className="relative z-50 flex flex-wrap items-center justify-center gap-2 rounded-none px-4 py-12 lg:hidden">
				<div className="relative mt-24 flex h-[20vh] w-full items-center justify-center">
					{/* Top left */}
					<LogoShortTsx className="absolute right-16 top-0 mr-[0.10rem] inline-block h-auto w-20 w-[9rem] rotate-[-50deg] rounded-md bg-primary px-2 py-1 sm:w-[15rem]" />
					{/* Top right */}
					<LogoShortTsx className="absolute left-20 top-0 mr-[0.10rem] inline-block h-auto w-20 w-[9rem] rotate-[25deg] rounded-md bg-primary px-2 py-1 sm:w-[15rem]" />

					<LogoShortTsx className="absolute bottom-2 right-8 mr-[0.10rem] inline-block h-auto w-20 w-[9rem] rotate-[-40deg] rounded-md bg-primary px-2 py-1 sm:w-[15rem]" />

					{/* Middle right */}
					<LogoShortTsx className="absolute right-0 top-12 mr-[0.10rem] inline-block h-auto w-20 w-[9rem] rotate-[50deg] rounded-md bg-primary px-2 py-1" />

					<LogoShortTsx className="absolute left-0 top-12 mr-[0.10rem] inline-block h-auto w-20 w-[9rem] rotate-[-60deg] rounded-md bg-primary px-2 py-1 sm:w-[15rem]" />

					{/* Bottom left */}
					<LogoShortTsx className="absolute bottom-0 left-8 mr-[0.10rem] inline-block h-auto w-20 w-[9rem] rotate-[60deg] rounded-md bg-primary px-2 py-1 sm:w-[15rem]" />

					{/* Center bottom */}
					<LogoShortTsx className="absolute -bottom-16 left-1/2 mr-[0.10rem] inline-block h-auto w-20 w-[9rem] -translate-x-1/2 rotate-[-15deg] rounded-md bg-primary px-2 py-1 sm:w-[15rem]" />
				</div>
			</div>
		</div>
	)
}

export default FabriqueContent
