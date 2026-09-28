import assert from 'node:assert/strict'
import test from 'node:test'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { JSDOM } from 'jsdom'
import './helpers/css'

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||= 'test1234'
process.env.NEXT_PUBLIC_SANITY_DATASET ||= 'production'

test('mobile team swipes navigate once, wrap, and ignore scrolling, pinch, and cancelled gestures', async () => {
	const dom = new JSDOM('<div id="root"></div>', { pretendToBeVisual: true })
	Object.defineProperties(dom.window, {
		innerWidth: { value: 390 },
		innerHeight: { value: 844 },
		matchMedia: {
			value: () => ({
				matches: true,
				addEventListener() {},
				removeEventListener() {},
			}),
		},
	})
	Object.defineProperty(dom.window.HTMLElement.prototype, 'offsetWidth', {
		get: () => 390,
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
	const tick = async (ms: number) =>
		act(async () => {
			await new Promise((resolve) => setTimeout(resolve, ms))
		})
	const settle = async () => {
		await tick(250)
		await tick(80)
	}
	const activeName = () =>
		host.querySelector('[aria-pressed="true"]')!.getAttribute('aria-label')
	const activeCard = () => host.querySelector('[aria-pressed="true"]')!
	const point = (clientX: number, clientY: number, identifier = 1) => ({
		clientX,
		clientY,
		identifier,
	})
	const touch = async (
		type: string,
		points: ReturnType<typeof point>[],
		changedTouches = points,
	) => {
		const event = new dom.window.Event(type, {
			bubbles: true,
			cancelable: true,
		})
		Object.defineProperties(event, {
			touches: { value: points },
			changedTouches: { value: changedTouches },
		})
		await act(async () => {
			activeCard().dispatchEvent(event)
		})
		assert.equal(
			event.defaultPrevented,
			false,
			'native page scrolling and zoom remain available',
		)
	}
	const swipe = async (start: number, end: number) => {
		await touch('touchstart', [point(start, 150)])
		await touch('touchmove', [point(end, 155)])
		await touch('touchend', [], [point(end, 155)])
	}
	try {
		const { default: TeamCarousel } =
			await import('../src/components/equipe/TeamCarousel')
		const persons = ['Alex', 'Sam', 'Jo'].map((name) => ({ _id: name, name }))
		await act(async () => {
			root.render(<TeamCarousel persons={persons} language="en" />)
		})

		await swipe(280, 100)
		await swipe(280, 100)
		await settle()
		assert.equal(
			activeName(),
			'Sam',
			'swipes during a transition do not skip a person',
		)

		const click = new dom.window.MouseEvent('click', {
			bubbles: true,
			cancelable: true,
			detail: 1,
		})
		await act(async () => {
			host.querySelector('[aria-label="Jo"]')!.dispatchEvent(click)
		})
		assert.equal(
			click.defaultPrevented,
			true,
			'a swipe must not also click the card underneath',
		)

		await swipe(100, 280)
		await settle()
		assert.equal(activeName(), 'Alex')
		await swipe(100, 280)
		await settle()
		assert.equal(activeName(), 'Jo', 'swipe right wraps from first to last')
		await swipe(280, 100)
		await settle()
		assert.equal(activeName(), 'Alex', 'swipe left wraps from last to first')

		await swipe(200, 180)
		await touch('touchstart', [point(200, 150)])
		await touch('touchmove', [point(190, 220)])
		await touch('touchend', [], [point(50, 230)])
		await touch('touchstart', [point(280, 150)])
		await touch('touchstart', [point(280, 150), point(180, 150, 2)])
		await touch('touchend', [point(100, 150)], [point(180, 150, 2)])
		await touch('touchend', [], [point(100, 150)])
		await touch('touchstart', [point(280, 150)])
		await touch('touchcancel', [])
		await touch('touchend', [], [point(100, 150)])
		await settle()
		assert.equal(
			activeName(),
			'Alex',
			'short swipes, scrolls, pinch and cancellation do not navigate',
		)

		await touch('touchstart', [point(200, 150)])
		await touch('touchend', [], [point(200, 150)])
		await act(async () => {
			host
				.querySelector('[aria-label="Sam"]')!
				.dispatchEvent(
					new dom.window.MouseEvent('click', { bubbles: true, detail: 1 }),
				)
		})
		await settle()
		assert.equal(activeName(), 'Sam', 'ordinary taps still select a card')
	} finally {
		await act(async () => root.unmount())
		dom.window.close()
		for (const [key, descriptor] of descriptors) {
			if (descriptor) Object.defineProperty(globalThis, key, descriptor)
			else Reflect.deleteProperty(globalThis, key)
		}
	}
})
