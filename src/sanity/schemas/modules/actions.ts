import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'actionsBlock',
	title: 'Actions',
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
			type: 'internationalizedBlock',
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
			text: 'text',
			media: 'image',
		},
		prepare({ title, text, media }) {
			console.log(title, text)
			const getLocalizedValue = (array, lang) => {
				if (!Array.isArray(array)) return null
				return array.find((v: KeyedObject) => v?._key === lang)?.value
			}

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
