import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'programming',
	title: 'Programmation',
	type: 'document',
	fields: [
		defineField({
			name: 'brochureLink',
			title: 'Brochure Link',
			type: 'url',
		}),
		defineField({
			name: 'programDetails',
			title: 'Program Details',
			type: 'text',
		}),
	],
	preview: {
		prepare: () => ({
			title: 'Programmation',
		}),
	},
})
