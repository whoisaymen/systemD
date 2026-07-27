import { groq, fetchSanityLive } from '@/sanity/lib/fetch'
import { modulesQuery } from '@/sanity/lib/queries'
import processMetadata from '@/lib/processMetadata'
import VideoBackground from '@/components/homepage/VideoBackground'
import LogoShortTsx from '@/components/svgs/LogoShort'
import { useTranslations } from 'next-intl'
import LogoShortAnimated from '@/components/svgs/LogoShortAnimated'
import { FaInstagram } from 'react-icons/fa'
import AnimatedCircle from '@/components/homepage/BigBangCircleAnimated'
import EquipeLogoAnimated from '@/components/homepage/EquipeAnimated'
import MemoirePlayAnimated from '@/components/homepage/MemoirePlayAnimated'
import FestivalAnimated from '@/components/homepage/FestivalAnimated'
import FestivalSparklesIcon from '@/components/festival/FestivalSparklesIcon'

export default function IndexRoute() {
	const themeColors = {
		dark: {
			fill: 'var(--color-grayDark)',
			stroke: 'var(--color-dark)',
		},
		light: {
			fill: 'var(--color-primary)',
			stroke: 'var(--color-grayDark)',
		},
	}

	const themeColorsIcon = {
		dark: {
			fill: 'var(--color-grayDark)',
			// stroke: isHovered ? 'var(--color-dark)' : 'var(--color-dark)',
		},
		light: {
			fill: 'var(--color-grayDark)',
		},
	}

	return (
		<div className="lg:shadowtest lg:no-scrollbar relative flex h-svh w-full items-center justify-center overflow-hidden tracking-tight lg:my-1 lg:h-[calc(100svh-10px)] lg:overflow-y-auto lg:rounded-xl">
			{/* Rule of thirds grid */}
			<div className="pointer-events-none absolute inset-0 z-20">
				<div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
					<div className="border-b border-r border-grayLight opacity-20"></div>
					<div className="border-b border-r border-grayLight opacity-20"></div>
					<div className="border-b border-grayLight opacity-20"></div>
					<div className="border-b border-r border-grayLight opacity-20"></div>
					<div className="border-b border-r border-grayLight opacity-20"></div>
					<div className="border-b border-grayLight opacity-20"></div>
					<div className="border-r border-grayLight opacity-20"></div>
					<div className="border-r border-grayLight opacity-20"></div>
					<div></div>
				</div>
			</div>

			{/* Recording frame corners */}
			<div className="absolute left-4 top-4 z-30 h-8 w-8 border-l-[2px] border-t-[2px] border-[#fff] mix-blend-overlay"></div>
			<div className="absolute right-4 top-4 z-30 h-8 w-8 border-r-[2px] border-t-[2px] border-[#fff] mix-blend-overlay"></div>
			<div className="absolute bottom-4 left-4 z-30 h-8 w-8 border-b-[2px] border-l-[2px] border-[#fff] mix-blend-overlay"></div>
			<div className="absolute bottom-4 right-4 z-30 h-8 w-8 border-b-[2px] border-r-[2px] border-[#fff] mix-blend-overlay"></div>

			{/* Main Logo */}
			<div className="absolute z-30 flex items-center justify-center sm:hidden">
				<LogoShortAnimated
					className="w-[85vw] -rotate-6 text-primary"
					theme={{
						fill: 'var(--color-primary)',
						stroke: 'var(--color-dark)',
					}}
				/>
			</div>

			<div className="m-0 h-full w-auto p-0">
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
