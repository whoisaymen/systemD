import FilmSubmissionForm from '@/components/forms/FilmSubmissionForm'
import { fetchSanityLive, groq } from '@/sanity/lib/fetch'

export default async function ApplyPage({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const content = await fetchSanityLive({
		query: groq`*[_type == "filmSubmissionSettings" && _id == "filmSubmissionSettings"][0].filmSubmissionContent`,
	})
	return <FilmSubmissionForm content={content} language={locale} />
}
