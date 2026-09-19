import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'customTextBlock',
	title: 'Bloc de texte',
	type: 'object',
	fields: [
		defineField({
			name: 'title',
			title: 'Nom du bloc dans le Studio',
			description:
				'Repère interne. Le texte visible sur le site se modifie dans Contenu.',
			type: 'string',
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
		select: {
			title: 'title',
		},
		prepare({ title }) {
			return {
				title: title || 'Bloc de texte',
			}
		},
	},
})
