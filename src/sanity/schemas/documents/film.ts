import { defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'

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
			name: 'slug',
			type: 'slug',
			title: 'Slug URL',
			description: `"Slug URL" est le chemin ou le lien permanent de l'URL. Il est généré automatiquement à partir du titre. Par exemple, si le titre est "La Haine", le slug sera "fight-club", et sera accessible à https://systemd.brussels/film/la-haine.
`,
			options: {
				source: (doc: any) => {
					const defaultLanguage = 'en' // Replace with your default language
					const titleArray = doc.title || doc.metadata.title
					const titleObject =
						titleArray.find((item: any) => item.language === defaultLanguage) ||
						titleArray[0]
					return titleObject ? titleObject.value : 'untitled'
				},
				slugify: (input: string) =>
					input
						.trim() // Trim leading and trailing spaces
						.toLowerCase()
						.replace(/\s+/g, '-') // Replace spaces with hyphens
						.replace(/[^\w-]+/g, '') // Remove all non-word characters except hyphens
						.slice(0, 96), // Limit slug length to 96 characters
			},
			validation: (Rule) => Rule.required(),
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
		// defineField({
		// 	name: 'gallery',
		// 	title: 'Galerie de photos',
		// 	type: 'array',
		// 	of: [{ type: 'photoGalleryBlock' }],
		// }),
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
			title: 'URL',
			type: 'url',
		}),
		defineField({
			name: 'festival',
			title: 'Festival',
			type: 'reference',
			to: [{ type: 'festival' }],
			description: 'Sélectionnez le festival auquel ce film appartient',
		}),
	],
	preview: {
		select: {
			title: 'title',
			year: 'year',
			director: 'director',
			festival: 'festival.year',
			affiche: 'affiche',
			gallery: 'gallery',
		},
		prepare(selection) {
			const { title, year, director, festival, affiche, gallery } = selection

			const getLocalizedValue = (array: any[], lang: string) => {
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

			const displayYear = festival ? `édition ${festival}` : `${year}`

			const media =
				affiche || (gallery && gallery.length > 0 ? gallery[0].photo : null)

			return {
				title: `${displayTitle} (${displayYear})`,
				subtitle: `Réalisé par ${director}`,
				media,
			}
		},
	},
})
