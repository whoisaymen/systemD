import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'
import imageBlock from '../fragments/image-block'
import internationalizedBlock from './internationalizedBlock'

export default defineType({
	name: 'bigbangShortStory',
	title: 'Short story',
	icon: VscCalendar,
	type: 'document',
	groups: [
		// { name: 'content', default: true },
		// { name: 'options' },
		// { name: 'seo', title: 'SEO' },
	],
	fields: [
		// defineField({
		// 	name: 'body',
		// 	title: 'Paragraphes',
		// 	type: 'array',
		// 	of: [
		// 		{
		// 			type: 'internationalizedBlock',
		// 		},
		// 	],
		// }),
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
	// defineField({
	// 	name: 'metadata',
	// 	type: 'metadata',
	// 	group: 'seo',
	// }),
	preview: {
		prepare: () => ({
			title: 'Short story',
		}),
	},
})
