'use client'
import Img from '@/ui/Img'
import { PortableText } from 'next-sanity'
import FestivalTicket from './FestivalTicket'
import { getRandomRotationClass } from '@/lib/utils'
import FestivalSparkleIcon from './FestivalSparkleIcon'
import FestivalSparklesIcon from './FestivalSparklesIcon'
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import { IoCalendar, IoGrid, IoList } from 'react-icons/io5'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import LogoShortTsx from '../svgs/LogoShort'
import { renderParagraph } from '../common/RenderParagraph'
import FallingSparkle from './FallingSparkle'
import BackToTopButton from '../common/BackToTop'

import Snowfall from 'react-snowfall'

interface FestivalContentProps {
	festival: any
	language: string
}

const FestivalContent: React.FC<FestivalContentProps> = ({
	festival,
	language,
}) => {
	const [view, setView] = useState<'calendar' | 'list'>('list')
	const [isFullscreen, setIsFullscreen] = useState(false)

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

	const sparkleImg = new window.Image()
	sparkleImg.src = '/assets/svg/SparkleSnow2.svg'

	return (
		<div
			key={festival._id}
			id="festival-content"
			className="flex h-full w-full flex-col space-y-1 rounded-md p-2 px-4 pb-32 sm:mt-0 sm:h-svh sm:p-0"
		>
			<div className="fixed bottom-4 right-12 z-50">
				<BackToTopButton targetId="navbar-mobile" />
			</div>
			<Snowfall
				snowflakeCount={10}
				speed={[0.2, 0.5]}
				wind={[0, 0]}
				radius={[10, 40]}
				rotationSpeed={[0.2, 0.5]}
				images={[sparkleImg]}
			/>
			<Accordion
				type="single"
				collapsible
				onValueChange={() => {
					const navbar = document.getElementById('navbar-mobile')
					if (navbar) {
						navbar.scrollIntoView({ behavior: 'smooth', block: 'start' })
					}
				}}
			>
				{festival.blocks &&
					festival.blocks.map((block: any, index: number) => {
						switch (block._type) {
							case 'yellowBannerBlock':
								const text = getLocalizedValue(block.text, language)
								const paragraphs = text.split('\n\n')
								return (
									<div key={`yellowBannerBlock-${index}`} className="">
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
									<AccordionItem
										value={`custom-${index}`}
										key={`custom-${index}`}
										className="flex flex-col items-center justify-center"
									>
										{/* <div
											key={`customTextBlock-${index}`}
											className="flex flex-col items-center rounded-md px-0"
										> */}
										{/* <Accordion type="single" collapsible> */}
										{/* <AccordionItem
												value={`item-${index}`}
												className="flex flex-col items-center justify-center"
											> */}
										<AccordionTrigger className={`-mb-0 rotate-3 sm:text-7xl`}>
											{block.title}
										</AccordionTrigger>
										<AccordionContent>
											<div className="px-2 pb-0 pt-4 text-base leading-[1.2] tracking-tighter text-dark dark:text-primary">
												{block.content && block.content[language] && (
													<PortableText
														value={block.content[language]}
														components={{
															block: {
																normal: ({ children }) => (
																	<p className="mb-4 last:mb-0">{children}</p>
																),
															},
														}}
													/>
												)}
											</div>
										</AccordionContent>
										{/* </AccordionItem> */}
										{/* </Accordion> */}
										{/* </div> */}
									</AccordionItem>
								)

							case 'mediaTeaserBlock':
								const imageUrl = block.image?.asset?._ref
									? `/${block.image.asset._ref.split('-')[1]}-${block.image.asset._ref.split('-')[2]}.${block.image.asset._ref.split('-')[3]}`
									: ''
								return (
									<>
										{/* <div
										key={`mediaTeaserBlock-${index}`}
										className="mx-0 h-[65vh] w-auto pb-10 pt-2 sm:h-[50vh] sm:pb-0 sm:pt-0"
									>
										<video
										
											className="h-full w-full transform rounded-3xl border-[3px] border-primary object-cover sm:rounded-md sm:border-0"
											autoPlay
											loop
											muted
											playsInline
										>
											<source
												src="/assets/videos/teaser2.mp4"
												type="video/mp4"
											/>
											Your browser does not support the video tag.
										</video>
									</div> */}

										<motion.div
											key={`mediaTeaserBlock-${index}`}
											layout
											className={`mx-0 w-auto cursor-pointer overflow-hidden rounded-lg pb-10 pt-2 sm:h-[50vh] sm:pb-0 sm:pt-0 ${
												isFullscreen
													? 'fixed inset-0 z-50 w-screen rounded-none bg-dark'
													: ''
											}`}
											style={{
												height: isFullscreen ? '100%' : '65vh',
												width: isFullscreen ? '100%' : '100%',
											}}
											onClick={() => !isFullscreen && setIsFullscreen(true)}
											transition={{
												duration: 0.6,
												ease: [0.32, 0.72, 0, 1],
											}}
										>
											<video
												className="h-full w-full transform rounded-3xl border-[3px] border-primary object-cover sm:rounded-md sm:border-0"
												autoPlay
												muted
												loop
												playsInline
											>
												<source
													src="/assets/videos/teaser2.mp4"
													type="video/mp4"
												/>
												Your browser does not support the video tag.
											</video>

											{/* Close button for fullscreen */}
											<AnimatePresence>
												{/* {isFullscreen && (
												<motion.button
													initial={{ opacity: 0, scale: 0.8 }}
													animate={{ opacity: 1, scale: 1 }}
													exit={{ opacity: 0, scale: 0.8 }}
													transition={{ delay: 0.3 }}
													onClick={(e) => {
														e.stopPropagation()
														setIsFullscreen(false)
													}}
													className="absolute h-full w-full bottom-11 right-1 z-10 p-3 text-primary"
												>
													Close
												</motion.button>
											)} */}
												{isFullscreen && (
													<div
														onClick={(e) => {
															e.stopPropagation()
															setIsFullscreen(false)
														}}
														className="fixed inset-0 z-50 h-full w-full"
													/>
												)}
											</AnimatePresence>
										</motion.div>
									</>
								)

							// case 'whiteTextBlock':
							// 	if (!block.show) return null
							// 	return (
							// 		<div
							// 			key={index}
							// 			className="flex flex-col items-center rounded-md px-2 text-xl font-medium leading-tight tracking-tighter sm:h-full sm:px-0 sm:text-2xl"
							// 		>
							// 			<Accordion type="single" collapsible>
							// 				<AccordionItem
							// 					value="item-1"
							// 					className="flex flex-col items-center justify-center"
							// 				>
							// 					<AccordionTrigger
							// 						className={`-mb-2 rotate-3 sm:text-7xl`}
							// 					>
							// 						Call for Entry!
							// 					</AccordionTrigger>
							// 					<AccordionContent>
							// 						<div className="z-0 w-full rounded-md border-2 border-dark bg-primary px-10 py-12 text-2xl font-medium leading-[1.3] text-dark shadow-sm sm:border-0 sm:bg-dark sm:text-xl sm:text-primary">
							// 							{block.content && block.content[language] && (
							// 								<PortableText value={block.content[language]} />
							// 							)}
							// 						</div>
							// 					</AccordionContent>
							// 				</AccordionItem>
							// 			</Accordion>
							// 		</div>
							// 	)

							case 'juryBlock':
								const [selectedMemberId, setSelectedMemberId] = useState<
									string | null
								>(null)

								const toggleMember = (id: string) => {
									setSelectedMemberId((prev) => (prev === id ? null : id))
								}

								useEffect(() => {
									if (
										block.juryMembers?.length > 0 &&
										selectedMemberId === null
									) {
										setSelectedMemberId(block.juryMembers[0]._id)
									}
								}, [block.juryMembers, selectedMemberId])

								if (!block.show) return null
								return (
									<AccordionItem
										value={`jury-${index}`}
										key={`jury-${index}`}
										className="flex flex-col items-center justify-center"
									>
										<AccordionTrigger className={`-rotate-6 sm:text-7xl`}>
											Jury
										</AccordionTrigger>
										<AccordionContent>
											{/* Jury Grid */}
											<div className="grid w-full grid-cols-3 gap-1">
												{block.juryMembers && block.juryMembers.length > 0 ? (
													block.juryMembers.map((member: any) => (
														<div
															key={member._id}
															className="flex cursor-pointer flex-col items-center px-0"
															onClick={() => toggleMember(member._id)}
														>
															<div
																className={`relative h-full w-full overflow-hidden rounded-lg border-[3px] sm:px-0 ${
																	selectedMemberId === member._id
																		? 'border-primary'
																		: 'border-dark'
																}`}
															>
																<Img
																	image={member.image}
																	src={member.image?.asset.url}
																	alt={member.name}
																	className="z-0 h-full w-full border-0 border-dark object-cover dark:border-primary sm:border-0"
																/>
																{selectedMemberId !== member._id && (
																	<div
																		className="bg-dark/50 absolute inset-0 z-10"
																		style={{
																			backgroundColor: 'var(--color-dark)',
																			opacity: 0.9,
																		}}
																	/>
																	// Use your darkGray color here, e.g. bg-grayDark/70 if you have it in Tailwind config
																)}
															</div>
															{/* <h2 className="mt-2 text-left text-base font-bold leading-tight tracking-tighter text-primary">
																	{member.name}
																</h2> */}
														</div>
													))
												) : (
													<p>No jury members found</p>
												)}
											</div>

											{/* Full-width bio section */}
											{selectedMemberId && (
												<div className="mb-4 mt-4 w-full px-0 sm:px-12">
													{(() => {
														const selectedMember = block.juryMembers.find(
															(m: any) => m._id === selectedMemberId,
														)
														if (!selectedMember) return null
														return (
															<div className="w-full text-primary">
																{selectedMember.name && (
																	<div className="flex items-center justify-center">
																		<h2 className="mb-3 -rotate-0 rounded-md border-[0px] border-primary px-2 text-2xl font-semibold tracking-tighter text-primary">
																			{selectedMember.name}
																		</h2>
																	</div>
																	// <h2 className="mb-2 text-2xl font-bold tracking-tight">
																	// 	{selectedMember.name}
																	// </h2>
																)}
																{selectedMember.biography && (
																	<p className="text-base leading-tight tracking-tighter">
																		{getLocalizedValue(
																			selectedMember.biography,
																			language,
																		)}
																	</p>
																)}
															</div>
														)
													})()}
												</div>
											)}
										</AccordionContent>
									</AccordionItem>
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
									// <div
									// 	key={`onTourBlock-${index}`}
									// 	className="on-tour-block flex h-full w-full flex-col items-center"
									// >
									<AccordionItem
										value={`onTour-${index}`}
										key={`onTour-${index}`}
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
															<th className="border px-4 py-2">Date + Time</th>
															<th className="border px-4 py-2">Event Title</th>
															<th className="border px-4 py-2">Address</th>
														</tr>
													</thead>
													<tbody>
														{block.events.map(
															(event: any, eventIndex: number) => (
																<tr
																	key={eventIndex}
																	className="border-b border-t border-dark text-sm tracking-tighter text-dark dark:border-primary dark:text-primary"
																>
																	<td className="flex flex-col px-4 py-2">
																		<span>
																			{new Date(event.date).toLocaleDateString(
																				language,
																				{
																					weekday: 'long',
																					day: 'numeric',
																					month: 'long',
																				},
																			)}
																		</span>
																		<span>
																			{new Date(event.date).toLocaleTimeString(
																				language,
																				{
																					hour: '2-digit',
																					minute: '2-digit',
																					hour12: true,
																				},
																			)}
																		</span>
																	</td>
																	<td className="px-4 py-2 text-sm normal-case leading-[1]">
																		{getLocalizedValue(event.title, language)}
																	</td>
																	<td className="px-4 py-2">
																		{event.location || 'Location not specified'}
																	</td>
																</tr>
															),
														)}
													</tbody>
												</table>
											</div>
										</AccordionContent>
									</AccordionItem>
									// </div>
								)
							default:
								return null
						}
					})}
			</Accordion>
		</div>
	)
}

export default FestivalContent
