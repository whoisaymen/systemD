'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import {
	motion,
	useScroll,
	useTransform,
	AnimatePresence,
	LayoutGroup,
} from 'motion/react'
import { PortableText } from 'next-sanity'
import { Maximize2, Minimize2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import Img from '@/ui/Img'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import LogoShortTsx from '../svgs/LogoShort'
import BackToTopButton from '../common/BackToTop'
import { IoClose } from 'react-icons/io5'
import NewArrowRightSimple from '../common/NewArrowRightSimple'
import SparkleEffect from './SparkleEffect'

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
	_id?: string
	date?: string
	endDate?: string
	title: Array<{ _key?: string; language?: string; value: string }>
	location?: string
	description?: Array<{ _key?: string; language?: string; value: string }>
	pressLink?: string
}

interface EventsListProps {
	events: Event[]
	language: string
	getLocalizedValue: (array: any[], lang: string) => string
}

interface EventMonthGroup {
	key: string
	month: number
	label: string
	events: Event[]
}

type EventDetailSelection = {
	event: Event
	monthGroup: EventMonthGroup
}

type VideoRect = {
	height: number
	left: number
	top: number
	width: number
}

const MEDIA_TEASER_TRANSITION =
	'left 800ms cubic-bezier(0.76, 0, 0.24, 1), top 800ms cubic-bezier(0.76, 0, 0.24, 1), width 800ms cubic-bezier(0.76, 0, 0.24, 1), height 800ms cubic-bezier(0.76, 0, 0.24, 1), border-radius 800ms cubic-bezier(0.76, 0, 0.24, 1)'
const EVENT_CARD_EASE = [0.76, 0, 0.24, 1] as const
const EVENT_MONTH_FADE_MS = 240
const EVENT_CONTENT_FADE_MS = 220
const EVENT_CARD_LAYOUT_MS = 860
const EVENT_CARD_RADIUS = 8

// Custom hook for localized values
const useLocalizedValue = () => {
	return (array: any[], lang: string): string => {
		if (!Array.isArray(array)) return ''
		const languages = [lang, 'en', 'fr', 'nl']
		const item = languages
			.map((language) =>
				array.find(
					(entry) => entry.language === language || entry._key === language,
				),
			)
			.find(Boolean)
		return item ? item.value : ''
	}
}

const getValidDate = (value?: string) => {
	if (!value) return null

	const date = new Date(value)
	return Number.isNaN(date.getTime()) ? null : date
}

const isSameCalendarDay = (a: Date, b: Date) =>
	a.getFullYear() === b.getFullYear() &&
	a.getMonth() === b.getMonth() &&
	a.getDate() === b.getDate()

const formatDateRange = (event: Event, language: string) => {
	const start = getValidDate(event.date)
	const end = getValidDate(event.endDate)

	if (!start) return ''

	const fullDateOptions: Intl.DateTimeFormatOptions = {
		weekday: 'short',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	}

	if (!end || isSameCalendarDay(start, end)) {
		return start.toLocaleDateString(language, fullDateOptions)
	}

	const shortDateOptions: Intl.DateTimeFormatOptions = {
		weekday: 'short',
		day: 'numeric',
		month: 'long',
	}

	return `${start.toLocaleDateString(language, shortDateOptions)} - ${end.toLocaleDateString(language, fullDateOptions)}`
}

const formatTimeRange = (event: Event, language: string) => {
	const start = getValidDate(event.date)
	const end = getValidDate(event.endDate)

	if (!start) return ''

	const timeOptions: Intl.DateTimeFormatOptions = {
		hour: '2-digit',
		minute: '2-digit',
	}
	const startTime = start.toLocaleTimeString(language, timeOptions)

	if (!end || !isSameCalendarDay(start, end)) {
		return startTime
	}

	return `${startTime} - ${end.toLocaleTimeString(language, timeOptions)}`
}

const getEventEndDate = (event: Event) => {
	const start = getValidDate(event.date)
	const end = getValidDate(event.endDate)

	if (!start) return null
	if (!end || end < start) return start

	return end
}

const eventOverlapsYear = (event: Event, year: number) => {
	const start = getValidDate(event.date)
	const end = getEventEndDate(event)

	if (!start || !end) return false

	const yearStart = new Date(year, 0, 1)
	const nextYearStart = new Date(year + 1, 0, 1)

	return start < nextYearStart && end >= yearStart
}

const getEventDisplayMonth = (event: Event, year: number) => {
	const start = getValidDate(event.date)

	if (!start) return null
	if (start.getFullYear() < year) return 0
	if (start.getFullYear() > year) return null

	return start.getMonth()
}

const getInitialEventYear = (events: Event[]) => {
	const currentYear = new Date().getFullYear()
	const years = events
		.map((event) => getValidDate(event.date)?.getFullYear())
		.filter((year): year is number => typeof year === 'number')
		.sort((a, b) => a - b)

	if (years.includes(currentYear)) return currentYear

	return years[0] ?? currentYear
}

const getEventsForYear = (events: Event[], year: number) =>
	events
		.filter((event) => eventOverlapsYear(event, year))
		.map((event) => ({ event, start: getValidDate(event.date) }))
		.filter(
			(item): item is { event: Event; start: Date } => item.start !== null,
		)
		.sort((a, b) => a.start.getTime() - b.start.getTime())
		.map(({ event }) => event)

const groupEventsByMonth = (
	events: Event[],
	year: number,
	language: string,
): EventMonthGroup[] =>
	Array.from({ length: 12 }, (_, month) => ({
		key: `${year}-${month}`,
		month,
		label: new Date(year, month, 1).toLocaleDateString(language, {
			month: 'long',
		}),
		events: events.filter(
			(event) => getEventDisplayMonth(event, year) === month,
		),
	}))

const AnnualEventsList: React.FC<EventsListProps> = ({
	events,
	language,
	getLocalizedValue,
}) => {
	const tFestivalEvents = useTranslations('festivalEvents')
	const [selectedYear, setSelectedYear] = useState(() =>
		getInitialEventYear(events),
	)
	const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
	const [expandedEvent, setExpandedEvent] =
		useState<EventDetailSelection | null>(null)
	const [openingEvent, setOpeningEvent] = useState<EventDetailSelection | null>(
		null,
	)
	const [closingEvent, setClosingEvent] = useState<EventDetailSelection | null>(
		null,
	)
	const [detailContentVisible, setDetailContentVisible] = useState(false)
	const eventTransitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
		null,
	)
	const eventContentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
		null,
	)
	const selectedYearEvents = useMemo(
		() => getEventsForYear(events, selectedYear),
		[events, selectedYear],
	)
	const monthGroups = useMemo(
		() => groupEventsByMonth(selectedYearEvents, selectedYear, language),
		[selectedYearEvents, selectedYear, language],
	)
	const monthsWithEvents = monthGroups.filter(
		(month) => month.events.length > 0,
	)
	const selectedEvent = expandedEvent?.event ?? null
	const expandedMonthGroup = expandedEvent?.monthGroup ?? null
	const selectedDescription = selectedEvent
		? getLocalizedValue(selectedEvent.description ?? [], language)
		: ''
	const openingMonthKey = openingEvent?.monthGroup.key ?? null
	const closingMonthKey = closingEvent?.monthGroup.key ?? null
	const transitionMonthKey = openingMonthKey ?? closingMonthKey
	const isEventTransitioning = Boolean(openingEvent || closingEvent)
	const isCalendarLayoutHandoff = Boolean(openingEvent || closingEvent)

	useEffect(() => {
		return () => {
			if (eventTransitionTimerRef.current) {
				clearTimeout(eventTransitionTimerRef.current)
			}
			if (eventContentTimerRef.current) {
				clearTimeout(eventContentTimerRef.current)
			}
		}
	}, [])

	const clearEventTransitionTimer = () => {
		if (eventTransitionTimerRef.current) {
			clearTimeout(eventTransitionTimerRef.current)
			eventTransitionTimerRef.current = null
		}
	}

	const clearEventContentTimer = () => {
		if (eventContentTimerRef.current) {
			clearTimeout(eventContentTimerRef.current)
			eventContentTimerRef.current = null
		}
	}

	const resetEventDetails = () => {
		clearEventTransitionTimer()
		clearEventContentTimer()
		setOpeningEvent(null)
		setClosingEvent(null)
		setExpandedEvent(null)
		setDetailContentVisible(false)
	}

	const closeEventDetails = () => {
		clearEventTransitionTimer()
		clearEventContentTimer()

		if (!expandedEvent) {
			resetEventDetails()
			return
		}

		const selection = expandedEvent
		setDetailContentVisible(false)
		eventContentTimerRef.current = setTimeout(() => {
			setClosingEvent(selection)
			setOpeningEvent(null)
			setExpandedEvent(null)
			eventContentTimerRef.current = null
			eventTransitionTimerRef.current = setTimeout(() => {
				setClosingEvent(null)
				eventTransitionTimerRef.current = null
			}, EVENT_CARD_LAYOUT_MS)
		}, EVENT_CONTENT_FADE_MS)
	}

	const openEventDetails = (event: Event, monthGroup: EventMonthGroup) => {
		const selection = { event, monthGroup }

		if (expandedEvent?.monthGroup.key === monthGroup.key) {
			setExpandedEvent(selection)
			return
		}

		clearEventTransitionTimer()
		clearEventContentTimer()

		setExpandedEvent(null)
		setClosingEvent(null)
		setDetailContentVisible(false)
		setOpeningEvent(selection)
		eventTransitionTimerRef.current = setTimeout(() => {
			setOpeningEvent(null)
			setExpandedEvent(selection)
			eventTransitionTimerRef.current = null
			eventContentTimerRef.current = setTimeout(() => {
				setDetailContentVisible(true)
				eventContentTimerRef.current = null
			}, EVENT_CARD_LAYOUT_MS)
		}, EVENT_MONTH_FADE_MS)
	}
	const handleYearChange = (direction: -1 | 1) => {
		resetEventDetails()
		setSelectedYear((year) => year + direction)
	}
	const handleViewModeChange = (mode: 'calendar' | 'list') => {
		resetEventDetails()
		setViewMode(mode)
	}

	const renderExpandedEventDetails = (fillsCalendarStage = false) => {
		if (!expandedEvent || !expandedMonthGroup || !selectedEvent) return null

		return (
			<motion.div
				data-testid="festival-event-detail"
				key={`event-detail-${expandedMonthGroup.key}`}
				layout
				layoutId={`month-card-${expandedMonthGroup.key}`}
				initial={{ opacity: 1 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 1 }}
				transition={{
					layout: {
						duration: EVENT_CARD_LAYOUT_MS / 1000,
						ease: EVENT_CARD_EASE,
					},
					opacity: {
						duration: EVENT_CONTENT_FADE_MS / 1000,
						ease: EVENT_CARD_EASE,
					},
				}}
				style={{ borderRadius: EVENT_CARD_RADIUS }}
				className={`relative flex w-full flex-col overflow-hidden rounded-lg bg-dark p-4 text-primary lg:p-5 ${
					fillsCalendarStage
						? 'h-full min-h-0'
						: 'min-h-[26rem] lg:min-h-[30rem]'
				}`}
			>
				<motion.div
					data-testid="festival-event-detail-content"
					className="flex min-h-0 flex-1 flex-col"
					animate={{
						opacity: detailContentVisible ? 1 : 0,
						pointerEvents: detailContentVisible ? 'auto' : 'none',
					}}
					initial={false}
					transition={{
						duration: EVENT_CONTENT_FADE_MS / 1000,
						ease: EVENT_CARD_EASE,
					}}
				>
					<button
						type="button"
						onClick={closeEventDetails}
						className="absolute right-3 top-3 z-10 rounded-full p-1 text-grayDark transition-colors hover:bg-primary hover:text-dark"
						aria-label={tFestivalEvents('closeDetails')}
					>
						<IoClose className="h-5 w-5" />
					</button>

					<div className="mb-4 pr-8">
						<p className="text-sm font-semibold tracking-wide text-grayDark">
							{expandedMonthGroup.label} {selectedYear}
						</p>
						<h3 className="-rotate-1 text-2xl font-bold leading-none text-primary lg:text-4xl">
							{getLocalizedValue(selectedEvent.title, language)}
						</h3>
					</div>

					<div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[minmax(11rem,15rem)_1fr]">
						<div className="no-scrollbar min-h-0 space-y-2 overflow-y-auto border-b border-primary/40 pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-4">
							{expandedMonthGroup.events.map((event, index) => {
								const isActive =
									event._id && selectedEvent._id
										? event._id === selectedEvent._id
										: event === selectedEvent

								return (
									<button
										key={
											event._id ?? `${expandedMonthGroup.key}-detail-${index}`
										}
										type="button"
										onClick={() => openEventDetails(event, expandedMonthGroup)}
										className={`block w-full rounded-md border border-primary px-2 py-2 text-left text-sm font-semibold leading-tight transition-colors ${
											isActive
												? 'bg-primary text-dark'
												: 'text-primary hover:bg-primary/10'
										}`}
									>
										<span className="block">
											{getLocalizedValue(event.title, language)}
										</span>
										<span
											className={`mt-1 block text-xs font-medium ${
												isActive ? 'text-dark/70' : 'text-grayDark'
											}`}
										>
											{formatDateRange(event, language)}
										</span>
									</button>
								)
							})}
						</div>

						<div className="no-scrollbar min-h-0 space-y-4 overflow-y-auto pr-1 text-grayDark">
							<div>
								<span className="mb-1 block text-xs font-semibold tracking-wide text-primary">
									{tFestivalEvents('dateLabel')}
								</span>
								<span>{formatDateRange(selectedEvent, language)}</span>
							</div>

							<div>
								<span className="mb-1 block text-xs font-semibold tracking-wide text-primary">
									{tFestivalEvents('timeLabel')}
								</span>
								<span>{formatTimeRange(selectedEvent, language)}</span>
							</div>

							{selectedEvent.location && (
								<div>
									<span className="mb-1 block text-xs font-semibold tracking-wide text-primary">
										{tFestivalEvents('locationLabel')}
									</span>
									<span>{selectedEvent.location}</span>
								</div>
							)}

							{selectedDescription && (
								<div>
									<span className="mb-1 block text-xs font-semibold tracking-wide text-primary">
										{tFestivalEvents('descriptionLabel')}
									</span>
									<p className="text-sm leading-relaxed">
										{selectedDescription}
									</p>
								</div>
							)}

							{selectedEvent.pressLink && (
								<a
									href={selectedEvent.pressLink}
									target="_blank"
									rel="noreferrer"
									className="inline-block rounded-md bg-primary px-3 py-1 text-sm font-semibold text-dark"
								>
									{tFestivalEvents('pressLink')}
								</a>
							)}
						</div>
					</div>
				</motion.div>
			</motion.div>
		)
	}

	return (
		<>
			<div
				data-testid="festival-events-box"
				className="relative z-[49] rounded-xl bg-grayDark lg:mx-32"
			>
				<div className="flex flex-col gap-3 p-3 lg:flex-row lg:items-center lg:justify-between">
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => handleYearChange(-1)}
							className="rounded-md bg-dark p-1 text-primary"
							aria-label={tFestivalEvents('previousYear')}
						>
							<NewArrowRightSimple
								theme={{ stroke: 'var(--color-primary)' }}
								className="h-5 w-5 rotate-180"
							/>
						</button>
						<h3 className="-rotate-3 rounded-md bg-grayDark px-2 text-xl font-semibold tracking-tight text-dark lg:rounded-xl lg:border-[3px] lg:border-dark lg:text-2xl">
							{selectedYear}
						</h3>
						<button
							type="button"
							onClick={() => handleYearChange(1)}
							className="rounded-md bg-dark p-1 text-primary"
							aria-label={tFestivalEvents('nextYear')}
						>
							<NewArrowRightSimple
								theme={{ stroke: 'var(--color-primary)' }}
								className="h-5 w-5"
							/>
						</button>
					</div>

					<div className="flex w-fit rounded-lg bg-dark p-1">
						<button
							data-testid="festival-events-grid-toggle"
							type="button"
							onClick={() => handleViewModeChange('calendar')}
							className={`rounded px-3 py-1 text-sm font-semibold transition-colors ${
								viewMode === 'calendar'
									? 'bg-primary text-dark'
									: 'text-grayDark'
							}`}
						>
							{tFestivalEvents('gridView')}
						</button>
						<button
							data-testid="festival-events-list-toggle"
							type="button"
							onClick={() => handleViewModeChange('list')}
							className={`rounded px-3 py-1 text-sm font-semibold transition-colors ${
								viewMode === 'list' ? 'bg-primary text-dark' : 'text-grayDark'
							}`}
						>
							{tFestivalEvents('listView')}
						</button>
					</div>
				</div>

				<AnimatePresence mode="wait">
					{viewMode === 'calendar' ? (
						<LayoutGroup id={`festival-events-calendar-${selectedYear}`}>
							<div className="px-3 pb-2">
								<div
									data-testid="festival-calendar-stage"
									className="h-[101.5rem] sm:h-[50.5rem] lg:h-[33.5rem] xl:h-[25rem]"
								>
									<AnimatePresence initial={false} mode="popLayout">
										{expandedEvent && expandedMonthGroup ? (
											renderExpandedEventDetails(true)
										) : (
											<motion.div
												key={`calendar-${selectedYear}`}
												initial={
													isCalendarLayoutHandoff
														? { opacity: 1, y: 0 }
														: { opacity: 0, y: 12 }
												}
												animate={{ opacity: 1, y: 0 }}
												exit={
													isCalendarLayoutHandoff
														? { opacity: 1, y: 0 }
														: { opacity: 0, y: -12 }
												}
												transition={{
													opacity: { duration: 0.25 },
													y: { duration: 0.25 },
												}}
												className="grid h-full auto-rows-fr grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
											>
												{monthGroups.map((monthGroup) => {
													const isTransitionSelected =
														transitionMonthKey === monthGroup.key
													const isFadingOut =
														Boolean(transitionMonthKey) && !isTransitionSelected

													return (
														<motion.div
															data-testid="festival-month-card"
															key={monthGroup.key}
															layout
															layoutId={`month-card-${monthGroup.key}`}
															style={{ borderRadius: EVENT_CARD_RADIUS }}
															className={`min-h-0 overflow-hidden rounded-lg p-3 ${
																monthGroup.events.length > 0
																	? 'bg-dark'
																	: 'border-2 border-dark bg-grayDark'
															}`}
															initial={{ opacity: isFadingOut ? 0 : 1 }}
															animate={{ opacity: isFadingOut ? 0 : 1 }}
															transition={{
																layout: {
																	duration: EVENT_CARD_LAYOUT_MS / 1000,
																	ease: EVENT_CARD_EASE,
																},
																opacity: {
																	duration: isFadingOut
																		? EVENT_MONTH_FADE_MS / 1000
																		: 0.2,
																	ease: EVENT_CARD_EASE,
																},
															}}
														>
															<motion.div
																data-testid="festival-month-card-content"
																initial={{
																	opacity: isTransitionSelected ? 0 : 1,
																}}
																animate={{
																	opacity: isTransitionSelected ? 0 : 1,
																	pointerEvents: isTransitionSelected
																		? 'none'
																		: 'auto',
																}}
																transition={{
																	duration: EVENT_CONTENT_FADE_MS / 1000,
																	ease: EVENT_CARD_EASE,
																}}
															>
																<div className="flex items-start justify-between gap-2">
																	<div className="flex items-center gap-2">
																		<h4
																			data-testid="festival-month-title"
																			className={`text-sm font-semibold capitalize leading-none tracking-tight ${
																				monthGroup.events.length > 0
																					? 'text-primary'
																					: 'text-dark'
																			}`}
																		>
																			{monthGroup.label}
																		</h4>
																		{monthGroup.events.length > 0 && (
																			<span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-2 text-xs font-bold leading-none text-dark">
																				{monthGroup.events.length}
																			</span>
																		)}
																	</div>
																</div>

																{monthGroup.events.length > 0 && (
																	<div className="mt-4 space-y-1">
																		{monthGroup.events
																			.slice(0, 2)
																			.map((event, index) => (
																				<button
																					data-testid="festival-event-preview"
																					key={
																						event._id ??
																						`${monthGroup.key}-preview-${index}`
																					}
																					type="button"
																					disabled={isEventTransitioning}
																					onClick={() =>
																						openEventDetails(event, monthGroup)
																					}
																					className="block w-full rounded-md bg-grayDark px-2 py-1 text-left text-sm font-semibold leading-tight text-dark transition-opacity hover:opacity-80 disabled:pointer-events-none"
																				>
																					{getLocalizedValue(
																						event.title,
																						language,
																					)}
																				</button>
																			))}
																		{monthGroup.events.length > 2 && (
																			<p className="text-sm font-semibold text-primary">
																				{tFestivalEvents('moreEvents', {
																					count: monthGroup.events.length - 2,
																				})}
																			</p>
																		)}
																	</div>
																)}
															</motion.div>
														</motion.div>
													)
												})}
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</div>
						</LayoutGroup>
					) : (
						<LayoutGroup id={`festival-events-list-${selectedYear}`}>
							<div className="px-3 pb-2">
								<AnimatePresence initial={false} mode="wait">
									{expandedEvent && expandedMonthGroup ? (
										renderExpandedEventDetails()
									) : (
										<motion.div
											key={`list-${selectedYear}`}
											initial={{ opacity: 0, y: 12 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -12 }}
											transition={{ duration: 0.25 }}
											className="space-y-6"
										>
											{monthsWithEvents.length > 0 ? (
												monthsWithEvents.map((monthGroup) => (
													<section key={monthGroup.key} className="space-y-2">
														<h4 className="border-b border-dark pb-1 text-left text-sm font-semibold uppercase tracking-wide text-dark">
															{monthGroup.label}
														</h4>

														<div className="divide-y divide-dark">
															{monthGroup.events.map((event, index) => (
																<motion.button
																	key={
																		event._id ?? `${monthGroup.key}-${index}`
																	}
																	type="button"
																	onClick={() =>
																		openEventDetails(event, monthGroup)
																	}
																	className="grid w-full gap-2 py-3 text-left transition-opacity hover:opacity-80 lg:grid-cols-[minmax(12rem,18rem)_7rem_1fr]"
																	whileHover={{ x: 4 }}
																	whileTap={{ scale: 0.99 }}
																>
																	<span className="text-sm font-semibold text-dark">
																		{formatDateRange(event, language)}
																	</span>
																	<span className="text-sm text-dark">
																		{formatTimeRange(event, language)}
																	</span>
																	<span>
																		<span className="block text-base font-semibold leading-tight text-dark">
																			{getLocalizedValue(event.title, language)}
																		</span>
																		{event.location && (
																			<span className="mt-1 block text-sm text-dark/70">
																				{event.location}
																			</span>
																		)}
																	</span>
																</motion.button>
															))}
														</div>
													</section>
												))
											) : (
												<div className="py-8 text-center text-lg tracking-tight text-dark">
													{tFestivalEvents('noEvents', { year: selectedYear })}
												</div>
											)}
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</LayoutGroup>
					)}
				</AnimatePresence>
			</div>
		</>
	)
}

const VisionBlock: React.FC<BlockProps> = ({ block, index, language }) => {
	const getLocalizedValue = useLocalizedValue()
	const tFestivalEvents = useTranslations('festivalEvents')

	if (!block.show) return null

	return (
		<AccordionItem
			value={`vision-${index}`}
			className="relative flex flex-col items-center justify-center"
		>
			<AccordionTrigger className="-rotate-3 lg:text-5xl">
				{getLocalizedValue(block.visionTitle, language) ||
					tFestivalEvents('visionFallback')}
			</AccordionTrigger>
			<AccordionContent>
				<div className="mb-4 pt-2">
					{block.vision?.map((visionItem: any, vIndex: number) => (
						<motion.div
							key={vIndex}
							className="mt-4 first:-mt-2"
							// initial={{ opacity: 0, x: -20 }}
							// animate={{ opacity: 1, x: 0 }}
							// transition={{ duration: 0.5, delay: vIndex * 0.2 }}
						>
							<div className="relative mb-8 flex flex-col items-center rounded-t-3xl px-4">
								{/* <h3 className="-z-10 -mt-0 inline-block -rotate-0 rounded-md border-2 border-dark bg-primary px-2 py-0 text-center text-base font-medium tracking-tight text-dark lg:z-0 lg:mx-20 lg:mb-2 lg:text-lg">
									{getLocalizedValue(visionItem.title, language)}
								</h3> */}

								<>
									{splitTitle(
										getLocalizedValue(visionItem.title, language),
										30,
									).map((line, idx) => (
										<h1
											key={idx}
											className={[
												'-z-10 -mt-0 inline-block -rotate-0 rounded-md border-2 border-dark bg-primary px-2 py-0 text-center text-base font-medium tracking-tight text-dark lg:z-0 lg:mx-20 lg:mb-2 lg:text-lg',
												idx === 0 ? '' : '-z-0 -mt-1',
												idx % 2 === 0
													? '-rotate-1 lg:-rotate-3'
													: 'rotate-1 lg:rotate-3',
											].join(' ')}
										>
											{line}
										</h1>
									))}
								</>
								<p className="mx-auto -mt-2 py-2 text-base font-normal leading-[1.2] tracking-tight text-primary lg:px-32 lg:text-xl">
									{getLocalizedValue(visionItem.text, language) ||
										tFestivalEvents('noDescription')}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</AccordionContent>
		</AccordionItem>
	)
}

// Custom Text Block Component
const CustomTextBlock: React.FC<BlockProps> = ({ block, index, language }) => {
	if (!block.show) return null

	return (
		<AccordionItem
			value={`custom-${index}`}
			className="flex flex-col items-center justify-center hover:relative hover:z-50"
		>
			<AccordionTrigger className="-mb-0 rotate-3 lg:text-5xl">
				{block.title}
			</AccordionTrigger>
			<AccordionContent>
				<div className="px-2 pb-0 pt-4 text-base leading-[1.2] tracking-tight text-primary lg:mx-16 lg:rounded-md lg:pb-8 lg:pt-8 lg:text-xl lg:leading-[1.5rem] lg:text-primary">
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
				className="relative border-2 border-dark bg-primary px-4 py-10 shadow-sm lg:hidden lg:border-0 lg:py-10"
			>
				{paragraphs.map((paragraph: string, i: number) => (
					<p
						key={i}
						className="mx-auto py-2 text-center text-xl font-bold leading-[1.2] tracking-tight text-dark lg:py-4 lg:text-3xl"
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
									<LogoShortTsx className="mr-[0.10rem] inline-block h-auto w-[9rem] -rotate-6 rounded-md bg-dark px-2 py-1 text-primary lg:w-[15rem]" />
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
	const tFestivalEvents = useTranslations('festivalEvents')
	const teaserRef = useRef<HTMLDivElement>(null)
	const [overlayMode, setOverlayMode] = useState<
		'opening' | 'open' | 'closing' | null
	>(null)
	const [videoFrame, setVideoFrame] = useState<VideoRect | null>(null)
	const [hasFrameTransition, setHasFrameTransition] = useState(false)
	const isOverlayActive = overlayMode !== null

	const getTeaserRect = () => {
		const rect = teaserRef.current?.getBoundingClientRect()
		if (!rect) return null

		return {
			height: rect.height,
			left: rect.left,
			top: rect.top,
			width: rect.width,
		}
	}

	const getFixedOffset = () => {
		if (!teaserRef.current) return { left: 0, top: 0 }

		const probe = document.createElement('div')
		probe.style.position = 'fixed'
		probe.style.left = '0'
		probe.style.top = '0'
		probe.style.width = '1px'
		probe.style.height = '1px'
		probe.style.pointerEvents = 'none'
		probe.style.visibility = 'hidden'
		teaserRef.current.appendChild(probe)
		const rect = probe.getBoundingClientRect()
		probe.remove()

		return {
			left: rect.left,
			top: rect.top,
		}
	}

	const toFixedRect = (rect: VideoRect): VideoRect => {
		const offset = getFixedOffset()

		return {
			height: rect.height,
			left: rect.left - offset.left,
			top: rect.top - offset.top,
			width: rect.width,
		}
	}

	const getFullscreenRect = (): VideoRect => {
		const offset = getFixedOffset()

		return {
			height: window.innerHeight,
			left: -offset.left,
			top: -offset.top,
			width: window.innerWidth,
		}
	}

	const handleVideoClick = () => {
		if (isOverlayActive) return

		const rect = getTeaserRect()
		if (!rect) return

		const fixedRect = toFixedRect(rect)

		setVideoFrame(fixedRect)
		setHasFrameTransition(false)
		setOverlayMode('opening')
		window.requestAnimationFrame(() => {
			window.requestAnimationFrame(() => {
				setHasFrameTransition(true)
				setVideoFrame(getFullscreenRect())
			})
		})
	}

	const handleCloseFullscreen = (e: React.MouseEvent) => {
		e.stopPropagation()
		const rect = getTeaserRect()

		if (!rect) return

		setHasFrameTransition(true)
		setVideoFrame(toFixedRect(rect))
		setOverlayMode('closing')
	}

	const handleFrameTransitionEnd = (
		event: React.TransitionEvent<HTMLDivElement>,
	) => {
		if (
			event.target !== event.currentTarget ||
			event.propertyName !== 'width'
		) {
			return
		}

		if (overlayMode === 'opening') {
			setOverlayMode('open')
			return
		}

		if (overlayMode === 'closing') {
			setOverlayMode(null)
			setVideoFrame(null)
			setHasFrameTransition(false)
		}
	}

	return (
		<>
			<div
				ref={teaserRef}
				data-testid="festival-video-teaser"
				className={`lg:rounded-0xl relative mx-0 h-[65vh] w-full cursor-pointer rounded-lg pb-10 pt-2 lg:h-full lg:p-0 ${
					isOverlayActive ? 'overflow-visible' : 'overflow-hidden'
				}`}
				onClick={handleVideoClick}
			>
				<div
					data-testid={isOverlayActive ? 'festival-video-overlay' : undefined}
					className={`overflow-hidden bg-dark ${
						isOverlayActive ? 'fixed z-[70]' : 'relative h-full w-full'
					}`}
					style={
						isOverlayActive && videoFrame
							? {
									borderRadius:
										overlayMode === 'closing' || !hasFrameTransition ? 24 : 0,
									height: videoFrame.height,
									left: videoFrame.left,
									top: videoFrame.top,
									transition: hasFrameTransition
										? MEDIA_TEASER_TRANSITION
										: 'none',
									width: videoFrame.width,
								}
							: {
									borderRadius: 24,
									transition: 'none',
								}
					}
					onTransitionEnd={handleFrameTransitionEnd}
				>
					<video
						className="h-full w-full transform rounded-none border-0 object-cover"
						autoPlay
						muted
						loop
						playsInline
					>
						<source src="/assets/videos/teaser2.mp4" type="video/mp4" />
						{tFestivalEvents('videoUnsupported')}
					</video>

					{isOverlayActive && (
						<>
							<div className="pointer-events-none absolute left-4 top-4 z-30 h-8 w-8 border-l-[2px] border-t-[2px] border-[#fff] mix-blend-overlay" />
							<div className="pointer-events-none absolute right-4 top-4 z-30 h-8 w-8 border-r-[2px] border-t-[2px] border-[#fff] mix-blend-overlay" />
							<div className="pointer-events-none absolute bottom-4 left-4 z-30 h-8 w-8 border-b-[2px] border-l-[2px] border-[#fff] mix-blend-overlay" />
							<div className="pointer-events-none absolute bottom-4 right-4 z-30 h-8 w-8 border-b-[2px] border-r-[2px] border-[#fff] mix-blend-overlay" />
						</>
					)}

					{!isOverlayActive && (
						<motion.button
							data-testid="festival-video-expand"
							type="button"
							onClick={(event) => {
								event.stopPropagation()
								handleVideoClick()
							}}
							className="absolute bottom-8 right-8 z-10 flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border-2 border-primary bg-dark/90 text-primary shadow-md backdrop-blur transition-colors hover:bg-primary hover:text-dark focus:outline-none"
							aria-label={tFestivalEvents('expandVideo')}
							initial={{ opacity: 0, scale: 0.8, y: 8 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							whileHover={{ scale: 1.06 }}
							transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
						>
							<Maximize2 aria-hidden="true" className="h-5 w-5" />
						</motion.button>
					)}

					{overlayMode === 'open' && (
						<motion.button
							data-testid="festival-video-close"
							type="button"
							onClick={handleCloseFullscreen}
							className="absolute bottom-8 right-8 z-40 flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border-2 border-primary bg-dark/90 text-primary shadow-md backdrop-blur transition-colors hover:bg-primary hover:text-dark focus:outline-none"
							aria-label={tFestivalEvents('closeVideo')}
							initial={{ opacity: 0, scale: 0.8, y: 8 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							whileHover={{ scale: 1.06 }}
							transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
						>
							<Minimize2 aria-hidden="true" className="h-5 w-5" />
						</motion.button>
					)}
				</div>
			</div>
		</>
	)
}

const JuryBlock: React.FC<BlockProps> = ({ block, index, language }) => {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [isVisible, setIsVisible] = useState(false)
	const [isOpen, setIsOpen] = useState(false) // track accordion open state
	const juryRef = useRef<HTMLDivElement>(null)
	const getLocalizedValue = useLocalizedValue()

	const members = block.juryMembers || []
	const total = members.length
	const currentMember = members[currentIndex]

	const goPrev = () => setCurrentIndex((prev) => (prev - 1 + total) % total)
	const goNext = () => setCurrentIndex((prev) => (prev + 1) % total)

	// Observe visibility only when open
	useEffect(() => {
		if (!isOpen || !juryRef.current) {
			setIsVisible(false)
			return
		}

		const observer = new IntersectionObserver(
			([entry]) => setIsVisible(entry.isIntersecting),
			{ threshold: 0.2 },
		)

		observer.observe(juryRef.current)
		return () => observer.disconnect()
	}, [isOpen])

	if (!block.show || !currentMember) return null

	return (
		<AccordionItem
			value={`jury-${index}`}
			className="flex flex-col items-center justify-center"
		>
			<AccordionTrigger
				className="-rotate-6 lg:text-5xl"
				onClick={() => setIsOpen((prev) => !prev)}
			>
				Jury
			</AccordionTrigger>

			<AccordionContent>
				<div
					ref={juryRef}
					className="relative flex w-full flex-col items-center justify-center pt-4 lg:flex-row lg:items-stretch lg:justify-center lg:gap-8 lg:px-32 lg:py-8"
				>
					{/* Desktop arrows */}
					<button
						onClick={goPrev}
						className={`absolute left-2 top-24 hidden transition-opacity duration-300 lg:left-12 lg:top-1/2 lg:block ${
							isVisible && isOpen
								? 'opacity-100'
								: 'pointer-events-none opacity-0'
						}`}
					>
						<NewArrowRightSimple
							theme={{ stroke: 'var(--color-dark)' }}
							className="h-[2.35rem] w-[2.35rem] -rotate-180 rounded-lg bg-grayDark p-2 lg:w-7"
						/>
					</button>

					<button
						onClick={goNext}
						className={`absolute right-2 top-24 hidden transition-opacity duration-300 lg:right-12 lg:top-1/2 lg:block ${
							isVisible && isOpen
								? 'opacity-100'
								: 'pointer-events-none opacity-0'
						}`}
					>
						<NewArrowRightSimple
							theme={{ stroke: 'var(--color-dark)' }}
							className="h-[2.35rem] w-[2.35rem] rounded-lg bg-grayDark p-2 lg:w-7"
						/>
					</button>

					{/* Member content */}
					<div className="flex flex-col items-center">
						<Img
							image={currentMember.image}
							src={currentMember.image?.asset.url}
							alt={currentMember.name}
							className="aspect-video w-full rounded-lg border-[3px] border-primary object-cover lg:h-80 lg:w-56 lg:border-4"
						/>
						<h2 className="z-10 -mt-4 inline-block w-auto -rotate-3 rounded-md border-0 border-dark bg-primary px-2 py-0 text-center text-xl font-medium tracking-tighter text-dark lg:text-2xl">
							{currentMember.name}
						</h2>
					</div>

					<div className="mt-6 flex flex-1 flex-col items-center lg:mt-0 lg:items-start lg:text-left">
						{currentMember.biography && (
							<p className="mb-4 text-base font-normal leading-[1.2] tracking-tight text-primary lg:text-xl lg:leading-[1.5rem]">
								{getLocalizedValue(currentMember.biography, language)}
							</p>
						)}
					</div>
				</div>
			</AccordionContent>

			<div
				className={`fixed bottom-0 left-0 right-0 z-40 mb-4 flex justify-between px-8 transition-opacity duration-300 lg:hidden ${
					isVisible && isOpen
						? 'pointer-events-auto opacity-100'
						: 'pointer-events-none opacity-0'
				}`}
			>
				<button onClick={goPrev} className="pointer-events-auto">
					<NewArrowRightSimple
						theme={{ stroke: 'var(--color-dark)' }}
						className="h-[2.5rem] w-[2.5rem] -rotate-180 rounded-lg border-2 border-dark bg-grayDark p-2"
					/>
				</button>
				<button onClick={goNext} className="pointer-events-auto">
					<NewArrowRightSimple
						theme={{ stroke: 'var(--color-dark)' }}
						className="h-[2.5rem] w-[2.5rem] rounded-lg border-2 border-dark bg-grayDark p-2"
					/>
				</button>
			</div>
		</AccordionItem>
	)
}

const EventsBlock: React.FC<BlockProps> = ({ block, index, language }) => {
	const getLocalizedValue = useLocalizedValue()
	const tFestivalEvents = useTranslations('festivalEvents')

	if (!block.show) return null

	return (
		<AccordionItem
			value={`events-${index}`}
			className="flex flex-col items-center justify-center"
		>
			<AccordionTrigger className="rotate-6 lg:text-5xl">
				{tFestivalEvents('title')}
			</AccordionTrigger>
			<AccordionContent className="relative w-full">
				<div className="relative mt-4 w-full">
					<AnnualEventsList
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
	const tFestivalEvents = useTranslations('festivalEvents')
	const handleAccordionValueChange = () => {
		const navbar = document.getElementById('navbar-mobile')
		if (navbar) {
			navbar.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
	}

	if (!festival) {
		return <div>{tFestivalEvents('noContent')}</div>
	}

	// Setup sparkle image for snowfall
	// const sparkleImg = new window.Image()
	// sparkleImg.src = '/assets/svg/SparkleSnow2.svg'

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
				return <EventsBlock key={`events-${index}`} {...blockProps} />
			case 'visionBlock':
				return <VisionBlock key={`vision-${index}`} {...blockProps} />

			default:
				return null
		}
	}

	return (
		<div
			key={festival._id}
			className="no-scrollbar relative flex h-full w-full flex-col gap-1 p-2 px-4 pb-16 lg:mt-1 lg:grid lg:h-[calc(100svh-10px)] lg:grid-rows-[auto_minmax(12rem,1fr)] lg:overflow-hidden lg:p-0"
		>
			<div className="fixed bottom-0 right-0 z-50 mb-4 flex items-center justify-end px-8 lg:hidden">
				<BackToTopButton targetId="navbar-mobile" />
			</div>
			{/* <Snowfall
				snowflakeCount={15}
				speed={[0.2, 0.5]}
				wind={[0, 0]}
				radius={[10, 40]}
				rotationSpeed={[0.2, 0.5]}
				images={[sparkleImg]}
				style={{ zIndex: 48 }}
			/> */}
			<div
				id="festival-content"
				data-testid="festival-accordion-area"
				className="lg:shadowtest relative z-10 shrink-0 rounded-md border-primary lg:min-h-0 lg:overflow-visible lg:rounded-xl lg:border-[0px] lg:bg-dark"
			>
				<SparkleEffect
					count={15}
					colors={[
						{ fill: 'var(--color-primary)' },
						// { fill: 'var(--color-dark)', stroke: 'var(--color-primary)' },
					]}
					size={[30, 40]}
					speed={[15, 25]}
					wind={[-50, 50]}
				/>
				{/* Accordion Items */}
				<Accordion
					type="single"
					collapsible
					onValueChange={handleAccordionValueChange}
					// className="lg:rounded-md lg:bg-dark lg:bg-gradient-to-t lg:from-grayDark lg:py-16 lg:shadow-inner"
					className="lg:rounded-lg lg:border-0 lg:border-primary lg:bg-transparent lg:py-16"
				>
					{accordionBlocks?.map(renderBlock)}
				</Accordion>
			</div>
			{/* Media Teaser Blocks - Outside of Accordion content area */}
			{mediaTeaserBlocks?.length ? (
				<div
					data-testid="festival-video-area"
					className="relative z-10 min-h-[18rem] flex-1 lg:min-h-0 lg:overflow-visible"
				>
					{mediaTeaserBlocks.map((block: any, index: number) => (
						<MediaTeaserBlock
							key={`media-${index}`}
							block={block}
							index={index}
							language={language}
						/>
					))}
				</div>
			) : null}
		</div>
	)
}

export default FestivalContent

function splitTitle(title: string, maxLength = 18) {
	const result = []
	let str = title

	while (str.length > maxLength) {
		let idx = str.lastIndexOf(' ', maxLength)
		if (idx === -1) idx = maxLength // no space found, hard cut
		result.push(str.slice(0, idx).trim())
		str = str.slice(idx).trim()
	}
	if (str.length) result.push(str)
	return result
}
