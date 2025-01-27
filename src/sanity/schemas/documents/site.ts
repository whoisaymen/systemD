import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'site',
	title: 'Réglages',
	type: 'document',
	groups: [
		{ name: 'general', title: 'Général', default: true },
		{ name: 'socials', title: 'Réseaux sociaux' },
		{ name: 'seo', title: 'SEO' },
		{ name: 'visual', title: 'Identité visuelle' },
	],
	fields: [
		defineField({
			name: 'title',
			title: 'Titre',
			type: 'string',
			group: 'general',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'description',
			type: 'text',
			group: 'seo',
			rows: 3,
			validation: (Rule) => Rule.max(160).warning(),
		}),
		defineField({
			name: 'logo',
			type: 'logo',
			options: {
				collapsable: true,
				collapsed: true,
			},
			group: 'general',
		}),
		defineField({
			name: 'announcements',
			title: 'News',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'announcement' }] }],
			group: 'general',
		}),
		// defineField({
		// 	name: 'ctas',
		// 	title: 'Call-to-action (Site-wide)',
		// 	description: 'Typically used in the header and/or footer.',
		// 	type: 'array',
		// 	of: [{ type: 'cta' }],
		// 	group: 'general',
		// }),
		defineField({
			name: 'copyright',
			type: 'array',
			of: [
				{
					type: 'block',
					styles: [{ title: 'Normal', value: 'normal' }],
				},
			],
			group: 'general',
		}),
		// defineField({
		// 	name: 'headerMenu',
		// 	type: 'reference',
		// 	to: [{ type: 'navigation' }],
		// 	group: 'navigation',
		// }),
		// defineField({
		// 	name: 'footerMenu',
		// 	type: 'reference',
		// 	to: [{ type: 'navigation' }],
		// 	group: 'navigation',
		// }),
		defineField({
			name: 'social',
			title: 'Réseaux sociaux',
			type: 'reference',
			to: [{ type: 'navigation' }],
			group: 'socials',
		}),
		defineField({
			name: 'ogimage',
			title: 'Image Open Graph',
			description:
				'Utilisée pour les aperçus de partage sur les réseaux sociaux.',
			type: 'image',
			options: {
				hotspot: true,
			},
			group: 'socials',
		}),
		defineField({
			name: 'keywords',
			title: 'Mots-clés Meta',
			type: 'array',
			of: [{ type: 'string' }],
			options: {
				layout: 'tags',
			},
			group: 'seo',
		}),
		// visual , title:'Visual identity'fields
		defineField({
			name: 'primaryColorLight',
			title: 'Couleur primaire light mode',
			type: 'color',
			group: 'visual',
		}),
		defineField({
			name: 'primaryColorDark',
			title: 'Couleur primaire dark mode',
			type: 'color',
			group: 'visual',
		}),
		defineField({
			name: 'secondaryColorLight',
			title: 'Couleur secondaire light mode',
			type: 'color',
			group: 'visual',
		}),
		defineField({
			name: 'secondaryColorDark',
			title: 'Couleur secondaire dark mode',
			type: 'color',
			group: 'visual',
		}),
		defineField({
			name: 'accentColorLight',
			title: 'Couleur accentuée light mode',
			type: 'color',
			group: 'visual',
		}),
		defineField({
			name: 'accentColorDark',
			title: 'Couleur accentuée dark mode',
			type: 'color',
			group: 'visual',
		}),
	],
	preview: {
		prepare: () => ({
			title: 'Réglages',
		}),
	},
})
