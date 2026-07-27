import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'mediaTeaserBlock',
	title: 'Bloc teaser média',
	type: 'object',
	fields: [
		defineField({
			name: 'image',
			title: 'Image',
			type: 'image',
			options: { hotspot: true },
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
		defineField({
			name: 'text',
			title: 'Texte',
			type: 'internationalizedArrayText',
		}),
		defineField({
			name: 'show',
			title: 'Afficher',
			type: 'boolean',
			initialValue: true,
		}),
	],
	preview: {
		select: {
			image: 'image',
		},
		prepare({ image }) {
			return {
				title: 'Média teaser',
				media: image,
			}
		},
	},
})
