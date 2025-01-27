import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'whiteTextBlock',
	title: 'Bloc de texte',
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
			name: 'content',
			title: 'Contenu',
			type: 'internationalizedBlock',
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
				title: 'Bloc de texte',
			}
		},
	},
})
