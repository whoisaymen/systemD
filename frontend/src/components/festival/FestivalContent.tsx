'use client'

import { useState, useEffect, useEffectEvent, useMemo, useRef } from 'react'
import {
	motion,
	useScroll,
	useTransform,
	AnimatePresence,
	LayoutGroup,
} from 'motion/react'
import RichText from '@/components/common/RichText'
import {
	EDITORIAL_BODY_TEXT as FESTIVAL_BODY_TEXT,
	EDITORIAL_COPY_WIDTH as FESTIVAL_COPY_WIDTH,
	EDITORIAL_DESKTOP_TAB_STYLE,
} from '@/components/common/editorialStyles'
import {
	combineRichText,
	localizedRichText,
	richTextToPlainText,
} from '@/lib/richText'
import { Maximize2, Minimize2, X } from 'lucide-react'
import ReactPlayer from 'react-player'
import { useTranslations } from 'next-intl'

import Img, { getImageDimensions } from '@/ui/Img'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import BackToTopButton from '../common/BackToTop'
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
	title: Array<{ _key?: string; language?: string; value: any }>
	eventType?: {
		_id?: string
		title?: Array<{ _key?: string; language?: string; value: any }>
	} | null
	location?: any
	visual?: Sanity.Image
	isMock?: boolean
	description?: Array<{ _key?: string; language?: string; value: any }>
	pressLink?: string
}

interface EventsListProps {
	events: Event[]
	language: string
}

interface EventMonthGroup {
	key: string
	month: number
	label: string
	events: Event[]
}

type EventDetailSelection = {
	event: Event | null
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
const EVENT_MONTH_FADE_MS = 180
const EVENT_CONTENT_FADE_MS = 160
const EVENT_CONTENT_DELAY_MS = 100
const EVENT_CARD_LAYOUT_MS = 340
const EVENT_CARD_RADIUS = 8
const CALENDAR_ARROW_BUTTON =
	'flex h-7 w-7 shrink-0 items-center justify-center text-primary transition-opacity hover:opacity-60 lg:h-5 lg:w-5'
const FESTIVAL_TITLE_SIZE =
	'text-4xl lg:text-[clamp(1rem,2.17cqw,1.5rem)]'
const FESTIVAL_TITLE_STYLE =
	`${FESTIVAL_TITLE_SIZE} rounded-md border-[3px] px-2 pr-4 text-center font-bold uppercase italic tracking-tighter shadow-sm ${EDITORIAL_DESKTOP_TAB_STYLE}`

const FestivalEventTitle: React.FC<{ title: any }> = ({ title }) => {
	const containerRef = useRef<HTMLSpanElement>(null)
	const trackRef = useRef<HTMLSpanElement>(null)
	const [isOverflowing, setIsOverflowing] = useState(false)

	useEffect(() => {
		const container = containerRef.current
		const track = trackRef.current
		if (!container || !track) return

		const measure = () => {
			const distance = Math.max(0, track.scrollWidth - container.clientWidth)
			setIsOverflowing(distance > 1)
			container.style.setProperty(
				'--festival-event-marquee-distance',
				`${distance}px`,
			)
			container.style.setProperty(
				'--festival-event-marquee-duration',
				`${Math.max(3, distance / 28 + 1.5)}s`,
			)
		}

		measure()
		const observer = new ResizeObserver(measure)
		observer.observe(container)
		document.fonts?.ready.then(measure)

		return () => observer.disconnect()
	}, [title])

	return (
		<span
			ref={containerRef}
			className="relative block min-w-0 overflow-hidden whitespace-nowrap"
		>
			<span
				className="theme-festival-event-title-static block truncate"
				data-overflow={isOverflowing}
			>
				<RichText value={title} inline allowLinks={false} />
			</span>
			<span
				ref={trackRef}
				aria-hidden="true"
				data-overflow={isOverflowing}
				className="theme-festival-event-title-marquee pointer-events-none absolute left-0 top-0 block w-max whitespace-nowrap opacity-0"
			>
				<RichText value={title} inline allowLinks={false} />
			</span>
		</span>
	)
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

const eventOverlapsMonth = (event: Event, year: number, month: number) => {
	const start = getValidDate(event.date)
	const end = getEventEndDate(event)

	if (!start || !end) return false

	const monthStart = new Date(year, month, 1)
	const nextMonthStart = new Date(year, month + 1, 1)

	return start < nextMonthStart && end >= monthStart
}

const eventOccursOnDay = (event: Event, day: Date) => {
	const start = getValidDate(event.date)
	const end = getEventEndDate(event)

	if (!start || !end) return false

	const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate())
	const nextDayStart = new Date(
		day.getFullYear(),
		day.getMonth(),
		day.getDate() + 1,
	)

	return start < nextDayStart && end >= dayStart
}

const getCalendarDays = (year: number, month: number) => {
	const firstDay = new Date(year, month, 1)
	const mondayOffset = (firstDay.getDay() + 6) % 7
	const numberOfDays = new Date(year, month + 1, 0).getDate()

	return [
		...Array.from({ length: mondayOffset }, () => null),
		...Array.from(
			{ length: numberOfDays },
			(_, index) => new Date(year, month, index + 1),
		),
	]
}

const getWeekdayLabels = (language: string) =>
	Array.from({ length: 7 }, (_, index) =>
		new Date(2024, 0, index + 1).toLocaleDateString(language, {
			weekday: 'narrow',
		}),
	)

const getEventDayLabel = (event: Event) => {
	const start = getValidDate(event.date)
	const end = getEventEndDate(event)

	if (!start) return '--'
	if (!end || isSameCalendarDay(start, end)) {
		return String(start.getDate())
	}

	return `${start.getDate()}-${end.getDate()}`
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
		events: events.filter((event) => eventOverlapsMonth(event, year, month)),
	}))

const AnnualEventsList: React.FC<EventsListProps> = ({ events, language }) => {
	const tFestivalEvents = useTranslations('festivalEvents')
	const [selectedYear, setSelectedYear] = useState(() =>
		getInitialEventYear(events),
	)
	const [selectedDay, setSelectedDay] = useState<Date | null>(null)
	const [expandedEvent, setExpandedEvent] =
		useState<EventDetailSelection | null>(null)
	const [openingEvent, setOpeningEvent] = useState<EventDetailSelection | null>(
		null,
	)
	const [closingEvent, setClosingEvent] = useState<EventDetailSelection | null>(
		null,
	)
	const [detailContentVisible, setDetailContentVisible] = useState(false)
	const expandedEventRef = useRef<EventDetailSelection | null>(null)
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
	const selectedEvent = expandedEvent?.event ?? null
	const selectedImageDimensions = selectedEvent?.visual
		? getImageDimensions(selectedEvent.visual)
		: undefined
	const isPortraitImage = selectedImageDimensions
		? selectedImageDimensions.height > selectedImageDimensions.width
		: false
	const selectedEventType = richTextToPlainText(
		localizedRichText(selectedEvent?.eventType?.title, language),
	).trim()
	const expandedMonthGroup = expandedEvent?.monthGroup ?? null
	const selectedDescription = selectedEvent
		? localizedRichText(selectedEvent.description, language)
		: ''
	const openingMonthKey = openingEvent?.monthGroup.key ?? null
	const closingMonthKey = closingEvent?.monthGroup.key ?? null
	const transitionMonthKey = openingMonthKey ?? closingMonthKey
	const isEventTransitioning = Boolean(openingEvent || closingEvent)
	const isCalendarLayoutHandoff = Boolean(openingEvent || closingEvent)
	const weekdayLabels = useMemo(() => getWeekdayLabels(language), [language])

	useEffect(() => {
		expandedEventRef.current = expandedEvent
	}, [expandedEvent])

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
		setSelectedDay(null)
		setOpeningEvent(null)
		setClosingEvent(null)
		setExpandedEvent(null)
		setDetailContentVisible(false)
	}

	const animateCloseEventDetails = (selection: EventDetailSelection) => {
		clearEventTransitionTimer()
		clearEventContentTimer()
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

	const closeEventDetails = () => {
		const selection = expandedEventRef.current

		if (!selection) return
		animateCloseEventDetails(selection)
	}

	const closeEventDetailsOnEscape = useEffectEvent(() => closeEventDetails())

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && expandedEventRef.current) {
				closeEventDetailsOnEscape()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	const getDefaultEvent = (monthGroup: EventMonthGroup) => {
		if (monthGroup.events.length <= 1) return monthGroup.events[0] ?? null

		const now = new Date()
		return (
			monthGroup.events.find((event) => {
				const end = getEventEndDate(event)
				return end ? end >= now : false
			}) ?? monthGroup.events[0]
		)
	}

	const selectEvent = (event: Event) => {
		if (!expandedMonthGroup) return
		setExpandedEvent({ event, monthGroup: expandedMonthGroup })
	}

	const openMonth = (monthGroup: EventMonthGroup, event?: Event) => {
		setSelectedDay(null)
		if (expandedEvent?.monthGroup.key === monthGroup.key) {
			setExpandedEvent({
				event: event ?? getDefaultEvent(monthGroup),
				monthGroup,
			})
			return
		}

		clearEventTransitionTimer()
		clearEventContentTimer()

		setExpandedEvent(null)
		setClosingEvent(null)
		setDetailContentVisible(false)
		const resolvedSelection = {
			event: event ?? getDefaultEvent(monthGroup),
			monthGroup,
		}
		setOpeningEvent(resolvedSelection)
		eventTransitionTimerRef.current = setTimeout(() => {
			setOpeningEvent(null)
			setExpandedEvent(resolvedSelection)
			eventTransitionTimerRef.current = null
			eventContentTimerRef.current = setTimeout(() => {
				setDetailContentVisible(true)
				eventContentTimerRef.current = null
			}, EVENT_CONTENT_DELAY_MS)
		}, EVENT_MONTH_FADE_MS)
	}

	const handleYearChange = (direction: -1 | 1) => {
		resetEventDetails()
		setSelectedYear((year) => year + direction)
	}

	const handleMonthChange = (direction: -1 | 1) => {
		if (!expandedMonthGroup) return
		setSelectedDay(null)

		const targetDate = new Date(
			selectedYear,
			expandedMonthGroup.month + direction,
			1,
		)
		const targetYear = targetDate.getFullYear()
		const targetMonth = targetDate.getMonth()
		const targetYearEvents = getEventsForYear(events, targetYear)
		const targetMonthGroup = groupEventsByMonth(
			targetYearEvents,
			targetYear,
			language,
		)[targetMonth]

		setSelectedYear(targetYear)
		setExpandedEvent({
			event: getDefaultEvent(targetMonthGroup),
			monthGroup: targetMonthGroup,
		})
		setDetailContentVisible(true)
	}

	const getEventCountLabel = (count: number) =>
		`${count} ${tFestivalEvents(
			count === 1 ? 'eventSingular' : 'eventPlural',
		)}`

	const renderMonthEventList = () => {
		if (!expandedMonthGroup) return null
		const visibleEvents = selectedDay
			? expandedMonthGroup.events.filter((event) => eventOccursOnDay(event, selectedDay))
			: expandedMonthGroup.events

		if (expandedMonthGroup.events.length === 0) {
			return (
				<p className="pt-4 text-sm font-semibold uppercase tracking-wide text-primary/65">
					{tFestivalEvents('noEventsScheduled')}
				</p>
			)
		}

		return (
			<div className="space-y-1 pt-2 lg:pr-1">
				{selectedDay && (
					<div className="grid grid-cols-7 items-center gap-y-1 pb-1 text-xs leading-tight">
						<h4 className="col-span-6 font-semibold" aria-live="polite">
							{selectedDay.toLocaleDateString(language, {
								weekday: 'short',
								day: 'numeric',
								month: 'short',
							})}
						</h4>
						<button
							type="button"
							onClick={() => setSelectedDay(null)}
							className="justify-self-center font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
						>
							{tFestivalEvents('allEvents')}
						</button>
					</div>
				)}
				{visibleEvents.map((event, index) => {
					const start = getValidDate(event.date)
					const isActive =
						event._id && selectedEvent?._id
							? event._id === selectedEvent._id
							: event === selectedEvent

					return (
						<button
							key={event._id ?? `${expandedMonthGroup.key}-detail-${index}`}
							type="button"
							aria-pressed={Boolean(isActive)}
							onClick={() => selectEvent(event)}
							className={`theme-festival-month-event group flex w-full items-center gap-1 rounded border border-transparent p-1 text-left text-xs font-semibold normal-case leading-tight transition-colors ${
								isActive
									? 'bg-primary text-dark lg:w-[calc(100%+0.25rem)] lg:rounded-r-none lg:pr-2'
									: 'bg-grayDark text-[var(--color-dark)] hover:border-grayDark hover:bg-[var(--color-dark)] hover:text-grayDark'
							}`}
						>
							{start && (
								<time dateTime={start.toISOString()} className="shrink-0 whitespace-nowrap tabular-nums tracking-wide">
									{start.toLocaleTimeString(language, {
										hour: '2-digit',
										minute: '2-digit',
										hourCycle: 'h23',
									})}
								</time>
							)}
							<FestivalEventTitle title={localizedRichText(event.title, language)} />
						</button>
					)
				})}
			</div>
		)
	}

	const renderExpandedMonth = () => {
		if (!expandedEvent || !expandedMonthGroup) return null

		const calendarDays = getCalendarDays(selectedYear, expandedMonthGroup.month)

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
				className="theme-festival-expanded-month relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-lg border-2 border-dark bg-dark text-primary"
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
					<div className="flex items-center justify-between gap-4 bg-dark px-2 py-3">
						<div className="flex min-w-0 items-center gap-2">
							<button
								type="button"
								onClick={() => handleMonthChange(-1)}
								className={CALENDAR_ARROW_BUTTON}
								aria-label={tFestivalEvents('previousMonth')}
							>
								<NewArrowRightSimple
									theme={{ stroke: 'currentColor' }}
									className="h-3.5 w-3.5 rotate-180 lg:h-3 lg:w-3"
								/>
							</button>
							<h3 className="flex min-w-0 items-center gap-1 text-[15px] font-semibold leading-none tracking-tight">
								<span className="truncate capitalize">
									{expandedMonthGroup.label}
								</span>
								{expandedMonthGroup.events.length > 0 && (
									<span
										className="font-normal italic"
										aria-label={getEventCountLabel(
											expandedMonthGroup.events.length,
										)}
									>
										({expandedMonthGroup.events.length})
									</span>
								)}
							</h3>
							<button
								type="button"
								onClick={() => handleMonthChange(1)}
								className={CALENDAR_ARROW_BUTTON}
								aria-label={tFestivalEvents('nextMonth')}
							>
								<NewArrowRightSimple
									theme={{ stroke: 'currentColor' }}
									className="h-3.5 w-3.5 lg:h-3 lg:w-3"
								/>
							</button>
						</div>
						<button
							type="button"
							onClick={closeEventDetails}
							className={CALENDAR_ARROW_BUTTON}
							aria-label={tFestivalEvents('backToYearCalendar')}
							title={tFestivalEvents('backToYearCalendar')}
						>
							<X className="h-3.5 w-3.5" aria-hidden="true" />
						</button>
					</div>

					<div className="grid min-h-0 flex-1 lg:grid-cols-[38%_62%] lg:pr-4">
						<div className="no-scrollbar min-h-0 overflow-y-auto border-b border-primary bg-dark p-4 lg:border-b-0 lg:pr-0 lg:pt-0">
							<div className="mb-5 lg:mr-1">
								<div className="mb-1 grid grid-cols-7 text-center text-[0.65rem] font-bold uppercase text-primary/55">
									{weekdayLabels.map((label, index) => (
										<span key={`${label}-${index}`}>{label}</span>
									))}
								</div>
								<div className="grid grid-cols-7 gap-y-1 text-center text-xs font-semibold">
									{calendarDays.map((day, index) => {
										if (!day) return <span key={`empty-${index}`} />
										const dayEvents = expandedMonthGroup.events.filter(
											(event) => eventOccursOnDay(event, day),
										)
										const isSelected = selectedDay
											? isSameCalendarDay(selectedDay, day)
											: selectedEvent
												? eventOccursOnDay(selectedEvent, day)
												: false
										const dayLabel = `${day.toLocaleDateString(language, {
											weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
										})} · ${getEventCountLabel(dayEvents.length)}`

										return (
											<button
												key={day.toISOString()}
												type="button"
												aria-label={dayLabel}
												aria-pressed={isSelected}
												title={dayLabel}
												disabled={dayEvents.length === 0}
												onClick={() => {
													setSelectedDay(day)
													if (!selectedEvent || !eventOccursOnDay(selectedEvent, day)) {
														selectEvent(dayEvents[0])
													}
												}}
												className={`relative mx-auto flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
													isSelected
														? 'bg-primary text-dark'
														: dayEvents.length > 0
															? 'bg-grayDark text-[var(--color-dark)] hover:bg-primary hover:text-dark'
															: 'text-primary/55'
												}`}
											>
												{day.getDate()}
												{dayEvents.length > 1 && (
													<span aria-hidden="true" className="pointer-events-none absolute bottom-[3px] flex gap-[2px]">
														<span className="h-0.5 w-0.5 rounded-full bg-current" />
														<span className="h-0.5 w-0.5 rounded-full bg-current" />
													</span>
												)}
											</button>
										)
									})}
								</div>
							</div>
							{renderMonthEventList()}
						</div>

						<div className="no-scrollbar min-h-0 overflow-y-auto rounded-lg bg-primary p-5 text-dark lg:p-4">
							{selectedEvent ? (
								<div className="flex min-h-full flex-col">
									{selectedEventType && (
										<span
											data-testid="festival-event-type"
											className="mb-2 w-fit rounded border border-dark px-1.5 py-0.5 text-xs font-semibold normal-case leading-tight text-dark"
										>
											{selectedEventType}
										</span>
									)}
									<h4 className="text-4xl font-bold normal-case leading-tight text-dark lg:text-[clamp(1.2rem,2.6cqw,1.8rem)] lg:leading-none">
										<RichText
											value={localizedRichText(selectedEvent.title, language)}
											inline
										/>
									</h4>
									{selectedEvent.location && (
										<p className="mt-1 text-sm">
											<span className="font-semibold text-dark">
												@
											</span>{' '}
											<RichText value={selectedEvent.location} inline />
										</p>
									)}

									<Img
										image={selectedEvent.visual}
										alt={richTextToPlainText(localizedRichText(selectedEvent.title, language))}
										imageWidth={960}
										className={`mt-5 rounded-md ${isPortraitImage ? 'h-auto max-h-[clamp(10rem,28svh,16rem)] w-auto max-w-full shrink-0 self-start object-contain' : 'aspect-video w-full object-cover'}`}
									/>
									{selectedDescription && (
										<RichText
											value={selectedDescription}
											className="mt-6 max-w-2xl text-sm font-normal leading-[1.2] tracking-tight"
										/>
									)}
									{selectedEvent.pressLink && (
										<a
											href={selectedEvent.pressLink}
											target="_blank"
											rel="noreferrer"
											className="mt-auto inline-block w-fit text-sm normal-case text-dark underline transition-opacity hover:opacity-80"
										>
											{tFestivalEvents('openPressKit')} ↗
										</a>
									)}
								</div>
							) : (
								<div className="flex h-full items-center justify-center text-center text-sm font-semibold uppercase tracking-wide text-dark">
									{tFestivalEvents('noEventsScheduled')}
								</div>
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
				className="theme-festival-events-surface relative z-[49] rounded-xl bg-grayDark lg:mx-[min(8rem,11.6%)]"
			>
				<div className="p-3">
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => handleYearChange(-1)}
							className={`${CALENDAR_ARROW_BUTTON} rounded bg-dark`}
							aria-label={tFestivalEvents('previousYear')}
						>
							<NewArrowRightSimple
								theme={{ stroke: 'currentColor' }}
								className="h-3.5 w-3.5 rotate-180 lg:h-3 lg:w-3"
							/>
						</button>
						<h3 className={`${FESTIVAL_TITLE_STYLE} theme-festival-events-year -rotate-3 border-dark bg-grayDark text-dark`}>
							{selectedYear}
						</h3>
						<button
							type="button"
							onClick={() => handleYearChange(1)}
							className={`${CALENDAR_ARROW_BUTTON} rounded bg-dark`}
							aria-label={tFestivalEvents('nextYear')}
						>
							<NewArrowRightSimple
								theme={{ stroke: 'currentColor' }}
								className="h-3.5 w-3.5 lg:h-3 lg:w-3"
							/>
						</button>
					</div>
				</div>

				<LayoutGroup id={`festival-events-calendar-${selectedYear}`}>
					<div className="px-3 pb-2">
						<div
							data-testid="festival-calendar-stage"
							className={
								expandedEvent
									? 'h-[52rem] lg:h-[34rem] xl:h-[29rem]'
									: 'h-[101.5rem] sm:h-[50.5rem] lg:h-[clamp(18rem,40svh,25rem)]'
							}
						>
							<AnimatePresence initial={false} mode="popLayout">
								{expandedEvent && expandedMonthGroup ? (
									renderExpandedMonth()
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
										className="grid h-full auto-rows-fr grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4"
									>
										{monthGroups.map((monthGroup) => {
											const hasEvents = monthGroup.events.length > 0
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
													className={`theme-festival-events-month-card min-h-0 overflow-hidden rounded-lg p-3 lg:p-[clamp(0.5rem,1.2svh,0.75rem)] ${
														hasEvents
															? 'theme-festival-events-month-card--has-events cursor-pointer bg-dark'
															: 'cursor-default border-2 border-dark bg-grayDark'
													}`}
													role="button"
													tabIndex={hasEvents ? 0 : -1}
													aria-disabled={!hasEvents}
													aria-label={`${monthGroup.label} ${selectedYear}`}
													onClick={hasEvents ? () => openMonth(monthGroup) : undefined}
													onKeyDown={(event) => {
														if (
															hasEvents &&
															event.currentTarget === event.target &&
															(event.key === 'Enter' || event.key === ' ')
														) {
															event.preventDefault()
															openMonth(monthGroup)
														}
													}}
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
														className="flex h-full min-h-0 flex-col"
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
														<div className="flex shrink-0 items-start justify-between gap-2">
															<div className="flex items-center gap-1">
																<h4
																	data-testid="festival-month-title"
																	className={`text-[15px] font-semibold capitalize leading-none tracking-tight ${
																		monthGroup.events.length > 0
																			? 'text-primary'
																			: 'text-dark'
																	}`}
																>
																	{monthGroup.label}
																</h4>
																{monthGroup.events.length > 0 && (
																	<span
																		className="text-sm font-normal italic leading-none text-primary"
																		aria-label={getEventCountLabel(
																			monthGroup.events.length,
																		)}
																	>
																		({monthGroup.events.length})
																	</span>
																)}
															</div>
														</div>

														{monthGroup.events.length > 0 && (
															<div className="no-scrollbar mt-4 min-h-0 space-y-1 overflow-y-auto lg:mt-2">
																{monthGroup.events.map((event, index) => (
																	<button
																		data-testid="festival-event-preview"
																		key={
																			event._id ??
																			`${monthGroup.key}-preview-${index}`
																		}
																		type="button"
																		disabled={isEventTransitioning}
																		onClick={(clickEvent) => {
																			clickEvent.stopPropagation()
																			openMonth(monthGroup, event)
																		}}
																		className="group grid w-full grid-cols-[minmax(1.125rem,max-content)_minmax(0,1fr)] items-center gap-1 rounded border-b border-primary/25 bg-primary p-1 text-left text-xs font-semibold normal-case leading-tight text-dark disabled:pointer-events-none"
																	>
																		<span className="whitespace-nowrap">{getEventDayLabel(event)}</span>
																		<FestivalEventTitle
																			title={localizedRichText(
																				event.title,
																				language,
																			)}
																		/>
																	</button>
																))}
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
			</div>
		</>
	)
}

const VisionBlock: React.FC<BlockProps> = ({ block, index, language }) => {
	const tFestivalEvents = useTranslations('festivalEvents')

	if (block.show === false) return null

	return (
		<AccordionItem
			value={`vision-${index}`}
			className="relative flex flex-col items-center justify-center lg:contents"
		>
			<AccordionTrigger
				className={`${FESTIVAL_TITLE_STYLE} theme-festival-dropdown-label -rotate-3 lg:translate-y-0.5`}
				animationDelay={0.15}
			>
				{richTextToPlainText(localizedRichText(block.visionTitle, language)) ||
					tFestivalEvents('visionFallback')}
			</AccordionTrigger>
			<AccordionContent>
				<div className={`${FESTIVAL_BODY_TEXT} mb-4 pt-2 lg:mb-[0.89em] lg:pt-[0.45em]`}>
					{block.vision?.map((visionItem: any, vIndex: number) => (
						<motion.div
							key={vIndex}
							className="mt-4 first:-mt-2 lg:mt-[0.89em] lg:first:-mt-[0.45em]"
							// initial={{ opacity: 0, x: -20 }}
							// animate={{ opacity: 1, x: 0 }}
							// transition={{ duration: 0.5, delay: vIndex * 0.2 }}
						>
							<div className="relative mb-8 flex flex-col items-center rounded-t-3xl lg:mb-[1.78em]">
								<RichText
									value={combineRichText(
										localizedRichText(visionItem.title, language),
										localizedRichText(visionItem.text, language),
										'titleLabel',
									)}
									className={`${FESTIVAL_COPY_WIDTH} mx-auto py-2 text-primary lg:py-[0.45em] [&>*]:text-[length:inherit]`}
								/>
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
	if (block.show === false) return null

	return (
		<AccordionItem
			value={`custom-${index}`}
			className="flex flex-col items-center justify-center hover:relative hover:z-50 lg:contents"
		>
			<AccordionTrigger
				className={`${FESTIVAL_TITLE_STYLE} theme-festival-dropdown-label -mb-0 rotate-3 lg:-translate-y-1 lg:-rotate-6`}
				animationDelay={0.43}
			>
				<RichText
					value={localizedRichText(block.title, language)}
					inline
					allowLinks={false}
				/>
			</AccordionTrigger>
			<AccordionContent>
				<div className={`${FESTIVAL_COPY_WIDTH} ${FESTIVAL_BODY_TEXT} pb-0 pt-4 text-primary lg:rounded-md lg:pb-8 lg:pt-8`}>
					<RichText value={localizedRichText(block.content, language)} />
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
	const { scrollY } = useScroll()
	const borderRadius = useTransform(scrollY, (value) =>
		Math.max(80 - value, 10),
	)

	const text = localizedRichText(block.text, language)

	return (
		<div className="lg:hidden">
			<motion.div
				style={{ borderRadius }}
				transition={{
					duration: 2,
					ease: [0.76, 0, 0.24, 1],
				}}
				className="relative border-2 border-dark bg-primary px-4 py-10 shadow-sm lg:hidden lg:border-0 lg:py-10"
			>
				<RichText
					value={text}
					className={`${FESTIVAL_BODY_TEXT} mx-auto py-2 text-center text-dark lg:py-4`}
				/>
			</motion.div>
		</div>
	)
}

// Media Teaser Block Component
const MediaTeaserBlock: React.FC<BlockProps> = ({ block, index, language }) => {
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

	if (block.show === false) return null
	const source = block.uploadedVideo?.asset?.url || block.video
	const poster = block.image?.asset?.url
	const isEmbeddedVideo =
		source && /(?:youtube\.com|youtu\.be|vimeo\.com)/i.test(source)
	const videoSource =
		source || (poster ? undefined : '/assets/videos/teaser2.mp4')

	return (
		<>
			<div
				ref={teaserRef}
				data-testid="festival-video-teaser"
				className={`relative h-[65vh] w-full cursor-pointer lg:aspect-video lg:h-auto ${
					isOverlayActive ? 'overflow-visible' : 'overflow-hidden'
				}`}
				onClick={handleVideoClick}
			>
				<div
					data-testid={isOverlayActive ? 'festival-video-overlay' : undefined}
					className={`group/festival-video overflow-hidden bg-dark ${
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
					{isEmbeddedVideo ? (
						<ReactPlayer
							src={source}
							width="100%"
							height="100%"
							playing
							muted
							loop
							playsInline
							controls={overlayMode === 'open'}
						/>
					) : videoSource ? (
						<video
							key={videoSource}
							className="h-full w-full rounded-none border-0 object-cover"
							suppressHydrationWarning
							autoPlay
							muted
							loop
							playsInline
							poster={poster}
						>
							<source src={videoSource} />
							{tFestivalEvents('videoUnsupported')}
						</video>
					) : (
						<Img
							image={block.image}
							alt=""
							className="h-full w-full object-cover"
						/>
					)}

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
							className="pointer-events-none absolute right-8 top-8 z-10 flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border-2 border-primary bg-dark/90 text-[color:var(--color-primary)] opacity-0 shadow-md backdrop-blur transition-[color,background-color,opacity] duration-200 hover:bg-primary hover:text-dark focus:outline-none focus-visible:pointer-events-auto focus-visible:opacity-100 group-hover/festival-video:pointer-events-auto group-hover/festival-video:opacity-100"
							aria-label={tFestivalEvents('expandVideo')}
							initial={{ scale: 0.8, y: 8 }}
							animate={{ scale: 1, y: 0 }}
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
							className="pointer-events-none absolute right-8 top-8 z-40 flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border-2 border-primary bg-dark/90 text-[color:var(--color-primary)] opacity-0 shadow-md backdrop-blur transition-[color,background-color,opacity] duration-200 hover:bg-primary hover:text-dark focus:outline-none focus-visible:pointer-events-auto focus-visible:opacity-100 group-hover/festival-video:pointer-events-auto group-hover/festival-video:opacity-100"
							aria-label={tFestivalEvents('closeVideo')}
							initial={{ scale: 0.8, y: 8 }}
							animate={{ scale: 1, y: 0 }}
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

	if (block.show === false || !currentMember) return null

	return (
		<AccordionItem
			value={`jury-${index}`}
			className="flex flex-col items-center justify-center lg:contents"
		>
			<AccordionTrigger
				className={`${FESTIVAL_TITLE_STYLE} theme-festival-dropdown-label -rotate-6 lg:-translate-y-0.5 lg:rotate-3`}
				animationDelay={0.31}
				onClick={() => setIsOpen((prev) => !prev)}
			>
				<RichText
					value={localizedRichText(block.title, language) || 'Jury'}
					inline
					allowLinks={false}
				/>
			</AccordionTrigger>

			<AccordionContent>
				<div
					ref={juryRef}
					className={`${FESTIVAL_COPY_WIDTH} relative flex flex-col items-center justify-center pt-4 lg:flex-row lg:items-stretch lg:justify-center lg:gap-8 lg:py-8`}
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
							alt={richTextToPlainText(currentMember.name)}
							className="aspect-video w-full rounded-lg border-[3px] border-primary object-cover lg:h-80 lg:w-56 lg:border-4"
						/>
						<h2 className="z-10 -mt-4 inline-block w-auto -rotate-3 rounded-md border-0 border-dark bg-primary px-2 py-0 text-center text-xl font-medium tracking-tighter text-dark lg:text-2xl">
							<RichText value={currentMember.name} inline />
						</h2>
					</div>

					<div className="mt-6 flex flex-1 flex-col items-center lg:mt-0 lg:items-start lg:text-left">
						{currentMember.biography && (
							<RichText
								value={localizedRichText(currentMember.biography, language)}
								className={`${FESTIVAL_BODY_TEXT} mb-4 text-primary`}
							/>
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
	const tFestivalEvents = useTranslations('festivalEvents')

	if (block.show === false) return null

	return (
		<AccordionItem
			value={`events-${index}`}
			className="flex flex-col items-center justify-center lg:contents"
		>
			<AccordionTrigger
				className={`${FESTIVAL_TITLE_STYLE} theme-festival-dropdown-label rotate-6 lg:translate-y-1`}
				animationDelay={0.24}
			>
				<RichText
					value={
						localizedRichText(block.title, language) || tFestivalEvents('title')
					}
					inline
					allowLinks={false}
				/>
			</AccordionTrigger>
			<AccordionContent className="relative w-full">
				<div className="relative mt-4 w-full lg:mt-8">
					<AnnualEventsList events={block.events || []} language={language} />
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
	const accordionBlocks = useMemo(
		() =>
			festival?.blocks?.filter(
				(block: any) => block._type !== 'mediaTeaserBlock',
			) ?? [],
		[festival?.blocks],
	)
	const mediaTeaserBlocks = useMemo(
		() =>
			festival?.blocks?.filter(
				(block: any) =>
					block._type === 'mediaTeaserBlock' && block.show !== false,
			) ?? [],
		[festival?.blocks],
	)
	const eventsAccordionValue = useMemo(() => {
		const eventsBlockIndex = accordionBlocks.findIndex(
			(block: any) => block._type === 'onTourBlock' && block.show !== false,
		)

		return eventsBlockIndex >= 0 ? `events-${eventsBlockIndex}` : ''
	}, [accordionBlocks])
	const [accordionValue, setAccordionValue] = useState('')
	const [isDesktop, setIsDesktop] = useState(false)

	useEffect(() => {
		const desktopQuery = window.matchMedia('(min-width: 1024px)')
		const updateLayout = () => setIsDesktop(desktopQuery.matches)
		updateLayout()
		setAccordionValue(desktopQuery.matches ? eventsAccordionValue : '')
		desktopQuery.addEventListener('change', updateLayout)
		return () => desktopQuery.removeEventListener('change', updateLayout)
	}, [eventsAccordionValue, festival?._id])

	const handleAccordionValueChange = (value: any) => {
		setAccordionValue(value)
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
			className="no-scrollbar relative flex h-full w-full flex-col p-2 px-4 pb-16 lg:my-1 lg:h-[calc(100svh-8px)] lg:overflow-hidden lg:p-0"
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
				className="lg:shadowtest section-folder-content section-folder-content--festival no-scrollbar relative z-10 rounded-md border-primary lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:rounded-xl lg:border-[0px] lg:bg-dark [container-type:inline-size]"
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
					orientation={isDesktop ? 'horizontal' : 'vertical'}
					value={accordionValue}
					onValueChange={handleAccordionValueChange}
					className="mt-4 lg:mt-[clamp(0.75rem,1.45cqw,1rem)] lg:flex lg:flex-wrap lg:items-start lg:justify-center lg:gap-y-[min(1.5rem,1.67cqw)] lg:rounded-lg lg:border-0 lg:border-primary lg:bg-transparent lg:py-[clamp(1.5rem,3.33cqw,4rem)] lg:[&>div>[role=region]]:order-1 lg:[&>div>[role=region]]:basis-full"
				>
					{accordionBlocks?.map(renderBlock)}
				</Accordion>
				{mediaTeaserBlocks?.length ? (
					<div
						data-testid="festival-video-area"
						className="relative z-[49] mt-6 space-y-4 pb-4 lg:mx-[min(8rem,11.6%)] lg:mt-0 lg:pb-8"
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
		</div>
	)
}

export default FestivalContent
