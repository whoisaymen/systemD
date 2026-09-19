import { getCliClient } from 'sanity/cli'

const dryRun = process.argv.includes('--dry-run')
const client = getCliClient({ apiVersion: '2026-08-16' })

type LocalizedDescription = {
	_key: string
	_type?: string
	language?: string
	value?: unknown
}

type MemoireDocument = {
	_id: string
	description?: LocalizedDescription[]
}

const createKey = (prefix: string, index: number) => `${prefix}-${index}`

const textToPortableText = (text: string, language: string) =>
	text
		.split(/\n{2,}/)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean)
		.map((paragraph, index) => ({
			_key: createKey(`${language}-block`, index),
			_type: 'block',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_key: createKey(`${language}-span`, index),
					_type: 'span',
					marks: [],
					text: paragraph,
				},
			],
		}))

const migrateDescription = (description: LocalizedDescription[]) =>
	description.map((entry, index) => {
		const language = entry._key || entry.language || `language-${index}`
		const value =
			typeof entry.value === 'string'
				? textToPortableText(entry.value, language)
				: entry.value

		return {
			...entry,
			_type: 'internationalizedArrayRichTextValue',
			value,
		}
	})

async function run() {
	const documents = await client.fetch<MemoireDocument[]>(
		`*[_type == "memoire" && defined(description)]{_id, description}`,
	)

	for (const document of documents) {
		if (!Array.isArray(document.description)) continue

		const hasLegacyContent = document.description.some(
			(entry) =>
				typeof entry.value === 'string' ||
				entry._type !== 'internationalizedArrayRichTextValue',
		)
		if (!hasLegacyContent) {
			console.log(`${document._id} is already using rich text.`)
			continue
		}

		console.log(
			`${dryRun ? 'Would migrate' : 'Migrating'} ${document._id} (${document.description.length} language value(s)).`,
		)
		if (dryRun) continue

		await client
			.patch(document._id)
			.set({ description: migrateDescription(document.description) })
			.commit()
	}
}

run().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
