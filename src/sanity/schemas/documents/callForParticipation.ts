import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'callForParticipation',
	title: 'Appel à participation',
	type: 'document',

	fields: [
		defineField({
			name: 'ctaText',
			title: 'Call-to-Action Text',
			type: 'text',
		}),
		defineField({
			name: 'ctaLink',
			title: 'Link',
			type: 'url',
		}),
	],
	preview: {
		prepare: () => ({
			title: 'Appel à participation',
		}),
	},
})
