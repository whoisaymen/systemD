import { localizedRichTextPreview } from '../../lib/richTextPreview'
import { defineField, defineType } from 'sanity'
import { FaAlignLeft } from 'react-icons/fa'

export default defineType({
	name: 'customParagraph',
	title: 'Texte',
	type: 'object',
	icon: FaAlignLeft,
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
			return {
				title: localizedRichTextPreview(text).substring(0, 100) || 'Texte',
				subtitle: 'Texte',
				media: FaAlignLeft,
			}
		},
	},
})
