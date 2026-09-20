import { copyFile, mkdir } from 'node:fs/promises'

// MapLibre 6's ESM worker imports a sibling shared module. Next's asset pipeline
// does not bundle that import, so serve both files from the installed package.
const packageUrl = import.meta.resolve('maplibre-gl/package.json')
const destination = new URL('../public/vendor/maplibre/', import.meta.url)
await mkdir(destination, { recursive: true })
for (const filename of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs']) {
	await copyFile(
		new URL(`dist/${filename}`, packageUrl),
		new URL(filename, destination),
	)
}
await copyFile(
	new URL('LICENSE.txt', packageUrl),
	new URL('LICENSE.txt', destination),
)
