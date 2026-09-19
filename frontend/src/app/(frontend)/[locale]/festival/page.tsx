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

	return <FestivalContent festival={content} language={locale} />
}

async function getFestival() {
	// First fetch the festival content
	const festivalQuery = groq`
  *[_type == 'lefestival'][0]{
    _id,
    vision,
    visionTitle,
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
        title,
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
      _type == 'onTourBlock' => {
        title,
        _key,
        _type,
        events[]->{
          _id,
          title,
          eventType->{_id, title},
          date,
          endDate,
          location,
          visual {
            ...,
            asset->{_id, url, metadata{dimensions}}
          },
          description,
          pressLink
        },
        show
      }
    }
  }
`
	const festivalData = await fetchSanityLive({ query: festivalQuery })

	if (!festivalData) {
		return notFound()
	}

	const vision = Array.isArray(festivalData.vision) ? festivalData.vision : []
	const hasVisionBlock = festivalData.blocks?.some(
		(block: any) => block?._type === 'visionBlock',
	)

	if (vision.length > 0 && !hasVisionBlock) {
		const visionBlock = {
			_key: 'vision-block',
			_type: 'visionBlock',
			show: true,
			visionTitle: festivalData.visionTitle,
			vision,
		}

		festivalData.blocks = [visionBlock, ...(festivalData.blocks ?? [])]
	}

	if (
		process.env.NODE_ENV === 'development' &&
		process.env.FESTIVAL_MOCK_EVENTS !== 'false'
	) {
		const { withFestivalMockEvents } = await import('@/content/festivalMockEvents')
		return withFestivalMockEvents(festivalData)
	}

	return festivalData
}
