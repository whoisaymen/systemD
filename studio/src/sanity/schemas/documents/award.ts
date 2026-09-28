import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'award',
	title: 'Prix',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Titre',
			type: 'string',
			description: 'Le titre du prix.',
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
			description: 'Description du prix.',
		}),
		defineField({
			name: 'visual',
			title: 'Visuel',
			type: 'image',
			options: {
				hotspot: true,
			},
		}),
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'description',
			media: 'visual',
		},
	},
})
