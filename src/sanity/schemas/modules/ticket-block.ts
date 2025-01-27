import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'yellowTicketBlock',
	title: 'Bloc ticket',
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
			name: 'bigTitle',
			title: 'Grand titre',
			type: 'internationalizedArrayString',
		}),
		defineField({
			name: 'items',
			title: 'Éléments',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						defineField({
							name: 'smallTitle',
							title: 'Petit titre',
							type: 'internationalizedArrayString',
						}),
						defineField({
							name: 'text',
							title: 'Texte',
							type: 'internationalizedArrayString',
						}),
					],
					preview: {
						select: {
							title: 'smallTitle',
							subtitle: 'text',
						},
						prepare({ title, subtitle }) {
							const getLocalizedValue = (array: any[], lang: string) => {
								if (!Array.isArray(array)) return null
								return array.find((v) => v?._key === lang)?.value
							}

							const displayTitle =
								getLocalizedValue(title, 'fr') ||
								getLocalizedValue(title, 'en') ||
								getLocalizedValue(title, 'nl') ||
								'Sans titre'

							const displaySubtitle =
								getLocalizedValue(subtitle, 'fr') ||
								getLocalizedValue(subtitle, 'en') ||
								getLocalizedValue(subtitle, 'nl') ||
								'Sans texte'

							return {
								title: displayTitle,
								subtitle: displaySubtitle,
							}
						},
					},
				},
			],
		}),
		defineField({
			name: 'circleText',
			title: 'Texte du cercle',
			type: 'internationalizedArrayString',
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
				title: 'Bloc ticket',
			}
		},
	},
})
