import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'practicalInfo',
	title: 'Infos pratiques',
	type: 'document',
	fields: [
		defineField({
			name: 'dates',
			title: 'Dates',
			type: 'string',
			description: 'Dates du festival.',
		}),
		defineField({
			name: 'locations',
			title: 'Lieux',
			type: 'string',
			description: 'Lieux où se déroule le festival.',
		}),
		defineField({
			name: 'ticketingLink',
			title: 'Lien de billetterie',
			type: 'url',
		}),
		defineField({
			name: 'additionalInfo',
			title: 'Informations supplémentaires',
			type: 'text',
		}),
	],
	preview: {
		select: {
			title: 'dates',
			subtitle: 'locations',
		},
	},
})
