'use client'
import { useState } from 'react'
import { motion } from 'motion/react'
import {
	Calendar,
	MapPin,
	Users,
	Award,
	Mail,
	Phone,
	Globe,
} from 'lucide-react'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/improved-accordion'
import Img from '@/ui/Img'

interface FestivalContentImprovedProps {
	festival: any
	language: string
}

export default function FestivalContentImproved({
	festival,
	language,
}: FestivalContentImprovedProps) {
	const [selectedJuryMember, setSelectedJuryMember] = useState<string | null>(
		null,
	)
	const [openAccordion, setOpenAccordion] = useState<string>('')

	const handleAccordionChange = (value: string) => {
		setOpenAccordion(value)
	}

	// Helper for localized values
	const getLocalizedValue = (array: any[], lang: string) => {
		if (!Array.isArray(array)) return ''
		const item = array.find(
			(entry) => entry.language === lang || entry._key === lang,
		)
		return item ? item.value : ''
	}

	// Extract blocks
	const blocks = festival?.blocks || []
	const mediaTeaserBlock = blocks.find(
		(b: any) => b._type === 'mediaTeaserBlock',
	)
	const juryBlock = blocks.find((b: any) => b._type === 'juryBlock')
	const onTourBlock = blocks.find((b: any) => b._type === 'onTourBlock')
	const customTextBlocks = blocks.filter(
		(b: any) => b._type === 'customTextBlock',
	)

	return (
		<div className="bg-background min-h-screen p-4 pb-32">
			<div className="mx-auto max-w-4xl space-y-6">
				<Accordion
					type="single"
					collapsible
					value={openAccordion}
					onValueChange={handleAccordionChange}
					className="space-y-4"
				>
					{/* Multiple Custom Text Blocks */}
					{customTextBlocks.map((block: any, idx: number) => (
						<AccordionItem
							key={block._key || `customTextBlock-${idx}`}
							value={block._key || `customTextBlock-${idx}`}
							className="flex w-full flex-col items-center justify-center"
						>
							<AccordionTrigger
								rotation={3}
								className="-mb-4 w-full sm:text-6xl"
							>
								{block.title}
							</AccordionTrigger>
							<AccordionContent>
								<div className="px-2 pb-0 pt-4 text-base leading-[1.2] tracking-tighter text-dark dark:text-primary">
									{block.content && block.content[language] && (
										<div className="prose dark:prose-invert max-w-none">
											{block.content[language].map(
												(subBlock: any, i: number) => (
													<p key={i}>
														{subBlock.children
															?.map((c: any) => c.text)
															.join(' ')}
													</p>
												),
											)}
										</div>
									)}
								</div>
							</AccordionContent>
						</AccordionItem>
					))}

					{/* Jury Section */}
					{juryBlock && (
						<AccordionItem
							value="jury"
							className="flex flex-col items-center justify-center"
						>
							<AccordionTrigger
								rotation={-2}
								className="-mb-4 w-full sm:text-6xl"
							>
								Jury
							</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-6">
									{/* Jury Grid */}
									<div className="grid grid-cols-3 gap-1 md:grid-cols-4">
										{juryBlock.juryMembers?.map((member: any) => (
											<motion.div
												key={member._id}
												className={`cursor-pointer overflow-hidden rounded-lg border-[3px] transition-all ${
													selectedJuryMember === member._id
														? 'border-primary shadow-lg'
														: 'border-gray-300 grayscale hover:grayscale-0'
												}`}
												onClick={() =>
													setSelectedJuryMember(
														selectedJuryMember === member._id
															? null
															: member._id,
													)
												}
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<Img
													image={member.image}
													src={member.image?.asset.url}
													alt={member.name}
													className="h-32 w-full object-cover md:h-40"
												/>
												{/* <div className="p-2">
													<h4 className="text-xs font-bold leading-tight">
														{member.name}
													</h4>
													<p className="text-muted-foreground text-xs">
														{member.role || ''}
													</p>
												</div> */}
											</motion.div>
										))}
									</div>

									{/* Selected Member Bio */}
									{selectedJuryMember && (
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											className="mt-8 w-full px-0 sm:px-12"
										>
											{(() => {
												const member = juryBlock.juryMembers.find(
													(m: any) => m._id === selectedJuryMember,
												)
												if (!member) return null
												return (
													<div className="w-full text-primary">
														{member.name && (
															<h2 className="mb-2 text-2xl font-bold tracking-tight">
																{member.name}
															</h2>
														)}
														{member.biography && (
															<p className="text-base leading-tight tracking-tighter">
																{getLocalizedValue(member.biography, language)}
															</p>
														)}
													</div>
												)
											})()}
										</motion.div>
									)}
								</div>
							</AccordionContent>
						</AccordionItem>
					)}

					{/* Events Section */}
					{onTourBlock && (
						<AccordionItem
							value="on-tour"
							className="flex h-full w-full flex-col items-center justify-center"
						>
							<AccordionTrigger
								rotation={4}
								className="-mb-4 w-full sm:text-6xl"
							>
								Events
							</AccordionTrigger>
							<AccordionContent className="w-full">
								<div className="mt-4 w-full">
									<table className="w-full table-auto border-collapse">
										<thead className="hidden">
											<tr>
												<th className="border px-4 py-2">Date + Time</th>
												<th className="border px-4 py-2">Event Title</th>
												<th className="border px-4 py-2">Address</th>
											</tr>
										</thead>
										<tbody>
											{onTourBlock.events?.map((event: any, index: number) => (
												<tr
													key={index}
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
													<td className="px-4 py-2 text-base font-bold normal-case leading-[1]">
														{getLocalizedValue(event.title, language)}
													</td>
													<td className="px-4 py-2">
														{event.location || 'Location not specified'}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</AccordionContent>
						</AccordionItem>
					)}

					{mediaTeaserBlock && (
						<div className="mx-0 h-[65vh] w-auto pb-10 pt-2 sm:h-[50vh] sm:pb-0 sm:pt-0">
							<video
								className="h-full w-full transform rounded-3xl border-[3px] border-primary object-cover sm:rounded-md sm:border-0"
								autoPlay
								loop
								muted
								playsInline
							>
								<source
									src={
										mediaTeaserBlock.videoUrl || '/assets/videos/teaser2.mp4'
									}
									type="video/mp4"
								/>
								Your browser does not support the video tag.
							</video>
						</div>
					)}
				</Accordion>
			</div>
		</div>
	)
}
