import { defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'

export default defineType({
	name: 'bigbangShortStory',
	title: 'Short story',
	icon: VscCalendar,
	type: 'document',
	fields: [
		defineField({
			name: 'tabLabel',
			title: 'Libellé de l’onglet',
			type: 'internationalizedArrayString',
		}),
		defineField({
			name: 'body',
			title: 'Contenu de la page',
			type: 'array',
			description:
				'Les textes et les illustrations s’affichent dans cet ordre sur la page. Glissez les blocs pour les déplacer, ou ajoutez un texte ou une illustration séparément.',
			of: [
				{
					type: 'customParagraph',
				},
				{
					type: 'storyIllustration',
				},
			],
		}),
	],
	preview: {
		prepare: () => ({
			title: 'Short story',
		}),
	},
})
