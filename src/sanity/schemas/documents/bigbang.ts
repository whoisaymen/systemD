import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'
import imageBlock from '../fragments/image-block'
import internationalizedBlock from './internationalizedBlock'

export default defineType({
	name: 'bigbang',
	title: 'Big Bang',
	icon: VscCalendar,
	type: 'document',
	groups: [
		// { name: 'content', default: true },
		// { name: 'options' },
		// { name: 'seo', title: 'SEO' },
	],
	fields: [
		defineField({
			name: 'body',
			title: 'Contenu',
			type: 'array',
			of: [
				{
					type: 'internationalizedBlock',
				},
			],
		}),
		// defineField({
		// 	name: 'metadata',
		// 	type: 'metadata',
		// 	group: 'seo',
		// }),
	],
	preview: {
		prepare: () => ({
			title: 'Big Bang',
		}),
	},
})
