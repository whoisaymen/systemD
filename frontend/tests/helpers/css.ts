import { createRequire } from 'node:module'

// Node does not load CSS modules; layout is verified in the browser.
const require = createRequire(import.meta.url)
require.extensions['.css'] = (module) => {
	module.exports = new Proxy(
		{},
		{
			get: (_, name) => (name === '__esModule' ? false : String(name)),
		},
	)
}
