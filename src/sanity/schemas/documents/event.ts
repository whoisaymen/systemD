import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'

export default defineType({
	name: 'event',
	title: 'Event',
	icon: VscCalendar,
	type: 'document',
	fields: [
		defineField({
			name: 'date',
			title: 'Date and Time',
			type: 'datetime',
		}),
		defineField({
			// should match 'languageField' plugin configuration setting, if customized
			name: 'language',
			type: 'string',
			readOnly: true,
			// hidden: true,
		}),
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
		}),
		defineField({
			name: 'image',
			type: 'image',
			options: {
				hotspot: true,
			},
		}),
	],
	preview: {
		select: {
			title: 'name',
			subtitle: 'date',
			media: 'image',
		},
	},
})
