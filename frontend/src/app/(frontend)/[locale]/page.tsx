import HomepageVideoIntro from '@/components/homepage/HomepageVideoIntro'
import { fetchSanityLive, groq } from '@/sanity/lib/fetch'

export default async function IndexRoute() {
	const homepage = await fetchSanityLive({
		query: groq`*[_type == "homepage"][0]{
		backgroundVideoUrl,
		"backgroundVideoUrlResolved": backgroundVideo.asset->url
	}`,
	})
	return <HomepageVideoIntro homepage={homepage} />
}
