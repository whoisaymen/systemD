import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'internationalizedImageBlock',
	title: 'Image',
	type: 'object',
	fields: [
		defineField({
			name: 'file',
			title: 'Fichier',
			type: 'image',
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: 'caption',
			title: 'Caption',
			type: 'internationalizedArrayString',
		}),
	],
})
