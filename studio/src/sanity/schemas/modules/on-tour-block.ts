import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'onTourBlock',
	title: 'Bloc événements',
	type: 'object',
	fields: [
		defineField({
			name: 'events',
			title: 'Événements',
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
			title: 'Bloc événements',
		}),
	},
})
