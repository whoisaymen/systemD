import { localizedRichText, richTextToPlainText } from './richText'

export type FilmSortField = 'title' | 'director' | 'year'
export type FilmSortOrder = 'asc' | 'desc'

export const DEFAULT_FILM_SORT: FilmSortField = 'title'
export const DEFAULT_FILM_ORDER: FilmSortOrder = 'asc'

interface FilmSelectionItem {
	_id?: string
	slug?: { current?: string }
	title?: unknown
	director?: unknown
	year?: number | null
	isWinner?: boolean
}

interface FilmSelectionOptions {
	language: string
	sort?: string
	order?: string
	winnersOnly?: boolean
}

function compareYears(a: FilmSelectionItem, b: FilmSelectionItem, direction = 1) {
	const yearA = typeof a.year === 'number' && Number.isFinite(a.year) ? a.year : null
	const yearB = typeof b.year === 'number' && Number.isFinite(b.year) ? b.year : null
	if (yearA === null) return yearB === null ? 0 : 1
	if (yearB === null) return -1
	return (yearA - yearB) * direction
}

/** Keep cards, table rows, and previous/next navigation in the same order. */
export function sortFilmSelection<T extends FilmSelectionItem>(
	films: readonly T[],
	{
		language,
		sort = DEFAULT_FILM_SORT,
		order = DEFAULT_FILM_ORDER,
		winnersOnly = false,
	}: FilmSelectionOptions,
): T[] {
	const collator = new Intl.Collator(language, { sensitivity: 'base' })
	const direction = order === 'desc' ? -1 : 1
	const title = (film: T) =>
		richTextToPlainText(localizedRichText(film.title, language)).trim()

	return films.filter((film) => !winnersOnly || film.isWinner).sort((a, b) => {
		const titleOrder = collator.compare(title(a), title(b))
		let comparison: number

		if (sort === 'year') {
			comparison = compareYears(a, b, direction) || titleOrder
		} else if (sort === 'director') {
			const directorA = richTextToPlainText(a.director).trim()
			const directorB = richTextToPlainText(b.director).trim()
			if (!directorA && directorB) return 1
			if (directorA && !directorB) return -1
			comparison = collator.compare(directorA, directorB) * direction || titleOrder
		} else {
			comparison = titleOrder * direction
		}

		// API queries can return ties in different orders; never rely on input order.
		return (
			comparison || compareYears(a, b) ||
			collator.compare(a._id ?? a.slug?.current ?? '', b._id ?? b.slug?.current ?? '')
		)
	})
}
