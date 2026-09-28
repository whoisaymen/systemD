import assert from 'node:assert/strict'
import test from 'node:test'
import { JSDOM } from 'jsdom'
import { mountMobileMenuTint } from '../src/lib/mobile-menu-tint'
import { applyThemeColors, FALLBACK_THEME_COMBOS } from '../src/lib/theme'

function createPage(ios = true) {
	const dom = new JSDOM(
		'<div id="animated-menu" style="transform: translateY(0)"></div>',
	)
	const frames = new Map<number, FrameRequestCallback>()
	let nextFrame = 0
	Object.defineProperty(dom.window, 'CSS', { value: { supports: () => ios } })
	dom.window.requestAnimationFrame = (callback) => {
		frames.set(++nextFrame, callback)
		return nextFrame
	}
	dom.window.cancelAnimationFrame = (frame) => {
		frames.delete(frame)
	}
	const paint = () => {
		const callbacks = [...frames.values()]
		frames.clear()
		for (const callback of callbacks) callback(0)
	}
	const document = dom.window.document
	const root = document.documentElement
	const metaColor = () =>
		document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')!.content
	return { dom, document, root, frames, paint, metaColor }
}

test('open menu has two viewport tint strips that update before Safari refreshes', () => {
	const page = createPage()
	const blue = FALLBACK_THEME_COMBOS[0]
	const ice = FALLBACK_THEME_COMBOS[1]
	applyThemeColors(blue, page.root)
	const release = mountMobileMenuTint(page.root)
	try {
		const edges = [
			...page.document.querySelectorAll<HTMLElement>(
				'[data-mobile-browser-tint]',
			),
		]
		assert.equal(edges.length, 2)
		assert.deepEqual(
			edges.map((edge) => edge.dataset.mobileBrowserTint),
			['top', 'bottom'],
		)
		for (const edge of edges) {
			assert.equal(
				edge.parentElement,
				page.document.body,
				'strip is outside the animated menu',
			)
			assert.equal(edge.style.position, 'fixed')
			assert.equal(edge.style.pointerEvents, 'none')
		}
		applyThemeColors(ice, page.root)
		for (const edge of edges) {
			assert.equal(edge.style.backgroundColor, 'rgb(208, 220, 220)')
		}
		assert.equal(page.metaColor(), ice.dark)
		page.paint()
		assert.equal(page.metaColor(), `${ice.dark}fe`)
		page.paint()
		assert.equal(page.metaColor(), ice.dark)
		assert.equal(page.frames.size, 0)
		release()
		assert.equal(
			page.document.querySelectorAll('[data-mobile-browser-tint]').length,
			0,
		)
		page.paint()
		page.paint()
		assert.equal(page.metaColor(), ice.dark)
	} finally {
		release()
		page.dom.window.close()
	}
})

test('rapid theme changes and menu closure cannot restore an older Safari tint', () => {
	const page = createPage()
	applyThemeColors(FALLBACK_THEME_COMBOS[0], page.root)
	const release = mountMobileMenuTint(page.root)
	try {
		page.paint()
		const latest = FALLBACK_THEME_COMBOS[3]
		applyThemeColors(FALLBACK_THEME_COMBOS[1], page.root)
		applyThemeColors(latest, page.root)
		release()
		assert.equal(page.metaColor(), latest.dark)
		assert.equal(page.frames.size, 1)
		page.paint()
		page.paint()
		assert.equal(page.metaColor(), latest.dark)
		assert.equal(page.frames.size, 0)
		assert.equal(
			page.document.querySelectorAll('meta[name="theme-color"]').length,
			1,
		)
	} finally {
		release()
		page.dom.window.close()
	}
})

test('other browsers keep their theme-color without the Safari refresh sequence', () => {
	const page = createPage(false)
	try {
		const theme = FALLBACK_THEME_COMBOS[0]
		applyThemeColors(theme, page.root)
		assert.equal(page.metaColor(), theme.dark)
		assert.equal(page.frames.size, 0)
	} finally {
		page.dom.window.close()
	}
})
