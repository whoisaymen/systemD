import Img from '@/ui/Img'
import RichText from '@/components/common/RichText'
import { richTextToPlainText } from '@/lib/richText'
import { GoPerson } from 'react-icons/go'

export default function Authors({
	authors,
	skeleton,
	allowLinks = true,
	...props
}: {
	authors?: Sanity.Person[]
	skeleton?: boolean
	allowLinks?: boolean
} & React.ComponentProps<'dl'>) {
	if (!authors?.length && !skeleton) return null

	return (
		<dl {...props}>
			{authors?.map((author) => (
				<Author author={author} key={author._id} allowLinks={allowLinks} />
			))}

			{skeleton && <Author />}
		</dl>
	)
}

function Author({
	author,
	allowLinks = true,
}: {
	author?: Sanity.Person
	allowLinks?: boolean
}) {
	return (
		<div className="flex items-center gap-[.5ch]">
			<dd className="grid aspect-square w-[1.7em] shrink-0 place-content-center overflow-hidden rounded-full bg-neutral-50">
				{author?.image ? (
					<Img
						className="aspect-square"
						image={author.image}
						imageWidth={60}
						alt={richTextToPlainText(author.name)}
					/>
				) : (
					<GoPerson className="text-xl text-accent/20" />
				)}
			</dd>

			<dt>
				<RichText value={author?.name} inline allowLinks={allowLinks} />
			</dt>
		</div>
	)
}
