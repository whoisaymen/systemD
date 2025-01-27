import { defineField, defineType } from 'sanity'
import { VscTag } from 'react-icons/vsc'

export default defineType({
	name: 'genre',
	title: 'Genre du film',
	type: 'document',
	icon: VscTag,
	fields: [
		defineField({
			name: 'title',
			title: 'Titre',
			type: 'internationalizedArrayString',
			validation: (Rule) => Rule.required(),
		}),
	],
	preview: {
		select: {
			title: 'title',
		},
		prepare({ title }) {
			const getLocalizedValue = (array: any[], lang: string) => {
				if (!Array.isArray(array)) return null
				return array.find((v) => v?._key === lang)?.value
			}

			const displayTitle =
				getLocalizedValue(title, 'fr') ||
				getLocalizedValue(title, 'en') ||
				getLocalizedValue(title, 'nl') ||
				'Sans titre'

			return {
				title: displayTitle,
			}
		},
	},
})
