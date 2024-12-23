import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'
import imageBlock from '../fragments/image-block'

export default defineType({
	name: 'lefestival',
	title: 'Festival',
	icon: VscCalendar,
	type: 'document',
	groups: [
		{ name: 'content', default: true },
		{ name: 'options' },
		{ name: 'seo', title: 'SEO' },
	],
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
		}),
		defineField({
			name: 'introText',
			title: 'Texte explicatif',
			type: 'text',
		}),
		defineField({
			name: 'teaserVideo',
			title: 'Vidéo teaser',
			type: 'url',
		}),
	],
	preview: {
		prepare: () => ({
			title: 'Festival',
		}),
	},
})
