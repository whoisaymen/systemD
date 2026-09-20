import { getBlockText } from '@/sanity/lib/utils'
import { localizedRichTextPreview } from '@/sanity/lib/richTextPreview'
import { defineField, defineType } from 'sanity'
import { GoPerson } from 'react-icons/go'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'

export default defineType({
	name: 'person',
	title: "Membre de l'équipe",
	type: 'document',
	icon: GoPerson,
	orderings: [orderRankOrdering],
	fields: [
		orderRankField({ type: 'person' }),
		defineField({
			name: 'name',
			title: 'Nom',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'role',
			title: 'Fonction',
			description: 'Fonction au sein de l’équipe, affichée sous le nom.',
			type: 'internationalizedArrayString',
		}),

		defineField({
			name: 'image',
			type: 'image',
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: 'biography',
			title: 'Biographie',
			type: 'internationalizedArrayRichText',
		}),
	],
	preview: {
		select: {
			title: 'name',
			media: 'image',
			role: 'role',
		},
		prepare({ title, media, role }) {
			return {
				title: typeof title === 'string' ? title : getBlockText(title, ' '),
				media,
				subtitle: localizedRichTextPreview(role),
			}
		},
	},
})
