import FestivalContent from '@/components/festival/FestivalContent'
import FestivalContentImproved from '@/components/festival/festivalcontent-improved'
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
	// return <FestivalContentImproved festival={content} language={locale} />
}

async function getFestival() {
	const query = groq`{
  "festival": *[_type == 'lefestival'][0]{
    description,
    blocks[]{
      _type == 'mediaTeaserBlock' => {
        _key,
        _type,
        image {
          asset->{
            url,
            metadata
          }
        },
        video,
        uploadedVideo {
          asset->{
            url
          }
        },
        text,
        show
      },
      _type == 'customTextBlock' => {
        _key,
        _type,
        title,
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
          image {
            asset->{
              _id,
              url,
              metadata
            }
          },
          biography,
          edition->{
            year
          }
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
      },
      _type == 'visionBlock' => {
        _key,
        _type,
        visionTitle,
        vision,
        show
      }
    }
  },
  "vision": *[_type == 'fabrique'][0].vision,
  "visionTitle": *[_type == 'fabrique'][0].visionTitle
}`

	const data = await fetchSanityLive({ query })

	if (!data) {
		return notFound()
	}

	// Adjust to access nested festival data
	const festival = data.festival

	// Inject the vision data as a visionBlock
	if (data.vision && data.visionTitle) {
		festival.blocks = festival.blocks || []
		festival.blocks.push({
			_key: 'vision-block',
			_type: 'visionBlock',
			vision: data.vision,
			visionTitle: data.visionTitle,
			show: true,
		})
	}

	return festival
}
