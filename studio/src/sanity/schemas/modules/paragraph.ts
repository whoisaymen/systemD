import { localizedRichTextPreview } from '../../lib/richTextPreview'
import { defineField, defineType } from 'sanity'
import { FaAlignLeft } from 'react-icons/fa'

export default defineType({
	name: 'internationalizedParagraphBlock',
	title: 'Paragraphe',
	type: 'object',
	fields: [
		defineField({
			name: 'text',
			title: 'Texte',
			type: 'internationalizedArrayRichText',
		}),
	],
	preview: {
		select: {
			text: 'text',
		},
		prepare({ text }) {
			const getLocalizedValue = localizedRichTextPreview

			const displayText =
				getLocalizedValue(text, 'fr') ||
				getLocalizedValue(text, 'en') ||
				getLocalizedValue(text, 'nl') ||
				''

			return {
				title: displayText.substring(0, 100), // Show the first 100 characters of the text
				media: FaAlignLeft,
			}
		},
	},
})
