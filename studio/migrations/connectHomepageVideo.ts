import fs from 'node:fs'
import path from 'node:path'
import { getCliClient } from 'sanity/cli'

const localEnv = path.resolve('../frontend/.env.local')
if (fs.existsSync(localEnv)) process.loadEnvFile(localEnv)
const client = getCliClient({ apiVersion: '2026-09-12' }).withConfig({
	token: process.env.SANITY_API_WRITE_TOKEN,
	useCdn: false,
	perspective: 'raw',
	timeout: 120000,
})

async function run() {
	const homes = await client.fetch<any[]>('*[_type == "homepage"]')
	if (!homes.length) throw new Error('No homepage document found')
	const source = path.resolve(
		process.env.HOMEPAGE_VIDEO_SOURCE ||
			'../frontend/public/assets/videos/teaser2.mp4',
	)
	const existing = process.env.HOMEPAGE_VIDEO_SOURCE
		? undefined
		: homes.find((home) => home.backgroundVideo?.asset?._ref)?.backgroundVideo
	const video = existing ?? {
		_type: 'file',
		asset: {
			_type: 'reference',
			_ref: (
				await client.assets.upload('file', fs.createReadStream(source), {
					filename: 'system-d-homepage-teaser.mp4',
					contentType: 'video/mp4',
				})
			)._id,
		},
	}
	const changed = homes.filter(
		(home) =>
			JSON.stringify(home.backgroundVideo) !== JSON.stringify(video) ||
			home.backgroundVideoUrl,
	)
	if (!changed.length) {
		console.log('Homepage already points to its Studio video asset.')
		return
	}
	fs.mkdirSync('backups', { recursive: true })
	const backup = path.resolve('backups', `homepage-video-${Date.now()}.ndjson`)
	fs.writeFileSync(
		backup,
		changed.map((home) => JSON.stringify(home)).join('\n') + '\n',
		{ mode: 0o600 },
	)
	let transaction = client.transaction()
	for (const home of changed)
		transaction = transaction.patch(home._id, (patch) =>
			patch
				.ifRevisionId(home._rev)
				.set({ backgroundVideo: video })
				.unset(['backgroundVideoUrl']),
		)
	await transaction.commit()
	console.log(
		`Linked ${changed.length} homepage document(s) to Studio asset ${video.asset._ref}. Backup: ${backup}`,
	)
}

run().catch((error) => {
	console.error(error.message)
	process.exitCode = 1
})
