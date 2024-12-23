import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'
import imageBlock from '../fragments/image-block'

export default defineType({
	name: 'memoire',
	title: 'La Mémoire',
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
		// 	defineField({
		// 		name: 'categories',
		// 		type: 'array',
		// 		of: [
		// 			{
		// 				type: 'reference',
		// 				to: [{ type: 'blog.category' }],
		// 			},
		// 		],
		// 		group: 'content',
		// 	}),
		// 	defineField({
		// 		name: 'featured',
		// 		type: 'boolean',
		// 		group: 'options',
		// 		initialValue: false,
		// 	}),
		// 	defineField({
		// 		name: 'hideTableOfContents',
		// 		type: 'boolean',
		// 		group: 'options',
		// 		initialValue: false,
		// 	}),
		// 	defineField({
		// 		name: 'metadata',
		// 		type: 'metadata',
		// 		group: 'seo',
		// 	}),
	],
	preview: {
		prepare: () => ({
			title: 'La Mémoire',
		}),
	},
})
