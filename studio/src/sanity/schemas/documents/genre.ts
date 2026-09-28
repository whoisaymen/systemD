import { getBlockText } from '@/sanity/lib/utils'
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
			type: 'internationalizedArrayRichText',
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
				const value = array.find(
					(v) => v?.language === lang || v?._key === lang,
				)?.value
				return typeof value === 'string' ? value : getBlockText(value, ' ')
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
