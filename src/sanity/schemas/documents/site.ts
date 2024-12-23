import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'site',
	title: 'Site settings',
	type: 'document',
	groups: [
		{ name: 'general', default: true },
		{ name: 'navigation' },
		{ name: 'seo', title: 'SEO' },
		{ name: 'visual', title: 'Visual identity' },
	],
	fields: [
		defineField({
			name: 'title',
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
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'announcement' }] }],
			group: 'general',
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-action (Site-wide)',
			description: 'Typically used in the header and/or footer.',
			type: 'array',
			of: [{ type: 'cta' }],
			group: 'general',
		}),
		defineField({
			name: 'headerMenu',
			type: 'reference',
			to: [{ type: 'navigation' }],
			group: 'navigation',
		}),
		defineField({
			name: 'footerMenu',
			type: 'reference',
			to: [{ type: 'navigation' }],
			group: 'navigation',
		}),
		defineField({
			name: 'social',
			type: 'reference',
			to: [{ type: 'navigation' }],
			group: 'navigation',
		}),
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
		defineField({
			name: 'ogimage',
			title: 'Open Graph Image (Site-wide)',
			description:
				'Used for social sharing previews. Set page-specific images in Page documents.',
			type: 'image',
			options: {
				hotspot: true,
			},
			group: 'general',
		}),
		defineField({
			name: 'keywords',
			title: 'Meta Keywords',
			type: 'array',
			of: [{ type: 'string' }],
			options: {
				layout: 'tags',
			},
			group: 'seo',
		}),
		// visual , title:'Visual identity'fields
		defineField({
			name: 'primaryColor',
			title: 'Primary Color',
			type: 'color',
			group: 'visual',
		}),
		defineField({
			name: 'secondaryColor',
			title: 'Secondary Color',
			type: 'color',
			group: 'visual',
		}),
	],
	preview: {
		prepare: () => ({
			title: 'Site settings',
		}),
	},
})
