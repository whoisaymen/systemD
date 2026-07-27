import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'onTourBlock',
	title: 'Bloc “on tour”',
	type: 'object',
	fields: [
		defineField({
			name: 'events',
			title: 'Événements “on tour”',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'event' }] }],
		}),
		defineField({
			name: 'show',
			title: 'Afficher',
			type: 'boolean',
			initialValue: true,
		}),
	],
	preview: {
		prepare: () => ({
			title: 'Bloc “on tour”',
		}),
	},
})
