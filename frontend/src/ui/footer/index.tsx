import { getSite } from '@/sanity/lib/queries'
import Navigation from './Navigation'
import Social from '@/ui/Social'
import { PortableText } from 'next-sanity'
import Link from 'next/link'
import LogoShortAnimated from '@/components/svgs/LogoShortAnimated'

export default async function Footer() {
	const { title, copyright } = await getSite()

	return (
		<footer className="bg-accent text-center text-canvas" role="contentinfo">
			<div className="section flex flex-wrap justify-between gap-x-12 gap-y-8 max-sm:flex-col">
				<div className="flex flex-col gap-3 self-start max-sm:mx-auto max-sm:items-center">
					<Link className="max-w-max" href="/" aria-label={title}>
						<LogoShortAnimated className="h-auto w-36 text-current md:w-48" />
					</Link>

					<Social />
				</div>

				<Navigation />
			</div>

			{copyright && (
				<div className="mx-auto flex max-w-screen-xl flex-wrap justify-center gap-x-6 gap-y-2 border-t border-canvas/20 p-4 text-sm">
					<PortableText value={copyright} />
				</div>
			)}
		</footer>
	)
}
