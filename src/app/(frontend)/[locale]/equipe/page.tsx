import EquipeContent from '@/components/equipe/EquipeContent'
import { groq, fetchSanityLive } from '@/sanity/lib/fetch'

export default async function EquipePage({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const content = await getEquipe('person', locale)

	return <EquipeContent person={content} language={locale} />
}

async function getEquipe(tab: string, locale: string) {
	const query = groq`
    {
      "person": *[_type == 'person'][0]{
        _id,
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
