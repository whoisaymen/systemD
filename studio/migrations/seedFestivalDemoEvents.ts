import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { isDeepStrictEqual } from 'node:util'
import { createClient, type SanityDocument } from '@sanity/client'
import { demoEventTypes, getFestivalDemoEvents } from './lib/festivalDemoEvents'
import { localizeText } from './lib/editorialContent'

process.loadEnvFile(
	fileURLToPath(new URL('../../frontend/.env.local', import.meta.url)),
)

const apply = process.argv.includes('--apply')
const remove = process.argv.includes('--remove')
const yearArgument = process.argv.find((argument) =>
	argument.startsWith('--year='),
)
const year = Number(
	yearArgument?.slice('--year='.length) ?? new Date().getFullYear(),
)
if (!Number.isInteger(year) || year < 2000 || year > 2100)
	throw new Error('Use --year=YYYY with a year between 2000 and 2100.')

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: '2026-09-20',
	useCdn: false,
	perspective: 'raw',
	token: apply
		? process.env.SANITY_API_WRITE_TOKEN
		: process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
})

type Reference = { _key: string; _type: 'reference'; _ref: string }
type Block = {
	_key: string
	_type: string
	show?: boolean
	events?: Reference[]
	[key: string]: unknown
}
type Festival = SanityDocument<{ blocks?: Block[] }>

async function run() {
	if (apply && !process.env.SANITY_API_WRITE_TOKEN)
		throw new Error('SANITY_API_WRITE_TOKEN is required to apply changes.')
	const events = getFestivalDemoEvents(year)
	const eventTypes = Object.values(demoEventTypes)
	const seeds = [...eventTypes, ...events]
	const ids = seeds.flatMap(({ _id }) => [_id, `drafts.${_id}`])
	const [festivals, existing] = await Promise.all([
		client.fetch<Festival[]>(
			'*[_type == "lefestival" && !(_id in path("versions.**"))]',
		),
		client.fetch<SanityDocument[]>('*[_id in $ids]', { ids }),
	])
	if (
		!remove &&
		new Set(festivals.map(({ _id }) => _id.replace(/^drafts\./, ''))).size !== 1
	)
		throw new Error(
			'Expected exactly one festival page (plus its optional draft).',
		)
	for (const document of existing) {
		const seed = seeds.find(
			({ _id }) => _id === document._id.replace(/^drafts\./, ''),
		)!
		if (document._type !== seed._type)
			throw new Error(`Unexpected document type at ${document._id}.`)
	}

	const eventIds = events.map(({ _id }) => _id)
	const eventIdSet = new Set(eventIds)
	const toCreate = remove
		? []
		: seeds.filter((seed) => !existing.some(({ _id }) => _id === seed._id))
	const toDelete: SanityDocument[] = []
	if (remove) {
		const eventDocuments = existing.filter(({ _type }) => _type === 'event')
		const deletedIds = new Set(eventDocuments.map(({ _id }) => _id))
		const users = await client.fetch<{ _id: string; _type: string }[]>(
			'*[references($ids)]{_id, _type}',
			{ ids: eventIds },
		)
		const externalUsers = users.filter(
			({ _id }) =>
				!festivals.some((festival) => festival._id === _id) &&
				!deletedIds.has(_id),
		)
		if (externalUsers.length)
			throw new Error(
				`Demo events are referenced elsewhere; unlink them first: ${externalUsers.map(({ _id }) => _id).join(', ')}`,
			)
		toDelete.push(...eventDocuments)
		for (const eventType of eventTypes) {
			const users = await client.fetch<string[]>('*[references($id)]._id', {
				id: eventType._id,
			})
			if (users.some((id) => !deletedIds.has(id))) {
				console.log(`Keeping reused type ${eventType._id}.`)
				continue
			}
			toDelete.push(
				...existing.filter(
					({ _id }) =>
						_id === eventType._id || _id === `drafts.${eventType._id}`,
				),
			)
		}
	} else {
		const imageIds = [
			...new Set(
				events.flatMap(({ visual }) => (visual ? [visual.asset._ref] : [])),
			),
		]
		const images = await client.fetch<string[]>(
			'*[_type == "sanity.imageAsset" && _id in $ids]._id',
			{ ids: imageIds },
		)
		if (imageIds.some((id) => !images.includes(id)))
			throw new Error(
				'A demo image is missing from this dataset; no changes were made.',
			)
	}

	const patches = festivals.flatMap((document) => {
		const blocks = structuredClone(document.blocks ?? [])
		if (remove) {
			for (const block of blocks) {
				if (block._type === 'onTourBlock' && Array.isArray(block.events))
					block.events = block.events.filter(
						({ _ref }) => !eventIdSet.has(_ref),
					)
			}
		} else {
			let block = blocks.find(
				(block) => block._type === 'onTourBlock' && block.show !== false,
			)
			if (!block) {
				block = {
					_key: `demo-festival-${year}-events`,
					_type: 'onTourBlock',
					title: localizeText({
						en: 'Events',
						fr: 'Événements',
						nl: 'Evenementen',
					}),
					show: true,
					events: [],
				}
				blocks.push(block)
			}
			const linked = new Set(block.events?.map(({ _ref }) => _ref))
			block.events = [
				...(block.events ?? []),
				...eventIds
					.filter((id) => !linked.has(id))
					.map((_ref): Reference => ({ _key: _ref, _type: 'reference', _ref })),
			]
		}
		return isDeepStrictEqual(blocks, document.blocks ?? [])
			? []
			: [{ document, blocks }]
	})

	console.log(
		`${apply ? 'Apply' : 'Dry run'}: ${client.config().projectId}/${client.config().dataset}, year ${year}.`,
	)
	console.log(
		`${toCreate.length} documents to create, ${patches.length} festival pages to update, ${toDelete.length} documents to delete.`,
	)
	for (const document of [...toCreate, ...toDelete])
		console.log(`  ${document._type}: ${document._id}`)
	if (!apply || (!toCreate.length && !patches.length && !toDelete.length))
		return

	const backupDirectory = fileURLToPath(new URL('../backups/', import.meta.url))
	fs.mkdirSync(backupDirectory, { recursive: true })
	const backupPath = `${backupDirectory}/festival-demo-${year}-${remove ? 'remove' : 'seed'}-${Date.now()}.json`
	fs.writeFileSync(
		backupPath,
		JSON.stringify(
			{
				projectId: client.config().projectId,
				dataset: client.config().dataset,
				createdIds: toCreate.map(({ _id }) => _id),
				documents: [...patches.map(({ document }) => document), ...toDelete],
			},
			null,
			2,
		),
		{ mode: 0o600 },
	)
	console.log(`Saved originals and demo IDs to ${backupPath}`)

	let transaction = client.transaction()
	for (const document of toCreate)
		transaction = transaction.createIfNotExists<typeof document>(document)
	for (const { document, blocks } of patches)
		transaction = transaction.patch(document._id, (patch) =>
			patch.ifRevisionId(document._rev).set({ blocks }),
		)
	for (const document of toDelete) {
		transaction = transaction.delete(document._id)
	}
	await transaction.commit({ visibility: 'sync' })

	const saved = await client.getDocuments([
		...seeds.map(({ _id }) => _id),
		...toDelete.map(({ _id }) => _id),
	])
	if (
		remove
			? saved.some(
					(document) =>
						document && toDelete.some(({ _id }) => _id === document._id),
				)
			: saved.some((document) => !document)
	)
		throw new Error('Demo document verification failed.')
	for (const { document, blocks } of patches) {
		const saved = await client.getDocument<Festival>(document._id)
		if (!isDeepStrictEqual(saved?.blocks, blocks))
			throw new Error(`Festival links could not be verified: ${document._id}`)
	}
	console.log(
		remove
			? 'Demo content removed and festival links verified.'
			: 'Demo events and types published; festival links verified.',
	)
}

run().catch((error) => {
	console.error(error.message)
	process.exitCode = 1
})
