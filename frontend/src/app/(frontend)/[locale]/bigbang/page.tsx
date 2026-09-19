import BigBangContent from '@/components/bigbang/BigBangContent'
import { groq, fetchSanityLive } from '@/sanity/lib/fetch'
import { notFound } from 'next/navigation'

export default async function BigBangPage({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const content = await getBigBang()

	return (
		<BigBangContent
			shortStory={content.shortStory}
			longStory={content.longStory}
			locale={locale}
		/>
		// <></>
	)
}

async function getBigBang() {
	const query = groq`
{
  "shortStory": *[_type == 'bigbangShortStory'][0]{
    ...,
    body[]{..., image{..., asset->{...}}}
  },
  "longStory": *[_type == 'bigbangLongStory'][0]{
    ...,
    body[]{
      ...,
      file{..., asset->{...}},
      uploadedVideo{..., asset->{url}}
    }
  }
}
`
	const data = await fetchSanityLive({ query })

	if (!data) {
		notFound()
		throw new Error(`No content found"`)
	}

	return data
}
