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

const SANITY_RETRY_DELAYS = [200, 600]
const TRANSIENT_FETCH_CODES = new Set([
	'ECONNRESET',
	'ECONNREFUSED',
	'ENETUNREACH',
	'ENOTFOUND',
	'EAI_AGAIN',
	'ETIMEDOUT',
	'UND_ERR_CONNECT_TIMEOUT',
	'UND_ERR_SOCKET',
])

const isTransientFetchError = (error: unknown) => {
	if (!(error instanceof Error)) return false
	if (/fetch failed|network|socket|timed?\s*out/i.test(error.message))
		return true

	const cause = (error as Error & { cause?: { code?: unknown } }).cause
	return (
		typeof cause?.code === 'string' && TRANSIENT_FETCH_CODES.has(cause.code)
	)
}

const wait = (delay: number) =>
	new Promise<void>((resolve) => setTimeout(resolve, delay))

export async function fetchSanityLive<T = any>(
	args: Parameters<typeof sanityFetch>[0],
) {
	const preview = (await draftMode()).isEnabled
	let lastError: unknown

	for (let attempt = 0; attempt <= SANITY_RETRY_DELAYS.length; attempt += 1) {
		try {
			const { data } = await sanityFetch({
				...args,
				perspective: preview ? 'drafts' : 'published',
				stega: preview,
			})

			return data as T
		} catch (error) {
			lastError = error

			if (
				!isTransientFetchError(error) ||
				attempt === SANITY_RETRY_DELAYS.length
			) {
				break
			}

			await wait(SANITY_RETRY_DELAYS[attempt])
		}
	}

	if (!preview) {
		try {
			return await fetchSanity<T>({
				query: args.query,
				params: args.params,
				useCdn: true,
			})
		} catch {
			// Preserve the original live-fetch error, which contains the useful cause.
		}
	}

	throw lastError
}
