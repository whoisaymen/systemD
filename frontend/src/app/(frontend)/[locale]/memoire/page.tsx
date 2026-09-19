import MemoireContent from '@/components/memoire/MemoireContent'
import { groq, fetchSanityLive } from '@/sanity/lib/fetch'

export default async function MemoirePage({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params

	const content = await getMemoire()
	return <MemoireContent memoire={content} language={locale} />
}

async function getMemoire() {
	const query = groq`
	  *[_type == 'memoire' && _id == 'memoire'][0]{
	    description,
	    pastFestivalsTitle,
	    pastFestivals[]->{..., visual{..., asset->{...}}}
	  }
	`
	const data = await fetchSanityLive({ query })

	if (!data) {
		throw new Error('No content found for Mémoire')
	}

	return data
}
