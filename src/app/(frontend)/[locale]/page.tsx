import { groq, fetchSanityLive } from '@/sanity/lib/fetch'
import { modulesQuery } from '@/sanity/lib/queries'
import processMetadata from '@/lib/processMetadata'
import VideoBackground from '@/components/homepage/VideoBackground'
import LogoShortTsx from '@/components/svgs/LogoShort'
import { useTranslations } from 'next-intl'
import LogoShortAnimated from '@/components/svgs/LogoShortAnimated'
import { FaInstagram } from 'react-icons/fa'

export default function IndexRoute() {
	return (
		<div className="relative flex h-svh w-full items-center justify-center overflow-hidden tracking-tight sm:h-[100vh]">
			{/* Rule of thirds grid */}
			<div className="pointer-events-none absolute inset-0 z-20">
				<div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
					<div className="border-b border-r border-white opacity-20 dark:border-grayLight"></div>
					<div className="border-b border-r border-white opacity-20 dark:border-grayLight"></div>
					<div className="border-b border-white opacity-20 dark:border-grayLight"></div>
					<div className="border-b border-r border-white opacity-20 dark:border-grayLight"></div>
					<div className="border-b border-r border-white opacity-20 dark:border-grayLight"></div>
					<div className="border-b border-white opacity-20 dark:border-grayLight"></div>
					<div className="border-r border-white opacity-20 dark:border-grayLight"></div>
					<div className="border-r border-white opacity-20 dark:border-grayLight"></div>
					<div></div>
				</div>
			</div>

			{/* Recording frame corners */}
			<div className="absolute left-4 top-4 z-30 h-8 w-8 border-l-[2px] border-t-[2px] border-[#fff] mix-blend-overlay"></div>
			<div className="absolute right-4 top-4 z-30 h-8 w-8 border-r-[2px] border-t-[2px] border-[#fff] mix-blend-overlay"></div>
			<div className="absolute bottom-4 left-4 z-30 h-8 w-8 border-b-[2px] border-l-[2px] border-[#fff] mix-blend-overlay"></div>
			<div className="absolute bottom-4 right-4 z-30 h-8 w-8 border-b-[2px] border-r-[2px] border-[#fff] mix-blend-overlay"></div>

			<div className="h-full w-auto py-1 sm:mx-0">
				<video
					className="h-full w-full transform rounded-none border-0 object-cover sm:rounded-md"
					autoPlay
					loop
					muted
					playsInline
				>
					<source src="/assets/videos/teaser2.mp4" type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			</div>
		</div>
	)
}

// export async function generateMetadata() {
// 	const page = await getPage()
// 	return processMetadata(page)
// }

async function getPage() {
	const data = await fetchSanityLive<Sanity.Page>({
		query: groq`*[_type == 'page' && metadata.slug.current == 'index'][0]{
			...,
			modules[]{ ${modulesQuery} },
			metadata {
				...,
				'ogimage': image.asset->url + '?w=1200',
			}
		}`,
	})

	if (!data)
		throw Error('No `page` document with slug "index" found in the Studio')
	return data
}
