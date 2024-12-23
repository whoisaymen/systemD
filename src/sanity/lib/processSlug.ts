export default function ({
	_type,
	internal,
	params,
	external,
}: {
	// internal
	_type?: string
	internal?: string
	params?: string
	// external
	external?: string
}) {
	if (external) return external

	if (internal) {
		const segment = _type === 'blog.post' ? '/blog/' : '/'
		const path = internal === 'index' ? null : internal

		return [segment, path, params].filter(Boolean).join('')
	}

	return undefined
}
