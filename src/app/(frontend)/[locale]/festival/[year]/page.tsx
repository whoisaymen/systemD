import FestivalContent from '@/components/festival/FestivalContent'
import FestivalEditionContent from '@/components/festival/FestivalEditionContent'
import SystemD from '@/components/SystemD'
import { groq, fetchSanityLive } from '@/sanity/lib/fetch'
import { notFound } from 'next/navigation'

export default async function FestivalEditionPage({
	params,
}: {
	params: { locale: string; year: string }
}) {
	const { locale, year } = await params
	console.log(locale, year, 'locale, year')
	const content = await getFestivalEdition(year)

	if (!content) {
		return <div>No content available for this festival edition</div>
	}

	console.log(content)
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
    filmSelection[]->{
      _id,
      slug,
      title,
      description,
      director,
      releaseYear,
      poster
    },
    jury[]->{
      name,
      image,
      biography
    },
    photoGallery[]{
      _type,
      images[]{
        asset->{
          url,
          metadata
        }
      }
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
