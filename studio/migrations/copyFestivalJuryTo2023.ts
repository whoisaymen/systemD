import { getCliClient } from 'sanity/cli'

const dryRun = process.argv.includes('--dry-run')
const yearArg = process.argv.find((arg) => arg.startsWith('--year='))
const targetYear = Number(yearArg?.split('=')[1] ?? 2023)
const client = getCliClient({ apiVersion: '2024-12-01' })

type SanityReference = {
	_key?: string
	_ref: string
	_type: 'reference'
}

type JuryBlock = {
	_key?: string
	_type?: string
	juryMembers?: SanityReference[]
	show?: boolean
}

type LeFestivalDoc = {
	_id: string
	blocks?: JuryBlock[]
}

type FestivalDoc = {
	_id: string
	jury?: SanityReference[]
	year?: number
}

type JuryDoc = {
	_id: string
	edition?: SanityReference
}

const sourceDocIds = ['lefestival', 'drafts.lefestival']

const getJuryReferences = (doc?: LeFestivalDoc) =>
	doc?.blocks
		?.filter((block) => block?._type === 'juryBlock')
		.flatMap((block) => block.juryMembers ?? [])
		.filter((reference): reference is SanityReference =>
			Boolean(reference?._ref),
		)
		.reduce<SanityReference[]>((references, reference) => {
			if (!references.some((item) => item._ref === reference._ref)) {
				references.push(reference)
			}

			return references
		}, []) ?? []

const getReferenceKey = (reference: SanityReference, index: number) => {
	const refKey = reference._ref.replace(/[^A-Za-z0-9_-]/g, '-').slice(-70)

	return `jury-${index}-${refKey}`
}

const toFestivalJuryReference = (
	reference: SanityReference,
	index: number,
): SanityReference => ({
	_key: getReferenceKey(reference, index),
	_ref: reference._ref,
	_type: 'reference',
})

async function addJuryReferencesToFestival(
	festival: FestivalDoc,
	sourceReferences: SanityReference[],
) {
	const existingRefs = new Set((festival.jury ?? []).map((item) => item._ref))
	const referencesToAdd = sourceReferences
		.filter((reference) => !existingRefs.has(reference._ref))
		.map(toFestivalJuryReference)

	if (referencesToAdd.length === 0) {
		console.log(
			`${festival._id} already has all ${sourceReferences.length} jury member(s).`,
		)
		return
	}

	console.log(
		`${dryRun ? 'Would add' : 'Adding'} ${referencesToAdd.length} jury member reference(s) to ${festival._id}.`,
	)

	if (dryRun) return

	if (festival.jury?.length) {
		await client
			.patch(festival._id)
			.insert('after', 'jury[-1]', referencesToAdd)
			.commit()
		return
	}

	await client.patch(festival._id).set({ jury: referencesToAdd }).commit()
}

async function assignMissingMemberEditions(
	references: SanityReference[],
	targetFestivalId: string,
) {
	const memberIds = references.map((reference) => reference._ref)
	const members = await client.fetch<JuryDoc[]>(
		`*[_type == "jury" && _id in $memberIds]{_id, edition}`,
		{ memberIds },
	)

	for (const member of members) {
		if (member.edition?._ref) {
			console.log(
				`${member._id} already has edition ${member.edition._ref}; leaving it unchanged.`,
			)
			continue
		}

		console.log(
			`${dryRun ? 'Would assign' : 'Assigning'} ${member._id} to festival ${targetFestivalId}.`,
		)

		if (dryRun) continue

		await client
			.patch(member._id)
			.set({
				edition: {
					_ref: targetFestivalId,
					_type: 'reference',
				},
			})
			.commit()
	}
}

async function run() {
	if (!Number.isFinite(targetYear)) {
		throw new Error(`Invalid --year value: ${yearArg}`)
	}

	const sourceDocs = await client.fetch<LeFestivalDoc[]>(
		`*[_id in $sourceDocIds]{_id, blocks}`,
		{ sourceDocIds },
	)
	const sourceWithReferences = sourceDocs
		.map((doc) => ({
			doc,
			references: getJuryReferences(doc),
		}))
		.sort((a, b) => b.references.length - a.references.length)[0]

	if (!sourceWithReferences?.references.length) {
		console.log('No jury members found in the Le Festival jury block.')
		return
	}

	const targetFestivals = await client.fetch<FestivalDoc[]>(
		`*[_type == "festival" && year == $targetYear]{_id, year, jury}`,
		{ targetYear },
	)
	const publishedTarget =
		targetFestivals.find((festival) => !festival._id.startsWith('drafts.')) ??
		targetFestivals[0]

	if (!publishedTarget) {
		console.log(`No festival edition found for ${targetYear}.`)
		return
	}

	console.log(
		`Using ${sourceWithReferences.references.length} jury member reference(s) from ${sourceWithReferences.doc._id}.`,
	)

	for (const festival of targetFestivals) {
		await addJuryReferencesToFestival(festival, sourceWithReferences.references)
	}

	await assignMissingMemberEditions(
		sourceWithReferences.references,
		publishedTarget._id,
	)
}

run().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
