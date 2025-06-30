// import EquipeContent from '@/components/equipe/EquipeContent'
import dynamic from 'next/dynamic'

import { groq, fetchSanityLive } from '@/sanity/lib/fetch'

const EquipeContent = dynamic(
	() => import('@/components/equipe/EquipeContent'),
	{
		ssr: !!false,
	},
)

export default async function EquipePage({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const content = await getEquipe('person', locale)

	return <EquipeContent persons={content} language={locale} />
}

async function getEquipe(tab: string, locale: string) {
	const query = groq`
    {
      "person": *[_type == 'person']{
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
