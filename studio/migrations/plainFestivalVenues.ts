import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createClient, type SanityDocument } from '@sanity/client'
import { richTextToPlainText } from '../src/sanity/lib/richTextPreview'

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
		'*[_type == "festival" && defined(venue)]',
	)
	const plans = documents
		.filter((document) => typeof document.venue !== 'string')
		.map((document) => {
			if (
				!Array.isArray(document.venue) ||
				!document.venue.every(
					(block) =>
						block?._type === 'block' &&
						Array.isArray(block.children) &&
						block.children.every(
							(child: { _type?: string; text?: unknown } | null) =>
								child?._type === 'span' && typeof child.text === 'string',
						),
				)
			)
				throw new Error(`Unexpected venue content: ${document._id}`)
			return {
				document,
				venue: richTextToPlainText(document.venue).replace(/\s*\r?\n\s*/g, ' '),
			}
		})
	for (const { document, venue } of plans) {
		console.log(`${document._id} (${document.year}): ${JSON.stringify(venue)}`)
	}
	console.log(
		`${plans.length} venues ${apply ? 'to convert' : 'would change'}.`,
	)
	if (!apply || !plans.length) return
	if (!process.env.SANITY_API_WRITE_TOKEN)
		throw new Error('A Sanity write token is required.')

	const backupDirectory = fileURLToPath(new URL('../backups/', import.meta.url))
	fs.mkdirSync(backupDirectory, { recursive: true })
	const backupPath = `${backupDirectory}/festival-venues-${Date.now()}.json`
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
	for (const { document, venue } of plans) {
		transaction = transaction.patch(document._id, (patch) =>
			patch.ifRevisionId(document._rev).set({ venue }),
		)
	}
	await transaction.commit()
	for (const { document, venue } of plans) {
		const saved = await client.getDocument(document._id)
		if (saved?.venue !== venue)
			throw new Error(`Verification failed: ${document._id}`)
	}
	console.log('All venues verified. Draft and published states preserved.')
}

run().catch((error) => {
	console.error(error.message)
	process.exitCode = 1
})
