import { defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'

export default defineType({
	name: 'fabrique',
	title: 'La Fabrique',
	icon: VscCalendar,
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Titre',
			type: 'internationalizedArrayString',
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'internationalizedArrayText',
		}),
		defineField({
			name: 'actions',
			title: 'Actions',
			type: 'array',
			of: [{ type: 'actionsBlock' }],
		}),
		defineField({
			name: 'vision',
			title: 'Vision',
			type: 'array',
			of: [{ type: 'visionBlock' }],
		}),
	],
	preview: {
		prepare: () => ({
			title: 'La Fabrique',
		}),
	},
})
