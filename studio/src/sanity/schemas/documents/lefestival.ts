import { defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'

export default defineType({
	name: 'lefestival',
	title: 'Festival',
	icon: VscCalendar,
	type: 'document',
	fields: [
		defineField({
			name: 'visionTitle',
			title: 'Intitulé « Notre vision »',
			description: 'Texte du bouton qui ouvre la section (par exemple « Notre vision » ou « Our vision »).',
			type: 'internationalizedArrayString',
		}),
		defineField({
			name: 'vision',
			title: 'Notre vision',
			type: 'array',
			of: [{ type: 'visionBlock' }],
		}),
		defineField({
			name: 'blocks',
			title: 'Blocs',
			type: 'array',
			of: [
				{ type: 'mediaTeaserBlock' },
				{ type: 'customTextBlock' },
				{ type: 'juryBlock' },
				{ type: 'onTourBlock' },
			],
		}),
	],
	preview: {
		prepare: () => ({
			title: 'Festival',
		}),
	},
})
