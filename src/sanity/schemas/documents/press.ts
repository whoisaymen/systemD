import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'press',
	title: 'Presse',
	type: 'document',
	fields: [
		defineField({
			name: 'pressText',
			title: 'Texte pour la presse',
			type: 'text',
			description: 'Informations à destination des journalistes.',
		}),
		defineField({
			name: 'pressKitLink',
			title: 'Lien vers le dossier de presse',
			type: 'url',
		}),
	],
	preview: {
		select: {
			title: 'pressText',
		},
		prepare(selection) {
			const { title } = selection
			return {
				title: title ? title.substring(0, 30) + '...' : 'Presse',
			}
		},
	},
})
