import assert from 'node:assert/strict'
import test from 'node:test'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { JSDOM } from 'jsdom'
import './helpers/css'

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||= 'test1234'
process.env.NEXT_PUBLIC_SANITY_DATASET ||= 'production'

test('story changes reset the desktop panel in both directions and retain mobile scrolling', async () => {
	const dom = new JSDOM('<div id="navbar-mobile"></div><div id="root"></div>', {
		pretendToBeVisual: true,
	})
	let desktop = true
	let mobileScrolls = 0
	Object.defineProperty(dom.window, 'matchMedia', {
		value: () => ({
			matches: desktop,
			addEventListener() {},
			removeEventListener() {},
		}),
	})
	dom.window.HTMLElement.prototype.scrollTo = function () {
		this.scrollTop = 0
	}
	dom.window.HTMLElement.prototype.scrollIntoView = function () {
		mobileScrolls++
	}
	const globals = {
		window: dom.window,
		document: dom.window.document,
		HTMLElement: dom.window.HTMLElement,
		Element: dom.window.Element,
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
		const { default: BigBangContent } =
			await import('../src/components/bigbang/BigBangContent')
		await act(async () =>
			root.render(
				<BigBangContent
					shortStory={{ body: [] }}
					longStory={{ body: [] }}
					locale="en"
				/>,
			),
		)
		const panel = host.querySelector<HTMLDivElement>(
			'.section-folder-content--bigbang',
		)!
		const [short, long] = host.querySelectorAll('button')
		panel.scrollTop = 900
		await act(async () => long.click())
		assert.ok(host.querySelector('#long-story'))
		assert.equal(panel.scrollTop, 0)
		assert.equal(mobileScrolls, 0)

		panel.scrollTop = 650
		await act(async () => short.click())
		assert.ok(host.querySelector('#short-story'))
		assert.equal(panel.scrollTop, 0)

		panel.scrollTop = 300
		await act(async () => short.click())
		assert.equal(
			panel.scrollTop,
			300,
			'the current tab must not interrupt reading',
		)

		desktop = false
		await act(async () => long.click())
		assert.equal(mobileScrolls, 1, 'mobile still scrolls to its header')
	} finally {
		await act(async () => root.unmount())
		dom.window.close()
		for (const [key, descriptor] of descriptors) {
			if (descriptor) Object.defineProperty(globalThis, key, descriptor)
			else Reflect.deleteProperty(globalThis, key)
		}
	}
})
