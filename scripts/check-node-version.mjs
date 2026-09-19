import { readFileSync } from 'node:fs'

// Keep the supported range in sync with npm; use the pins as the recommendation.
const { engines } = JSON.parse(
	readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
)
const range = /^>=(\d+\.\d+\.\d+) <(\d+)$/.exec(engines.node)
if (!range) {
	throw new Error('Expected engines.node to use the format ">=major.minor.patch <major".')
}

const recommended = readFileSync(
	new URL('../.node-version', import.meta.url),
	'utf8',
).trim()
const minimum = range[1].split('.').map(Number)
const maximumMajor = Number(range[2])
const current = process.versions.node.split('.').map(Number)

const compareVersions = (left, right) => {
	for (let index = 0; index < right.length; index += 1) {
		if (left[index] > right[index]) return 1
		if (left[index] < right[index]) return -1
	}

	return 0
}

if (current[0] >= maximumMajor || compareVersions(current, minimum) < 0) {
	console.error(
		[
			`This project requires Node.js ${engines.node}.`,
			`Current Node.js version: ${process.version}`,
			`Recommended Node.js version: ${recommended}`,
			'',
			'Use the supported LTS runtime before installing or running the project:',
			'  nvm install && nvm use',
			'  fnm install && fnm use',
			`  mise use node@${recommended}`,
		].join('\n'),
	)
	process.exit(1)
}
