import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'
import imageBlock from '../fragments/image-block'

export default defineType({
	name: 'film',
	title: 'Film',
	icon: VscCalendar,
	type: 'document',
	groups: [
		{ name: 'content', title: 'Content', default: true },
		{ name: 'details', title: 'Details' },
		{ name: 'media', title: 'Media' },
		{ name: 'seo', title: 'SEO' },
	],
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
			group: 'content',
		}),
		defineField({
			name: 'releaseDate',
			title: 'Release Date',
			type: 'date',
			group: 'details',
		}),
		defineField({
			name: 'director',
			title: 'Director',
			type: 'string',
			group: 'details',
		}),
		defineField({
			name: 'cast',
			title: 'Cast',
			type: 'array',
			of: [{ type: 'string' }],
			group: 'details',
		}),
		defineField({
			name: 'duration',
			title: 'Duration (minutes)',
			type: 'number',
			group: 'details',
		}),
		defineField({
			name: 'categories',
			title: 'Categories',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'blog.category' }],
				},
			],
			group: 'details',
		}),
		defineField({
			name: 'poster',
			title: 'Poster',
			type: 'image',
			options: {
				hotspot: true,
			},
			group: 'media',
		}),
		defineField({
			name: 'trailer',
			title: 'Trailer',
			type: 'url',
			group: 'media',
		}),
		defineField({
			name: 'gallery',
			title: 'Gallery',
			type: 'array',
			of: [{ type: 'image' }],
			options: {
				layout: 'grid',
			},
			group: 'media',
		}),
		defineField({
			name: 'body',
			title: 'Body',
			type: 'array',
			of: [
				{ type: 'block' },
				imageBlock,
				defineArrayMember({
					title: 'Code block',
					type: 'code',
					options: {
						withFilename: true,
					},
				}),
				{ type: 'custom-html' },
			],
			group: 'content',
		}),
		defineField({
			name: 'seo',
			title: 'SEO',
			type: 'object',
			fields: [
				defineField({
					name: 'metaTitle',
					title: 'Meta Title',
					type: 'string',
				}),
				defineField({
					name: 'metaDescription',
					title: 'Meta Description',
					type: 'text',
				}),
				defineField({
					name: 'keywords',
					title: 'Keywords',
					type: 'array',
					of: [{ type: 'string' }],
				}),
			],
			group: 'seo',
		}),
	],
})
