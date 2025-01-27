import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'yellowBannerBlock',
	title: 'Bloc bannière jaune',
	type: 'object',
	fields: [
		defineField({
			name: 'color',
			title: 'Couleur',
			type: 'color',
		}),
		defineField({
			name: 'text',
			title: 'Texte',
			type: 'internationalizedArrayText',
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
				title: 'Bannière jaune',
			}
		},
	},
})
