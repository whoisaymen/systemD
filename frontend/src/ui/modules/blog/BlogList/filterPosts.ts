export function filterPosts(posts: Sanity.BlogPost[], category: string) {
	return posts.filter(
		(post) =>
			category === 'All' ||
			post.categories?.some(({ slug }) => slug?.current === category),
	)
}
