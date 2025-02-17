import MemoireContent from '@/components/memoire/MemoireContent'
import SystemD from '@/components/SystemD'
import { groq, fetchSanityLive } from '@/sanity/lib/fetch'

export default async function FestivalPage({
	params,
}: {
	params: { locale: string }
}) {
	const { locale } = await params
	const content = await getMemoire()

	// return <SystemD tab="memoire" content={content} locale={locale} />
	return <MemoireContent memoire={content} language={locale} />
}

async function getMemoire() {
	const query = groq`
  *[_type == 'memoire'][0]{
    title,
    description,
    "pastFestivals": *[_type == 'festival' && year != ${new Date().getFullYear()}]{
      title,
      description,
      year,
      venue,
      visual,
      pressLink
    },
    pastOnTourEvents[]->{
      title,
      description,
      date
    }
  }
`

	const data = await fetchSanityLive({ query })

	if (!data) {
		throw new Error(`No content found for festival"`)
	}

	return data
}
