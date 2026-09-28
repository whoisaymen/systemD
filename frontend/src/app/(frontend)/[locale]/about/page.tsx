import ContactContent from '@/components/contact/ContactContent'
import { groq, fetchSanity } from '@/sanity/lib/fetch'
import { getSite } from '@/sanity/lib/queries'

export default async function AboutPage({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const [content, site] = await Promise.all([
		getContact(),
		getSite().catch(() => null),
	])

	return (
		<ContactContent
			contact={content}
			language={locale}
			social={site?.social}
			copyrightYear={new Date().getFullYear()}
		/>
	)
}

async function getContact() {
	const query = groq`
    *[_type == 'contact'][0]{
      _id,
      address,
      contactTitle,
      partnersTitle,
      credits,
      mapLocation,
      partners[]{
        _key,
        logo {
          asset->{
            url,
            mimeType,
            metadata {
              dimensions,
              lqip
            }
          }
        },
        name,
        url
      }
    }
  `
	// Asset replacements must be visible on the next visit, even if a live
	// invalidation event was missed while the site was closed.
	const data = await fetchSanity({
		query,
		useCdn: false,
		next: { revalidate: 0 },
	})

	if (!data) {
		throw new Error(`No contact content found`)
	}

	return data
}
