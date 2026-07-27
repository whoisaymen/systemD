import { getCliClient } from 'sanity/cli'

const dryRun = process.argv.includes('--dry-run')
const client = getCliClient({ apiVersion: '2024-12-01' })

type FestivalDoc = {
	_id: string
	_type: string
	vision?: unknown[]
	blocks?: Array<
		Record<string, unknown> & {
			_key?: string
			_type?: string
			title?: string
		}
	>
}

const docIds = [
	'fabrique',
	'drafts.fabrique',
	'lefestival',
	'drafts.lefestival',
]

const normalizeTitle = (value: unknown) =>
	typeof value === 'string' ? value.trim().toLowerCase() : ''

const hasCallForEntryBlock = (doc?: FestivalDoc) =>
	doc?.blocks?.some(
		(block) =>
			block?._type === 'customTextBlock' &&
			normalizeTitle(block.title) === 'call for entry',
	) ?? false

const getCallForEntryBlock = (doc?: FestivalDoc) =>
	doc?.blocks?.find(
		(block) =>
			block?._type === 'customTextBlock' &&
			normalizeTitle(block.title) === 'call for entry',
	)

const callForEntryBlock = {
	_key: 'call-for-entry',
	_type: 'customTextBlock',
	title: 'Call for entry',
	show: false,
	content: {
		fr: [],
		en: [],
		nl: [],
	},
}

async function moveVision({
	source,
	target,
	cleanupSource = source,
}: {
	source?: FestivalDoc
	target?: FestivalDoc
	cleanupSource?: FestivalDoc
}) {
	if (!target) {
		console.log(
			`Skipping ${source?._id ?? 'missing source'}: target document is missing, so no draft was created.`,
		)
		return
	}

	if (target.vision?.length) {
		console.log(`${target._id} already has Vision content.`)
		return
	}

	if (!source?.vision?.length) {
		console.log(
			`No Vision content found on ${source?._id ?? 'missing source'}.`,
		)
		return
	}

	console.log(
		`${dryRun ? 'Would move' : 'Moving'} ${source.vision.length} Vision item(s) from ${source._id} to ${target._id}.`,
	)

	if (dryRun) return

	const transaction = client
		.transaction()
		.patch(target._id, (patch) => patch.set({ vision: source.vision }))

	if (cleanupSource) {
		transaction.patch(cleanupSource._id, (patch) => patch.unset(['vision']))
	}

	await transaction.commit()
}

async function ensureCallForEntry({
	target,
	sourceBlock,
}: {
	target?: FestivalDoc
	sourceBlock?: Record<string, unknown>
}) {
	if (!target) {
		console.log('Skipping Call for entry: Le Festival document is missing.')
		return
	}

	if (hasCallForEntryBlock(target)) {
		console.log(`${target._id} already has a Call for entry block.`)
		return
	}

	const block = sourceBlock ?? callForEntryBlock
	const sourceLabel = sourceBlock
		? 'the published Call for entry block'
		: 'a hidden Call for entry block'

	console.log(
		`${dryRun ? 'Would add' : 'Adding'} ${sourceLabel} to ${target._id}.`,
	)

	if (dryRun) return

	const patch = client.patch(target._id)

	if (target.blocks?.length) {
		await patch.insert('before', 'blocks[0]', [block]).commit()
		return
	}

	await patch.set({ blocks: [block] }).commit()
}

async function run() {
	const docs = await client.fetch<FestivalDoc[]>(
		`*[_id in $ids]{_id, _type, vision, blocks}`,
		{ ids: docIds },
	)
	const byId = new Map(docs.map((doc) => [doc._id, doc]))
	const publishedFabrique = byId.get('fabrique')
	const draftFabrique = byId.get('drafts.fabrique')
	const publishedFestival = byId.get('lefestival')

	await moveVision({
		source: publishedFabrique,
		target: publishedFestival,
	})
	await moveVision({
		source: draftFabrique ?? publishedFabrique,
		target: byId.get('drafts.lefestival'),
		cleanupSource: draftFabrique,
	})
	await ensureCallForEntry({
		target: publishedFestival,
	})
	await ensureCallForEntry({
		target: byId.get('drafts.lefestival'),
		sourceBlock: getCallForEntryBlock(publishedFestival),
	})
}

run().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
