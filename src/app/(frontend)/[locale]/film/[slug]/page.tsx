import FilmContent from '@/components/film/FilmContent'
import { groq, fetchSanityLive } from '@/sanity/lib/fetch'
import { notFound } from 'next/navigation'
import Loading from './loading'

export default async function FilmPage({
	params,
	searchParams,
}: {
	params: Promise<{ locale: string; slug: string }>
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const { locale, slug } = await params
	const resolvedSearchParams = await searchParams

	const film = await getFilm(slug)
	if (!film) {
		return <div>No content available for this film</div>
	}

	const festival = await getFestivalWithFilms(film.festival?._ref)

	// Convert searchParams to a proper object for easier handling
	const searchParamsObj: Record<string, string> = {}
	Object.entries(resolvedSearchParams).forEach(([key, value]) => {
		if (value && typeof value === 'string') {
			searchParamsObj[key] = value
		}
	})

	return (
		<FilmContent
			film={film}
			language={locale}
			festival={festival}
			searchParams={searchParamsObj}
		/>
		// <Loading />
	)
}

async function getFilm(slug: string) {
	const query = groq`
    *[_type == 'film' && slug.current == $slug][0]{
      _id,
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
      description,
      slug,
      festival,
      isWinner
    }
  `
	const data = await fetchSanityLive({ query, params: { slug } })

	if (!data) {
		notFound()
	}

	return data
}

async function getFestivalWithFilms(festivalId: string) {
	if (!festivalId) {
		return null
	}

	// Get the festival details
	const festivalQuery = groq`
    *[_type == 'festival' && _id == $festivalId][0]{
      _id,
      year,
      venue,
      description,
      text,
      pressLink,
      aftermovieLink,
      photoGallery,
      expoPhoto,
      "slug": {"current": $festivalId}
    }
  `

	// Get all films for this festival
	const filmsQuery = groq`
    *[_type == 'film' && festival._ref == $festivalId]{
      _id,
      title,
      director,
      year,
      slug,
      affiche,
      isWinner,
      genre->{
        title
      },
      city,
      length
    } | order(year asc)
  `

	try {
		const [festival, films] = await Promise.all([
			fetchSanityLive({ query: festivalQuery, params: { festivalId } }),
			fetchSanityLive({ query: filmsQuery, params: { festivalId } }),
		])

		if (!festival) {
			return null
		}

		// Combine festival with films
		return {
			...festival,
			filmSelection: films || [],
		}
	} catch (error) {
		console.error('Error fetching festival and films:', error)
		return null
	}
}
