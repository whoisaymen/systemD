import {
	localizedRichTextPreview,
	richTextToPlainText,
} from '../../lib/richTextPreview'
import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'visionBlock',
	title: 'Vision',
	type: 'object',
	fields: [
		defineField({
			name: 'text',
			title: 'Contenu',
			description: 'Ajoutez vos titres et paragraphes dans cet éditeur. Le style « Titre en étiquette » reprend la présentation graphique des titres.',
			type: 'internationalizedArrayRichText',
		}),
	],
	preview: {
		select: {
			text: 'text',
		},
		prepare({ text }) {
			const getLocalizedValue = localizedRichTextPreview
			const content = ['fr', 'en', 'nl']
				.map(
					(language) =>
						text?.find(
							(entry: any) => (entry.language || entry._key) === language,
						)?.value,
				)
				.find((value) => Array.isArray(value) && value.length)
			const displayTitle = richTextToPlainText(content?.slice(0, 1)) || 'Vision'

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
