import FabriqueContent from '@/components/fabrique/FabriqueContent'
import { groq, fetchSanityLive } from '@/sanity/lib/fetch'

export default async function FabriquePage({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const content = await getFabrique()

	return <FabriqueContent fabrique={content.fabrique} language={locale} />
}

async function getFabrique() {
	const query = groq`
    {
      "fabrique": *[_type == 'fabrique'][0]{
        description,
        closingText,
        actions
      }
    }
  `
	const data = await fetchSanityLive({ query })

	if (!data) {
		throw new Error(`No content found for Fabrique"`)
	}

	return data
}
