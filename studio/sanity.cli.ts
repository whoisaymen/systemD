import { defineCliConfig } from 'sanity/cli'
import { projectId, dataset } from '@/sanity/lib/env'

export default defineCliConfig({
	api: {
		projectId,
		dataset,
	},
	studioHost: process.env.SANITY_STUDIO_HOST || 'systemd',
	deployment: {
		appId: '2bd2bf1d3e5494ca26803fc6',
		autoUpdates: true,
	},
})
