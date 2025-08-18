'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react'
import { PortableText } from 'next-sanity'
import Snowfall from 'react-snowfall'

import Img from '@/ui/Img'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import LogoShortTsx from '../svgs/LogoShort'
import BackToTopButton from '../common/BackToTop'
import {
	IoChevronBack,
	IoChevronForward,
	IoClose,
	IoCalendar,
} from 'react-icons/io5'
import ArrowRight from '../common/ArrowRight'
import { BsFillCalendar2Fill } from 'react-icons/bs'
import { PiListBold } from 'react-icons/pi'

// Types
interface FestivalContentProps {
	festival: any
	language: string
}

interface BlockProps {
	block: any
	index: number
	language: string
}
// Types
interface Event {
	date: string
	title: Array<{ _key: string; value: string }>
	location: string
	description?: string
}

interface CalendarProps {
	events: Event[]
	language: string
	getLocalizedValue: (array: any[], lang: string) => string
}

interface CalendarDay {
	date: Date
	events: Event[]
	isCurrentMonth: boolean
	isToday: boolean
}

// Custom hook for localized values
const useLocalizedValue = () => {
	return (array: any[], lang: string): string => {
		if (!Array.isArray(array)) return ''
		const item = array.find((entry) => entry._key === lang)
		return item ? item.value : ''
	}
}

//Calendar Component
const EventCalendar: React.FC<CalendarProps> = ({
	events,
	language,
	getLocalizedValue,
}) => {
	const [currentDate, setCurrentDate] = useState(new Date())
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
	const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')

	// Get current month and year
	const currentMonth = currentDate.getMonth()
	const currentYear = currentDate.getFullYear()

	// Navigation functions
	const goToPrevMonth = () => {
		setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
	}

	const goToNextMonth = () => {
		setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
	}

	const goToToday = () => {
		setCurrentDate(new Date())
	}

	// Generate calendar days
	const calendarDays = useMemo(() => {
		const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
		const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
		const firstDayOfWeek = firstDayOfMonth.getDay()
		const daysInMonth = lastDayOfMonth.getDate()

		const days: CalendarDay[] = []
		const today = new Date()

		// Add days from previous month
		for (let i = firstDayOfWeek - 1; i >= 0; i--) {
			const date = new Date(currentYear, currentMonth, -i)
			days.push({
				date,
				events: [],
				isCurrentMonth: false,
				isToday: false,
			})
		}

		// Add days from current month
		for (let day = 1; day <= daysInMonth; day++) {
			const date = new Date(currentYear, currentMonth, day)
			const dateString = date.toISOString().split('T')[0]

			const dayEvents = events.filter(
				(event) => event.date.split('T')[0] === dateString,
			)

			days.push({
				date,
				events: dayEvents,
				isCurrentMonth: true,
				isToday: date.toDateString() === today.toDateString(),
			})
		}

		// Add days from next month to complete the grid
		const remainingDays = 42 - days.length // 6 rows × 7 days
		for (let day = 1; day <= remainingDays; day++) {
			const date = new Date(currentYear, currentMonth + 1, day)
			days.push({
				date,
				events: [],
				isCurrentMonth: false,
				isToday: false,
			})
		}

		return days
	}, [currentMonth, currentYear, events])

	// Month names
	const monthNames = [
		'Janvier',
		'Février',
		'Mars',
		'Avril',
		'Mai',
		'Juin',
		'Juillet',
		'Août',
		'Septembre',
		'Octobre',
		'Novembre',
		'Décembre',
	]

	const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

	// Get events for the current month
	const currentMonthEvents = events.filter((event) => {
		const eventDate = new Date(event.date)
		return (
			eventDate.getMonth() === currentMonth &&
			eventDate.getFullYear() === currentYear
		)
	})

	console.log('events', events)

	return (
		<>
			<div className="absolute top-16 flex w-full items-center justify-between px-16">
				<button
					onClick={goToPrevMonth}
					className="z-40 text-primary"
					aria-label="Previous"
				>
					<ArrowRight
						theme={{
							fill: 'var(--color-grayDark',
							// stroke: 'var(--color-primary',
						}}
						className="h-9 w-9 rotate-180"
					/>
				</button>
				<button
					onClick={goToNextMonth}
					className="z-40 text-primary"
					aria-label="Next"
				>
					<ArrowRight
						theme={{
							fill: 'var(--color-grayDark',
							// stroke: 'var(--color-primary',
						}}
						className="h-9 w-9"
					/>
				</button>
			</div>
			<div className="relative mx-32 rounded-xl border-[3px] border-primary bg-dark pb-4">
				{/* Header with controls */}
				<div className="mb-6 flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
					<div className="flex items-center gap-4">
						<h3 className="-rotate-3 rounded-md bg-grayDark px-2 text-2xl font-semibold tracking-tighter text-dark lg:top-4 lg:rounded-xl lg:border-[3px] lg:border-dark lg:px-2 lg:text-2xl">
							{monthNames[currentMonth]} {currentYear}
						</h3>

						{(currentMonth !== new Date().getMonth() ||
							currentYear !== new Date().getFullYear()) && (
							<button
								onClick={goToToday}
								className="hover:bg-primary/90 rounded-md bg-primary px-3 py-1 text-sm font-semibold text-dark transition-colors"
							>
								Aujourd&apos;hui
							</button>
						)}
					</div>

					<div className="flex items-center gap-2">
						{/* View Mode Toggle */}
						<div className="flex rounded-lg border-2 border-primary p-0">
							<button
								onClick={() => setViewMode('calendar')}
								className={`flex items-center gap-1 rounded px-3 py-1 text-sm font-medium transition-colors ${
									viewMode === 'calendar'
										? 'bg-primary text-dark'
										: 'text-gray-600 hover:text-gray-800'
								}`}
							>
								{/* <IoCalendar className="h-4 w-4" /> */}
								<BsFillCalendar2Fill className="h-4 w-4" />
							</button>
							<button
								onClick={() => setViewMode('list')}
								className={`flex items-center gap-1 rounded px-3 py-1 text-sm font-medium transition-colors ${
									viewMode === 'list'
										? 'bg-primary text-dark'
										: 'text-gray-600 hover:text-gray-800'
								}`}
							>
								<PiListBold className="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>

				{/* Calendar or List View */}
				<AnimatePresence mode="wait">
					{viewMode === 'calendar' ? (
						<motion.div
							key="calendar"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.3 }}
							className="p-4"
						>
							{/* Day headers */}
							<div className="mb-4 grid grid-cols-7 gap-1">
								{dayNames.map((day) => (
									<div
										key={day}
										className="p-2 text-center text-sm font-semibold text-primary"
									>
										{day}
									</div>
								))}
							</div>

							{/* Calendar grid */}
							<div className="grid grid-cols-7 gap-1">
								{calendarDays.map((day, index) =>
									day.isCurrentMonth ? (
										<motion.div
											key={`${day.date.toISOString()}-${index}`}
											className={`relative min-h-[100px] border-t ${day.events.length > 0 ? 'border-primary' : 'border-grayDark'} p-2 transition-colors ${
												day.isToday ? '' : ''
											}`}
											whileHover={{ scale: day.events.length > 0 ? 1.02 : 1 }}
											transition={{
												type: 'spring',
												stiffness: 300,
												damping: 30,
											}}
										>
											{/* Day number */}
											<div
												className={`w-fit text-sm font-medium ${day.events.length > 0 ? 'text-primary' : 'text-grayDark'} ${day.isToday ? 'rounded-full bg-primary px-1 py-0 font-bold !text-dark' : ''} `}
											>
												{day.date.getDate()}
											</div>
											{/* Events */}
											{day.events.length > 0 && (
												<div className="mt-1 space-y-1">
													{day.events.slice(0, 2).map((event, eventIndex) => (
														<motion.button
															key={eventIndex}
															onClick={() => setSelectedEvent(event)}
															className="hover:bg-primary/90 w-full rounded-md bg-primary px-2 py-1 text-left text-xs font-medium text-dark transition-colors"
															whileHover={{ scale: 1.02 }}
															whileTap={{ scale: 0.98 }}
														>
															{getLocalizedValue(event.title, language)}
															{/* {getLocalizedValue(event.title, language).length >
															15 && '...'} */}
														</motion.button>
													))}
													{day.events.length > 2 && (
														<div className="text-xs font-medium text-primary">
															+{day.events.length - 2} autres
														</div>
													)}
												</div>
											)}
										</motion.div>
									) : (
										<div
											key={`${day.date.toISOString()}-${index}`}
											className="min-h-[100px] p-2"
											aria-hidden="true"
										/>
									),
								)}
							</div>
						</motion.div>
					) : (
						<motion.div
							key="list"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.3 }}
							className=""
						>
							{currentMonthEvents.length > 0 ? (
								currentMonthEvents.map((event, index) => (
									<motion.div
										key={index}
										className="cursor-pointer border-b border-primary p-4 transition-colors hover:bg-gray-50"
										onClick={() => setSelectedEvent(event)}
										whileHover={{ scale: 1.01 }}
										whileTap={{ scale: 0.99 }}
									>
										<div className="flex items-start justify-between gap-4">
											<div className="flex-1">
												<h4 className="mb-1 font-semibold text-primary">
													{getLocalizedValue(event.title, language)}
												</h4>
												<p className="text-sm text-gray-600">
													{event.location}
												</p>
											</div>
											<div className="text-right">
												<div className="text-sm font-medium text-primary">
													{new Date(event.date).toLocaleDateString(language, {
														weekday: 'long',
														day: 'numeric',
														month: 'long',
													})}
												</div>
												<div className="text-sm text-gray-600">
													{new Date(event.date).toLocaleTimeString(language, {
														hour: '2-digit',
														minute: '2-digit',
													})}
												</div>
											</div>
										</div>
									</motion.div>
								))
							) : (
								<div className="py-8 text-center text-primary">
									Aucun événement ce mois-ci
								</div>
							)}
						</motion.div>
					)}
				</AnimatePresence>

				{/* Event Detail Modal */}
				<AnimatePresence>
					{selectedEvent && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
							onClick={() => setSelectedEvent(null)}
						>
							<motion.div
								initial={{ scale: 0.9, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.9, opacity: 0 }}
								className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800"
								onClick={(e) => e.stopPropagation()}
							>
								{/* Close button */}
								<button
									onClick={() => setSelectedEvent(null)}
									className="absolute right-4 top-4 rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
								>
									<IoClose className="h-5 w-5" />
								</button>

								{/* Event details */}
								<div className="pr-8">
									<h3 className="mb-4 -rotate-1 text-xl font-bold text-primary">
										{getLocalizedValue(selectedEvent.title, language)}
									</h3>

									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<span className="font-medium text-gray-700 dark:text-gray-300">
												Date:
											</span>
											<span className="text-gray-900">
												{new Date(selectedEvent.date).toLocaleDateString(
													language,
													{
														weekday: 'long',
														year: 'numeric',
														month: 'long',
														day: 'numeric',
													},
												)}
											</span>
										</div>

										<div className="flex items-center gap-2">
											<span className="font-medium text-gray-700 dark:text-gray-300">
												Heure:
											</span>
											<span className="text-gray-900 dark:text-gray-100">
												{new Date(selectedEvent.date).toLocaleTimeString(
													language,
													{
														hour: '2-digit',
														minute: '2-digit',
													},
												)}
											</span>
										</div>

										<div className="flex items-center gap-2">
											<span className="font-medium text-gray-700 dark:text-gray-300">
												Lieu:
											</span>
											<span className="text-gray-900 dark:text-gray-100">
												{selectedEvent.location}
											</span>
										</div>

										{selectedEvent.description && (
											<div className="mt-4">
												<span className="mb-2 block font-medium text-gray-700 dark:text-gray-300">
													Description:
												</span>
												<p className="text-sm leading-relaxed text-gray-900 dark:text-gray-100">
													{selectedEvent.description}
												</p>
											</div>
										)}
									</div>
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</>
	)
}

// Custom Text Block Component
const CustomTextBlock: React.FC<BlockProps> = ({ block, index, language }) => {
	if (!block.show) return null

	return (
		<AccordionItem
			value={`custom-${index}`}
			className="flex flex-col items-center justify-center"
		>
			<AccordionTrigger className="-mb-0 rotate-3 lg:text-6xl">
				{block.title}
			</AccordionTrigger>
			<AccordionContent>
				<div className="px-2 pb-0 pt-4 text-base leading-[1.2] tracking-tight text-primary lg:mx-32 lg:rounded-md lg:bg-primary lg:pb-8 lg:pt-8 lg:text-xl lg:leading-[1.75rem] lg:text-dark">
					{block.content?.[language] && (
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
		</AccordionItem>
	)
}

// Yellow Banner Block Component
const YellowBannerBlock: React.FC<BlockProps> = ({
	block,
	index,
	language,
}) => {
	const getLocalizedValue = useLocalizedValue()
	const { scrollY } = useScroll()
	const borderRadius = useTransform(scrollY, (value) =>
		Math.max(80 - value, 10),
	)

	const text = getLocalizedValue(block.text, language)
	const paragraphs = text.split('\n\n')

	return (
		<div className="">
			<motion.div
				style={{ borderRadius }}
				transition={{
					duration: 2,
					ease: [0.76, 0, 0.24, 1],
				}}
				className="relative border-2 border-dark bg-primary px-4 py-10 shadow-sm dark:bg-primary lg:hidden lg:border-0 lg:py-10"
			>
				{paragraphs.map((paragraph: string, i: number) => (
					<p
						key={i}
						className="mx-auto py-2 text-center text-xl font-bold leading-[1.2] tracking-tighter text-dark lg:py-4 lg:text-3xl"
					>
						{paragraph.split(/(System D)/).map((part, partIndex) =>
							part === 'System D' ? (
								<motion.span
									key={partIndex}
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
									<LogoShortTsx className="mr-[0.10rem] inline-block h-auto w-[9rem] -rotate-6 rounded-md bg-dark px-2 py-1 text-primary dark:bg-dark lg:w-[15rem]" />
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
}

// Media Teaser Block Component
const MediaTeaserBlock: React.FC<BlockProps> = ({ block, index }) => {
	const [isFullscreen, setIsFullscreen] = useState(false)

	const handleVideoClick = () => {
		if (!isFullscreen) setIsFullscreen(true)
	}

	const handleCloseFullscreen = (e: React.MouseEvent) => {
		e.stopPropagation()
		setIsFullscreen(false)
	}

	return (
		<motion.div
			layout
			className={`mx-0 w-auto cursor-pointer overflow-hidden rounded-lg pb-10 pt-2 lg:h-[50vh] lg:pb-0 lg:pt-0 ${
				isFullscreen ? 'fixed inset-0 z-50 w-screen rounded-none bg-dark' : ''
			}`}
			style={{
				height: isFullscreen ? '100%' : '65vh',
				width: isFullscreen ? '100%' : '100%',
			}}
			onClick={handleVideoClick}
			transition={{
				duration: 0.6,
				ease: [0.32, 0.72, 0, 1],
			}}
		>
			<video
				className={`h-full w-full transform rounded-3xl border-[3px] border-primary object-cover lg:rounded-md lg:border-0 ${
					isFullscreen ? 'lg:border-4' : ''
				}`}
				autoPlay
				muted
				loop
				playsInline
			>
				<source src="/assets/videos/teaser2.mp4" type="video/mp4" />
				Your browser does not support the video tag.
			</video>

			<AnimatePresence>
				{isFullscreen && (
					<div
						onClick={handleCloseFullscreen}
						className="fixed inset-0 z-50 h-full w-full"
					/>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

// Jury Block Component
const JuryBlock: React.FC<BlockProps> = ({ block, index, language }) => {
	const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
	const getLocalizedValue = useLocalizedValue()

	const toggleMember = (id: string) => {
		setSelectedMemberId((prev) => (prev === id ? null : id))
	}

	useEffect(() => {
		if (block.juryMembers?.length > 0 && selectedMemberId === null) {
			setSelectedMemberId(block.juryMembers[0]._id)
		}
	}, [block.juryMembers, selectedMemberId])

	if (!block.show) return null

	const selectedMember = block.juryMembers?.find(
		(m: any) => m._id === selectedMemberId,
	)

	return (
		<AccordionItem
			value={`jury-${index}`}
			className="flex flex-col items-center justify-center"
		>
			<AccordionTrigger className="-rotate-6 lg:text-6xl">
				Jury
			</AccordionTrigger>
			<AccordionContent>
				{/* Jury Grid */}
				<div className="grid w-full grid-cols-3 gap-1 lg:grid-cols-6 lg:px-32">
					{block.juryMembers?.length > 0 ? (
						block.juryMembers.map((member: any) => (
							<div
								key={member._id}
								className="flex cursor-pointer flex-col items-center px-0"
								onClick={() => toggleMember(member._id)}
							>
								<div
									className={`relative h-full w-full overflow-hidden rounded-lg border-[3px] lg:px-0 ${
										selectedMemberId === member._id
											? 'border-primary'
											: 'border-dark'
									}`}
								>
									<Img
										image={member.image}
										src={member.image?.asset.url}
										alt={member.name}
										className={`z-0 h-full w-full border-0 border-dark object-cover dark:border-primary lg:border-0 ${
											selectedMemberId === member._id
												? 'saturate-100'
												: 'lg:saturate-0'
										}`}
									/>
									{selectedMemberId !== member._id && (
										<div
											className="absolute inset-0 z-10 mix-blend-screen"
											style={{
												backgroundColor: 'var(--color-dark)',
												opacity: 0.9,
											}}
										/>
									)}
								</div>
							</div>
						))
					) : (
						<p>No jury members found</p>
					)}
				</div>

				{/* Selected Member Bio */}
				{selectedMemberId && selectedMember && (
					<div className="mb-4 mt-4 w-full px-0">
						<div className="w-full text-primary">
							{selectedMember.name && (
								<div className="flex items-center justify-center">
									<h2 className="mb-3 -rotate-0 rounded-md border-[0px] border-primary px-2 text-lg font-semibold tracking-tighter text-primary lg:hidden">
										{selectedMember.name}
									</h2>
								</div>
							)}
							{selectedMember.biography && (
								<p className="text-base font-normal leading-[1.2] tracking-tighter lg:px-32 lg:text-xl">
									<span className="mr-4 hidden font-bold tracking-tighter lg:inline-block">
										{selectedMember.name}
									</span>
									{getLocalizedValue(selectedMember.biography, language)}
								</p>
							)}
						</div>
					</div>
				)}
			</AccordionContent>
		</AccordionItem>
	)
}

// On Tour Block Component
// const OnTourBlock: React.FC<BlockProps> = ({ block, index, language }) => {
// 	const getLocalizedValue = useLocalizedValue()

// 	if (!block.show) return null

// 	return (
// 		<AccordionItem
// 			value={`onTour-${index}`}
// 			className="flex flex-col items-center justify-center"
// 		>
// 			<AccordionTrigger className="rotate-6 lg:text-6xl">
// 				On Tour
// 			</AccordionTrigger>
// 			<AccordionContent className="w-full">
// 				<div className="mt-4 w-full">
// 					<table className="w-full table-auto border-collapse">
// 						<tbody>
// 							{block.events.map((event: any, eventIndex: number) => (
// 								<tr
// 									key={eventIndex}
// 									className="border-b border-t border-dark text-sm tracking-tighter text-dark dark:border-primary dark:text-primary"
// 								>
// 									<td className="flex flex-col px-4 py-2">
// 										<span>
// 											{new Date(event.date).toLocaleDateString(language, {
// 												weekday: 'long',
// 												day: 'numeric',
// 												month: 'long',
// 											})}
// 										</span>
// 										<span>
// 											{new Date(event.date).toLocaleTimeString(language, {
// 												hour: '2-digit',
// 												minute: '2-digit',
// 												hour12: true,
// 											})}
// 										</span>
// 									</td>
// 									<td className="px-4 py-2 text-sm normal-case leading-[1]">
// 										{getLocalizedValue(event.title, language)}
// 									</td>
// 									<td className="px-4 py-2">
// 										{event.location || 'Location not specified'}
// 									</td>
// 								</tr>
// 							))}
// 						</tbody>
// 					</table>
// 				</div>
// 			</AccordionContent>
// 		</AccordionItem>
// 	)
// }

const OnTourBlock: React.FC<BlockProps> = ({ block, index, language }) => {
	const getLocalizedValue = useLocalizedValue()

	if (!block.show) return null

	return (
		<AccordionItem
			value={`onTour-${index}`}
			className="flex flex-col items-center justify-center"
		>
			<AccordionTrigger className="rotate-6 lg:text-6xl">
				On Tour
			</AccordionTrigger>
			<AccordionContent className="relative w-full">
				<div className="relative mt-4 w-full">
					<EventCalendar
						events={block.events || []}
						language={language}
						getLocalizedValue={getLocalizedValue}
					/>
				</div>
			</AccordionContent>
		</AccordionItem>
	)
}

// Main Component
const FestivalContent: React.FC<FestivalContentProps> = ({
	festival,
	language,
}) => {
	const handleAccordionValueChange = () => {
		const navbar = document.getElementById('navbar-mobile')
		if (navbar) {
			navbar.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
	}

	if (!festival) {
		return <div>No content available</div>
	}

	// Setup sparkle image for snowfall
	const sparkleImg = new window.Image()
	sparkleImg.src = '/assets/svg/SparkleSnow2.svg'

	// Separate accordion items from media teaser
	const accordionBlocks = festival.blocks?.filter(
		(block: any) => block._type !== 'mediaTeaserBlock',
	)
	const mediaTeaserBlocks = festival.blocks?.filter(
		(block: any) => block._type === 'mediaTeaserBlock',
	)

	const renderBlock = (block: any, index: number) => {
		const blockProps = { block, index, language }

		switch (block._type) {
			case 'customTextBlock':
				return <CustomTextBlock key={`custom-${index}`} {...blockProps} />
			case 'yellowBannerBlock':
				return <YellowBannerBlock key={`yellow-${index}`} {...blockProps} />
			case 'juryBlock':
				return <JuryBlock key={`jury-${index}`} {...blockProps} />
			case 'onTourBlock':
				return <OnTourBlock key={`onTour-${index}`} {...blockProps} />
			default:
				return null
		}
	}

	console.log(festival)

	return (
		<div
			key={festival._id}
			id="festival-content"
			className="relative flex h-full w-full flex-col space-y-1 rounded-md p-2 px-4 pb-32 lg:mt-0 lg:h-svh lg:p-0 lg:pt-0"
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

			{/* Accordion Items */}
			<Accordion
				type="single"
				collapsible
				onValueChange={handleAccordionValueChange}
				// className="lg:rounded-md lg:bg-dark lg:bg-gradient-to-t lg:from-grayDark lg:py-16 lg:shadow-inner"
				className="lg:rounded-lg lg:border-0 lg:border-primary lg:bg-primary lg:bg-gradient-to-b lg:from-dark lg:pb-28 lg:pt-20"
			>
				{accordionBlocks?.map(renderBlock)}
			</Accordion>
			{/* Media Teaser Blocks - Outside of Accordion */}
			{mediaTeaserBlocks?.map((block: any, index: number) => (
				<MediaTeaserBlock
					key={`media-${index}`}
					block={block}
					index={index}
					language={language}
				/>
			))}
		</div>
	)
}

export default FestivalContent
