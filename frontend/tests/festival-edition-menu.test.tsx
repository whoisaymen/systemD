import assert from 'node:assert/strict'
import test from 'node:test'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { JSDOM } from 'jsdom'
import { NextIntlClientProvider } from 'next-intl'
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { SearchParamsContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime'
import messages from '../messages/en.json'
import './helpers/css'

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||= 'test1234'
process.env.NEXT_PUBLIC_SANITY_DATASET ||= 'production'

test('mobile edition chapters return to the intro and dock the year only at the sticky heading', async () => {
	const dom = new JSDOM('<div id="navbar-mobile"></div><div id="root"></div>', {
		url: 'http://localhost/en/festival/2023',
		pretendToBeVisual: true,
	})
	let scrolls = 0
	dom.window.HTMLElement.prototype.scrollIntoView = () => {
		scrolls++
	}
	Object.defineProperty(dom.window, 'matchMedia', {
		value: () => ({
			matches: false,
			addEventListener() {},
			removeEventListener() {},
			addListener() {},
			removeListener() {},
		}),
	})
	const globals = {
		window: dom.window,
		document: dom.window.document,
		sessionStorage: dom.window.sessionStorage,
		HTMLElement: dom.window.HTMLElement,
		Element: dom.window.Element,
		SVGElement: dom.window.SVGElement,
		ResizeObserver: class {
			observe() {}
			disconnect() {}
		},
		getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
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
		const { default: FestivalEditionContent } =
			await import('../src/components/festival/FestivalEditionContent')
		const router = {
			bfcacheId: 'edition-test',
			back() {},
			forward() {},
			refresh() {},
			push() {},
			replace() {},
			prefetch: async () => {},
		}
		const sharedMenu = {
			filmsTitle: [{ language: 'en', value: 'Shared film selection' }],
			exhibitionTitle: [{ language: 'en', value: 'Shared exhibition' }],
			photosTitle: [{ language: 'en', value: 'Shared photo gallery' }],
			juryTitle: [{ language: 'en', value: 'Shared jury' }],
		}
		const render = async (query = '', year = 2023) => {
			await act(async () =>
				root.render(
					<AppRouterContext.Provider value={router}>
						<SearchParamsContext.Provider value={new URLSearchParams(query)}>
							<NextIntlClientProvider
								locale="en"
								timeZone="Europe/Brussels"
								messages={messages}
							>
								<FestivalEditionContent
									key={`${query}-${year}`}
									language="en"
									festival={{
										year,
										menu: sharedMenu,
										exhibitionTitle: [{ language: 'en', value: 'Old edition exhibition' }],
										venue: 'KVS',
										description: 'Edition overview',
										photoGallery: [{ photographer: 'Test Photographer', photos: [] }],
										expoPhoto: [{ curatorName: 'Test Curator', photos: [] }],
										jury: [
											{ _id: 'juror', name: 'Juror', biography: 'Biography' },
										],
									}}
								/>
							</NextIntlClientProvider>
						</SearchParamsContext.Provider>
					</AppRouterContext.Provider>,
				),
			)
		}
		await render()
		const menu = host.querySelector<HTMLElement>('#edition-mobile-menu')!
		const verifySharedLabels = () => {
			for (const [chapter, label] of Object.entries({
				films: 'Shared film selection', exhibition: 'Shared exhibition',
				photos: 'Shared photo gallery', jury: 'Shared jury',
			})) {
				const mobileButton = host.querySelector(`#edition-mobile-menu button[aria-controls="edition-panel-${chapter}"]`)
				assert.ok(mobileButton?.textContent?.includes(label))
				const desktopButtons = host.querySelectorAll(`nav[aria-label="${messages.festivalEdition.indexLabel}"] button`)
				assert.ok(Array.from(desktopButtons).some((button) => button.textContent?.includes(label)), 'desktop exposes the shared label')
			}
			assert.ok(!host.textContent?.includes('Old edition exhibition'))
		}
		verifySharedLabels()
		const chapters = ['overview', 'films', 'exhibition', 'photos', 'jury']
		const verifySelection = (chapter: string) => {
			const buttons = Array.from(menu.querySelectorAll('button'))
			assert.equal(
				menu.textContent?.includes('Photos by Test Photographer'),
				chapter === 'photos',
			)
			assert.equal(
				menu.textContent?.includes('Curated by Test Curator'),
				chapter === 'exhibition',
			)
			assert.equal(buttons.length, chapters.length - 1)
			assert.equal(
				menu.querySelector('[aria-controls="edition-panel-overview"]'),
				null,
			)
			assert.equal(
				buttons.filter(
					(button) => button.getAttribute('aria-pressed') === 'true',
				).length,
				chapter === 'overview' ? 0 : 1,
			)
			if (chapter !== 'overview') {
				assert.equal(
					buttons.at(-1)?.getAttribute('aria-controls'),
					`edition-panel-${chapter}`,
				)
			}
			for (const key of chapters) {
				const panel = host.querySelector<HTMLElement>(`#edition-panel-${key}`)!
				assert.ok(
					menu.compareDocumentPosition(panel) &
						dom.window.Node.DOCUMENT_POSITION_FOLLOWING,
				)
				assert.equal(panel.classList.contains('hidden'), key !== chapter)
			}
		}
		verifySelection('overview')
		for (const chapter of ['films', 'photos', 'jury', 'exhibition']) {
			const button = menu.querySelector<HTMLButtonElement>(
				`[aria-controls="edition-panel-${chapter}"]`,
			)!
			await act(async () => button.click())
			verifySelection(chapter)
			const before = scrolls
			await act(async () => button.click())
			verifySelection('overview')
			assert.equal(
				scrolls,
				before + 1,
				'closing the active chapter returns to the intro at the top',
			)
		}
		assert.equal(scrolls, 8)
		await act(async () =>
			menu
				.querySelector<HTMLButtonElement>(
					'[aria-controls="edition-panel-jury"]',
				)!
				.click(),
		)
		await act(async () =>
			menu
				.querySelector<HTMLButtonElement>(
					'[aria-controls="edition-panel-films"]',
				)!
				.click(),
		)
		verifySelection('films')

		assert.ok(host.querySelector('[data-edition-year="header"]'))
		const sticky = menu.querySelector<HTMLElement>('[data-sticky-active="true"]')!
		let stickyTop = 0
		Object.defineProperty(sticky, 'offsetHeight', { value: 54 })
		sticky.style.top = '0px'
		sticky.getBoundingClientRect = () => new dom.window.DOMRect(0, stickyTop, 320, 54)
		const scrollFrame = async () => act(async () => {
			dom.window.dispatchEvent(new dom.window.Event('scroll'))
			await new Promise<void>((resolve) => dom.window.requestAnimationFrame(() => resolve()))
		})
		await scrollFrame()
		const dockedYear = host.querySelector('[data-edition-year="docked"]')!
		assert.equal(dockedYear.textContent, '2023')
		assert.equal(dockedYear.closest('[data-sticky-active="true"]')?.querySelector('button')?.getAttribute('aria-controls'), 'edition-panel-films')
		assert.equal(host.querySelectorAll('[data-edition-year]').length, 1)
		stickyTop = 20
		await scrollFrame()
		assert.ok(host.querySelector('[data-edition-year="header"]'), 'scrolling above the sticky threshold returns the year to the logo')
		assert.equal(host.querySelector('[data-edition-year="docked"]'), null)
		stickyTop = 0
		await scrollFrame()
		assert.ok(host.querySelector('[data-edition-year="docked"]'))
		await act(async () => menu.querySelector<HTMLButtonElement>('[aria-controls="edition-panel-photos"]')!.click())
		assert.ok(host.querySelector('[data-edition-year="header"]'), 'selecting a new chapter resets the year until its heading sticks')

		await render('view=list&sort=title')
		const restoredMenu = host.querySelector('#edition-mobile-menu')!
		assert.equal(
			restoredMenu
				.querySelector('[aria-pressed="true"]')
				?.getAttribute('aria-controls'),
			'edition-panel-films',
		)
		assert.equal(
			host.querySelector('#edition-panel-films')?.classList.contains('hidden'),
			false,
		)
		assert.equal(
			host
				.querySelector('#edition-panel-overview')
				?.classList.contains('hidden'),
			true,
		)
		await render('', 2021)
		verifySharedLabels()
	} finally {
		await act(async () => root.unmount())
		dom.window.close()
		for (const [key, descriptor] of descriptors) {
			if (descriptor) Object.defineProperty(globalThis, key, descriptor)
			else Reflect.deleteProperty(globalThis, key)
		}
	}
})
