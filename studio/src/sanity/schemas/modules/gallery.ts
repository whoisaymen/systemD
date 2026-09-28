import { defineField, defineType } from 'sanity'
import { richTextToPlainText } from '../../lib/richTextPreview'

export default defineType({
	name: 'photoGalleryBlock',
	title: 'Galerie de photos',
	type: 'object',
	fields: [
		defineField({
			name: 'photographer',
			title: 'Photographer',
			type: 'array',
			of: [{ type: 'block' }],
		}),
		defineField({
			name: 'photos',
			title: 'Photos',
			type: 'array',
			of: [
				{
					type: 'image',
					options: {
						hotspot: true,
					},
				},
			],
			// of: [
			// 	{
			// 		type: 'object',
			// 		fields: [
			// 			defineField({
			// 				name: 'photo',
			// 				title: 'Photo',
			// 				type: 'image',
			// 				options: {
			// 					hotspot: true,
			// 				},
			// 			}),
			// 			defineField({
			// 				name: 'altText',
			// 				title: 'Texte alternatif',
			// 				type: 'string',
			// 				options: {
			// 					isHighlighted: true, // This will make the field appear in the image editor
			// 				},
			// 			}),
			// 		],
			// 		preview: {
			// 			select: {
			// 				title: 'altText',
			// 				media: 'photo',
			// 			},
			// 			prepare({ title, media }) {
			// 				return {
			// 					title: title || 'Sans texte alternatif',
			// 					media,
			// 				}
			// 			},
			// 		},
			// 	},
			// ],
			options: {
				layout: 'grid',
			},
		}),
	],
	preview: {
		select: {
			title: 'photographer',
			photos: 'photos',
		},
		prepare({ title, photos }) {
			const firstPhoto = photos?.[0]?.asset ? photos[0] : undefined

			return {
				title: title
					? `Photos par ${richTextToPlainText(title)}`
					: 'Galerie de photos',
				media: firstPhoto,
			}
		},
	},
})
