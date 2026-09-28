import { defineField, defineType } from 'sanity'
import { richTextToPlainText } from '../../lib/richTextPreview'

export default defineType({
	name: 'expoPhotoBlock',
	title: 'Exposition',
	type: 'object',
	fields: [
		defineField({
			name: 'curatorName',
			title: 'Nom du curateur',
			type: 'array',
			of: [{ type: 'block' }],
		}),
		defineField({
			name: 'description',
			title: 'Description de l’exposition',
			type: 'internationalizedArrayRichText',
			description:
				'Texte facultatif affiché sous le crédit du curateur, avant les images. Laissez vide pour ne rien afficher.',
		}),
		defineField({
			name: 'photos',
			title: 'Photos',
			type: 'array',
			of: [
				{
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
							name: 'artistName',
							title: "Nom de l'artiste",
							type: 'array',
							of: [{ type: 'block' }],
						}),
					],
				},
			],
		}),
	],
	preview: {
		select: {
			title: 'curatorName',
			media: 'photos.0.photo',
		},
		prepare(selection) {
			const { title, media } = selection
			return {
				title: richTextToPlainText(title),
				media,
			}
		},
	},
})
