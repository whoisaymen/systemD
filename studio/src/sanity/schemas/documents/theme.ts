import { defineField, defineType } from 'sanity'
import { VscSymbolColor } from 'react-icons/vsc'

export default defineType({
	name: 'theme',
	title: 'Thème',
	icon: VscSymbolColor,
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Nom',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Identifiant',
			type: 'slug',
			options: {
				source: 'title',
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'primaryColor',
			title: 'Couleur primaire',
			type: 'color',
			group: 'colors',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'darkColor',
			title: 'Couleur de fond',
			type: 'color',
			group: 'colors',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'grayDarkColor',
			title: 'Couleur secondaire',
			type: 'color',
			group: 'colors',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'imageGrade',
			title: 'Filtre des images',
			type: 'object',
			options: {
				columns: 2,
			},
			fields: [
				defineField({
					name: 'gray',
					title: 'Grayscale',
					type: 'number',
					initialValue: 1,
					validation: (Rule) => Rule.required(),
				}),
				defineField({
					name: 'sepia',
					title: 'Sepia',
					type: 'number',
					initialValue: 0.72,
					validation: (Rule) => Rule.required(),
				}),
				defineField({
					name: 'saturate',
					title: 'Saturation',
					type: 'number',
					initialValue: 2,
					validation: (Rule) => Rule.required(),
				}),
				defineField({
					name: 'hue',
					title: 'Hue rotate (degrés)',
					type: 'number',
					initialValue: 174,
					validation: (Rule) => Rule.required(),
				}),
				defineField({
					name: 'contrast',
					title: 'Contraste',
					type: 'number',
					initialValue: 0.92,
					validation: (Rule) => Rule.required(),
				}),
				defineField({
					name: 'brightness',
					title: 'Luminosité',
					type: 'number',
					initialValue: 1.08,
					validation: (Rule) => Rule.required(),
				}),
			],
		}),
	],
	groups: [{ name: 'colors', title: 'Couleurs', default: true }],
	preview: {
		select: {
			title: 'title',
			primary: 'primaryColor.hex',
			dark: 'darkColor.hex',
		},
		prepare: ({ title, primary, dark }) => ({
			title,
			subtitle: [primary, dark].filter(Boolean).join(' / '),
			media: VscSymbolColor,
		}),
	},
})
