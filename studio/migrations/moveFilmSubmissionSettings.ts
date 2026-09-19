import fs from 'node:fs'
import path from 'node:path'
import { isDeepStrictEqual } from 'node:util'
import { getCliClient } from 'sanity/cli'

const envFile = path.resolve('../frontend/.env.local')
if (fs.existsSync(envFile)) process.loadEnvFile(envFile)
const client = getCliClient({ apiVersion: '2026-09-12' }).withConfig({ useCdn: false, perspective: 'raw', token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN })
const apply = process.argv.includes('--apply')

async function run() {
	const documents = await client.fetch<any[]>('*[_type in ["site", "filmSubmissionSettings"]]')
	const plan = documents.filter(doc => doc._type === 'site' && Object.hasOwn(doc, 'filmSubmissionContent')).map(source => {
		const targetId = `${source._id.startsWith('drafts.') ? 'drafts.' : ''}filmSubmissionSettings`
		const target = documents.find(doc => doc._id === targetId)
		if (target && !isDeepStrictEqual(target.filmSubmissionContent, source.filmSubmissionContent)) throw new Error(`Different content exists at ${targetId}; refusing to overwrite it.`)
		return { source, target, targetId }
	})
	if (new Set(plan.map(item => item.targetId)).size !== plan.length) throw new Error('Multiple sources target the same form document.')
	console.log(`${plan.length} documents ${apply ? 'will move' : 'would move'}. Draft and published content remain separate.`)
	for (const { source, targetId } of plan) console.log(`${source._id} → ${targetId}: ${source.filmSubmissionContent?.length ?? 'legacy'} entries`)
	if (!apply || !plan.length) return
	fs.mkdirSync('backups', { recursive: true })
	const backup = path.join('backups', `form-settings-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
	fs.writeFileSync(backup, JSON.stringify(plan, null, 2), { mode: 0o600 })
	let transaction = client.transaction()
	for (const { source, target, targetId } of plan) {
		if (!target) transaction = transaction.create({ _id: targetId, _type: 'filmSubmissionSettings', filmSubmissionContent: source.filmSubmissionContent })
		else transaction = transaction.patch(targetId, patch => patch.ifRevisionId(target._rev).set({ filmSubmissionContent: target.filmSubmissionContent }))
		transaction = transaction.patch(source._id, patch => patch.ifRevisionId(source._rev).unset(['filmSubmissionContent']))
	}
	await transaction.commit()
	const moved = await client.fetch<any[]>('*[_id in $ids]', { ids: plan.map(item => item.targetId) })
	for (const { source, targetId } of plan) {
		if (!isDeepStrictEqual(moved.find(doc => doc._id === targetId)?.filmSubmissionContent, source.filmSubmissionContent)) throw new Error(`Verification failed for ${targetId}. Backup: ${backup}`)
	}
	console.log('Form settings moved and verified without changing their content.')
}
run().catch(error => { console.error(error.message); process.exitCode = 1 })
