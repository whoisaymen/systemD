import { defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'

export default defineType({
	name: 'memoire',
	title: 'La Mémoire',
	icon: VscCalendar,
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Titre',
			type: 'internationalizedArrayString',
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'internationalizedArrayText',
		}),
		defineField({
			name: 'pastFestivals',
			title: 'Festivals passés',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'festival' }],
				},
			],
		}),
		defineField({
			name: 'pastOnTourEvents',
			title: 'Événements “on tour” passés',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'event' }],
				},
			],
		}),
	],
	preview: {
		prepare: () => ({
			title: 'La Mémoire',
		}),
	},
})
