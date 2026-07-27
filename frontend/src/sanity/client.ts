import { createClient } from 'next-sanity'
import { projectId, dataset, apiVersion } from '@/sanity/lib/env'
import { dev } from '@/lib/env'

const studioUrl =
	process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333'

export default createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: !dev,
	stega: {
		studioUrl,
	},
})
