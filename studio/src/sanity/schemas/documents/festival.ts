import { defineField, defineType } from 'sanity'
import { richTextToPlainText } from '../../lib/richTextPreview'

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
			name: 'startDate',
			title: 'Date de début',
			type: 'date',
			description: "Optionnel. Utilisée pour afficher les dates de l'édition.",
		}),
		defineField({
			name: 'endDate',
			title: 'Date de fin',
			type: 'date',
			description: 'Optionnel. À remplir pour une édition sur plusieurs jours.',
			validation: (Rule) => Rule.min(Rule.valueOfField('startDate')),
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
			type: 'internationalizedArrayRichText',
			description:
				'Présentation complète de l’édition. Utilisez « Titre de niveau 2 » pour une introduction plus grande et « Normal » pour les paragraphes.',
		}),
		defineField({
			name: 'pressLink',
			title: 'Lien de presse',
			type: 'url',
		}),
		defineField({
			name: 'aftermovieLink',
			title: "Lien de l'aftermovie",
			type: 'url',
		}),
		defineField({
			name: 'jury',
			title: 'Membres du jury',
			type: 'array',
			description: 'Ajoutez les membres du jury pour cette édition.',
			validation: (Rule) => Rule.unique(),
			of: [
				{
					type: 'reference',
					to: [{ type: 'jury' }],
				},
			],
		}),
		// defineField({
		// 	name: 'filmSelection',
		// 	title: 'Films sélectionnés',
		// 	type: 'array',
		// 	validation: (Rule) => Rule.unique(),
		// 	of: [
		// 		{
		// 			type: 'reference',
		// 			to: [{ type: 'film' }],
		// 		},
		// 	],
		// }),
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
		defineField({
			name: 'overviewTitle',
			title: 'Titre : présentation',
			type: 'internationalizedArrayRichText',
		}),
		defineField({
			name: 'filmsTitle',
			title: 'Titre : sélection des films',
			type: 'internationalizedArrayRichText',
		}),
		defineField({
			name: 'exhibitionTitle',
			title: 'Titre : exposition photo',
			type: 'internationalizedArrayRichText',
		}),
		defineField({
			name: 'photosTitle',
			title: 'Titre : galerie photo',
			type: 'internationalizedArrayRichText',
		}),
		defineField({
			name: 'juryTitle',
			title: 'Titre : jury',
			type: 'internationalizedArrayRichText',
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
				subtitle: richTextToPlainText(subtitle),
				media,
			}
		},
	},
})
