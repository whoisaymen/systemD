export interface Event {
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

export interface EventMonthGroup {
	key: string
	month: number
	label: string
	events: Event[]
}

export const getValidDate = (value?: string) => {
	if (!value) return null

	const date = new Date(value)
	return Number.isNaN(date.getTime()) ? null : date
}

export const isSameCalendarDay = (a: Date, b: Date) =>
	a.getFullYear() === b.getFullYear() &&
	a.getMonth() === b.getMonth() &&
	a.getDate() === b.getDate()

export const getEventEndDate = (event: Event) => {
	const start = getValidDate(event.date)
	const end = getValidDate(event.endDate)

	if (!start) return null
	if (!end || end < start) return start

	return end
}

export const eventOverlapsYear = (event: Event, year: number) => {
	const start = getValidDate(event.date)
	const end = getEventEndDate(event)

	if (!start || !end) return false

	const yearStart = new Date(year, 0, 1)
	const nextYearStart = new Date(year + 1, 0, 1)

	return start < nextYearStart && end >= yearStart
}

export const eventOverlapsMonth = (
	event: Event,
	year: number,
	month: number,
) => {
	const start = getValidDate(event.date)
	const end = getEventEndDate(event)

	if (!start || !end) return false

	const monthStart = new Date(year, month, 1)
	const nextMonthStart = new Date(year, month + 1, 1)

	return start < nextMonthStart && end >= monthStart
}

export const eventOccursOnDay = (event: Event, day: Date) => {
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

export const getCalendarDays = (year: number, month: number) => {
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

export const getWeekdayLabels = (language: string) =>
	Array.from({ length: 7 }, (_, index) =>
		new Date(2024, 0, index + 1).toLocaleDateString(language, {
			weekday: 'narrow',
		}),
	)

export const getEventDayLabel = (event: Event) => {
	const start = getValidDate(event.date)
	const end = getEventEndDate(event)

	if (!start) return '--'
	if (!end || isSameCalendarDay(start, end)) {
		return String(start.getDate())
	}

	return `${start.getDate()}-${end.getDate()}`
}

export const getInitialEventYear = (events: Event[]) => {
	const currentYear = new Date().getFullYear()
	const years = events
		.map((event) => getValidDate(event.date)?.getFullYear())
		.filter((year): year is number => typeof year === 'number')
		.sort((a, b) => a - b)

	if (years.includes(currentYear)) return currentYear

	return years[0] ?? currentYear
}

export const getEventsForYear = (events: Event[], year: number) =>
	events
		.filter((event) => eventOverlapsYear(event, year))
		.map((event) => ({ event, start: getValidDate(event.date) }))
		.filter(
			(item): item is { event: Event; start: Date } => item.start !== null,
		)
		.sort((a, b) => a.start.getTime() - b.start.getTime())
		.map(({ event }) => event)

export const groupEventsByMonth = (
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
