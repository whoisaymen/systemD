import MemoireContent from '@/components/memoire/MemoireContent'
import { groq, fetchSanityLive } from '@/sanity/lib/fetch'

export default async function FestivalPage({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params

	const content = await getMemoire()
	// return <Loading />
	return <MemoireContent memoire={content} language={locale} />
}

async function getMemoire() {
	const currentYear = new Date().getFullYear()

	const query = groq`
	  *[_type == 'memoire'][0]{
	    title,
	    description,
	    pastFestivals[]->{
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
        year,
        venue,
        visual,
        pressLink
      },
	  }
	`
	const data = await fetchSanityLive({ query })

	if (!data) {
		throw new Error(`No content found for Memoire"`)
	}

	return data
}
