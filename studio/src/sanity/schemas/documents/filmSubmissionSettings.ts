import { defineType } from 'sanity'
import { filmSubmissionContent } from '../objects/filmSubmissionContent'

export default defineType({
	name: 'filmSubmissionSettings',
	title: 'Formulaire de participation',
	type: 'document',
	fields: [filmSubmissionContent],
	preview: {
		prepare: () => ({ title: 'Formulaire de participation' }),
	},
})
