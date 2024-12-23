import { fetchSanityLive } from '@/sanity/lib/fetch'
import { linkQuery } from '@/sanity/lib/queries'
import Scheduler from './Scheduler'
import { PortableText, groq } from 'next-sanity'
import CTA from '@/ui/CTA'

export default async function Announcement() {
	const announcements = await fetchSanityLive<
		(Sanity.Announcement & Sanity.Module)[]
	>({
		query: groq`*[_type == 'site'][0].announcements[]->{
			...,
			cta{ ${linkQuery} },
		}`,
		tag: 'announcements',
	})

	if (!announcements) return null

	return (
		<>
			{announcements?.map(({ start, end, content, cta, _id }) => (
				<Scheduler start={start} end={end} key={_id}>
					<aside className="flex items-center justify-center gap-x-4 text-balance bg-accent p-2 text-center text-canvas max-md:text-sm md:gap-x-6">
						<div className="anim-fade-to-r [&_a]:link">
							<PortableText value={content} />
						</div>

						<CTA className="link anim-fade-to-l shrink" link={cta} />
					</aside>
				</Scheduler>
			))}
		</>
	)
}
