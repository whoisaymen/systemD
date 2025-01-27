import { defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'
import photoGalleryBlock from '../objects/photoGalleryBlock'

export default defineType({
	name: 'film',
	title: 'Film',
	icon: VscCalendar,
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Titre',
			type: 'internationalizedArrayString',
		}),
		defineField({
			name: 'director',
			title: 'Nom du réalisateur',
			type: 'string',
		}),
		defineField({
			name: 'production',
			title: 'Nom de la production',
			type: 'string',
		}),
		defineField({
			name: 'year',
			title: 'Année',
			type: 'number',
			validation: (Rule) =>
				Rule.required().min(1900).max(new Date().getFullYear()),
		}),
		defineField({
			name: 'genre',
			title: 'Genre',
			type: 'reference',
			to: [{ type: 'genre' }],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'synopsis',
			title: 'Synopsis',
			type: 'internationalizedArrayText',
		}),
		defineField({
			name: 'city',
			title: 'Ville',
			type: 'internationalizedArrayString',
		}),
		defineField({
			name: 'length',
			title: 'Durée (minutes)',
			type: 'number',
		}),
		defineField({
			name: 'gallery',
			title: 'Galerie de photos',
			type: 'array',
			of: [{ type: 'photoGalleryBlock' }],
		}),
		defineField({
			name: 'affiche',
			title: 'Affiche',
			type: 'image',
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: 'playFilmUrl',
			title: 'URL du teaser du film',
			type: 'url',
		}),
	],
	preview: {
		select: {
			title: 'title',
			director: 'director',
			year: 'year',
			affiche: 'affiche',
			gallery: 'gallery',
		},
		prepare({ title, director, year, affiche, gallery }) {
			const getLocalizedValue = (array, lang) => {
				if (!Array.isArray(array)) return null
				return array.find((v) => v?._key === lang)?.value
			}

			const displayTitle =
				getLocalizedValue(title, 'fr') ||
				getLocalizedValue(title, 'en') ||
				getLocalizedValue(title, 'nl') ||
				'Untitled'

			// const displayDirector =
			// 	getLocalizedValue(director, 'fr') ||
			// 	getLocalizedValue(director, 'en') ||
			// 	getLocalizedValue(director, 'nl') ||
			// 	'Unknown Director'

			const media =
				affiche || (gallery && gallery.length > 0 ? gallery[0].photo : null)

			return {
				title: `${displayTitle} (${year})`,
				subtitle: `Réalisé par ${director}`,
				media,
			}
		},
	},
})
