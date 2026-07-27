import { hostname, networkInterfaces } from 'node:os'
import { createClient, groq } from 'next-sanity'
import { projectId, dataset, apiVersion } from '@/sanity/lib/env'
// import { token } from '@/lib/sanity/token'
import type { NextConfig } from 'next'

import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin()

function getAllowedDevOrigins() {
	const origins = new Set(
		(process.env.NEXT_ALLOWED_DEV_ORIGINS ?? '')
			.split(',')
			.map((origin) => origin.trim())
			.filter(Boolean),
	)

	if (process.env.NODE_ENV === 'development') {
		for (const network of Object.values(networkInterfaces()).flat()) {
			if (network?.family === 'IPv4' && !network.internal) {
				origins.add(network.address)
			}
		}

		const localHostname = hostname()
		if (localHostname) {
			origins.add(localHostname)
			origins.add(`${localHostname}.local`)
		}
	}

	return Array.from(origins)
}

const allowedDevOrigins = getAllowedDevOrigins()

const client = createClient({
	projectId,
	dataset,
	// token, // for private datasets
	apiVersion,
	useCdn: true,
})

const nextConfig: NextConfig = {
	...(allowedDevOrigins.length > 0 ? { allowedDevOrigins } : {}),
	images: {
		qualities: [75, 90],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.sanity.io',
			},
		],
	},

	async redirects() {
		return await client.fetch(groq`*[_type == 'redirect']{
			source,
			'destination': select(
				destination.type == 'internal' =>
					select(
						destination.internal->._type == 'blog.post' => '/blog/',
						'/'
					) + destination.internal->.metadata.slug.current,
				destination.external
			),
			permanent
		}`)
	},

	env: {
		SC_DISABLE_SPEEDY: 'false',
	},

	webpack(config) {
		// Grab the existing rule that handles SVG imports
		const fileLoaderRule = config.module.rules.find((rule: any) =>
			rule.test?.test?.('.svg'),
		)

		config.module.rules.push(
			// Reapply the existing rule, but only for svg imports ending in ?url
			{
				...fileLoaderRule,
				test: /\.svg$/i,
				resourceQuery: /url/, // *.svg?url
			},

			// Convert all other *.svg imports to React components
			{
				test: /\.svg$/i,
				issuer: fileLoaderRule.issuer,
				resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
				use: ['@svgr/webpack'],
			},
		)

		return config
	},
	// logging: {
	// 	fetches: {
	// 		fullUrl: true,
	// 	},
	// },
}

export default withNextIntl(nextConfig)
