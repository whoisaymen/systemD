import { localizeText, textToBlocks } from './editorialContent'


/** Preserve existing content, including intentionally empty fields, when seeding new controls. */
export function seedStoryContent(document: any): any {
	const result = structuredClone(document)
	const seed = (field: string, translations: Record<string, string>) => {
		if (result[field] === undefined) result[field] = localizeText(translations)
	}
	if (result._type === 'bigbangShortStory') {
		seed('tabLabel', {
			fr: 'Short story',
			en: 'Short story',
			nl: 'Short story',
		})
	}
	if (result._type === 'bigbangLongStory') {
		seed('tabLabel', { fr: 'Long story', en: 'Long story', nl: 'Long story' })
	}
	if (result._type === 'fabrique') {
		if (Array.isArray(result.actions))
			result.actions = result.actions.map((action: any) => {
				if (action.subtitle !== undefined || !Array.isArray(action.title))
					return action
				const subtitles: any[] = []
				const title = action.title.map((entry: any) => {
					// Support calls before or after the generic schema migration, without changing marked text.
					const plain =
						typeof entry.value === 'string'
							? entry.value
							: Array.isArray(entry.value) &&
								  entry.value.length === 1 &&
								  !entry.value[0].markDefs?.length &&
								  entry.value[0].children?.length === 1 &&
								  !entry.value[0].children[0].marks?.length
								? entry.value[0].children[0].text
								: undefined
					if (!plain?.includes(' - ')) return entry
					const [heading, ...remainder] = plain.split(' - ')
					subtitles.push({
						...entry,
						_type: 'internationalizedArrayRichTextValue',
						value: textToBlocks(remainder.join(' - ')),
					})
					return {
						...entry,
						_type: 'internationalizedArrayRichTextValue',
						value: textToBlocks(heading),
					}
				})
				return subtitles.length
					? { ...action, title, subtitle: subtitles }
					: action
			})
	}
	if (result._type === 'memoire') {
		seed('pastFestivalsTitle', {
			fr: 'Éditions',
			en: 'Editions',
			nl: 'Edities',
		})
	}
	return result
}
