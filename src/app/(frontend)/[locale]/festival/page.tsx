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

	console.log('Fetched festival content: ', content)
	return <FestivalContent festival={content} language={locale} />
}

async function getFestival() {
	// First fetch the festival content
	const festivalQuery = groq`
  *[_type == 'lefestival'][0]{
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
      }
    }
  }
`
	// Then fetch the vision data from fabrique
	const visionQuery = groq`
    *[_type == 'fabrique'][0]{
      vision,
      visionTitle
    }
  `

	const [festivalData, visionData] = await Promise.all([
		fetchSanityLive({ query: festivalQuery }),
		fetchSanityLive({ query: visionQuery }),
	])

	if (!festivalData) {
		return notFound()
	}

	// Create a vision block and add it to the festival blocks
	if (visionData && visionData.vision) {
		const visionBlock = {
			_key: 'vision-block',
			_type: 'visionBlock',
			show: true,
			vision: visionData.vision,
			visionTitle: visionData.visionTitle,
		}

		// Initialize blocks array if it doesn't exist
		if (!festivalData.blocks) {
			festivalData.blocks = []
		}

		// Add vision block to the beginning of the array using unshift
		festivalData.blocks.unshift(visionBlock)

		// Alternatively, you can create a new array with vision block first
		// festivalData.blocks = [visionBlock, ...festivalData.blocks]
	}

	return festivalData
}
