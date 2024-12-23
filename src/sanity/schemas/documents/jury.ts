import { defineField, defineType, KeyedObject } from 'sanity'
import { GoPerson } from 'react-icons/go'

export default defineType({
	name: 'jury',
	title: 'Jury',
	type: 'document',
	icon: GoPerson,
	fields: [
		defineField({
			name: 'name',
			title: 'Name',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'title',
			title: 'Title',
			type: 'internationalizedArrayString',
			description: "Team member's role",
		}),
		defineField({
			name: 'image',
			title: 'Image',
			type: 'image',
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: 'biography',
			title: 'Biography',
			type: 'internationalizedArrayText',
		}),
		defineField({
			name: 'festival',
			title: 'Festival',
			type: 'reference',
			to: [{ type: 'festival' }],
			description: 'The festival this jury member is associated with',
		}),
	],
	preview: {
		select: {
			title: 'name',
			subtitle: 'title',
			media: 'image',
		},
		prepare({ title, subtitle, media }) {
			const subtitleText = subtitle?.length
				? subtitle?.find((v: KeyedObject) => v?._key === 'fr')?.value
				: ''
			return {
				title,
				subtitle: subtitleText,
				media,
			}
		},
	},
})
