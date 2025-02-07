import SystemD from '@/components/SystemD'
import { groq, fetchSanityLive } from '@/sanity/lib/fetch'

export default async function EquipePage({
	params,
}: {
	params: { locale: string }
}) {
	const { locale } = await params
	const content = await getEquipe('fabrique', locale)
	console.log(content, 'content')

	return <SystemD tab="equipe" content={content} locale={locale} />
}

async function getEquipe(tab: string, locale: string) {
	const query = groq`
    {
      "person": *[_type == 'person'][0]{
        name,
        title,
        biography,
        image
      }
    }
  `
	const data = await fetchSanityLive({ query })

	if (!data?.person) {
		throw new Error(`No content found for tab "${tab}"`)
	}

	return data.person
}
