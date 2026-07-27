import { defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'

export default defineType({
	name: 'bigbangLongStory',
	title: 'Long story',
	icon: VscCalendar,
	type: 'document',
	fields: [
		defineField({
			name: 'body',
			title: 'Paragraphes',
			type: 'array',
			of: [
				{ type: 'internationalizedCitationBlock' },
				{ type: 'internationalizedParagraphBlock' },
				{ type: 'internationalizedImageBlock' },
			],
		}),
	],
	preview: {
		prepare: () => ({
			title: 'Long story',
		}),
	},
})
