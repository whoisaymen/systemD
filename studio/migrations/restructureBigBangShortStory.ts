import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { isDeepStrictEqual } from 'node:util'
import { createClient, type SanityDocument } from '@sanity/client'
import { restructureShortStoryBody } from './lib/shortStoryBlocks'

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

async function run() {
	const documents = await client.fetch<SanityDocument[]>(
		'*[_type == "bigbangShortStory" && defined(body)]',
	)
	const plans = documents
		.map((document) => ({
			document,
			body: restructureShortStoryBody(document.body),
		}))
		.filter(({ document, body }) => !isDeepStrictEqual(document.body, body))

	for (const { document, body } of plans) {
		console.log(
			`${document._id}: ${body.map((block) => (block._type === 'storyIllustration' ? block.label : 'Texte')).join(' → ')}`,
		)
	}
	console.log(
		`${plans.length} documents ${apply ? 'to update' : 'would change'}.`,
	)
	if (!apply || !plans.length) return
	if (!process.env.SANITY_API_WRITE_TOKEN)
		throw new Error('A Sanity write token is required.')

	const backupDirectory = fileURLToPath(new URL('../backups/', import.meta.url))
	fs.mkdirSync(backupDirectory, { recursive: true })
	const backupPath = `${backupDirectory}/bigbang-story-blocks-${Date.now()}.json`
	fs.writeFileSync(
		backupPath,
		JSON.stringify(
			plans.map(({ document }) => document),
			null,
			2,
		),
		{ mode: 0o600 },
	)
	console.log(`Saved originals to ${backupPath}`)

	let transaction = client.transaction()
	for (const { document, body } of plans) {
		transaction = transaction.patch(document._id, (patch) =>
			patch.ifRevisionId(document._rev).set({ body }),
		)
	}
	await transaction.commit()
	for (const { document, body } of plans) {
		const saved = await client.getDocument(document._id)
		if (!isDeepStrictEqual(saved?.body, body))
			throw new Error(`Verification failed: ${document._id}`)
	}
	console.log(
		'Verified saved order and content. Draft and published versions were updated independently.',
	)
}

run().catch((error) => {
	console.error(error.message)
	process.exitCode = 1
})
