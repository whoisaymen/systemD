import { defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'

export default defineType({
	name: 'fabrique',
	title: 'La Fabrique',
	icon: VscCalendar,
	type: 'document',
	fields: [
		defineField({
			name: 'description',
			title: 'Description',
			description: 'Présentation complète. Le style « Titre de niveau 2 » reprend la mise en forme du texte d’introduction.',
			type: 'internationalizedArrayRichText',
		}),

		defineField({
			name: 'actions',
			title: 'Actions',
			type: 'array',
			of: [{ type: 'actionsBlock' }],
		}),
		defineField({
			name: 'closingText',
			title: 'Texte de conclusion',
			description: 'Affiché après le collage de logos. Choisissez « Titre de niveau 2 » pour le grand titre, ou « Normal » pour un paragraphe.',
			type: 'internationalizedArrayRichText',
		}),

	],
	preview: {
		prepare: () => ({
			title: 'La Fabrique',
		}),
	},
})
