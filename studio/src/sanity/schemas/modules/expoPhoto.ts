import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'expoPhotoBlock',
	title: 'Expo photo',
	type: 'object',
	fields: [
		defineField({
			name: 'curatorName',
			title: 'Nom du curateur',
			type: 'string',
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
							type: 'string',
						}),
						defineField({
							name: 'copyright',
							title: 'Copyright',
							type: 'string',
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
				title,
				media,
			}
		},
	},
})
