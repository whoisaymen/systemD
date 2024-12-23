import { defineField, defineType, KeyedObject } from 'sanity'
import { FiUser, FiGlobe, FiUsers, FiMapPin } from 'react-icons/fi'
import { GoPerson } from 'react-icons/go'

export default defineType({
	name: 'person',
	title: 'Person',
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
			type: 'image',
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: 'biography',
			type: 'internationalizedArrayText',
			// group: 'localized',
			// hidden: (context) => context?.document?.name === undefined,
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
				: ``

			return {
				title,
				subtitle: subtitleText ?? ``,
				media,
			}
		},
	},
})
