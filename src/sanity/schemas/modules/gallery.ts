import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'photoGalleryBlock',
	title: 'Galerie de photos',
	type: 'object',
	fields: [
		defineField({
			name: 'photo',
			title: 'Photo',
			type: 'image',
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: 'caption',
			title: 'Légende',
			type: 'string',
		}),
		defineField({
			name: 'altText',
			title: 'Texte alternatif',
			type: 'string',
		}),
	],
	preview: {
		select: {
			media: 'photo',
			caption: 'caption',
		},
		prepare({ media, caption }) {
			return {
				title: caption || 'Sans légende',
				media,
			}
		},
	},
})
