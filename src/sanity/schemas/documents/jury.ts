import { defineField, defineType, KeyedObject } from 'sanity'
import { GoPerson } from 'react-icons/go'
import festival from './festival'

export default defineType({
	name: 'jury',
	title: 'Membre du jury',
	type: 'document',
	icon: GoPerson,
	fields: [
		defineField({
			name: 'name',
			title: 'Nom',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'image',
			type: 'image',
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: 'biography',
			title: 'Biographie',
			type: 'internationalizedArrayText',
		}),
		defineField({
			name: 'edition',
			title: 'Festival',
			type: 'reference',
			to: [{ type: 'festival' }],
			description: "L'édition du festival auquel ce membre du jury est associé",
		}),
	],
	preview: {
		select: {
			title: 'name',
			festivalYear: 'edition.year',
			media: 'image',
		},
		prepare({ title, festivalYear, media }) {
			return {
				title,
				subtitle: festivalYear
					? `Édition ${festivalYear}`
					: 'Aucune édition associée',
				media,
			}
		},
	},
})
