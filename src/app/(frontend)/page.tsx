import { groq, fetchSanityLive } from '@/sanity/lib/fetch'
import { modulesQuery } from '@/sanity/lib/queries'
import Modules from '@/ui/modules'
import processMetadata from '@/lib/processMetadata'
import SystemD from '@/components/SystemD'

export default async function Page() {
	// const page = await getPage()
	// return <Modules modules={page?.modules} />
	// return <SystemD  />
	return (
		<div className="flex h-svh w-full items-center justify-center">
			<h1 className="text-9xl font-black uppercase">Coming Soon</h1>
		</div>
	)
}

// export async function generateMetadata() {
// 	const page = await getPage()
// 	return processMetadata(page)
// }

// async function getPage() {
// 	const data = await fetchSanityLive<Sanity.Page>({
// 		query: groq`*[_type == 'page' && metadata.slug.current == 'index'][0]{
// 			...,
// 			modules[]{ ${modulesQuery} },
// 			metadata {
// 				...,
// 				'ogimage': image.asset->url + '?w=1200',
// 			}
// 		}`,
// 	})

// 	if (!data)
// 		throw Error('No `page` document with slug "index" found in the Studio')
// 	return data
// }
