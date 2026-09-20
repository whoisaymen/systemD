import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { JSDOM } from 'jsdom'
import PartnerLogo from '../src/components/contact/PartnerLogo'

test('partner SVGs contain scalable geometry and transparent theme-colored fills', () => {
	for (const name of ['pianofabriek', 'vlaanderen', 'saint-gilles', 'kvs']) {
		const svg = fs.readFileSync(
			new URL(`../public/assets/partners/${name}.svg`, import.meta.url),
			'utf8',
		)
		const dom = new JSDOM(svg, { contentType: 'image/svg+xml' })
		const document = dom.window.document
		assert.ok(document.documentElement.getAttribute('viewBox'))
		assert.ok(document.querySelector('path'))
		assert.equal(
			document.querySelector('image, text, script, foreignObject, use, style'),
			null,
		)
		for (const node of document.querySelectorAll('*')) {
			for (const attr of node.attributes) {
				assert.doesNotMatch(attr.name, /^on|href$/i)
				if (attr.name === 'fill' || attr.name === 'stroke')
					assert.ok(['currentColor', 'none'].includes(attr.value))
			}
		}
		dom.window.close()
	}
})

test('SVG logos use an accessible theme-colored mask instead of an image with fixed colors', () => {
	for (const asset of [
		{ url: 'https://cdn.sanity.io/logo.svg' },
		{ url: 'https://cdn.sanity.io/logo?version=2', mimeType: 'image/svg+xml' },
	]) {
		const dom = new JSDOM(
			renderToStaticMarkup(<PartnerLogo asset={asset} name="Partner" />),
		)
		const logo = dom.window.document.querySelector('[role="img"]')!
		assert.equal(logo.getAttribute('aria-label'), 'Partner')
		assert.equal(
			(logo as HTMLElement).style.backgroundColor,
			'var(--color-primary)',
		)
		assert.ok(logo.getAttribute('style')?.includes('mask:url('))
		assert.equal(dom.window.document.querySelector('img'), null)
		dom.window.close()
	}
})

test('legacy raster logos retain dimensions and alternative text, and missing assets are omitted', () => {
	const dom = new JSDOM(
		renderToStaticMarkup(
			<PartnerLogo
				name="Partner"
				asset={{
					url: '/legacy.png',
					metadata: { dimensions: { width: 240, height: 120 } },
				}}
			/>,
		),
	)
	const image = dom.window.document.querySelector('img')!
	assert.equal(image.alt, 'Partner')
	assert.equal(image.width, 240)
	assert.equal(image.height, 120)
	assert.equal(renderToStaticMarkup(<PartnerLogo name="Missing" />), '')
	dom.window.close()
})
