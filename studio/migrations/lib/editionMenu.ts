import { isDeepStrictEqual } from 'node:util'
import { richTextToPlainText } from '../../../frontend/src/lib/richText'
import { localizeText, migrateEditorialValue } from './editorialContent'
import { editionMenuLabels } from './festivalSeeds'

type Document = {
	_id: string
	_type: string
	_rev?: string
	[key: string]: any
}

export const retiredEditionMenuFields = [
	'overviewTitle',
	...Object.keys(editionMenuLabels),
]

function entries(value: any): any[] {
	return migrateEditorialValue(
		structuredClone(value ?? []),
		{ type: 'internationalizedArrayRichText' },
		new Map(),
	)
}

function renameExhibition(entry: any) {
	const oldTitles: Record<string, string> = {
		en: 'photo exhibition',
		fr: 'expo photo',
		nl: 'foto-expo',
	}
	const text = richTextToPlainText(entry.value)
	if (text.trim().toLowerCase() !== oldTitles[entry.language]) return entry
	const next = structuredClone(entry)
	const spans = next.value.flatMap((block: any) => block.children ?? [])
	if (entry.language === 'en') {
		// Remove the prefix even when Photo and Exhibition use different marks.
		let remaining = text.toLowerCase().indexOf('exhibition')
		for (const span of spans) {
			const length = (span.text ?? '').length
			span.text = (span.text ?? '').slice(remaining)
			remaining = Math.max(0, remaining - length)
		}
	} else {
		spans.forEach((span: any, index: number) => {
			span.text =
				index === 0 ? editionMenuLabels.exhibitionTitle[entry.language] : ''
		})
	}
	return next
}

/** Resolve each locale independently; never silently choose between differing edition labels. */
function sharedMenu(existing: any, festivals: Document[]) {
	const menu = structuredClone(existing ?? {})
	for (const [field, defaults] of Object.entries(editionMenuLabels)) {
		const current = entries(menu[field])
		const candidates = festivals.flatMap((festival) => entries(festival[field]))
		const languages = new Set([
			...current.map((entry) => entry.language),
			...candidates.map((entry) => entry.language),
			...Object.keys(defaults),
		])
		menu[field] = [...languages].map((language) => {
			if (!language) throw new Error(`Missing language in ${field}`)
			const saved = current.find((entry) => entry.language === language)
			const options = candidates.filter(
				(entry) => entry.language === language && entry.value !== undefined,
			)
			if (
				!saved &&
				new Set(options.map((entry) => richTextToPlainText(entry.value))).size >
					1
			)
				throw new Error(`Conflicting edition labels for ${field}.${language}`)
			const entry =
				saved ??
				options[0] ??
				localizeText({ [language]: defaults[language] })[0]
			return field === 'exhibitionTitle' ? renameExhibition(entry) : entry
		})
	}
	return menu
}

export function planEditionMenuMigration(documents: Document[]) {
	const festivals = documents.filter(
		(document) => document._type === 'festival',
	)
	const published = festivals.filter(
		(document) => !document._id.startsWith('drafts.'),
	)
	const drafts = festivals.filter((document) =>
		document._id.startsWith('drafts.'),
	)
	const draftIds = new Set(drafts.map((document) => document._id.slice(7)))
	const draftView = [
		...drafts,
		...published.filter((document) => !draftIds.has(document._id)),
	]
	const memoires = documents.filter((document) => document._type === 'memoire')
	if (!memoires.some((document) => document._id === 'memoire'))
		throw new Error('The published La Mémoire document is required.')
	if (
		memoires.some(
			(document) => !['memoire', 'drafts.memoire'].includes(document._id),
		)
	)
		throw new Error(
			'Unexpected La Mémoire document; resolve duplicate documents first.',
		)
	if (
		drafts.some((document) =>
			retiredEditionMenuFields.some((field) => Object.hasOwn(document, field)),
		) &&
		!memoires.some((document) => document._id === 'drafts.memoire')
	)
		throw new Error(
			'Create a La Mémoire draft before migrating unpublished edition labels.',
		)
	const plans: {
		document: Document
		set: Record<string, any>
		unset: string[]
	}[] = []
	for (const document of memoires) {
		const sources = document._id.startsWith('drafts.') ? draftView : published
		const menu = sharedMenu(
			document.menu,
			sources.sort((a, b) => (b.year ?? 0) - (a.year ?? 0)),
		)
		if (!isDeepStrictEqual(menu, document.menu))
			plans.push({ document, set: { menu }, unset: [] })
	}
	for (const document of festivals) {
		const unset = retiredEditionMenuFields.filter((field) =>
			Object.hasOwn(document, field),
		)
		if (unset.length) plans.push({ document, set: {}, unset })
	}
	return plans
}
