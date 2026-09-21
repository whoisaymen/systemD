import assert from 'node:assert/strict'
import test from 'node:test'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { JSDOM } from 'jsdom'
import SectionFolderSurface, { type FolderSection } from '../src/components/navigation/SectionFolderSurface'
import './helpers/css'

const loadingModule = import('../src/components/loading/PageSkeleton')

test('the destination panel exists before its page arrives and survives the loader handoff', async () => {
	const { default: Loading } = await loadingModule
	const dom = new JSDOM('<div id="root"></div>', { pretendToBeVisual: true })
	Object.defineProperty(dom.window, 'matchMedia', {
		value: () => ({ matches: true, addEventListener() {}, removeEventListener() {} }),
	})
	const panel = new dom.window.DOMRect(200, 4, 800, 792)
	const festivalTab = new dom.window.DOMRect(4, 44, 192, 500)
	const memoireTab = new dom.window.DOMRect(1004, 4, 192, 220)
	dom.window.Element.prototype.getBoundingClientRect = function () {
		if (this.hasAttribute('data-cached-hidden')) return new dom.window.DOMRect()
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
				{phase === 'pending' && <div className="navigation-loading-overlay"><Loading page={section} /></div>}
				<main>
					{/* Next can retain an earlier visit in a hidden route tree. */}
					<section data-cached-hidden className={`section-folder-content--${section}`} />
					{phase === 'fallback' ? <Loading page={section} /> : (
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
		assert.equal(host.querySelector('.section-folder-content--memoire:not([data-cached-hidden])'), null)
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

test('destination skeletons distinguish sections and nested archive pages', async () => {
	const { skeletonPageForPath } = await loadingModule
	for (const locale of ['en', 'fr', 'nl']) {
		for (const section of [
			'festival',
			'bigbang',
			'memoire',
			'fabrique',
			'equipe',
			'about',
		]) {
			assert.equal(skeletonPageForPath(`/${locale}/${section}/`), section)
		}
		assert.equal(
			skeletonPageForPath(`/${locale}/festival/2023?chapter=films`),
			'edition',
		)
		assert.equal(skeletonPageForPath(`/${locale}/film/a-film`), 'film')
		assert.equal(skeletonPageForPath(`/${locale}/contact`), 'about')
		assert.equal(skeletonPageForPath(`/${locale}`), 'generic')
	}
})

test('desktop fallbacks contain page content placeholders and one measurable loading panel', async () => {
	const { default: Loading } = await loadingModule
	for (const page of [
		'bigbang',
		'festival',
		'memoire',
		'fabrique',
		'equipe',
		'edition',
		'film',
		'about',
	] as const) {
		const dom = new JSDOM(renderToStaticMarkup(<Loading page={page} />))
		const panel = dom.window.document.querySelector(
			`[data-skeleton-page="${page}"]`,
		)!
		assert.equal(
			dom.window.document.querySelectorAll('.theme-loading-surface').length,
			1,
		)
		assert.equal(panel.getAttribute('aria-busy'), 'true')
		assert.equal(panel.querySelector('svg, animate, button, a'), null)
		assert.ok(panel.querySelectorAll('.shape').length > 3)
		dom.window.close()
	}
})
