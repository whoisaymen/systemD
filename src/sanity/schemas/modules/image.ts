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
		defineField({
			name: 'video',
			title: 'Vidéo',
			type: 'url',
		}),
		defineField({
			name: 'uploadedVideo',
			title: 'Vidéo (Upload)',
			type: 'file',
			options: {
				accept: 'video/*',
			},
		}),
	],
})
