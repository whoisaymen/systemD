import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { isDeepStrictEqual } from 'node:util'
import { createClient } from '@sanity/client'
import { mergeFestivalDescription } from './lib/festivalDescription'

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
	const documents = await client.fetch<any[]>('*[_type == "festival"]')
	const plans = documents
		.map((document) => ({ document, next: mergeFestivalDescription(document) }))
		.filter(({ document, next }) => !isDeepStrictEqual(document, next))
	for (const { document, next } of plans) {
		console.log(
			`${document._id} (${document.year}): ${next.description.map((entry: any) => `${entry.language}: ${entry.value.length} blocks`).join(', ')}`,
		)
	}
	console.log(
		`${plans.length} edition documents ${apply ? 'to update' : 'would change'}. Drafts and published documents stay separate.`,
	)
	if (!apply || !plans.length) return
	if (!process.env.SANITY_API_WRITE_TOKEN)
		throw new Error('A Sanity write token is required.')
	const backupDirectory = fileURLToPath(new URL('../backups/', import.meta.url))
	fs.mkdirSync(backupDirectory, { recursive: true })
	const backupPath = `${backupDirectory}/festival-description-${Date.now()}.json`
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
	for (const { document, next } of plans) {
		transaction = transaction.patch(document._id, (patch) =>
			patch
				.ifRevisionId(document._rev)
				.set({ description: next.description })
				.unset(['text']),
		)
	}
	await transaction.commit()
	for (const { document, next } of plans) {
		const saved = await client.getDocument(document._id)
		if (
			!isDeepStrictEqual(saved?.description, next.description) ||
			saved?.text !== undefined
		)
			throw new Error(`Verification failed: ${document._id}`)
		if (!isDeepStrictEqual(saved, mergeFestivalDescription(saved)))
			throw new Error(`Migration is not idempotent: ${document._id}`)
	}
	console.log('All descriptions verified; the retired text field is removed.')
}

run().catch((error) => {
	console.error(error.message)
	process.exitCode = 1
})
