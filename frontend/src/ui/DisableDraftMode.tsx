'use client'

import { useVisualEditingEnvironment } from 'next-sanity/hooks'

export default function DisableDraftMode() {
	const environment = useVisualEditingEnvironment()

	if (environment && environment !== 'standalone') return null

	return (
		<a
			className="action fixed bottom-0 right-4 rounded-b-none text-xs opacity-50 hover:opacity-100"
			href="/api/draft-mode/disable"
		>
			Disable Draft Mode
		</a>
	)
}
