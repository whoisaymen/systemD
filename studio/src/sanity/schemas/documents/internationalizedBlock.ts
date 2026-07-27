import { defineType, defineField, defineArrayMember } from 'sanity'

const supportedLanguages = [
	{ id: 'nb', title: 'Norwegian', isDefault: true },
	{ id: 'en', title: 'English' },
]

export default defineType({
	name: 'internationalizedBlock',
	title: 'Internationalized Rich Text',
	type: 'object', // Object because it's a container for multiple locales
	fields: [
		defineField({
			name: 'fr',
			title: 'Français',
			type: 'array',
			of: [defineArrayMember({ type: 'block' })],
		}),
		defineField({
			name: 'en',
			title: 'English',
			type: 'array',
			of: [defineArrayMember({ type: 'block' })],
		}),
		defineField({
			name: 'nl',
			title: 'Nederlands',
			type: 'array',
			of: [defineArrayMember({ type: 'block' })],
		}),
		// Add more locales here as needed, e.g., 'nl', 'de', etc.
	],
})
