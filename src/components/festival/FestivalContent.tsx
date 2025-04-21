'use client'
import Img from '@/ui/Img'
import { PortableText } from 'next-sanity'
import FestivalTicket from './FestivalTicket'
import { getRandomRotationClass } from '@/lib/utils'
import FestivalSparkleIcon from './FestivalSparkleIcon'
import FestivalSparklesIcon from './FestivalSparklesIcon'
import { motion, useScroll, useTransform } from 'motion/react'
import { useEffect, useState } from 'react'
import { IoCalendar, IoGrid, IoList } from 'react-icons/io5'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import LogoShortTsx from '../svgs/LogoShort'

interface FestivalContentProps {
	festival: any
	language: string
}

const FestivalContent: React.FC<FestivalContentProps> = ({
	festival,
	language,
}) => {
	const [view, setView] = useState<'calendar' | 'list'>('list')
	let { scrollY } = useScroll()
	let borderRadius = useTransform(scrollY, (value) => Math.max(80 - value, 10))

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

	const themeColors = {
		dark: {
			fill: 'var(--color-dark)',
			stroke: 'var(--color-primary)',
			icon: 'var(--color-primary)',
		},
		sparkle: {
			fill: 'var(--color-primary)',
			stroke: 'var(--color-dark)',
		},
	}

	console.log(festival)
	return (
		<div
			key={festival._id}
			className="mt-20 flex h-full w-full flex-col space-y-1 rounded-md p-2 px-4 pb-32 sm:mt-0 sm:h-svh sm:p-0"
		>
			{festival.description && (
				<div className="relative mt-4 h-full py-6 pb-12">
					{getLocalizedValue(festival.description, language)
						.split('\n\n') // Split by double newlines for paragraphs
						.map((paragraph: string, i: number) => (
							<p
								key={i}
								className="px-8 text-2xl font-bold leading-[1] text-primary"
							>
								{/* Replace "System D" or variants with the logo */}
								{paragraph.split(/(System[_ ]?D)/i).map((part, index) =>
									/System[_ ]?D/i.test(part) ? (
										<motion.span
											key={index}
											className="z-10 inline-block"
											animate={{
												rotate: 3,
												transition: {
													ease: [0.76, 0, 0.24, 1],
													duration: 1.5,
													repeat: Infinity,
													repeatType: 'reverse',
												},
											}}
										>
											<LogoShortTsx className="mr-[0.10rem] inline-block h-auto w-[9rem] -rotate-6 rounded-md bg-dark px-2 py-1 text-primary dark:bg-primary dark:text-dark sm:w-[15rem]" />
										</motion.span>
									) : (
										part
									),
								)}
							</p>
						))}

					<div className="absolute left-0 top-0 z-30 h-8 w-8 border-l-[2px] border-t-[2px] border-[#fff] mix-blend-overlay"></div>
					<div className="absolute right-0 top-0 z-30 h-8 w-8 border-r-[2px] border-t-[2px] border-[#fff] mix-blend-overlay"></div>
					<div className="absolute bottom-2 left-0 z-30 h-8 w-8 border-b-[2px] border-l-[2px] border-[#fff] mix-blend-overlay"></div>
					<div className="absolute bottom-2 right-0 z-30 h-8 w-8 border-b-[2px] border-r-[2px] border-[#fff] mix-blend-overlay"></div>
				</div>
			)}

			{festival.blocks &&
				festival.blocks.map((block: any, index: number) => {
					switch (block._type) {
						case 'yellowBannerBlock':
							const text = getLocalizedValue(block.text, language)
							const paragraphs = text.split('\n\n')
							return (
								<div key={index} className="">
									<motion.div
										// initial={{
										// 	borderRadius: '0.375rem',
										// }}
										style={{ borderRadius }}
										// animate={{ borderRadius: '5rem' }}
										transition={{
											duration: 2,
											ease: [0.76, 0, 0.24, 1],
											// repeat: Infinity,
											// repeatType: 'reverse',
										}}
										className="relative border-2 border-dark bg-primary px-4 py-10 shadow-sm dark:bg-primary sm:hidden sm:border-0 sm:py-10"
									>
										{/* Camera Viewfinder Corners */}
										<div className="pointer-events-none absolute inset-0 hidden px-4 py-4">
											<div className="absolute left-6 top-6 h-[40px] w-[40px] border-l-4 border-t-4 border-black"></div>

											<div className="absolute right-6 top-6 h-[40px] w-[40px] border-r-4 border-t-4 border-black"></div>

											<div className="absolute bottom-6 left-6 h-[40px] w-[40px] border-b-4 border-l-4 border-black"></div>

											<div className="absolute bottom-6 right-6 h-[40px] w-[40px] border-b-4 border-r-4 border-black"></div>
										</div>

										{paragraphs.map((paragraph: string, i: number) => (
											<p
												key={i}
												className="mx-auto py-2 text-center text-xl font-bold leading-[1.2] tracking-tighter text-dark sm:py-4 sm:text-3xl"
											>
												{paragraph.split(/(System D)/).map((part, index) =>
													part === 'System D' ? (
														<motion.span
															key={index}
															className="z-10 inline-block"
															animate={{
																rotate: 3,
																transition: {
																	ease: [0.76, 0, 0.24, 1],
																	duration: 1.5,
																	repeat: Infinity,
																	repeatType: 'reverse',
																},
															}}
														>
															<LogoShortTsx className="mr-[0.10rem] inline-block h-auto w-[9rem] -rotate-6 rounded-md bg-dark px-2 py-1 text-primary dark:bg-dark sm:w-[15rem]" />
														</motion.span>
													) : (
														part
													),
												)}
											</p>
										))}
									</motion.div>
								</div>
							)

						case 'customTextBlock':
							if (!block.show) return null
							return (
								<div
									key={index}
									className="flex flex-col items-center rounded-md px-2 text-xl font-medium leading-tight tracking-tighter sm:h-full sm:px-0 sm:text-2xl"
								>
									<Accordion type="single" collapsible>
										<AccordionItem
											value={`item-${index}`}
											className="flex flex-col items-center justify-center"
										>
											<AccordionTrigger
												className={`-mb-2 rotate-3 sm:text-7xl`}
											>
												{block.title}
											</AccordionTrigger>
											<AccordionContent>
												<div className="z-0 w-full rounded-md border-2 border-dark bg-primary px-4 py-4 text-2xl font-medium leading-[1.2] text-dark shadow-sm sm:border-0 sm:bg-dark sm:text-xl sm:text-primary">
													{block.content && block.content[language] && (
														<PortableText value={block.content[language]} />
													)}
												</div>
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</div>
							)

						case 'mediaTeaserBlock':
							const imageUrl = block.image?.asset?._ref
								? `/${block.image.asset._ref.split('-')[1]}-${block.image.asset._ref.split('-')[2]}.${block.image.asset._ref.split('-')[3]}`
								: ''
							return (
								<div
									key={index}
									className="mx-0 h-[80vh] w-auto pb-10 pt-2 sm:h-[50vh] sm:pb-0 sm:pt-0"
								>
									<video
										className="h-full w-full transform rounded-full border-4 border-primary object-cover sm:rounded-md sm:border-0"
										autoPlay
										loop
										muted
										playsInline
									>
										<source src="/assets/videos/teaser2.mp4" type="video/mp4" />
										Your browser does not support the video tag.
									</video>
								</div>
							)

						case 'whiteTextBlock':
							if (!block.show) return null
							return (
								<div
									key={index}
									className="flex flex-col items-center rounded-md px-2 text-xl font-medium leading-tight tracking-tighter sm:h-full sm:px-0 sm:text-2xl"
								>
									<Accordion type="single" collapsible>
										<AccordionItem
											value="item-1"
											className="flex flex-col items-center justify-center"
										>
											<AccordionTrigger
												className={`-mb-2 rotate-3 sm:text-7xl`}
											>
												Call for Entry!
											</AccordionTrigger>
											<AccordionContent>
												<div className="z-0 w-full rounded-md border-2 border-dark bg-primary px-10 py-12 text-2xl font-medium leading-[1.3] text-dark shadow-sm sm:border-0 sm:bg-dark sm:text-xl sm:text-primary">
													{block.content && block.content[language] && (
														<PortableText value={block.content[language]} />
													)}
												</div>
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</div>
							)
						case 'juryBlock':
							if (!block.show) return null
							return (
								<div
									key={index}
									className="relative my-0 flex h-full w-full flex-col items-center px-6 sm:px-0"
								>
									<Accordion type="single" collapsible>
										<AccordionItem
											value="item-1"
											className="flex flex-col items-center justify-center"
										>
											<AccordionTrigger className={`-rotate-6 sm:text-7xl`}>
												Jury
											</AccordionTrigger>
											<AccordionContent>
												<div className="grid h-full grid-cols-2 gap-8 sm:grid-cols-6 sm:gap-2">
													{block.juryMembers && block.juryMembers.length > 0 ? (
														block.juryMembers.map(
															(member: any, memberIndex: number) => (
																<div
																	key={member._id}
																	className="h-full w-full rounded-md"
																>
																	{member.image && (
																		<div className="relative">
																			<Img
																				image={member.image}
																				src={member.image?.asset.url}
																				alt={member.name}
																				className="z-0 aspect-square h-full w-full rounded-full border-2 border-primary object-cover sm:rounded-md sm:border-0"
																				// style={{
																				// 	maskImage: 'url(/assets/svg/Sparkle.svg)',
																				// 	WebkitMaskImage:
																				// 		'url(/assets/svg/Sparkle.svg)',
																				// 	maskSize: 'contain',
																				// 	WebkitMaskSize: 'contain',
																				// 	maskRepeat: 'no-repeat',
																				// 	WebkitMaskRepeat: 'no-repeat',
																				// 	maskPosition: 'center',
																				// 	WebkitMaskPosition: 'center',
																				// }}
																			/>
																			<div className="absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-grayLight to-transparent dark:from-dark sm:dark:from-dark" />
																		</div>
																	)}
																	{member.name && (
																		<div className="sm:dark:bg-darkGray flex items-center justify-center rounded-b-md bg-grayLight px-2 dark:bg-transparent">
																			<h3
																				className={`z-10 rounded-full border-2 bg-primary bg-none px-2 py-0 text-center text-base font-semibold tracking-tighter text-dark dark:border-primary dark:bg-primary dark:text-dark sm:border-0 ${getRandomRotationClass()}`}
																			>
																				{member.name}
																			</h3>
																			{/* <FestivalSparkleIcon
																	theme={themeColors.sparkle}
																	className="h-5 w-5"
																/> */}
																		</div>
																	)}
																	{/* {member.biography && (
															<p className="truncate">
																{getLocalizedValue(member.biography, language)}
															</p>
														)} */}
																</div>
															),
														)
													) : (
														<p>No jury members found</p>
													)}
												</div>
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</div>
							)

						// case 'ticketBlock':
						// 	if (!block.show) return null
						// 	const ticketItems = block.items.map((item: any) => ({
						// 		smallTitle: getLocalizedValue(item.smallTitle, language),
						// 		text: getLocalizedValue(item.text, language),
						// 	}))
						// 	return (
						// 		<div
						// 			key={index}
						// 			className="flex h-full w-full flex-col items-center"
						// 		>
						// 			<Accordion type="single" collapsible className="w-full">
						// 				<AccordionItem
						// 					value="item-3"
						// 					className="flex h-full w-full flex-col items-center justify-center"
						// 				>
						// 					<AccordionTrigger className={`-rotate-1 sm:text-7xl`}>
						// 						Save the Date!
						// 					</AccordionTrigger>
						// 					<AccordionContent className="w-full">
						// 						<FestivalTicket
						// 							key={index}
						// 							items={ticketItems}
						// 							block={block}
						// 							language={language}
						// 							getLocalizedValue={getLocalizedValue}
						// 						/>
						// 					</AccordionContent>
						// 				</AccordionItem>
						// 			</Accordion>
						// 		</div>
						// 	)

						case 'onTourBlock':
							if (!block.show) return null
							return (
								<div
									key={index}
									className="on-tour-block flex h-full w-full flex-col items-center"
								>
									<Accordion type="single" collapsible className="w-full">
										<AccordionItem
											value="item-4"
											className="flex h-full w-full flex-col items-center justify-center"
										>
											<AccordionTrigger className={`rotate-6 sm:text-7xl`}>
												On Tour
											</AccordionTrigger>
											<AccordionContent className="w-full">
												<div className="mt-4 w-full">
													{/* List View */}
													<table className="w-full table-auto border-collapse">
														<thead className="hidden">
															<tr>
																<th className="border px-4 py-2">
																	Date + Time
																</th>
																<th className="border px-4 py-2">
																	Event Title
																</th>
																<th className="border px-4 py-2">Address</th>
															</tr>
														</thead>
														<tbody>
															{block.events.map(
																(event: any, eventIndex: number) => (
																	<tr
																		key={eventIndex}
																		className="border-b border-t border-dark text-xs uppercase tracking-tighter text-dark dark:border-primary dark:text-primary"
																	>
																		<td className="flex flex-col px-4 py-2">
																			<span>
																				{new Date(
																					event.date,
																				).toLocaleDateString(language, {
																					weekday: 'long',
																					day: 'numeric',
																					month: 'long',
																				})}
																			</span>
																			<span>
																				{new Date(
																					event.date,
																				).toLocaleTimeString(language, {
																					hour: '2-digit',
																					minute: '2-digit',
																					hour12: true,
																				})}
																			</span>
																		</td>
																		<td className="px-4 py-2 text-base font-bold normal-case leading-[1]">
																			{getLocalizedValue(event.title, language)}
																		</td>
																		<td className="px-4 py-2">
																			{event.location ||
																				'Location not specified'}
																		</td>
																	</tr>
																),
															)}
														</tbody>
													</table>
												</div>
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</div>
							)
						default:
							return null
					}
				})}
		</div>
	)
}

export default FestivalContent
