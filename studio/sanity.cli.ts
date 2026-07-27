import { defineCliConfig } from 'sanity/cli'
import { projectId, dataset } from '@/sanity/lib/env'

export default defineCliConfig({
	api: {
		projectId,
		dataset,
	},
	studioHost: process.env.SANITY_STUDIO_HOST || undefined,
	deployment: { autoUpdates: false },
})
