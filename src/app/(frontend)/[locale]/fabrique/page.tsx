import SystemD from '@/components/SystemD'
import { groq, fetchSanityLive } from '@/sanity/lib/fetch'

export default async function FabriquePage({
	params,
}: {
	params: { locale: string }
}) {
	const { locale } = params
	const content = await getFabrique('bigbang', locale)

	return <SystemD tab="fabrique" content={content} locale={locale} />
}

async function getFabrique(tab: string, locale: string) {
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
	const params = { tab }
	const data = await fetchSanityLive({ query })

	if (!data) {
		throw new Error(`No content found for tab "${tab}"`)
	}

	return data
}
