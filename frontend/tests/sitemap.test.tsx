import assert from 'node:assert/strict'
import test from 'node:test'
import { buildSitemap, type SitemapData } from '../src/lib/sitemap'

const options = { baseUrl: 'https://system-d.test/', locales: ['fr', 'en', 'nl'] }

test('all public routes have localized URLs and reciprocal language alternatives', () => {
	const entries = buildSitemap({}, options)
	assert.equal(entries.length, 8 * 3)
	for (const locale of options.locales) {
		for (const path of ['', '/bigbang', '/festival', '/fabrique', '/memoire', '/equipe', '/about', '/apply']) {
			const entry = entries.find(({ url }) => url === `https://system-d.test/${locale}${path}`)
			assert.ok(entry)
			assert.deepEqual(entry.alternates?.languages, {
				fr: `https://system-d.test/fr${path}`,
				en: `https://system-d.test/en${path}`,
				nl: `https://system-d.test/nl${path}`,
			})
		}
	}
})

test('published festival and film routes use their real year and slug fields', () => {
	const entries = buildSitemap({
		festivals: [
			{ _id: 'edition', year: 2023, _updatedAt: '2026-08-01T00:00:00Z' },
			{ _id: 'duplicate-edition', year: 2023 },
			{ _id: 'invalid-edition', year: null },
			{ _id: 'drafts.next-edition', year: 2027 },
		],
		films: [
			{ _id: 'film', slug: 'été-bruxellois' },
			{ _id: 'no-slug' },
			{ _id: 'bad-slug', slug: '../not-a-film' },
			{ _id: 'versions.release.unpublished-film', slug: 'unpublished' },
		],
	}, options)
	assert.equal(entries.length, 10 * 3)
	assert.equal(entries.find(({ url }) => url.endsWith('/fr/festival/2023'))?.lastModified, '2026-08-01T00:00:00Z')
	assert.ok(entries.some(({ url }) => url.endsWith('/nl/film/%C3%A9t%C3%A9-bruxellois')))
	assert.ok(entries.every(({ url }) => !/2027|unpublished|not-a-film/.test(url)))
})

test('noIndex excludes static and dynamic routes and blog requires a public template', () => {
	const data: SitemapData = {
		pages: {
			'/about': [{ _id: 'contact', metadata: { noIndex: true } }],
			'/bigbang': [
				{ _id: 'short', _updatedAt: '2026-07-01T00:00:00Z' },
				{ _id: 'long', _updatedAt: '2026-08-01T00:00:00Z' },
			],
		},
		festivals: [{ _id: 'hidden-festival', year: 2024, metadata: { noIndex: true } }],
		films: [{ _id: 'hidden-film', slug: 'private', metadata: { noIndex: true } }],
		blogPosts: [
			{ _id: 'post', slug: 'news' },
			{ _id: 'hidden-post', slug: 'hidden', metadata: { noIndex: true } },
		],
	}
	const entries = buildSitemap(data, options)
	assert.equal(entries.length, 7 * 3)
	assert.ok(entries.every(({ url }) => !/about|2024|private|blog/.test(url)))
	assert.equal(entries.find(({ url }) => url.endsWith('/en/bigbang'))?.lastModified, '2026-08-01T00:00:00Z')
	assert.equal(buildSitemap({ ...data, blogTemplate: { _id: 'blog-template' } }, options).length, 8 * 3)
	assert.equal(buildSitemap({ ...data, blogTemplate: { _id: 'blog-template', metadata: { noIndex: true } } }, options).length, 7 * 3)
})
