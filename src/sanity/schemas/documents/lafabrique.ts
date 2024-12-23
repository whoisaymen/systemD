import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'
import imageBlock from '../fragments/image-block'

export default defineType({
	name: 'fabrique',
	title: 'La Fabrique',
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
	],
	preview: {
		prepare: () => ({
			title: 'La Fabrique',
		}),
	},
})
