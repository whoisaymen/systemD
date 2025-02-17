import FestivalContent from '@/components/festival/FestivalContent'
import SystemD from '@/components/SystemD'
import { groq, fetchSanityLive } from '@/sanity/lib/fetch'
import { notFound } from 'next/navigation'

export default async function FestivalPage({
	params,
}: {
	params: { locale: string }
}) {
	const { locale } = await params
	const content = await getFestival()

	// return <SystemD tab="festival" content={content} locale={locale} />
	console.log(content, 'content festival')
	return <FestivalContent festival={content} language={locale} />
}

async function getFestival() {
	const query = groq`
    *[_type == 'lefestival'][0]{
      // title,
      // description,
      blocks[]{
        _type == 'mediaTeaserBlock' => {
          _type,
          color,
          image,
          video,
          text
        },
        _type == 'yellowBannerBlock' => {
          _type,
          color,
          text
        },
        _type == 'whiteTextBlock' => {
          _type,
          backgroundColor,
          textColor,
          content, 
          show
        },
        _type == 'juryBlock' => {
          _type,
          backgroundColor,
          textColor,
          show,
          juryMembers[]->{
            name,
            image,
            biography,
            edition->{
            year}
          }
        },
       _type == 'ticketBlock' => {
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
