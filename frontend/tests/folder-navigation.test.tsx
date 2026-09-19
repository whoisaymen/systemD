import assert from 'node:assert/strict'
import test from 'node:test'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { JSDOM } from 'jsdom'
import SectionFolderSurface, { type FolderSection } from '../src/components/navigation/SectionFolderSurface'
import Loading from '../src/app/(frontend)/[locale]/loading'

test('the destination panel exists before its page arrives and survives the loader handoff', async () => {
	const dom = new JSDOM('<div id="root"></div>', { pretendToBeVisual: true })
	Object.defineProperty(dom.window, 'matchMedia', {
		value: () => ({ matches: true, addEventListener() {}, removeEventListener() {} }),
	})
	const panel = new dom.window.DOMRect(200, 4, 800, 792)
	const festivalTab = new dom.window.DOMRect(4, 44, 192, 500)
	const memoireTab = new dom.window.DOMRect(1004, 4, 192, 220)
	dom.window.Element.prototype.getBoundingClientRect = function () {
		if (this.classList.contains('section-folder-tab--festival')) return festivalTab
		if (this.classList.contains('section-folder-tab--memoire')) return memoireTab
		return panel
	}
	const globals = {
		window: dom.window,
		document: dom.window.document,
		MutationObserver: dom.window.MutationObserver,
		ResizeObserver: class { observe() {} disconnect() {} },
		requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window),
		cancelAnimationFrame: dom.window.cancelAnimationFrame.bind(dom.window),
		IS_REACT_ACT_ENVIRONMENT: true,
	}
	const originalDescriptors = Object.keys(globals).map(key =>
		[key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
	)
	for (const [key, value] of Object.entries(globals)) {
		Object.defineProperty(globalThis, key, { configurable: true, value })
	}
	const host = dom.window.document.getElementById('root')!
	const root = createRoot(host)
	const render = async (section: FolderSection, phase: 'pending' | 'fallback' | 'loaded') => {
		await act(async () => {
			root.render(<>
				<SectionFolderSurface section={section} />
				<nav><a className={`section-folder-tab--${section}`} /></nav>
				{phase === 'pending' && <div className="navigation-loading-overlay"><Loading /></div>}
				<main>
					{phase === 'fallback' ? <Loading /> : (
						<section className={`section-folder-content--${phase === 'pending' ? 'festival' : section}`} />
					)}
				</main>
			</>)
		})
	}
	const flushLayout = async () => {
		await act(async () => {
			await new Promise(resolve => dom.window.requestAnimationFrame(resolve))
		})
	}
	const outline = () => host.querySelector('.section-folder-surface path')?.getAttribute('d')

	try {
		await render('festival', 'loaded')
		const originalOutline = outline()
		assert.ok(originalOutline)

		// The new route has not committed: only the old page and instant loader exist.
		await render('memoire', 'pending')
		assert.equal(host.querySelector('.section-folder-content--memoire'), null)
		const pendingOutline = outline()
		assert.ok(pendingOutline, 'draw the destination in the same layout pass as the click')
		assert.notEqual(pendingOutline, originalOutline)
		assert.doesNotMatch(pendingOutline, /NaN|undefined/)

		await render('memoire', 'fallback')
		await flushLayout()
		assert.equal(outline(), pendingOutline, 'the route fallback must keep the same panel')

		await render('memoire', 'loaded')
		await flushLayout()
		assert.equal(outline(), pendingOutline, 'the real page must not shift the panel')

		// Also cover a right-to-left pending navigation.
		await render('festival', 'pending')
		assert.equal(outline(), originalOutline)
	} finally {
		await act(async () => root.unmount())
		dom.window.close()
		for (const [key, descriptor] of originalDescriptors) {
			if (descriptor) Object.defineProperty(globalThis, key, descriptor)
			else Reflect.deleteProperty(globalThis, key)
		}
	}
})
