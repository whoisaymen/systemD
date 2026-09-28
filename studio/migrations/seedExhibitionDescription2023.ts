import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { isDeepStrictEqual } from 'node:util'
import { createClient } from '@sanity/client'
import { richTextToPlainText } from '../../frontend/src/lib/richText'
import { localizeText } from './lib/editorialContent'

process.loadEnvFile(
	fileURLToPath(new URL('../../frontend/.env.local', import.meta.url)),
)
const apply = process.argv.includes('--apply')
const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: '2026-09-12',
	useCdn: false,
	perspective: 'raw',
	token:
		process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN,
})

// Starter copy adapted from the existing 2023 overview, using the exhibition's curator spelling.
const starterText = {
	en: 'The photo exhibition curated by Naïma B. Reyale reminded us of the little things we share.',
	fr: 'L’exposition de photographies organisée par Naïma B. Reyale nous a rappelé les petites choses que nous partageons.',
	nl: 'De fototentoonstelling gecureerd door Naïma B. Reyale herinnerde ons aan de kleine dingen die we delen.',
}
// Curator context verified against the producer's film credits and synopsis:
// https://cvb.be/en/movie/hors-jeu-0 (accessed 2026-09-27).
const curatorContext = {
	en: 'Alongside her curatorial work, Naïma B. Reyale also takes part in collaborative filmmaking. She co-wrote and co-directed Hors Jeu (2023), a Centre Vidéo de Bruxelles production following a young stand-up performer finding her place in the Brussels comedy scene.',
	fr: 'En parallèle de son travail de commissaire, Naïma B. Reyale participe aussi à des créations cinématographiques collectives. Elle a coécrit et coréalisé Hors Jeu (2023), une production du Centre Vidéo de Bruxelles qui suit une jeune artiste de stand-up cherchant sa place sur la scène bruxelloise.',
	nl: 'Naast haar werk als curator werkt Naïma B. Reyale ook mee aan collectieve filmprojecten. Ze schreef en regisseerde mee aan Hors Jeu (2023), een productie van het Centre Vidéo de Bruxelles over een jonge stand-upcomedian die haar plaats zoekt in de Brusselse comedywereld.',
}
const starterDescription = localizeText(starterText)
const description = localizeText(
	Object.fromEntries(
		Object.entries(starterText).map(([language, text]) => [
			language,
			`${text}\n\n${curatorContext[language as keyof typeof curatorContext]}`,
		]),
	),
)
const exhibitionKey = 'be493de3d179'
const fieldPath = `expoPhoto[_key=="${exhibitionKey}"].description`

async function run() {
	const documents = await client.fetch<any[]>(
		'*[_type == "festival" && year == 2023 && !(_id in path("versions.**"))]',
	)
	if (!documents.length) throw new Error('The 2023 edition was not found.')
	const plans = documents.filter((document) => {
		const exhibition = document.expoPhoto?.find(
			(item: any) => item._key === exhibitionKey,
		)
		if (!exhibition)
			throw new Error(`The 2023 exhibition is missing in ${document._id}`)
		// Upgrade our starter copy; preserve any text changed or supplied by an editor.
		return (
			!richTextToPlainText(exhibition.description).trim() ||
			isDeepStrictEqual(exhibition.description, starterDescription)
		)
	})
	for (const document of plans)
		console.log(`${document._id}: add exhibition description (EN / FR / NL)`)
	console.log(
		`${plans.length} documents ${apply ? 'to update' : 'would change'}; only the 2023 exhibition is targeted.`,
	)
	if (!apply || !plans.length) return
	if (!process.env.SANITY_API_WRITE_TOKEN)
		throw new Error('A Sanity write token is required.')
	const directory = fileURLToPath(new URL('../backups/', import.meta.url))
	fs.mkdirSync(directory, { recursive: true })
	const backup = `${directory}exhibition-description-2023-${Date.now()}.json`
	fs.writeFileSync(backup, JSON.stringify(plans, null, 2), { mode: 0o600 })
	console.log(`Saved originals to ${backup}`)
	let transaction = client.transaction()
	for (const document of plans) {
		transaction = transaction.patch(document._id, (patch) =>
			patch.ifRevisionId(document._rev).set({ [fieldPath]: description }),
		)
	}
	await transaction.commit()
	for (const document of plans) {
		const saved = await client.getDocument(document._id)
		const actual = saved?.expoPhoto?.find(
			(item: any) => item._key === exhibitionKey,
		)?.description
		if (!isDeepStrictEqual(actual, description))
			throw new Error(`Verification failed: ${document._id}`)
	}
	console.log(
		'2023 exhibition descriptions verified. Drafts and published content remain separate.',
	)
}

run().catch((error) => {
	console.error(error.message)
	process.exitCode = 1
})
