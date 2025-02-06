import SystemD from '@/components/SystemD'
import { groq, fetchSanityLive } from '@/sanity/lib/fetch'
import { modulesQuery } from '@/sanity/lib/queries'
import { redirect } from 'next/navigation'

type ParamsType = { locale: string; tab: string }

export default async function Page({ params }: { params: ParamsType }) {
	const { locale, tab } = params
	let content

	const allowedPaths = ['home', 'admin']

	if (!allowedPaths.includes(tab)) {
		redirect(`/${locale}`)
	}

	try {
		content = await getContent(tab, locale)
	} catch (error) {
		console.error('Error fetching content:', error)
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold">Error</h1>
					<p className="mt-4">Failed to load content for tab: {tab}</p>
				</div>
			</div>
		)
	}

	return <SystemD tab={tab} content={content} locale={locale} />
}

async function getContent(tab: string, locale: string) {
	const queryMap: Record<string, string> = {
		bigbang: groq`
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
  `,
		equipe: groq`
      {
        "person": *[_type == 'person'][0]{
          name.${locale},
          title.${locale},
          biography.${locale},
          image
        }
      }
    `,
		fabrique: groq`
      {
        "fabrique": *[_type == 'fabrique'][0]{
          title.${locale},
          description.${locale},
          actions.${locale},
          vision.${locale}
        }
      }
    `,
	}

	const query =
		queryMap[tab] ||
		groq`*[_type == 'page' && metadata.slug.current == $tab][0]{
      title.${locale},
      body.${locale},
      modules[]{ ${modulesQuery} },
      metadata {
        ...,
        'ogimage': image.asset->url + '?w=1200',
      }
    }`

	const params = tab ? { tab } : {}

	const data = await fetchSanityLive({ query, params })

	if (!data) {
		throw new Error(`No content found for tab "${tab}"`)
	}

	return data
}
