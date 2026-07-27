import client from '@/sanity/client'
import { token } from '@/sanity/lib/token'
import { draftMode } from 'next/headers'
import { type QueryOptions, type QueryParams } from 'next-sanity'
import { defineLive } from 'next-sanity/live'

export { groq } from 'next-sanity'

export async function fetchSanity<T = any>({
	query,
	params = {},
	next,
	useCdn,
}: {
	query: string
	params?: Partial<QueryParams>
	next?: QueryOptions['next']
	useCdn?: boolean
}) {
	const preview = (await draftMode()).isEnabled

	return client.fetch<T>(
		query,
		params,
		preview
			? {
					stega: true,
					perspective: 'drafts',
					useCdn: false,
					token,
					next: {
						revalidate: 0,
						...next,
					},
				}
			: {
					perspective: 'published',
					useCdn: useCdn ?? true,
					next: {
						revalidate: 3600, // every hour
						...next,
					},
				},
	)
}

export const { sanityFetch, SanityLive } = defineLive({
	client,
	serverToken: token,
	browserToken: token,
})

export async function fetchSanityLive<T = any>(
	args: Parameters<typeof sanityFetch>[0],
) {
	const preview = (await draftMode()).isEnabled

	const { data } = await sanityFetch({
		...args,
		perspective: preview ? 'drafts' : 'published',
		stega: preview,
	})

	return data as T
}
