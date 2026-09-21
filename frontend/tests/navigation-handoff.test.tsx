import assert from 'node:assert/strict'
import test from 'node:test'
import React, { act, Suspense, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { JSDOM } from 'jsdom'
import { NextIntlClientProvider } from 'next-intl'
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import {
	PathnameContext,
	PathParamsContext,
} from 'next/dist/shared/lib/hooks-client-context.shared-runtime'
import './helpers/css'

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||= 'test1234'
process.env.NEXT_PUBLIC_SANITY_DATASET ||= 'production'

test('navigation keeps its artwork mounted and covers the old page until the destination commits', async () => {
	const dom = new JSDOM('<div id="root"></div>', {
		url: 'http://localhost/en/fabrique',
		pretendToBeVisual: true,
	})
	Object.defineProperty(dom.window, 'matchMedia', {
		value: (query: string) => ({
			matches: !query.includes('reduced-motion'),
			addEventListener() {},
			removeEventListener() {},
			addListener() {},
			removeListener() {},
		}),
	})
	const globals = {
		window: dom.window,
		self: dom.window,
		document: dom.window.document,
		Element: dom.window.Element,
		CustomEvent: dom.window.CustomEvent,
		localStorage: dom.window.localStorage,
		HTMLElement: dom.window.HTMLElement,
		SVGElement: dom.window.SVGElement,
		getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
		MutationObserver: dom.window.MutationObserver,
		ResizeObserver: class {
			observe() {}
			unobserve() {}
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
	const root = createRoot(dom.window.document.getElementById('root')!)
	let setPathname: (path: string) => void
	let setPage: (path: string) => void
	let finishLoading: () => void
	let loaded = false
	const data = new Promise<void>((resolve) => {
		finishLoading = resolve
	})
	const router = {
		bfcacheId: 'navigation-test',
		push: (path: string) => setPage(path),
		replace() {},
		refresh() {},
		back() {},
		forward() {},
		prefetch() {},
	}
	function Page({ path }: { path: string }) {
		if (path === '/en/equipe' && !loaded) throw data
		return (
			<main>
				{path === '/en/equipe' ? 'Team portraits' : 'Fabrique accordion titles'}
			</main>
		)
	}
	try {
		const { default: NavBar } =
			await import('../src/components/navigation/NavBar')
		function App() {
			const [pathname, updatePathname] = useState('/en/fabrique')
			const [page, updatePage] = useState('/en/fabrique')
			setPathname = updatePathname
			setPage = updatePage
			return (
				<AppRouterContext.Provider value={router}>
					<PathnameContext.Provider value={pathname}>
						<PathParamsContext.Provider value={{ locale: 'en' }}>
							<NextIntlClientProvider
								locale="en"
								timeZone="Europe/Brussels"
								messages={{ menu: { about: 'About' } }}
							>
								<NavBar locale="en" />
								<Page path={page} />
							</NextIntlClientProvider>
						</PathParamsContext.Provider>
					</PathnameContext.Provider>
				</AppRouterContext.Provider>
			)
		}
		await act(async () =>
			root.render(
				<Suspense fallback="Loading route">
					<App />
				</Suspense>,
			),
		)
		const document = dom.window.document
		const links = Array.from(document.querySelectorAll('.theme-menu-item'))
		const artwork = links.map((link) => link.querySelector('svg'))
		assert.equal(links.length, 5)
		const assertMounted = () => {
			Array.from(document.querySelectorAll('.theme-menu-item')).forEach(
				(link, index) => {
					assert.ok(
						link === links[index],
						'menu links must survive the navigation',
					)
					assert.ok(
						link.querySelector('svg') === artwork[index],
						'menu artwork must not remount',
					)
				},
			)
		}
		await act(async () => {
			document
				.querySelector<HTMLAnchorElement>('a[aria-label="Équipe"]')!
				.click()
		})
		assert.ok(
			document.querySelector(
				'.navigation-loading-overlay [data-skeleton-page="equipe"]',
			),
		)
		assert.equal(
			document.querySelector('main')?.textContent,
			'Fabrique accordion titles',
		)
		assertMounted()

		// Model an early URL update while the destination's first data request is pending.
		await act(async () => setPathname('/en/equipe'))
		assert.ok(
			document.querySelector('.navigation-loading-overlay'),
			'the URL alone must not uncover the old page',
		)
		assertMounted()

		await act(async () => {
			loaded = true
			finishLoading()
			await data
		})
		assert.equal(document.querySelector('.navigation-loading-overlay'), null)
		assert.equal(document.querySelector('main')?.textContent, 'Team portraits')
		assertMounted()
	} finally {
		await act(async () => root.unmount())
		dom.window.close()
		for (const [key, descriptor] of descriptors) {
			if (descriptor) Object.defineProperty(globalThis, key, descriptor)
			else Reflect.deleteProperty(globalThis, key)
		}
	}
})
