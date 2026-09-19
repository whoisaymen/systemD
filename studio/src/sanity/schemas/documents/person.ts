import { getBlockText } from '@/sanity/lib/utils'
import { defineField, defineType } from 'sanity'
import { GoPerson } from 'react-icons/go'

export default defineType({
	name: 'person',
	title: "Membre de l'équipe",
	type: 'document',
	icon: GoPerson,
	fields: [
		defineField({
			name: 'name',
			title: 'Nom',
			type: 'array',
			of: [
				{
					type: 'block',
					styles: [{ title: 'Normal', value: 'normal' }],
					lists: [],
				},
			],
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
			type: 'internationalizedArrayRichText',
		}),
	],
	preview: {
		select: {
			title: 'name',
			media: 'image',
		},
		prepare({ title, media }) {
			return {
				title: typeof title === 'string' ? title : getBlockText(title, ' '),
				media,
			}
		},
	},
})
