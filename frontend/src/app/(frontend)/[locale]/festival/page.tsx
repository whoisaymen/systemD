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
    description,
    vision,
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
          _id,
          title,
          date,
          endDate,
          location,
          description,
          pressLink
        },
        show
      }
    }
  }
`
	const fallbackVisionQuery = groq`
    *[_type == 'fabrique'][0]{
      vision
    }
  `

	const [festivalData, fallbackVisionData] = await Promise.all([
		fetchSanityLive({ query: festivalQuery }),
		fetchSanityLive({ query: fallbackVisionQuery }),
	])

	if (!festivalData) {
		return notFound()
	}

	const festivalVision = Array.isArray(festivalData.vision)
		? festivalData.vision
		: []
	const fallbackVision = Array.isArray(fallbackVisionData?.vision)
		? fallbackVisionData.vision
		: []
	const vision = festivalVision.length > 0 ? festivalVision : fallbackVision
	const hasVisionBlock = festivalData.blocks?.some(
		(block: any) => block?._type === 'visionBlock',
	)

	if (vision.length > 0 && !hasVisionBlock) {
		const visionBlock = {
			_key: 'vision-block',
			_type: 'visionBlock',
			show: true,
			vision,
		}

		festivalData.blocks = [visionBlock, ...(festivalData.blocks ?? [])]
	}

	return festivalData
}
