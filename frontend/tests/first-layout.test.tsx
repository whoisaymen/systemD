import assert from 'node:assert/strict'
import test from 'node:test'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { JSDOM } from 'jsdom'
import { NextIntlClientProvider } from 'next-intl'
import { PathnameContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime'
import './helpers/css'

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||= 'test1234'
process.env.NEXT_PUBLIC_SANITY_DATASET ||= 'production'

test('the first carousel reveal uses measured desktop dimensions without animating from mobile dimensions', async () => {
	const dom = new JSDOM('<div id="root"></div>', { pretendToBeVisual: true })
	let measuredWidth = 0
	Object.defineProperties(dom.window, {
		innerWidth: { value: 1280 },
		innerHeight: { value: 800 },
		matchMedia: {
			value: () => ({
				matches: false,
				addEventListener() {},
				removeEventListener() {},
			}),
		},
	})
	Object.defineProperty(dom.window.HTMLElement.prototype, 'offsetWidth', {
		get: () => measuredWidth,
	})
	const globals = {
		window: dom.window,
		document: dom.window.document,
		Element: dom.window.Element,
		HTMLElement: dom.window.HTMLElement,
		SVGElement: dom.window.SVGElement,
		getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
		ResizeObserver: class {
			observe() {}
			disconnect() {}
		},
		requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window),
		cancelAnimationFrame: dom.window.cancelAnimationFrame.bind(dom.window),
		IS_REACT_ACT_ENVIRONMENT: true,
	}
	const descriptors = Object.keys(globals).map(
		(key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
	)
	for (const [key, value] of Object.entries(globals)) {
		Object.defineProperty(globalThis, key, { configurable: true, value })
	}
	const host = dom.window.document.getElementById('root')!
	const root = createRoot(host)
	try {
		const { default: TeamCarousel } =
			await import('../src/components/equipe/TeamCarousel')
		await act(async () =>
			root.render(
				<TeamCarousel
					persons={[{ _id: 'alex', name: 'Alex' }]}
					language="en"
				/>,
			),
		)
		assert.equal(
			host.querySelector<HTMLElement>('.team-carousel')!.style.visibility,
			'hidden',
		)
		assert.ok(host.querySelector('[data-skeleton-page="equipe"]'))

		await act(async () => {
			measuredWidth = 800
			dom.window.dispatchEvent(new dom.window.Event('resize'))
		})
		const card = host.querySelector<HTMLButtonElement>(
			'button[aria-pressed="true"]',
		)!
		assert.equal(host.querySelector('[data-skeleton-page]'), null)
		assert.equal(
			host.querySelector<HTMLElement>('.team-carousel')!.style.visibility,
			'',
		)
		assert.equal(card.style.width, '336px')
		assert.equal(card.style.height, '336px')
		assert.equal(card.style.transform, 'translateX(232px)')

		// A cached, hidden page must retain its desktop geometry when its box is zero.
		await act(async () => {
			measuredWidth = 0
			dom.window.dispatchEvent(new dom.window.Event('resize'))
		})
		assert.equal(card.style.width, '336px')
		assert.equal(card.style.transform, 'translateX(232px)')
	} finally {
		await act(async () => root.unmount())
		dom.window.close()
		for (const [key, descriptor] of descriptors) {
			if (descriptor) Object.defineProperty(globalThis, key, descriptor)
			else Reflect.deleteProperty(globalThis, key)
		}
	}
})

test('archive photos reserve their cropped proportions before loading and prioritize the first visible cards', async () => {
	const { default: MemoireContent } =
		await import('../src/components/memoire/MemoireContent')
	const festivals = [
		{ year: 2023, visual: { asset: { _ref: 'image-example-600x800-jpg' } } },
		{ year: 2021, visual: { asset: { _ref: 'image-example-1200x800-jpg' } } },
		{
			year: 2016,
			visual: {
				asset: { _ref: 'image-example-1200x800-jpg' },
				crop: { left: 0.25, right: 0.25, top: 0, bottom: 0 },
			},
		},
	]
	const dom = new JSDOM(
		renderToStaticMarkup(
			<PathnameContext.Provider value="/en/memoire">
				<NextIntlClientProvider
					locale="en"
					timeZone="Europe/Brussels"
					messages={{ memoire: { previousEditions: 'Previous editions' } }}
				>
					<MemoireContent
						memoire={{ pastFestivals: festivals }}
						language="en"
					/>
				</NextIntlClientProvider>
			</PathnameContext.Provider>,
		),
	)
	try {
		const photos = Array.from(
			dom.window.document.querySelectorAll<HTMLImageElement>(
				'[data-memoire-card] img',
			),
		)
		assert.deepEqual(
			photos.map((photo) => photo.style.width),
			['75cqw', '100cqw', '75cqw'],
		)
		assert.deepEqual(
			photos.map((photo) => parseFloat(photo.style.aspectRatio)),
			[0.75, 1.5, 0.75],
		)
		assert.deepEqual(
			photos.map((photo) => photo.getAttribute('loading')),
			['eager', 'eager', 'lazy'],
		)
		assert.equal(photos[0].getAttribute('fetchPriority'), 'high')
		assert.equal(
			dom.window.document.querySelector<HTMLElement>('.timeline')!.style
				.visibility,
			'hidden',
		)
	} finally {
		dom.window.close()
	}
})
