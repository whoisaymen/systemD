import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'festival',
	title: 'Festival',
	type: 'document',
	fields: [
		defineField({
			name: 'year',
			title: 'Année',
			type: 'number',
			validation: (Rule) =>
				Rule.required().min(1900).max(new Date().getFullYear()),
		}),
		defineField({
			name: 'venue',
			title: 'Lieu',
			type: 'string',
		}),
		defineField({
			name: 'visual',
			title: 'Visuel',
			type: 'image',
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'internationalizedArrayText',
			validation: (Rule) => Rule.max(250),
		}),
		defineField({
			name: 'pressLink',
			title: 'Lien de presse',
			type: 'url',
		}),
		defineField({
			name: 'filmSelection',
			title: 'Films sélectionnés',
			type: 'array',
			validation: (Rule) => Rule.unique(),
			of: [
				{
					type: 'reference',
					to: [{ type: 'film' }],
				},
			],
		}),
		defineField({
			name: 'jury',
			title: 'Membres du jury',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'jury' }] }],
		}),
		defineField({
			name: 'photoGallery',
			title: 'Galerie de photos',
			type: 'array',
			of: [{ type: 'photoGalleryBlock' }],
		}),
		defineField({
			name: 'expoPhoto',
			title: 'Expo photo',
			type: 'array',
			of: [{ type: 'expoPhotoBlock' }],
		}),
	],
	preview: {
		select: {
			title: 'year',
			subtitle: 'venue',
			media: 'visual',
		},
		prepare({ title, subtitle, media }) {
			return {
				title: `Édition ${title}`,
				subtitle,
				media,
			}
		},
	},
})
