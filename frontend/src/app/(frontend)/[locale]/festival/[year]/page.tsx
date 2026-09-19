import FestivalEditionContent from '@/components/festival/FestivalEditionContent'
import { groq, fetchSanityLive } from '@/sanity/lib/fetch'
import { notFound } from 'next/navigation'

export default async function FestivalEditionPage({
	params,
}: {
	params: Promise<{ locale: string; year: string }>
}) {
	const { locale, year } = await params
	const content = await getFestivalEdition(year, locale)

	if (!content) {
		return <div>No content available for this festival edition</div>
	}

	// return <Loading />
	return <FestivalEditionContent festival={content} language={locale} />
}

async function getFestivalEdition(year: string, locale: string) {
	const query = groq`
		*[_type == 'festival' && year == $year][0]{
			_id,
			description,
			year,
			venue,
			visual,
			pressLink,
			aftermovieLink,
			overviewTitle,
			filmsTitle,
			exhibitionTitle,
			photosTitle,
			juryTitle,
			pressLinkLabel,
			aftermovieLinkLabel,

			"filmSelection": *[_type == 'film' && references(^._id)] | order(year asc, coalesce(
				pt::text(title[language == $locale || _key == $locale][0].value),
				title[language == $locale || _key == $locale][0].value,
				pt::text(title[0].value),
				title[0].value
			) asc) {
				_id,
				slug,
				title,
				description,
				director,
				year,
				affiche,
				isWinner
			},
			jury[]->{
				_id,
				name,
				image {
					asset->{
						_id,
						url,
						metadata
					}
				},
				biography,
				edition->{
					year
				}
			},
			"linkedJury": *[
				_type == 'jury' &&
				edition._ref == ^._id &&
				!(_id in coalesce(^.jury[]._ref, []))
			] | order(coalesce(pt::text(name), name) asc) {
				_id,
				name,
				image {
					asset->{
						_id,
						url,
						metadata
					}
				},
				biography,
				edition->{
					year
				}
			},
			"photoGallery": photoGallery[]{
				_type,
				photographer,
				photos[]{
					...,
					asset->{
						_id,
						url,
						metadata
					}
				},
			},
			expoPhoto[]{
				_type,
				curatorName,
				photos[]{
					photo{
						asset->{
							_id,
							url,
							metadata
						}
					},
					artistName,
				}
			}
		}
	`

	const data = await fetchSanityLive({
		query,
		params: { year: Number(year), locale },
	})

	if (!data) {
		return notFound()
	}

	const { linkedJury, jury, ...festival } = data

	return {
		...festival,
		jury: mergeJuryMembers(jury, linkedJury),
	}
}

function mergeJuryMembers(primary?: any[], secondary?: any[]) {
	const seen = new Set<string>()

	return [...(primary ?? []), ...(secondary ?? [])].filter((member) => {
		if (!member?._id || seen.has(member._id)) {
			return false
		}

		seen.add(member._id)
		return true
	})
}
