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
		{ name: 'themes', title: 'Thèmes' },
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
				collapsible: true,
				collapsed: true,
			},
			group: 'visual',
		}),
		defineField({
			name: 'favicon',
			title: 'Favicon',
			type: 'file',
			options: {
				accept: 'image/*,.ico',
			},
			group: 'visual',
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
		defineField({
			name: 'themes',
			title: 'Thèmes disponibles',
			description:
				"Le premier thème de cette liste est utilisé par défaut. L'ordre défini ici est aussi l'ordre utilisé par le bouton de changement de thème.",
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'theme' }] }],
			group: 'themes',
		}),
	],
	preview: {
		prepare: () => ({
			title: 'Réglages',
		}),
	},
})
