import { defineField, defineType } from 'sanity'
import { FaQuoteRight } from 'react-icons/fa'

export default defineType({
	name: 'internationalizedCitationBlock',
	title: 'Citation',
	type: 'object',
	fields: [
		defineField({
			name: 'text',
			title: 'Texte',
			type: 'internationalizedArrayText',
		}),
		defineField({
			name: 'author',
			title: 'Auteur',
			type: 'string',
		}),
	],
	preview: {
		select: {
			text: 'text',
			author: 'author',
		},
		prepare({ text, author }) {
			const getLocalizedValue = (array: any[], lang: string) =>
				array?.find((v) => v?._key === lang)?.value

			const displayText =
				getLocalizedValue(text, 'fr') ||
				getLocalizedValue(text, 'en') ||
				getLocalizedValue(text, 'nl') ||
				''

			return {
				title: author || 'Unknown Author',
				subtitle: displayText.substring(0, 100), // Show the first 100 characters of the text
				media: FaQuoteRight,
			}
		},
	},
})
