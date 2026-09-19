'use client'

import PostPreview from '../PostPreview'
import { useCategory } from '../store'
import { filterPosts } from './filterPosts'

export default function List({
	posts,
	...props
}: {
	posts: Sanity.BlogPost[]
} & React.ComponentProps<'ul'>) {
	const { category } = useCategory()
	const filtered = filterPosts(posts, category)

	if (!filtered.length) {
		return <div>No posts found...</div>
	}

	return (
		<ul {...props}>
			{filtered?.map((post) => (
				<li className="anim-fade" key={post._id}>
					<PostPreview post={post} />
				</li>
			))}
		</ul>
	)
}
