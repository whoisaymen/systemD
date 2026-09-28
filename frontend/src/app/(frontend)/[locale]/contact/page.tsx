import { permanentRedirect } from 'next/navigation'

export default async function ContactRedirect({
	params,
	searchParams,
}: {
	params: Promise<{ locale: string }>
	searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
	const [{ locale }, query] = await Promise.all([params, searchParams])
	const search = new URLSearchParams()
	for (const [key, value] of Object.entries(query)) {
		for (const entry of Array.isArray(value) ? value : value === undefined ? [] : [value])
			search.append(key, entry)
	}
	permanentRedirect(`/${locale}/about${search.size ? `?${search}` : ''}`)
}
