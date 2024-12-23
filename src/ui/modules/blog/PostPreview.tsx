import Link from 'next/link'
import processUrl from '@/lib/processUrl'
import Img from '@/ui/Img'
import Date from '@/ui/Date'
import Categories from './Categories'
import Authors from './Authors'

export default function PostPreview({
	post,
	skeleton,
}: {
	post?: Sanity.BlogPost
	skeleton?: boolean
}) {
	if (!post && !skeleton) return null

	const Root = skeleton ? 'div' : Link

	return (
		<Root
			className="group flex h-full flex-col space-y-2"
			href={processUrl(post, { base: false })}
		>
			<figure className="relative aspect-video overflow-hidden bg-neutral-50">
				<Img
					className="aspect-video w-full object-cover transition-[filter,transform] group-hover:scale-105 group-hover:brightness-110"
					image={post?.metadata.image}
					imageWidth={700}
					alt={post?.metadata.title}
				/>

				{post?.featured && (
					<span className="action absolute right-4 top-0 rounded-t-none py-1 text-xs shadow-md">
						Featured
					</span>
				)}
			</figure>

			<div className="h4 empty:skeleton-2 group-hover:underline">
				{post?.metadata.title}
			</div>

			<div className="grow">
				<p className="line-clamp-3 text-sm empty:h-[3lh]">
					{post?.metadata.description}
				</p>
			</div>

			{(post?.authors?.length || skeleton) && (
				<Authors
					className="flex flex-wrap items-center gap-4 text-sm"
					authors={post?.authors}
					skeleton={skeleton}
				/>
			)}

			<hr />

			<div className="empty:skeleton flex flex-wrap gap-x-4 text-sm">
				<Date value={post?.publishDate} />
				<Categories
					className="flex flex-wrap gap-x-2"
					categories={post?.categories}
				/>
			</div>
		</Root>
	)
}
