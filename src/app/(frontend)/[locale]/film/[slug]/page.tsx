import FilmContent from '@/components/film/FilmContent'
import { groq, fetchSanityLive } from '@/sanity/lib/fetch'
import { notFound } from 'next/navigation'

export default async function FilmPage({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>
}) {
	const { locale, slug } = await params
	const content = await getFilm(slug)

	if (!content) {
		return <div>No content available for this film</div>
	}

	return <FilmContent film={content} language={locale} />
}

async function getFilm(slug: string) {
	const query = groq`
    *[_type == 'film' && slug.current == $slug][0]{
      title,
      director,
      production,
      year,
      genre->{
        title
      },
      synopsis,
      city,
      length,
      playFilmUrl,
      affiche,
      description
    }
  `
	const data = await fetchSanityLive({ query, params: { slug } })

	if (!data) {
		notFound()

		throw new Error(`No content found for film with slug ${slug}`)
	}

	return data
}
