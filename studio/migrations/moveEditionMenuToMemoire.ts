import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { isDeepStrictEqual } from 'node:util'
import { createClient } from '@sanity/client'
import { planEditionMenuMigration } from './lib/editionMenu'

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
const query =
	'*[_type in ["festival", "memoire"] && !(_id in path("versions.**"))]'

async function run() {
	const documents = await client.fetch<any[]>(query)
	const plans = planEditionMenuMigration(documents)
	for (const { document, set, unset } of plans) {
		console.log(
			`${document._id}: ${set.menu ? 'set shared Menu' : `remove ${unset.join(', ')}`}`,
		)
	}
	console.log(
		`${plans.length} documents ${apply ? 'to update' : 'would change'}. Drafts and publications stay separate.`,
	)
	if (!apply || !plans.length) return
	if (!process.env.SANITY_API_WRITE_TOKEN)
		throw new Error('A Sanity write token is required.')

	const directory = fileURLToPath(new URL('../backups/', import.meta.url))
	fs.mkdirSync(directory, { recursive: true })
	const backup = `${directory}edition-menu-${Date.now()}.json`
	fs.writeFileSync(backup, JSON.stringify(documents, null, 2), { mode: 0o600 })
	console.log(`Saved originals to ${backup}`)
	let transaction = client.transaction()
	for (const { document, set, unset } of plans) {
		const revision = document._rev
		if (!revision) throw new Error(`Missing revision: ${document._id}`)
		transaction = transaction.patch(document._id, (patch) =>
			patch.ifRevisionId(revision).set(set).unset(unset),
		)
	}
	await transaction.commit()
	const saved = await client.fetch<any[]>(query)
	for (const { document, set, unset } of plans) {
		const actual = saved.find((item) => item._id === document._id)
		const expected = { ...document, ...set }
		for (const field of unset) delete expected[field]
		const content = (value: any) =>
			Object.fromEntries(
				Object.entries(value ?? {}).filter(
					([key]) => !['_rev', '_updatedAt'].includes(key),
				),
			)
		if (!isDeepStrictEqual(content(actual), content(expected)))
			throw new Error(`Verification failed: ${document._id}`)
	}
	if (planEditionMenuMigration(saved).length)
		throw new Error('Migration is not idempotent.')
	console.log(
		'Shared menus and edition cleanup verified; no unrelated content changed.',
	)
}

run().catch((error) => {
	console.error(error.message)
	process.exitCode = 1
})
