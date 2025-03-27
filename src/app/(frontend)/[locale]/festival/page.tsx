import FestivalContent from '@/components/festival/FestivalContent'
import { groq, fetchSanityLive } from '@/sanity/lib/fetch'
import { notFound } from 'next/navigation'

export default async function FestivalPage({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const content = await getFestival()

	// return <Loading />
	return <FestivalContent festival={content} language={locale} />
}

async function getFestival() {
	const query = groq`
    *[_type == 'lefestival'][0]{
      // title,
      // description,
      blocks[]{
        _type == 'mediaTeaserBlock' => {
          _key,
          _type,
          color,
          image,
          video,
          text
        },
        _type == 'yellowBannerBlock' => {
          _key,
          _type,
          color,
          text
        },
        _type == 'whiteTextBlock' => {
          _key,
          _type,
          backgroundColor,
          textColor,
          content, 
          show
        },
        _type == 'juryBlock' => {
          _key,
          _type,
          backgroundColor,
          textColor,
          show,
          juryMembers[]->{
            _id,
            name,
            image,
            biography,
            edition->{
            year}
          }
        },
       _type == 'ticketBlock' => {
          _key,
          _type,
          backgroundColor,
          textColor,
          bigTitle,
          items[]{
            smallTitle,
            text
          },
          show
        },
         _type == 'onTourBlock' => {
          _key, 
          _type,
          events[]->{
            title,
            date,
            location
          },
          show
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
