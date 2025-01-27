import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'juryBlock',
	title: 'Bloc membres du jury',
	type: 'object',
	fields: [
		defineField({
			name: 'backgroundColor',
			title: 'Couleur de fond',
			type: 'color',
		}),
		defineField({
			name: 'textColor',
			title: 'Couleur du texte',
			type: 'color',
		}),
		defineField({
			name: 'juryMembers',
			title: 'Membres du jury',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'jury' }] }],
		}),
		defineField({
			name: 'show',
			title: 'Afficher',
			type: 'boolean',
			initialValue: true,
		}),
	],
	preview: {
		prepare() {
			return {
				title: 'Membres du jury',
			}
		},
	},
})
