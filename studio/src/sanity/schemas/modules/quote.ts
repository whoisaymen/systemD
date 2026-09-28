import { localizedRichTextPreview } from '../../lib/richTextPreview'
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
			type: 'internationalizedArrayRichText',
		}),
		defineField({
			name: 'author',
			title: 'Auteur',
			type: 'array',
			of: [{ type: 'block' }],
		}),
	],
	preview: {
		select: {
			text: 'text',
			author: 'author',
		},
		prepare({ text, author }) {
			const getLocalizedValue = localizedRichTextPreview

			const displayText =
				getLocalizedValue(text, 'fr') ||
				getLocalizedValue(text, 'en') ||
				getLocalizedValue(text, 'nl') ||
				''

			return {
				title: localizedRichTextPreview(author) || 'Unknown Author',
				subtitle: displayText.substring(0, 100), // Show the first 100 characters of the text
				media: FaQuoteRight,
			}
		},
	},
})
