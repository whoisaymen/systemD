import client from '@/sanity/client'
import { groq } from 'next-sanity'
import { routing } from '@/i18n/routing'
import { buildSitemap, type SitemapData } from '@/lib/sitemap'
import type { MetadataRoute } from 'next'

export const revalidate = 3600

const documentMetadata = groq`_id, _updatedAt, metadata { noIndex }`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const data = await client.fetch<SitemapData>(
		groq`{
			'pages': {
				'/': *[_type == 'homepage'][0...1]{ ${documentMetadata} },
				'/bigbang': [
					*[_type == 'bigbangShortStory'][0]{ ${documentMetadata} },
					*[_type == 'bigbangLongStory'][0]{ ${documentMetadata} }
				],
				'/festival': *[_type == 'lefestival'][0...1]{ ${documentMetadata} },
				'/fabrique': *[_type == 'fabrique'][0...1]{ ${documentMetadata} },
				'/memoire': *[_type == 'memoire'][0...1]{ ${documentMetadata} },
				'/equipe': *[_type == 'person']{ _id, _updatedAt },
				'/contact': *[_type == 'contact'][0...1]{ ${documentMetadata} },
				'/apply': *[_type == 'filmSubmissionSettings' && _id == 'filmSubmissionSettings']{
					${documentMetadata}
				}
			},
			'festivals': *[_type == 'festival' && defined(year)] | order(year asc){
				${documentMetadata}, year
			},
			'films': *[_type == 'film' && defined(slug.current)] | order(slug.current){
				${documentMetadata}, 'slug': slug.current
			},
			'blogTemplate': *[_type == 'page' && metadata.slug.current == 'blog/*'][0]{
				${documentMetadata}
			},
			'blogPosts': *[_type == 'blog.post' && defined(metadata.slug.current)] | order(metadata.slug.current){
				${documentMetadata}, 'slug': metadata.slug.current
			}
		}`,
		{},
		{
			// Search engines must always receive published URLs, even in preview sessions.
			perspective: 'published',
			stega: false,
			useCdn: true,
			next: { revalidate },
		},
	)

	return buildSitemap(data, {
		baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
		locales: routing.locales,
	})
}
