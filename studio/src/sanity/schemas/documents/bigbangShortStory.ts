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
			title: 'Paragraphes',
			type: 'array',
			of: [
				{
					type: 'customParagraph',
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
