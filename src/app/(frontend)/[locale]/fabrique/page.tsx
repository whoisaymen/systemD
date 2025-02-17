import FabriqueContent from '@/components/fabrique/FabriqueContent'
import SystemD from '@/components/SystemD'
import { groq, fetchSanityLive } from '@/sanity/lib/fetch'

export default async function FabriquePage({
	params,
}: {
	params: { locale: string }
}) {
	const { locale } = await params
	const content = await getFabrique()

	// return <SystemD tab="fabrique" content={content} locale={locale} />
	return <FabriqueContent fabrique={content.fabrique} language={locale} />
	// return <FabriqueContent fabrique={content.fabrique} language={locale} />
}

async function getFabrique() {
	const query = groq`
    {
      "fabrique": *[_type == 'fabrique'][0]{
        title,
        description,
        actions,
        vision
      }
    }
  `
	const data = await fetchSanityLive({ query })

	if (!data) {
		throw new Error(`No content found for Fabrique"`)
	}

	return data
}
