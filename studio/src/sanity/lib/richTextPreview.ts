/** Plain text for Studio previews; accepts legacy strings and localized Portable Text. */
export function richTextToPlainText(value: any): string {
	if (typeof value === 'string') return value
	if (!value) return ''
	if (Array.isArray(value)) {
		if (value.some((entry) => entry?._type === 'block')) {
			return value
				.map(
					(block) =>
						block?.children?.map((child: any) => child?.text ?? '').join('') ??
						'',
				)
				.join(' ')
		}
		return localizedRichTextPreview(value)
	}
	if (value.value !== undefined) return richTextToPlainText(value.value)
	return localizedRichTextPreview(value)
}

export function localizedRichTextPreview(value: any, locale = 'fr'): string {
	if (typeof value === 'string') return value
	if (!value) return ''
	if (Array.isArray(value) && value.some((entry) => entry?._type === 'block')) {
		return richTextToPlainText(value)
	}
	for (const language of [...new Set([locale, 'fr', 'en', 'nl'])]) {
		const candidate = Array.isArray(value)
			? value.find(
					(entry) => entry?.language === language || entry?._key === language,
				)?.value
			: value[language]
		const text = candidate == null ? '' : richTextToPlainText(candidate)
		if (text) return text
	}
	return ''
}
