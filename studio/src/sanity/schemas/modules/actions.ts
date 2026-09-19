import { localizedRichTextPreview } from '../../lib/richTextPreview'
import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'actionsBlock',
	title: 'Actions',
	type: 'object',
	fields: [
		defineField({
			name: 'title',
			title: 'Titre',
			type: 'internationalizedArrayRichText',
		}),
		defineField({
			name: 'subtitle',
			title: 'Sous-titre',
			description:
				'Affiché sous le titre de l’action, au-dessus de son contenu.',
			type: 'internationalizedArrayRichText',
		}),
		defineField({
			name: 'text',
			title: 'Texte',
			type: 'internationalizedBlock',
		}),
	],
	preview: {
		select: {
			title: 'title',
			text: 'text',
		},
		prepare({ title, text }) {
			const getLocalizedValue = localizedRichTextPreview

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
			}
		},
	},
})
