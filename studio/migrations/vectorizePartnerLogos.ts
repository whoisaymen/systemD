import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { isDeepStrictEqual } from 'node:util'
import { createClient, type SanityDocument } from '@sanity/client'

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

type Partner = {
	_key: string
	name?: string
	logo?: { _type: string; asset?: { _type: string; _ref: string } }
}
type Contact = SanityDocument & { partners?: Partner[] }

const replacements = [
	{
		name: 'pianofabriek',
		key: 'bc03557e3106',
		original: 'image-dc56d8064ebbcf3e8b0c88272eec6a0befdf7f57-356x438-png',
	},
	{
		name: 'vlaanderen',
		key: '5f8b2fe70d45',
		original: 'image-e60ee1536adee1caa0636828b7831b707913b9e7-986x384-png',
	},
	{
		name: 'saint-gilles',
		key: '0ccebfce419c',
		original: 'image-59c141d123f1d29d3d865ca10b1191aa771d96e6-424x118-png',
	},
	{
		name: 'kvs',
		key: 'ef82ddae9588',
		original: 'image-b75dd152f98ffda6b2f9734329040d29da231a61-1255x1415-png',
	},
].map((replacement) => {
	const content = fs.readFileSync(
		fileURLToPath(
			new URL(
				`../../frontend/public/assets/partners/${replacement.name}.svg`,
				import.meta.url,
			),
		),
	)
	const svg = content.toString('utf8')
	if (
		!svg.includes('fill="currentColor"') ||
		!svg.includes('viewBox=') ||
		/<(?:image|script|foreignObject|text)\b|\b(?:href|style)=/i.test(svg)
	)
		throw new Error(`Expected self-contained vector paths: ${replacement.name}`)
	return {
		...replacement,
		content,
		sha1: createHash('sha1').update(content).digest('hex'),
	}
})

async function run() {
	const documents = await client.fetch<Contact[]>(
		'*[_type == "contact" && defined(partners)]',
	)
	const plans = documents
		.map((document) => ({
			document,
			changes: (document.partners ?? []).flatMap((partner) => {
				const replacement = replacements.find(
					(item) => item.key === partner._key,
				)
				if (!replacement) return []
				const ref = partner.logo?.asset?._ref
				if (
					ref?.startsWith(`image-${replacement.sha1}-`) &&
					ref.endsWith('-svg')
				)
					return []
				if (ref !== replacement.original)
					throw new Error(
						`Logo changed since inspection: ${document._id}/${partner.name}`,
					)
				return [{ partner, replacement }]
			}),
		}))
		.filter(({ changes }) => changes.length)

	for (const { document, changes } of plans)
		console.log(
			`${document._id}: ${changes.map(({ partner }) => partner.name).join(', ')}`,
		)
	console.log(
		`${plans.length} documents ${apply ? 'to update' : 'would change'}.`,
	)
	if (!apply || !plans.length) return
	if (!process.env.SANITY_API_WRITE_TOKEN)
		throw new Error('A Sanity write token is required.')

	const backupDirectory = fileURLToPath(new URL('../backups/', import.meta.url))
	fs.mkdirSync(backupDirectory, { recursive: true })
	const backupPath = `${backupDirectory}/partner-logos-${Date.now()}.json`
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

	const uploaded = new Map<string, string>()
	for (const { changes } of plans) {
		for (const { replacement } of changes) {
			if (uploaded.has(replacement.name)) continue
			const asset = await client.assets.upload('image', replacement.content, {
				filename: `${replacement.name}.svg`,
				contentType: 'image/svg+xml',
			})
			if (
				asset.mimeType !== 'image/svg+xml' ||
				asset.sha1hash !== replacement.sha1
			)
				throw new Error(`Unexpected uploaded asset: ${replacement.name}`)
			uploaded.set(replacement.name, asset._id)
		}
	}

	let transaction = client.transaction()
	const expectedPartners = new Map<string, Partner[]>()
	for (const { document, changes } of plans) {
		const fields: Record<string, unknown> = {}
		const partners = structuredClone(document.partners ?? [])
		for (const { partner, replacement } of changes) {
			const logo = {
				_type: 'image',
				asset: { _type: 'reference', _ref: uploaded.get(replacement.name)! },
			}
			fields[`partners[_key==${JSON.stringify(partner._key)}].logo`] = logo
			partners.find((item) => item._key === partner._key)!.logo = logo
		}
		expectedPartners.set(document._id, partners)
		transaction = transaction.patch(document._id, (patch) =>
			patch.ifRevisionId(document._rev).set(fields),
		)
	}
	await transaction.commit()
	for (const { document } of plans) {
		const saved = await client.getDocument<Contact>(document._id)
		if (!isDeepStrictEqual(saved?.partners, expectedPartners.get(document._id)))
			throw new Error(`Verification failed: ${document._id}`)
	}
	console.log(
		'Verified all SVG replacements. Partner names, links, order, and draft/published states preserved.',
	)
}

run().catch((error) => {
	console.error(error.message)
	process.exitCode = 1
})
