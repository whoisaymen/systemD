import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'visionBlock',
	title: 'Vision',
	type: 'object',
	fields: [
		defineField({
			name: 'title',
			title: 'Titre',
			type: 'internationalizedArrayString',
		}),
		defineField({
			name: 'text',
			title: 'Texte',
			type: 'internationalizedArrayText',
		}),
	],
	preview: {
		select: {
			title: 'title',
			text: 'text',
		},
		prepare({ title, text }) {
			const getLocalizedValue = (array, lang) =>
				array?.find((v: KeyedObject) => v?._key === lang)?.value

			const displayTitle =
				getLocalizedValue(title, 'fr') ||
				getLocalizedValue(title, 'en') ||
				getLocalizedValue(title, 'nl') ||
				'Untitled'

			const displayText =
				getLocalizedValue(text, 'fr') ||
				getLocalizedValue(text, 'en') ||
				getLocalizedValue(text, 'nl') ||
				''

			return {
				title: displayTitle,
				subtitle: displayText.substring(0, 100),
			}
		},
	},
})
