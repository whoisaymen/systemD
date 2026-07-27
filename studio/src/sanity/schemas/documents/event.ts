import { defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'

export default defineType({
	name: 'event',
	title: 'Event',
	icon: VscCalendar,
	type: 'document',
	fields: [
		defineField({
			name: 'date',
			title: 'Date et heure de début',
			type: 'datetime',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'endDate',
			title: 'Date et heure de fin',
			description:
				'Optionnel. À remplir pour un événement sur plusieurs jours.',
			type: 'datetime',
			validation: (Rule) => Rule.min(Rule.valueOfField('date')),
		}),
		defineField({
			name: 'title',
			title: 'Nom',
			type: 'internationalizedArrayString',
		}),
		defineField({
			name: 'location',
			title: 'Lieu',
			type: 'string',
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
			endDate: 'endDate',
			media: 'visual',
		},
		prepare({ title, date, endDate, media }) {
			const getLocalizedValue = (array: any[], lang: string) => {
				if (!Array.isArray(array)) return null
				return array.find((v) => v?.language === lang || v?._key === lang)
					?.value
			}

			const displayTitle =
				getLocalizedValue(title, 'fr') ||
				getLocalizedValue(title, 'en') ||
				getLocalizedValue(title, 'nl') ||
				'Untitled'

			const formattedDate = date
				? `${new Date(date).getDate().toString().padStart(2, '0')}/${(new Date(date).getMonth() + 1).toString().padStart(2, '0')}/${new Date(date).getFullYear()}`
				: ''
			const formattedEndDate = endDate
				? `${new Date(endDate).getDate().toString().padStart(2, '0')}/${(new Date(endDate).getMonth() + 1).toString().padStart(2, '0')}/${new Date(endDate).getFullYear()}`
				: ''

			return {
				title: displayTitle,
				subtitle: formattedEndDate
					? `${formattedDate} - ${formattedEndDate}`
					: formattedDate,
				media,
			}
		},
	},
})
