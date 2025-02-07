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
		<div className="relative flex h-svh w-full items-center justify-center overflow-hidden tracking-tight">
			{/* Rule of thirds grid */}
			{/* <div className="pointer-events-none absolute inset-0 z-20">
				<div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
					<div className="border-b border-r border-gray-300 opacity-20"></div>
					<div className="border-b border-r border-gray-300 opacity-20"></div>
					<div className="border-b border-gray-300 opacity-20"></div>
					<div className="border-b border-r border-gray-300 opacity-20"></div>
					<div className="border-b border-r border-gray-300 opacity-20"></div>
					<div className="border-b border-gray-300 opacity-20"></div>
					<div className="border-r border-gray-300 opacity-20"></div>
					<div className="border-r border-gray-300 opacity-20"></div>
					<div></div>
				</div>
			</div> */}

			{/* Recording frame corners */}
			<div className="absolute left-4 top-4 z-30 h-8 w-8 border-l-[2px] border-t-[2px] border-[#fff] mix-blend-overlay"></div>
			<div className="absolute right-4 top-4 z-30 h-8 w-8 border-r-[2px] border-t-[2px] border-[#fff] mix-blend-overlay"></div>
			<div className="absolute bottom-4 left-4 z-30 h-8 w-8 border-b-[2px] border-l-[2px] border-[#fff] mix-blend-overlay"></div>
			<div className="absolute bottom-4 right-4 z-30 h-8 w-8 border-b-[2px] border-r-[2px] border-[#fff] mix-blend-overlay"></div>

			<div className="absolute bottom-4 left-0 z-20 flex w-full rotate-0 items-center justify-center font-mono text-[2vw] font-bold uppercase leading-relaxed mix-blend-normal sm:hidden lg:text-[1.5vw]">
				<div className="mr-1 h-[0.5rem] w-[0.5rem] animate-pulse rounded-full bg-red-500 text-red-500"></div>
				<span className="animate-pulse font-mono tracking-wide text-red-500">
					More info soon
				</span>
			</div>

			{/* <div className="absolute bottom-[30vh] left-0 z-20 flex w-full rotate-0 items-center justify-center text-[2vw] font-bold uppercase leading-relaxed mix-blend-difference sm:hidden lg:text-[1.5vw]">
				<span className="px-[2px] text-[#fff]">(</span>
				<div className="relative z-30 mr-1 h-[0.5rem] w-[0.5rem] animate-pulse rounded-full bg-red-500"></div>
				<span className="-tracking-tight text-[#8C8C8C]">
					More info soon<span className="px-[2px] text-[#fff]">)</span>
				</span>
			</div> */}

			<div className="no-scrollbar relative z-10 flex h-auto w-[75vw] flex-shrink-0 flex-col items-center justify-center py-1 mix-blend-difference sm:mt-0">
				<a
					target="_blank"
					href="https://www.instagram.com/festivalsystem_d/"
					className="w-full"
				>
					<LogoShortAnimated
						className="mt-6 !overflow-visible"
						fillColor="#AAAAAF"
					/>
				</a>
				{/* <LogoShortTsx fillColor="#AAAAAF" /> */}
				<div className="mt-0 w-full pl-1 pr-3 text-2xl font-medium uppercase text-[#AAAAAF]">
					<h1 className="flex flex-col -space-y-[0.10rem] text-[2vw] font-bold leading-relaxed lg:text-[1.4vw] lg:font-semibold">
						<div className="flex w-full items-center justify-between">
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

						<div className="flex w-full items-center justify-between pr-0">
							<span>
								creatives<span className="text-[#DEFE04]">/</span>
							</span>

							<span>
								creators<span className="text-[#DEFE04]">/</span>
							</span>

							{/* <span>
								info<span className="text-[#DEFE04]">@</span>systemd.brussels
							</span> */}
							<a
								href="mailto:info@systemd.brussels"
								className="lowercase text-white"
							>
								info<span className="text-[#DEFE04]">@</span>systemd.brussels
							</a>
						</div>
					</h1>

					{/* <div className="flex w-full items-center justify-end text-[2vw] font-bold uppercase leading-relaxed text-[#AAAAAF] mix-blend-difference lg:text-[1.5vw]">
						<a
							target="_blank"
							href="https://www.instagram.com/festivalsystem_d/"
							className="flex items-center justify-center space-x-2"
						>
							<span className="lowercase text-white">
								<span className="text-[#DEFE04]">@</span>festivalsystem_d
							</span>
						</a>
					</div> */}
				</div>
			</div>
			<VideoBackground />
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
