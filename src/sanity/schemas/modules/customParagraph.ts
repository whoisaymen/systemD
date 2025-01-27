import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'customParagraph',
	title: 'Custom paragraph',
	type: 'object',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'internationalizedArrayString',
		}),
		defineField({
			name: 'text',
			title: 'Text',
			type: 'internationalizedArrayText',
		}),
		defineField({
			name: 'image',
			title: 'Image',
			type: 'image',
			options: {
				hotspot: true,
			},
		}),
	],
	preview: {
		select: {
			title: 'title',
			media: 'image',
			text: 'text',
		},
		prepare({ title, text, media }) {
			const getLocalizedValue = (array: any[], lang: string) =>
				array?.find((v) => v?._key === lang)?.value

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
				subtitle: displayText.substring(0, 100), // Show the first 100 characters of the text
				media,
			}
		},
	},
})
