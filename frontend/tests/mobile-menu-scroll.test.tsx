import assert from 'node:assert/strict'
import test from 'node:test'
import { JSDOM } from 'jsdom'
import { containMobileMenuScroll } from '../src/lib/mobile-menu-scroll'

test('menu gestures stay inside the overlay without freezing the document', () => {
	const dom = new JSDOM('<main></main><div id="menu"><a>Link</a></div>')
	const { document } = dom.window
	const menu = document.getElementById('menu')!
	const link = menu.querySelector('a')!
	Object.defineProperties(menu, {
		clientHeight: { value: 600 },
		scrollHeight: { value: 1000 },
	})
	const release = containMobileMenuScroll(menu)
	const wheel = (target: Element, deltaY: number, ctrlKey = false) => {
		const event = new dom.window.WheelEvent('wheel', {
			bubbles: true,
			cancelable: true,
			deltaY,
			ctrlKey,
		})
		target.dispatchEvent(event)
		return event.defaultPrevented
	}
	try {
		assert.equal(wheel(document.querySelector('main')!, 40), true)
		assert.equal(wheel(link, -40), true)
		assert.equal(wheel(link, 40), false)
		menu.scrollTop = 400
		assert.equal(wheel(link, 40), true)
		assert.equal(wheel(link, -40), false)
		assert.equal(wheel(link, 40, true), false, 'browser zoom stays available')
		assert.equal(document.body.style.position, '')
		assert.equal(document.body.style.overflow, '')
		release()
		assert.equal(wheel(document.querySelector('main')!, 40), false)
	} finally {
		release()
		dom.window.close()
	}
})

test('touch gestures stop at menu edges while pinch zoom remains available', () => {
	const dom = new JSDOM('<div id="menu"></div>')
	const menu = dom.window.document.getElementById('menu')!
	Object.defineProperties(menu, {
		clientHeight: { value: 600 },
		scrollHeight: { value: 1000 },
	})
	const release = containMobileMenuScroll(menu)
	const touch = (type: string, positions: number[]) => {
		const event = new dom.window.Event(type, {
			bubbles: true,
			cancelable: true,
		})
		Object.defineProperty(event, 'touches', {
			value: positions.map((clientY) => ({ clientY })),
		})
		menu.dispatchEvent(event)
		return event.defaultPrevented
	}
	try {
		touch('touchstart', [100])
		assert.equal(touch('touchmove', [120]), true, 'no pull past the top edge')
		assert.equal(touch('touchmove', [80]), false, 'menu can scroll down')
		menu.scrollTop = 400
		assert.equal(touch('touchmove', [60]), true, 'no scroll beyond the bottom')
		assert.equal(touch('touchmove', [100]), false, 'menu can scroll back up')
		assert.equal(
			touch('touchmove', [80, 120]),
			false,
			'pinch zoom is not blocked',
		)
	} finally {
		release()
		dom.window.close()
	}
})
