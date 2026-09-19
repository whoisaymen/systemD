import type { MetadataRoute } from 'next'

const PUBLIC_PATHS = [
	'/',
	'/bigbang',
	'/festival',
	'/fabrique',
	'/memoire',
	'/equipe',
	'/contact',
	'/apply',
] as const

type SitemapDocument = {
	_id: string
	_updatedAt?: string
	metadata?: { noIndex?: boolean } | null
}

export type SitemapData = {
	pages?: Partial<
		Record<(typeof PUBLIC_PATHS)[number], (SitemapDocument | null)[]>
	>
	festivals?: (SitemapDocument & { year?: number | null })[]
	films?: (SitemapDocument & { slug?: string | null })[]
	blogTemplate?: SitemapDocument | null
	blogPosts?: (SitemapDocument & { slug?: string | null })[]
}

function isPublished(
	document: SitemapDocument | null,
): document is SitemapDocument {
	return (
		!!document &&
		!document._id.startsWith('drafts.') &&
		!document._id.startsWith('versions.')
	)
}

function isRouteSlug(slug: string | null | undefined): slug is string {
	return (
		typeof slug === 'string' &&
		slug.trim().length > 0 &&
		!/[/?#]/.test(slug) &&
		slug !== '.' &&
		slug !== '..'
	)
}

export function buildSitemap(
	data: SitemapData,
	{ baseUrl, locales }: { baseUrl: string; locales: readonly string[] },
): MetadataRoute.Sitemap {
	const base = new URL(baseUrl)
	base.search = ''
	base.hash = ''
	const origin = base.toString().replace(/\/+$/, '')
	const paths = new Map<string, SitemapDocument[]>()

	for (const path of PUBLIC_PATHS) {
		paths.set(path, (data.pages?.[path] ?? []).filter(isPublished))
	}

	function addPath(path: string, document: SitemapDocument) {
		paths.set(path, [...(paths.get(path) ?? []), document])
	}

	for (const festival of data.festivals ?? []) {
		if (
			isPublished(festival) &&
			typeof festival.year === 'number' &&
			Number.isInteger(festival.year) &&
			festival.year >= 1900
		) {
			addPath(`/festival/${festival.year}`, festival)
		}
	}
	for (const film of data.films ?? []) {
		if (isPublished(film) && isRouteSlug(film.slug)) {
			addPath(`/film/${encodeURIComponent(film.slug)}`, film)
		}
	}
	if (
		isPublished(data.blogTemplate ?? null) &&
		!data.blogTemplate?.metadata?.noIndex
	) {
		for (const post of data.blogPosts ?? []) {
			if (isPublished(post) && isRouteSlug(post.slug)) {
				addPath(`/blog/${encodeURIComponent(post.slug)}`, post)
			}
		}
	}

	return [...paths].flatMap(([path, documents]) => {
		if (documents.some((document) => document.metadata?.noIndex)) return []
		const lastModified = documents
			.map((document) => document._updatedAt)
			.filter(
				(value): value is string => !!value && Number.isFinite(Date.parse(value)),
			)
			.sort((a, b) => Date.parse(b) - Date.parse(a))[0]
		const languages = Object.fromEntries(
			locales.map((locale) => [
				locale,
				`${origin}/${locale}${path === '/' ? '' : path}`,
			]),
		)
		return Object.values(languages).map((url) => ({
			url,
			...(lastModified ? { lastModified } : {}),
			alternates: { languages },
			priority: path === '/' ? 1 : 0.5,
		}))
	})
}
