/** Content helpers accept both legacy text and Sanity Portable Text during migration. */
export function localizedRichText(value: any, locale: string): any {
	if (value == null || typeof value === 'string') return value
	if (!Array.isArray(value)) {
		if (typeof value !== 'object') return undefined
		if ('value' in value) return value.value
		return value[locale] ?? value.fr ?? value.en ?? value.nl
	}
	if (!value.length || value[0]?._type === 'block') return value
	const entries = value.filter((entry) => entry && 'value' in entry)
	const entry =
		entries.find((entry) => (entry.language || entry._key) === locale) ??
		entries.find((entry) => (entry.language || entry._key) === 'fr') ??
		entries.find((entry) => (entry.language || entry._key) === 'en') ??
		entries.find((entry) => (entry.language || entry._key) === 'nl') ??
		entries[0]
	return entry?.value
}

export function richTextToPlainText(value: any): string {
	if (typeof value === 'string') return value
	if (!value) return ''
	if (!Array.isArray(value)) {
		if (typeof value !== 'object') return ''
		if ('value' in value) return richTextToPlainText(value.value)
		return typeof value.text === 'string' ? value.text : ''
	}
	return value
		.map((block) =>
			Array.isArray(block?.children)
				? block.children.map((child: any) => child.text ?? '').join('')
				: richTextToPlainText(block),
		)
		.join('\n\n')
}

export function textToRichText(value: any): any[] {
	if (Array.isArray(value)) return value
	if (typeof value !== 'string' || !value) return []
	return value.split(/\n{2,}/).map((text, index) => ({
		_type: 'block',
		_key: `text-${index}`,
		style: 'normal',
		markDefs: [],
		children: [{ _type: 'span', _key: `span-${index}`, marks: [], text }],
	}))
}

/** Render an old separate heading during the transition to a single prose editor. */
export function combineRichText(title: any, body: any, style = 'h3'): any[] {
	return [
		...textToRichText(title).map((block, index) => ({
			...block,
			_key: `heading-${index}`,
			style,
		})),
		...textToRichText(body),
	]
}

export function safeRichTextHref(value: unknown): string | undefined {
	if (typeof value !== 'string') return undefined
	const href = value.trim()
	// Reject protocol-relative URLs and control characters as well as executable schemes.
	if (!href || /[\u0000-\u0020\u007f]/.test(href) || href.startsWith('//'))
		return undefined
	return /^(https?:\/\/|mailto:|tel:|\/|#|\?)/i.test(href) ? href : undefined
}
