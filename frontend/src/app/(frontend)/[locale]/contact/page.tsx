import ContactContent from '@/components/contact/ContactContent'
import { groq, fetchSanityLive } from '@/sanity/lib/fetch'

export default async function ContactPage({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const content = await getContact()

	return <ContactContent contact={content} language={locale} />
}

async function getContact() {
	const query = groq`
    *[_type == 'contact'][0]{
      formEmail,
      address,
      mapLocation,
      phone,
      backgroundColor,
      textColor,
      partners[]{
        _key,
        logo {
          asset->{
            url,
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
	const data = await fetchSanityLive({ query })

	if (!data) {
		throw new Error(`No content found for festival"`)
	}

	return data
}
