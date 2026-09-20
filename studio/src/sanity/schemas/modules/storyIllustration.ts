import { defineField, defineType } from 'sanity'
import { FaShapes } from 'react-icons/fa'

export default defineType({
	name: 'storyIllustration',
	title: 'Illustration',
	type: 'object',
	icon: FaShapes,
	fieldsets: [
		{
			name: 'artwork',
			title: 'Dessin SVG',
			options: { collapsible: true, collapsed: true },
		},
	],
	fields: [
		defineField({
			name: 'label',
			title: 'Nom dans le Studio',
			type: 'string',
			description:
				'Un repère pour retrouver le dessin. Ce nom n’apparaît pas sur le site.',
		}),
		defineField({
			name: 'size',
			title: 'Largeur',
			type: 'string',
			initialValue: 'wide',
			options: {
				layout: 'radio',
				direction: 'horizontal',
				list: [
					{ title: 'Large', value: 'wide' },
					{ title: 'Compacte', value: 'compact' },
				],
			},
			description: 'La largeur reste la même lorsque vous déplacez ce bloc.',
		}),
		defineField({
			name: 'svgMarkup',
			title: 'Code SVG',
			type: 'text',
			fieldset: 'artwork',
			description:
				'Le dessin complet au format SVG, avec les couleurs du thème.',
			validation: (Rule) => Rule.required(),
		}),
	],
	preview: {
		select: { label: 'label', size: 'size' },
		prepare({ label, size }) {
			return {
				title: label || 'Illustration',
				subtitle: `Illustration · ${size === 'compact' ? 'Compacte' : 'Large'}`,
				media: FaShapes,
			}
		},
	},
})
