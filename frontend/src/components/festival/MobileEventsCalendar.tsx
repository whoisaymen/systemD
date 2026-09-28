'use client'

import {
	useCallback,
	useEffect,
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import {
	AnimatePresence,
	motion,
	useIsPresent,
	useReducedMotion,
} from 'motion/react'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import RichText from '@/components/common/RichText'
import { EDITORIAL_BODY_TEXT } from '@/components/common/editorialStyles'
import NewArrowRightSimple from '@/components/common/NewArrowRightSimple'
import { localizedRichText, richTextToPlainText } from '@/lib/richText'
import Img from '@/ui/Img'
import {
	type Event,
	eventOccursOnDay,
	eventOverlapsMonth,
	getCalendarDays,
	getEventEndDate,
	getValidDate,
	getWeekdayLabels,
	isSameCalendarDay,
} from './calendar'

export default function MobileEventsCalendar({
	events,
	language,
}: {
	events: Event[]
	language: string
}) {
	const t = useTranslations('festivalEvents')
	const id = useId()
	const [today] = useState(() => new Date())
	const [month, setMonth] = useState(
		() => new Date(today.getFullYear(), today.getMonth(), 1),
	)
	const [selectedDay, setSelectedDay] = useState<Date | null>(null)
	const [expandedEvent, setExpandedEvent] = useState<Event | null>(null)
	const reduceMotion = useReducedMotion()
	const panelRef = useRef<HTMLElement>(null)
	const backButtonRef = useRef<HTMLButtonElement>(null)
	const returnButtonRef = useRef<HTMLButtonElement>(null)
	const lastEventRef = useRef<Event | null>(null)
	const returnScrollRef = useRef(0)
	const year = month.getFullYear()
	const monthIndex = month.getMonth()
	const monthLabel = month.toLocaleDateString(language, { month: 'long' })
	const days = getCalendarDays(year, monthIndex)
	const weekdays = getWeekdayLabels(language)
	const monthEvents = useMemo(
		() =>
			events
				.filter((event) => eventOverlapsMonth(event, year, monthIndex))
				.sort(
					(a, b) =>
						getValidDate(a.date)!.getTime() - getValidDate(b.date)!.getTime(),
				),
		[events, year, monthIndex],
	)
	const visibleEvents = selectedDay
		? monthEvents.filter((event) => eventOccursOnDay(event, selectedDay))
		: monthEvents
	const dayGroups: Array<{ day: Date; events: Event[] }> = []
	for (const event of visibleEvents) {
		const start = getValidDate(event.date)!
		const day = selectedDay ?? (start < month ? month : start)
		const previousGroup = dayGroups.at(-1)
		if (previousGroup && isSameCalendarDay(previousGroup.day, day))
			previousGroup.events.push(event)
		else dayGroups.push({ day, events: [event] })
	}
	const closeEvent = useCallback(() => setExpandedEvent(null), [])

	useEffect(() => {
		if (!expandedEvent) return
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') closeEvent()
		}
		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}, [expandedEvent, closeEvent])

	const enterView = useCallback(() => {
		if (expandedEvent && panelRef.current) {
			const menu = document.getElementById('festival-mobile-menu')
			panelRef.current.style.scrollMarginTop = `${(menu?.offsetHeight ?? 0) + 24}px`
			panelRef.current.scrollIntoView({
				behavior: reduceMotion ? 'instant' : 'smooth',
				block: 'start',
			})
		} else if (lastEventRef.current) {
			window.scrollTo({ top: returnScrollRef.current, behavior: 'instant' })
		}
	}, [expandedEvent, reduceMotion])
	const focusView = () => {
		if (expandedEvent) backButtonRef.current?.focus({ preventScroll: true })
		else {
			returnButtonRef.current?.focus({ preventScroll: true })
			returnButtonRef.current = null
			lastEventRef.current = null
		}
	}

	const changeMonth = (direction: -1 | 1) => {
		setMonth(new Date(year, monthIndex + direction, 1))
		setSelectedDay(null)
		setExpandedEvent(null)
	}
	const formatTime = (date: Date) =>
		date.toLocaleTimeString(language, {
			hour: '2-digit',
			minute: '2-digit',
			hourCycle: 'h23',
		})
	const detailStart = expandedEvent ? getValidDate(expandedEvent.date) : null
	const detailEnd = expandedEvent ? getEventEndDate(expandedEvent) : null

	const calendar = (
		<div className="px-1.5 pb-1.5">
			<div className="flex items-center justify-between gap-2 py-2.5">
				<h3
					aria-live="polite"
					className="-rotate-3 rounded-md border-2 border-dark pl-2 pr-3 text-2xl font-bold italic leading-tight tracking-tighter"
				>
					{year}
				</h3>
				<div className="flex min-w-0 items-center gap-2">
					<button
						type="button"
						onClick={() => changeMonth(-1)}
						aria-label={t('previousMonth')}
						className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-dark text-primary transition-opacity hover:opacity-60"
					>
						<NewArrowRightSimple
							theme={{ stroke: 'currentColor' }}
							className="h-3.5 w-3.5 rotate-180"
						/>
					</button>
					<h3
						aria-live="polite"
						className="flex min-w-0 items-center gap-1 text-center text-sm font-bold tracking-tight min-[375px]:text-lg"
					>
						<span className="truncate capitalize">{monthLabel}</span>
						{monthEvents.length > 0 && (
							<span
								className="shrink-0 font-normal italic"
								aria-label={`${monthEvents.length} ${t(monthEvents.length === 1 ? 'eventSingular' : 'eventPlural')}`}
							>
								({monthEvents.length})
							</span>
						)}
					</h3>
					<button
						type="button"
						onClick={() => changeMonth(1)}
						aria-label={t('nextMonth')}
						className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-dark text-primary transition-opacity hover:opacity-60"
					>
						<NewArrowRightSimple
							theme={{ stroke: 'currentColor' }}
							className="h-3.5 w-3.5"
						/>
					</button>
				</div>
			</div>

			<div
				className="grid grid-cols-7 pb-1.5 text-center text-xs font-semibold uppercase text-dark/60"
				aria-hidden="true"
			>
				{weekdays.map((label, index) => (
					<span key={index}>{label}</span>
				))}
			</div>
			<div className="grid grid-cols-7 text-center">
				{days.map((day, index) => {
					if (!day)
						return (
							<span
								key={`empty-${index}`}
								className="border-t border-dark/20"
							/>
						)
					const dayEvents = monthEvents.filter((event) =>
						eventOccursOnDay(event, day),
					)
					const isSelected = Boolean(
						selectedDay && isSameCalendarDay(selectedDay, day),
					)
					const isToday = isSameCalendarDay(today, day)
					const label = `${day.toLocaleDateString(language, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · ${dayEvents.length} ${t(dayEvents.length === 1 ? 'eventSingular' : 'eventPlural')}`
					return (
						<button
							key={day.getDate()}
							type="button"
							aria-label={label}
							aria-pressed={isSelected}
							aria-current={isToday ? 'date' : undefined}
							onClick={() => {
								setSelectedDay(isSelected ? null : day)
								setExpandedEvent(null)
							}}
							className="flex min-h-11 flex-col items-center justify-center gap-0.5 border-t border-dark/20 py-0.5"
						>
							<span
								className={`flex h-8 w-8 items-center justify-center rounded-full text-lg font-semibold ${isSelected ? 'bg-primary text-dark' : dayEvents.length > 0 ? 'bg-dark text-primary' : isToday ? 'ring-1 ring-inset ring-dark' : 'hover:bg-dark/15'}`}
							>
								{day.getDate()}
							</span>
							<span aria-hidden="true" className="flex h-1 gap-0.5">
								{dayEvents.slice(0, 3).map((_, dot) => (
									<span
										key={dot}
										className={`h-1 w-1 rounded-full ${isSelected ? 'bg-primary' : 'bg-dark'}`}
									/>
								))}
							</span>
						</button>
					)
				})}
			</div>

			<div
				className={selectedDay ? 'mt-2' : 'mt-5'}
				data-testid="festival-mobile-agenda"
			>
				{selectedDay && (
					<div className="flex min-h-10 items-center justify-between gap-2 border-b border-dark/40 py-2">
						<h4 className="text-sm font-semibold capitalize" aria-live="polite">
							{selectedDay.toLocaleDateString(language, {
								weekday: 'long',
								day: 'numeric',
								month: 'long',
							})}
						</h4>
						<button
							type="button"
							onClick={() => {
								setSelectedDay(null)
								setExpandedEvent(null)
							}}
							className="px-2 py-1 text-sm underline underline-offset-2"
						>
							{t('allEvents')}
						</button>
					</div>
				)}
				{visibleEvents.length === 0 && (
					<p className="py-4 text-sm text-dark/65">{t('noEventsScheduled')}</p>
				)}
				{dayGroups.map(({ day, events: dayEvents }) => (
					<div
						key={day.toDateString()}
						role="group"
						aria-label={day.toLocaleDateString(language, {
							weekday: 'long',
							day: 'numeric',
							month: 'long',
							year: 'numeric',
						})}
						data-testid="festival-mobile-day-group"
						className="mt-2 flex items-start gap-1.5 rounded-lg bg-dark p-1.5 text-primary"
					>
						<time
							dateTime={day.toISOString()}
							className="flex w-7 shrink-0 flex-col self-center text-center leading-none"
						>
							<span className="text-xl font-bold leading-none">
								{day.getDate()}
							</span>
							<span className="text-[10px] uppercase leading-none">
								{day.toLocaleDateString(language, { weekday: 'short' })}
							</span>
						</time>
						<div className="min-w-0 flex-1 space-y-1.5">
							{dayEvents.map((event, index) => {
								const start = getValidDate(event.date)!
								const end = getEventEndDate(event)!
								const title = localizedRichText(event.title, language)
								return (
									<article key={event._id ?? index}>
										<button
											ref={(node) => {
												if (event === lastEventRef.current)
													returnButtonRef.current = node
											}}
											type="button"
											aria-controls={`${id}-details`}
											onClick={() => {
												lastEventRef.current = event
												returnScrollRef.current = window.scrollY
												setExpandedEvent(event)
											}}
											className={`flex w-full items-start gap-2 rounded-md px-1.5 py-1 text-left ${dayEvents.length > 1 ? 'bg-primary text-dark' : ''}`}
										>
											<span className="min-w-0 flex-1">
												<span className="block text-base font-semibold leading-tight">
													<RichText value={title} inline allowLinks={false} />
												</span>
												{event.location && (
													<span className="mt-0.5 block text-xs opacity-[0.65]">
														<RichText
															value={event.location}
															inline
															allowLinks={false}
														/>
													</span>
												)}
											</span>
											<span className="shrink-0 text-right text-xs tabular-nums">
												<time dateTime={start.toISOString()} className="block">
													{formatTime(start)}
												</time>
												{end > start && (
													<time
														dateTime={end.toISOString()}
														className="mt-0.5 block opacity-60"
													>
														{isSameCalendarDay(start, end)
															? formatTime(end)
															: end.toLocaleDateString(language, {
																	day: 'numeric',
																	month: 'short',
																})}
													</time>
												)}
											</span>
										</button>
									</article>
								)
							})}
						</div>
					</div>
				))}
			</div>
		</div>
	)

	return (
		<motion.section
			ref={panelRef}
			layout="size"
			transition={{
				duration: reduceMotion ? 0 : 0.34,
				ease: [0.76, 0, 0.24, 1],
			}}
			data-testid="festival-mobile-calendar"
			aria-label={t('calendarView')}
			style={{ borderRadius: 12 }}
			className="theme-festival-events-surface relative z-[49] overflow-hidden border-2 border-grayDark bg-grayDark text-dark"
		>
			<AnimatePresence initial={false} mode="wait">
				<CalendarView
					key={expandedEvent ? 'event' : 'calendar'}
					detail={Boolean(expandedEvent)}
					reduceMotion={Boolean(reduceMotion)}
					onEnter={enterView}
					onEntered={focusView}
				>
					{expandedEvent ? (
						<div
							id={`${id}-details`}
							data-testid="festival-mobile-event-detail"
							role="region"
							aria-labelledby={`${id}-event-title`}
							className="bg-primary text-dark"
						>
							<div className="p-5">
								<div className="mb-3 flex items-center gap-2">
									<button
										ref={backButtonRef}
										type="button"
										onClick={closeEvent}
										aria-label={t('backToCalendar')}
										className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-dark text-primary transition-opacity hover:opacity-60"
									>
										<NewArrowRightSimple
											theme={{ stroke: 'currentColor' }}
											className="h-3.5 w-3.5 rotate-180"
										/>
									</button>
									{richTextToPlainText(
										localizedRichText(expandedEvent.eventType?.title, language),
									) && (
										<div className="w-fit rounded border border-dark px-1.5 py-0.5 text-xs font-semibold">
											<RichText
												value={localizedRichText(
													expandedEvent.eventType?.title,
													language,
												)}
												inline
											/>
										</div>
									)}
									<button
										type="button"
										onClick={closeEvent}
										aria-label={t('closeDetails')}
										className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded text-dark transition-opacity hover:opacity-60"
									>
										<X className="h-5 w-5" aria-hidden="true" />
									</button>
								</div>
								<h3
									id={`${id}-event-title`}
									className="text-3xl font-bold leading-none tracking-tight"
								>
									<RichText
										value={localizedRichText(expandedEvent.title, language)}
										inline
									/>
								</h3>
								<p className="mt-4 text-sm font-semibold">
									<time dateTime={expandedEvent.date}>
										{detailStart!.toLocaleDateString(language, {
											weekday: 'long',
											day: 'numeric',
											month: 'long',
											year: 'numeric',
										})}{' '}
										· {formatTime(detailStart!)}
									</time>
									{detailEnd! > detailStart! && (
										<>
											{' — '}
											<time dateTime={expandedEvent.endDate}>
												{!isSameCalendarDay(detailStart!, detailEnd!) &&
													`${detailEnd!.toLocaleDateString(language, { day: 'numeric', month: 'long', year: 'numeric' })} · `}
												{formatTime(detailEnd!)}
											</time>
										</>
									)}
								</p>
								{expandedEvent.location && (
									<p className="mt-1 text-sm">
										<RichText value={expandedEvent.location} inline />
									</p>
								)}
								<Img
									image={expandedEvent.visual}
									alt={richTextToPlainText(
										localizedRichText(expandedEvent.title, language),
									)}
									imageWidth={640}
									className="mt-5 max-h-80 w-auto max-w-full rounded-md object-contain"
								/>
								<RichText
									value={
										localizedRichText(expandedEvent.description, language) ||
										t('noDescription')
									}
									className={`mt-5 ${EDITORIAL_BODY_TEXT}`}
								/>
								{expandedEvent.pressLink && (
									<a
										href={expandedEvent.pressLink}
										target="_blank"
										rel="noreferrer"
										className="mt-4 inline-block text-sm underline underline-offset-2"
									>
										{t('openPressKit')} ↗
									</a>
								)}
							</div>
						</div>
					) : (
						calendar
					)}
				</CalendarView>
			</AnimatePresence>
		</motion.section>
	)
}

function CalendarView({
	children,
	detail,
	reduceMotion,
	onEnter,
	onEntered,
}: {
	children: React.ReactNode
	detail: boolean
	reduceMotion: boolean
	onEnter: () => void
	onEntered: () => void
}) {
	const isPresent = useIsPresent()
	useLayoutEffect(() => {
		if (isPresent) onEnter()
	}, [isPresent, onEnter])

	return (
		<motion.div
			layout="position"
			inert={!isPresent}
			aria-hidden={!isPresent || undefined}
			initial={{
				opacity: 0,
				y: reduceMotion ? 0 : detail ? 12 : -8,
				scale: reduceMotion ? 1 : 0.98,
			}}
			animate={{
				opacity: 1,
				y: 0,
				scale: 1,
				transition: {
					duration: reduceMotion ? 0 : 0.34,
					ease: [0.76, 0, 0.24, 1],
				},
			}}
			exit={{
				opacity: 0,
				scale: reduceMotion ? 1 : 0.98,
				transition: { duration: reduceMotion ? 0 : 0.16 },
			}}
			onAnimationComplete={() => {
				if (isPresent) onEntered()
			}}
		>
			{children}
		</motion.div>
	)
}
