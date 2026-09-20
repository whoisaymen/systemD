import { defineField, defineType } from 'sanity'
import { FaInfoCircle } from 'react-icons/fa'

export default defineType({
	name: 'contact',
	title: 'About',
	type: 'document',
	icon: FaInfoCircle,
	fields: [
		defineField({
			name: 'contactTitle',
			title: 'Titre de la section contact',
			type: 'internationalizedArrayRichText',
		}),
		defineField({
			name: 'partnersTitle',
			title: 'Titre des partenaires',
			type: 'internationalizedArrayRichText',
		}),
		// Retain the old label in saved drafts without exposing a retired control.
		defineField({
			name: 'mapLinkLabel',
			type: 'internationalizedArrayRichText',
			hidden: true,
		}),
		defineField({
			name: 'formEmail',
			title: 'Email pour le formulaire',
			type: 'string',
			validation: (Rule) => Rule.required().email(),
		}),
		defineField({
			name: 'address',
			title: 'Adresse',
			type: 'internationalizedArrayRichText',
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
							description:
								'Importez un SVG vectoriel monochrome sur fond transparent. Le site applique automatiquement la couleur du thème.',
							options: {
								accept: 'image/svg+xml',
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
		defineField({
			name: 'credits',
			title: 'Crédits',
			description: 'Texte affiché dans l’onglet Crédits de la page About.',
			type: 'internationalizedArrayRichText',
		}),
	],
	preview: {
		prepare() {
			return {
				title: 'About',
			}
		},
	},
})
