import { defineField, defineType } from 'sanity'
import { GiPartyPopper } from 'react-icons/gi'

export default defineType({
	name: 'festival',
	title: 'Festival',
	type: 'document',
	fields: [
		defineField({
			name: 'name',
			title: 'Name',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'year',
			title: 'Year',
			type: 'number',
			validation: (Rule) =>
				Rule.required().min(1900).max(new Date().getFullYear()),
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
		}),
		defineField({
			name: 'jury',
			title: 'Jury Members',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'jury' }] }],
			description: 'The jury members for this festival',
		}),
	],
	preview: {
		select: {
			title: 'name',
			subtitle: 'year',
		},
	},
})
