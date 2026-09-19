import { defineField, defineType } from 'sanity'
import { VscTag } from 'react-icons/vsc'

export default defineType({
	name: 'eventType',
	title: 'Type d’événement',
	type: 'document',
	icon: VscTag,
	fields: [
		defineField({
			name: 'title',
			title: 'Nom',
			description: 'Un libellé court : discussion, performance, projection, atelier…',
			type: 'internationalizedArrayString',
			validation: (Rule) => Rule.required().min(1),
		}),
	],
	preview: {
		select: { title: 'title' },
		prepare({ title }) {
			const label = ['fr', 'en', 'nl'].map((language) => {
				const value = Array.isArray(title)
					? title.find((entry) => entry.language === language || entry._key === language)?.value
					: undefined
				return typeof value === 'string' ? value.trim() : ''
			}).find(Boolean)
			return { title: label || 'Type sans nom' }
		},
	},
})
