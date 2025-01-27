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
			title: 'Date et heure',
			type: 'datetime',
		}),
		defineField({
			name: 'title',
			title: 'Nom',
			type: 'internationalizedArrayString',
		}),
		defineField({
			name: 'visual',
			title: 'Visuel',
			type: 'image',
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'internationalizedArrayText',
			validation: (Rule) => Rule.max(250),
		}),
		defineField({
			name: 'pressLink',
			title: 'Lien de presse',
			type: 'url',
		}),
	],
	preview: {
		select: {
			title: 'title',
			date: 'date',
			media: 'visual',
		},
		prepare({ title, date, media }) {
			const getLocalizedValue = (array, lang) => {
				if (!Array.isArray(array)) return null
				return array.find((v) => v?._key === lang)?.value
			}

			const displayTitle =
				getLocalizedValue(title, 'fr') ||
				getLocalizedValue(title, 'en') ||
				getLocalizedValue(title, 'nl') ||
				'Untitled'

			const formattedDate = date
				? `${new Date(date).getDate().toString().padStart(2, '0')}/${(new Date(date).getMonth() + 1).toString().padStart(2, '0')}/${new Date(date).getFullYear()}`
				: ''

			return {
				title: displayTitle,
				subtitle: formattedDate,
				media,
			}
		},
	},
})
