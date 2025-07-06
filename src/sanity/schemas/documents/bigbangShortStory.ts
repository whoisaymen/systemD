import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'
import imageBlock from '../fragments/image-block'
import internationalizedBlock from './internationalizedBlock'

export default defineType({
	name: 'bigbangShortStory',
	title: 'Short story',
	icon: VscCalendar,
	type: 'document',
	fields: [
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
