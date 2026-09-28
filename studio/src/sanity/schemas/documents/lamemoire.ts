import { defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'

export default defineType({
	name: 'memoire',
	title: 'La Mémoire',
	icon: VscCalendar,
	type: 'document',
	groups: [
		{ name: 'content', title: 'Contenu', default: true },
		{ name: 'menu', title: 'Menu' },
	],
	fields: [
		defineField({
			name: 'description',
			group: 'content',
			title: 'Description',
			description:
				'Texte d’introduction affiché au-dessus des éditions. Utilisez le style Normal pour le texte courant, comme dans Short story.',
			type: 'internationalizedArrayRichText',
		}),
		defineField({
			name: 'pastFestivalsTitle',
			group: 'content',
			title: 'Titre des éditions précédentes',
			description: 'Affiché sur mobile.',
			type: 'internationalizedArrayRichText',
		}),

		defineField({
			name: 'pastFestivals',
			group: 'content',
			title: 'Festivals passés',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'festival' }],
				},
			],
		}),
		defineField({
			name: 'menu',
			title: 'Menu des éditions',
			group: 'menu',
			type: 'object',
			description:
				'Ces intitulés sont partagés par toutes les éditions du festival, sur mobile et ordinateur.',
			options: { collapsible: false },
			fields: [
				defineField({
					name: 'filmsTitle',
					title: 'Sélection des films',
					type: 'internationalizedArrayRichText',
				}),
				defineField({
					name: 'exhibitionTitle',
					title: 'Exposition',
					type: 'internationalizedArrayRichText',
				}),
				defineField({
					name: 'photosTitle',
					title: 'Galerie photo',
					type: 'internationalizedArrayRichText',
				}),
				defineField({
					name: 'juryTitle',
					title: 'Jury',
					type: 'internationalizedArrayRichText',
				}),
			],
		}),
	],
	preview: {
		prepare: () => ({
			title: 'La Mémoire',
		}),
	},
})
