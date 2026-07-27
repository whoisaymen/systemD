import { defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'

export default defineType({
	name: 'lefestival',
	title: 'Festival',
	icon: VscCalendar,
	type: 'document',
	fields: [
		defineField({
			name: 'description',
			title: 'Description',
			type: 'internationalizedArrayText',
		}),
		defineField({
			name: 'blocks',
			title: 'Blocs',
			type: 'array',
			of: [
				{ type: 'mediaTeaserBlock' },
				{ type: 'customTextBlock' },
				{ type: 'juryBlock' },
				// { type: 'ticketBlock' },
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
