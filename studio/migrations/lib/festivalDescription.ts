import { textToRichText } from '../../../frontend/src/lib/richText'

/** Merge edition copy without mixing languages or changing existing inline formatting. */
export function mergeFestivalDescription(document: any): any {
	const next = structuredClone(document)
	const descriptions = document.description ?? []
	if (!Array.isArray(descriptions))
		throw new Error(`Expected localized descriptions: ${document._id}`)
	const languages = new Set<string>([
		...descriptions.map((entry: any) => entry.language || entry._key),
		...Object.keys(document.text ?? {}).filter((key) => !key.startsWith('_')),
	])
	if (languages.size) {
		next.description = [...languages].map((language) => {
			const entry = descriptions.find(
				(item: any) => (item.language || item._key) === language,
			)
			const intro = structuredClone(textToRichText(entry?.value))
			// Store the formerly separate 2023 lead's hierarchy in the editor.
			if (
				document.year === 2023 &&
				document.text != null &&
				intro[0]?._type === 'block' &&
				(!intro[0].style || intro[0].style === 'normal')
			)
				intro[0].style = 'h2'
			const keys = new Set(intro.map((block: any) => block._key))
			const body = structuredClone(
				textToRichText(document.text?.[language]),
			).map((block: any, index: number) => {
				let key = block._key || `body-${index}`
				while (keys.has(key)) key = `body-${key}`
				keys.add(key)
				return { ...block, _key: key }
			})
			return {
				...entry,
				_key: entry?._key || language,
				_type: 'internationalizedArrayRichTextValue',
				language,
				value: [...intro, ...body],
			}
		})
	}
	delete next.text
	return next
}
