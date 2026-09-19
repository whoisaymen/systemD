import { localizedRichTextPreview } from '../../lib/richTextPreview'
import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'customParagraph',
	title: 'Custom paragraph',
	type: 'object',
	fields: [
		defineField({
			name: 'text',
			title: 'Text',
			type: 'internationalizedArrayRichText',
		}),

		defineField({
			name: 'svgMarkup',
			title: 'SVG Markup',
			type: 'text', // or 'code' if you want syntax highlighting
		}),
		// defineField({
		// 	name: 'svg',
		// 	title: 'SVG Illustration',
		// 	type: 'code',
		// 	options: {
		// 		language: 'svg',
		// 		theme: 'github',
		// 	},
		// 	description:
		// 		'Paste SVG markup here. Use fill="currentColor" for theme support.',
		// }),
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
				title: displayText.substring(0, 100),
			}
		},
	},
})
