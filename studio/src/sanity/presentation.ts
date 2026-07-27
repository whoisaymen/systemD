import groq from 'groq'
import { presentationTool } from 'sanity/presentation'

const previewOrigin =
	process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'

export const presentation = presentationTool({
	name: 'editor',
	title: 'Editor',
	previewUrl: {
		initial: previewOrigin,
		previewMode: {
			enable: '/api/draft-mode/enable',
		},
	},
	resolve: {
		mainDocuments: [
			{
				route: '/',
				filter: groq`_type == 'page' && metadata.slug.current == 'index'`,
			},
			{
				route: '/:slug',
				filter: groq`_type == 'page' && metadata.slug.current == $slug`,
			},
			{
				route: '/blog/:slug',
				filter: groq`_type == 'blog.post' && metadata.slug.current == $slug`,
			},
		],
	},
})
