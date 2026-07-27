export const projectId =
	process.env.SANITY_STUDIO_PROJECT_ID ||
	process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
	's7yacqk1'

export const dataset =
	process.env.SANITY_STUDIO_DATASET ||
	process.env.NEXT_PUBLIC_SANITY_DATASET ||
	'production'

export const apiVersion =
	process.env.SANITY_STUDIO_API_VERSION ||
	process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
	'2024-12-01'
