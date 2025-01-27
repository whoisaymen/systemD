import { defineField, defineType } from 'sanity'
import { MdEmail } from 'react-icons/md'

export default defineType({
	name: 'contact',
	title: 'Contact',
	type: 'document',
	icon: MdEmail,
	fields: [
		defineField({
			name: 'formEmail',
			title: 'Email pour le formulaire',
			type: 'string',
			validation: (Rule) => Rule.required().email(),
		}),
		defineField({
			name: 'address',
			title: 'Adresse',
			type: 'internationalizedArrayText',
		}),
		defineField({
			name: 'mapLocation',
			title: 'Google Maps',
			type: 'url',
			description: 'URL Google Maps de votre localisation',
		}),
		defineField({
			name: 'phone',
			title: 'Téléphone',
			type: 'string',
		}),
		defineField({
			name: 'backgroundColor',
			title: 'Couleur de fond',
			type: 'color',
		}),
		defineField({
			name: 'textColor',
			title: 'Couleur du texte',
			type: 'color',
		}),
		defineField({
			name: 'partners',
			title: 'Logos des partenaires',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						defineField({
							name: 'name',
							title: 'Nom du partenaire',
							type: 'string',
						}),
						defineField({
							name: 'logo',
							title: 'Logo',
							type: 'image',
							options: {
								hotspot: true,
							},
						}),
						defineField({
							name: 'url',
							title: 'Site web',
							type: 'url',
						}),
					],
					preview: {
						select: {
							title: 'name',
							media: 'logo',
						},
					},
				},
			],
		}),
	],
	preview: {
		prepare() {
			return {
				title: 'Contact',
			}
		},
	},
})
