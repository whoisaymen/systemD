import SystemD from '@/components/SystemD'
import { groq, fetchSanityLive } from '@/sanity/lib/fetch'

export default async function BigBangPage({
	params,
}: {
	params: { locale: string }
}) {
	const { locale } = params
	const content = await getBigBang()

	return <SystemD tab="bigbang" content={content} locale={locale} />
}

async function getBigBang() {
	const query = groq`
    {
      "shortStory": *[_type == 'bigbangShortStory'][0]{
        body,
      },
      "longStory": *[_type == 'bigbangLongStory'][0]{
        title,
        body,
        "translations": *[_type == 'translation.metadata' && references(^._id)]{
          translations {
            value {
              title,
              body
            }
          }
        }
      }
    }
  `
	const data = await fetchSanityLive({ query })

	if (!data) {
		throw new Error(`No content found}"`)
	}

	return data
}
