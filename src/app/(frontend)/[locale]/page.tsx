import { groq, fetchSanityLive } from '@/sanity/lib/fetch'
import { modulesQuery } from '@/sanity/lib/queries'
import processMetadata from '@/lib/processMetadata'
import VideoBackground from '@/components/homepage/VideoBackground'
import LogoShortTsx from '@/components/svgs/LogoShort'
import { useTranslations } from 'next-intl'

export default function Page() {
	return (
		<div className="relative flex h-screen w-full items-center justify-center overflow-hidden">
			<div className="no-scrollbar relative z-10 flex h-full w-[75vw] flex-shrink-0 flex-col items-center justify-center overflow-scroll py-1 mix-blend-difference">
				<LogoShortTsx fillColor="#AAAAAF" />
				<div className="mt-2 w-full text-2xl font-medium uppercase text-[#AAAAAF]">
					<h1 className="flex flex-col text-xl font-bold">
						<div className="flex w-full items-center justify-between pr-36">
							<span className="">empowering</span>

							<span>
								<span>self</span>
								<span className="text-[#DEFE04]">—</span>
								made
							</span>

							{/* <span>
								creators<span className="text-[#DEFE04]">/</span>
							</span> */}
							<span>
								audiovisuals <span className="text-[#DEFE04]">&</span> makers
							</span>
						</div>
						<div className="flex w-full items-center justify-between space-x-16 pr-8">
							<span>
								creatives<span className="text-[#DEFE04]">/</span>
							</span>

							<span>
								creators<span className="text-[#DEFE04]">/</span>
							</span>

							{/* <span>
								info<span className="text-[#DEFE04]">@</span>systemd.brussels
							</span> */}
							<span className="text-white">
								info<span className="text-[#DEFE04]">@</span>systemd.brussels
							</span>
						</div>
					</h1>
				</div>
			</div>
			<VideoBackground />
		</div>
	)
}

export async function generateMetadata() {
	const page = await getPage()
	return processMetadata(page)
}

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
