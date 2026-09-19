import fs from 'node:fs'
import path from 'node:path'
import { getCliClient } from 'sanity/cli'
import { schemaTypes } from '../src/sanity/schemas'
import { changedFields, migrateEditorialValue } from './lib/editorialContent'
import { seedEditorialContent } from './lib/editorialSeeds'

// Draft mode fixes Studio editors without changing content served by the published site.
const apply = process.argv.includes('--apply')
const draftsOnly = process.argv.includes('--drafts-only')
const verbose = process.argv.includes('--verbose')
const localEnv = path.resolve('../frontend/.env.local')
if (fs.existsSync(localEnv)) process.loadEnvFile(localEnv)
const client = getCliClient({ apiVersion: '2026-09-12' }).withConfig({
	useCdn: false,
	perspective: 'raw',
	...(process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN
		? {
				token:
					process.env.SANITY_API_WRITE_TOKEN ||
					process.env.SANITY_API_READ_TOKEN,
			}
		: {}),
})

async function run() {
	const types = new Map(schemaTypes.map((schema) => [schema.name, schema]))
	const documents = await client.fetch<any[]>(`*[_type in $types]`, {
		types: schemaTypes
			.filter((schema) => schema.type === 'document')
			.map((schema) => schema.name),
	})
	const draftIds = new Set(
		documents
			.filter((document) => document._id.startsWith('drafts.'))
			.map((document) => document._id),
	)
	const sources = draftsOnly
		? documents.filter(
				(document) =>
					document._id.startsWith('drafts.') ||
					!draftIds.has(`drafts.${document._id}`),
			)
		: documents
	const plan = sources.flatMap((document) => {
		const seeded = seedEditorialContent(document, documents)
		const updated = migrateEditorialValue(
			seeded,
			{ type: document._type },
			types,
		)
		const set = changedFields(document, updated)
		const unset = Object.keys(document).filter(
			(key) => !key.startsWith('_') && !Object.hasOwn(updated, key),
		)
		const createDraft = draftsOnly && !document._id.startsWith('drafts.')
		return Object.keys(set).length || unset.length
			? [{ document, updated, set, unset, createDraft }]
			: []
	})
	const counts: Record<string, number> = {}
	for (const { document, set, unset, createDraft } of plan) {
		counts[document._type] = (counts[document._type] ?? 0) + 1
		if (verbose)
			console.log(
				`${apply ? 'Migrate' : 'Would migrate'} ${createDraft ? 'drafts.' : ''}${document._id} (${document._type}): ${Object.keys(set).join(', ')}${unset.length ? `; remove retired fields: ${unset.join(', ')}` : ''}`,
			)
	}
	console.log(JSON.stringify(counts))
	console.log(
		`${plan.length} of ${sources.length} documents ${apply ? 'will be migrated' : 'would change'}. ${draftsOnly ? 'Published content is unchanged; only drafts are created or updated.' : 'Drafts and published documents are handled independently.'}`,
	)
	if (!apply || !plan.length) return
	const backupDir = path.resolve('backups')
	fs.mkdirSync(backupDir, { recursive: true })
	const backupPath = path.join(
		backupDir,
		`editorial-content-${new Date().toISOString().replace(/[:.]/g, '-')}.ndjson`,
	)
	fs.writeFileSync(
		backupPath,
		plan
			.map(({ document, createDraft }) =>
				JSON.stringify({
					source: document,
					targetId: `${createDraft ? 'drafts.' : ''}${document._id}`,
					createdDraft: createDraft,
				}),
			)
			.join('\n') + '\n',
		{ mode: 0o600 },
	)
	console.log(`Saved originals to ${backupPath}`)
	// Each patch refuses to overwrite any intervening customer edit.
	for (let index = 0; index < plan.length; index += 50) {
		let transaction = client.transaction()
		for (const { document, updated, set, unset, createDraft } of plan.slice(
			index,
			index + 50,
		)) {
			if (createDraft) {
				const { _id, _rev, _createdAt, _updatedAt, ...content } = updated
				transaction = transaction.create({ ...content, _id: `drafts.${_id}` })
			} else {
				transaction = transaction.patch(document._id, (patch) =>
					patch.ifRevisionId(document._rev).set(set).unset(unset),
				)
			}
		}
		await transaction.commit()
		console.log(
			`Migrated ${Math.min(index + 50, plan.length)} / ${plan.length}.`,
		)
	}
	console.log('Editorial content migration complete.')
}

run().catch((error) => {
	console.error(error.message)
	process.exitCode = 1
})
