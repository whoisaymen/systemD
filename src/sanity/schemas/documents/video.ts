import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscVideo } from 'react-icons/vsc'

export default defineType({
	name: 'video',
	title: 'Vidéo',
	icon: VscVideo,
	type: 'document',
	groups: [
		{ name: 'content', title: 'Content', default: true },
		{ name: 'details', title: 'Details' },
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
			name: 'videoFile',
			title: 'Video File',
			type: 'file',
			options: {
				accept: 'video/*',
			},
			group: 'details',
		}),
		defineField({
			name: 'thumbnail',
			title: 'Thumbnail',
			type: 'image',
			options: {
				hotspot: true,
			},
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
