'use client'
import Img from '@/ui/Img'
import { PortableText } from 'next-sanity'
import FestivalTicket from './FestivalTicket'
import { getRandomRotationClass } from '@/lib/utils'
import FestivalSparkleIcon from './FestivalSparkleIcon'
import FestivalSparklesIcon from './FestivalSparklesIcon'
import { motion } from 'motion/react'
import { useState } from 'react'
import { IoCalendar, IoGrid, IoList } from 'react-icons/io5'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'

interface FestivalContentProps {
	festival: any
	language: string
}

const FestivalContent: React.FC<FestivalContentProps> = ({
	festival,
	language,
}) => {
	const [view, setView] = useState<'calendar' | 'list'>('calendar')

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

	return (
		<div
			key={festival._id}
			className="mt-20 flex h-full w-full flex-col space-y-12 rounded-md p-2 sm:mt-0 sm:p-1"
		>
			{festival.title && (
				<h1 className="text-3xl font-bold">{festival.title}</h1>
			)}
			{festival.description && <p>{festival.description}</p>}
			{festival.blocks &&
				festival.blocks.map((block: any, index: number) => {
					switch (block._type) {
						case 'mediaTeaserBlock':
							console.log(block, 'block')
							const imageUrl = block.image?.asset?._ref
								? `/${block.image.asset._ref.split('-')[1]}-${block.image.asset._ref.split('-')[2]}.${block.image.asset._ref.split('-')[3]}`
								: ''
							return (
								<div
									key={index}
									className="mx-0 h-[70vh] w-auto rounded-full rounded-b-md border-2 border-primary sm:h-[50vh]"
								>
									<video
										className="h-full w-full transform rounded-full rounded-b-md object-cover"
										autoPlay
										loop
										muted
										playsInline
										// style={{
										// 	maskImage: 'url(/assets/svg/Forward.svg)',
										// 	WebkitMaskImage: 'url(/assets/svg/Forward.svg)',
										// 	maskSize: 'cover',
										// 	WebkitMaskSize: 'cover',
										// }}
									>
										<source src="/assets/videos/teaser2.mp4" type="video/mp4" />
										{/* <track
                  src="/assets/videos/teaser.mp4"
                  kind="subtitles"
                  srcLang="en"
                  label="English"
                /> */}
										Your browser does not support the video tag.
									</video>
									{/* {imageUrl && (
										<Img
											image={block.image}
											src={imageUrl}
											alt={block.text}
											className="h-full w-full rounded-md object-cover"
										/>
									)}
									{block.text && (
										<p>{getLocalizedValue(block.text, language)}</p>
									)} */}
								</div>
							)
						case 'yellowBannerBlock':
							return (
								<div key={index}>
									<motion.div
										initial={{
											borderRadius: '0.375rem',
										}}
										animate={{ borderRadius: '5rem' }}
										transition={{
											duration: 2,
											ease: [0.76, 0, 0.24, 1],
											repeat: Infinity,
											repeatType: 'reverse',
										}}
										className="relative -mt-10 rounded-full border-2 border-dark px-4 py-10 shadow-sm dark:bg-secondary sm:py-10"
										// style={{ backgroundColor: block.color?.hex || '#DEFE04' }}
										style={{
											backgroundColor: 'var(--color-secondary)',
										}}
									>
										{/* Camera Viewfinder Corners */}
										<div className="pointer-events-none absolute inset-0 hidden px-4 py-4">
											<div className="absolute left-6 top-6 h-[40px] w-[40px] border-l-4 border-t-4 border-black"></div>

											<div className="absolute right-6 top-6 h-[40px] w-[40px] border-r-4 border-t-4 border-black"></div>

											<div className="absolute bottom-6 left-6 h-[40px] w-[40px] border-b-4 border-l-4 border-black"></div>

											<div className="absolute bottom-6 right-6 h-[40px] w-[40px] border-b-4 border-r-4 border-black"></div>
										</div>

										{/* Text Content */}
										{block.text && (
											<p className="mx-auto py-2 text-center text-xl font-bold leading-[1.2] tracking-tighter text-dark sm:py-4 sm:text-4xl">
												{getLocalizedValue(block.text, language)}
											</p>
										)}
									</motion.div>
								</div>
							)
						case 'whiteTextBlock':
							if (!block.show) return null
							return (
								<div
									key={index}
									className="flex flex-col items-center rounded-md px-2 text-xl font-medium leading-tight tracking-tighter sm:flex-row sm:px-32 sm:py-52 sm:text-2xl"
								>
									<Accordion type="single" collapsible>
										<AccordionItem
											value="item-1"
											className="flex flex-col items-center justify-center"
										>
											<AccordionTrigger
												className={`${getRandomRotationClass()}`}
											>
												Call for Entry!
											</AccordionTrigger>
											<AccordionContent>
												<div className="z-0 w-full rounded-md border-2 border-dark bg-primary px-10 py-12 text-lg font-medium leading-[1.3] text-dark shadow-sm sm:w-1/2">
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
									className="relative my-0 flex h-full w-full flex-col items-center px-6"
								>
									<h3
										className={`relative z-50 mx-auto inline-block rounded-md border-2 border-primary bg-dark px-2 text-center text-4xl font-black uppercase italic tracking-tighter text-primary ${getRandomRotationClass()}`}
									>
										Jury
									</h3>
									<div className="grid h-full grid-cols-2 gap-8 sm:grid-cols-6">
										{block.juryMembers && block.juryMembers.length > 0 ? (
											block.juryMembers.map(
												(member: any, memberIndex: number) => (
													<div
														key={member._id}
														className="h-full w-full rounded-md"
													>
														{/* <div className="absolute left-0 top-0 z-30 h-full w-[2%] bg-[url('/assets/svg/filmroll.svg')] bg-[length:12px_30px] bg-center bg-repeat-y"></div>
														<div className="absolute right-0 top-0 z-30 h-full w-[2%] bg-[url('/assets/svg/filmroll.svg')] bg-[length:12px_30px] bg-center bg-repeat-y"></div> */}
														{member.image && (
															<div className="relative">
																<Img
																	image={member.image}
																	src={member.image.asset.url}
																	alt={member.name}
																	className="z-0 aspect-square h-full w-full rounded-full border-2 border-primary object-cover"
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
																<div className="absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-grayLight to-transparent dark:from-dark" />
															</div>
														)}
														{member.name && (
															<div className="flex items-center justify-center rounded-b-md bg-grayLight px-2 dark:bg-dark">
																<h3
																	className={`z-10 rounded-full border-2 bg-primary bg-none px-2 py-0 text-center text-base font-semibold tracking-tighter text-dark dark:border-primary dark:bg-primary dark:text-dark ${getRandomRotationClass()}`}
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
								</div>
							)

						case 'ticketBlock':
							if (!block.show) return null
							const ticketItems = block.items.map((item: any) => ({
								smallTitle: getLocalizedValue(item.smallTitle, language),
								text: getLocalizedValue(item.text, language),
							}))
							return (
								<div
									key={index}
									className="flex h-full w-full flex-col items-center pt-20"
								>
									<h3
										className={`z-10 rounded-md border-2 border-dark bg-primary px-2 text-center text-3xl font-black uppercase italic text-dark ${getRandomRotationClass()}`}
									>
										Save the Date
									</h3>
									<FestivalTicket
										key={index}
										items={ticketItems}
										block={block}
										language={language}
										getLocalizedValue={getLocalizedValue}
									/>
								</div>
							)
						case 'onTourBlock':
							if (!block.show) return null
							return (
								<div
									key={index}
									className="on-tour-block flex h-full w-full flex-col items-center py-20 pb-40"
								>
									<h3
										className={`rounded-md border-2 border-dark bg-primary px-2 text-center text-3xl font-black uppercase italic text-dark ${getRandomRotationClass()}`}
									>
										On Tour
									</h3>
									<div className="flex h-full w-1/2 items-center justify-end gap-1">
										<button
											onClick={() => setView('calendar')}
											className={`rounded-md border-2 px-3 py-2 text-center font-bold tracking-tight transition-colors ${
												view === 'calendar'
													? 'border-primary bg-dark text-primary' // Active: Dark background, primary text & border
													: 'border-grayDark bg-grayLight text-dark hover:bg-grayDark hover:text-white' // Inactive: Light gray, hover darkens
											}`}
										>
											<IoCalendar />
										</button>

										<button
											onClick={() => setView('list')}
											className={`flex rounded-md border-2 px-3 py-2 text-center font-bold tracking-tight transition-colors ${
												view === 'list'
													? 'border-primary bg-dark text-primary' // Active: Strong contrast, bold secondary color
													: 'border-grayDark bg-grayLight text-dark hover:bg-grayDark hover:text-white' // Inactive: Light gray, hover darkens
											}`}
										>
											<IoList />
										</button>
									</div>
									{view === 'calendar' ? (
										<div className="mt-4">
											{/* Calendar View */}
											<p>MONTH YEAR</p>
										</div>
									) : (
										<div className="mt-4 w-full">
											{/* Grid List View */}
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
																className="border-b border-t border-dark text-xs uppercase tracking-tighter text-dark dark:border-primary dark:text-primary"
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

																<td className="px-4 py-2 text-lg font-bold normal-case leading-[1]">
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
									)}
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
