import FestivalContent from '@/components/festival/FestivalContent'
import FestivalEditionContent from '@/components/festival/FestivalEditionContent'
import { groq, fetchSanityLive } from '@/sanity/lib/fetch'
import { notFound } from 'next/navigation'

export default async function FestivalEditionPage({
	params,
}: {
	params: Promise<{ locale: string; year: string }>
}) {
	const { locale, year } = await params
	const content = await getFestivalEdition(year)

	if (!content) {
		return <div>No content available for this festival edition</div>
	}

	console.log('content', content)

	// return <Loading />
	return <FestivalEditionContent festival={content} language={locale} />
}

async function getFestivalEdition(year: string) {
	const query = groq`
  *[_type == 'festival' && year == ${year}][0]{
    title,
    description,
    year,
    venue,
    visual,
    pressLink,
    aftermovieLink,
    "filmSelection": *[_type == 'film' && references(^._id)] | order(year asc, title asc) {
      _id,
      slug,
      title,
      description,
      director,
      year,
      affiche,
      isWinner
    },
    jury[]->{
      name,
      image,
      biography
    },
    "photoGallery": photoGallery[]{
      _type,
      photos[],
    },
    expoPhoto[]{
      _type,
      images[]{
        asset->{
          url,
          metadata
        }
      }
    }
  }
`

	const data = await fetchSanityLive({ query })

	if (!data) {
		return notFound()
		throw new Error(`No content found for festival"`)
	}

	return data
}
