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
		// Retain legacy values in saved documents without exposing retired controls.
		defineField({
			name: 'mapLinkLabel',
			type: 'internationalizedArrayRichText',
			hidden: true,
		}),
		defineField({
			name: 'formEmail',
			type: 'string',
			hidden: true,
			readOnly: true,
		}),
		defineField({
			name: 'phone',
			type: 'string',
			hidden: true,
			readOnly: true,
		}),
		defineField({
			name: 'address',
			title: 'Adresse',
			type: 'internationalizedArrayRichText',
			description:
				'Coordonnées affichées dans la section Contact : adresse, téléphone et email, avec la mise en forme de votre choix.',
		}),
		defineField({
			name: 'mapLocation',
			title: 'Google Maps',
			type: 'url',
			description: 'URL Google Maps de votre localisation',
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
