import { defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'

export default defineType({
	name: 'memoire',
	title: 'La Mémoire',
	icon: VscCalendar,
	type: 'document',
	fields: [
		defineField({
			name: 'description',
			title: 'Description',
			description:
				'Texte d’introduction affiché au-dessus des éditions. Utilisez le style Normal pour le texte courant, comme dans Short story.',
			type: 'internationalizedArrayRichText',
		}),
		defineField({
			name: 'pastFestivalsTitle',
			title: 'Titre des éditions précédentes',
			description: 'Affiché sur mobile.',
			type: 'internationalizedArrayRichText',
		}),

		defineField({
			name: 'pastFestivals',
			title: 'Festivals passés',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'festival' }],
				},
			],
		}),
	],
	preview: {
		prepare: () => ({
			title: 'La Mémoire',
		}),
	},
})
