import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = [
	...nextCoreWebVitals,
	{
		ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
	},
	{
		rules: {
			'@next/next/no-html-link-for-pages': 'off',
			'react/display-name': 'off',
			'react/no-unescaped-entities': 'off',
			'react-hooks/immutability': 'off',
			'react-hooks/incompatible-library': 'off',
			'react-hooks/preserve-manual-memoization': 'off',
			'react-hooks/purity': 'off',
			'react-hooks/refs': 'off',
			'react-hooks/rules-of-hooks': 'warn',
			'react-hooks/set-state-in-effect': 'off',
			'react-hooks/static-components': 'off',
		},
	},
]

export default eslintConfig
