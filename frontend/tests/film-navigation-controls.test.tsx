import assert from 'node:assert/strict'
import test from 'node:test'
import React, { act, Suspense, useLayoutEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { JSDOM } from 'jsdom'
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { PathnameContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime'
import FilmNavigationProvider, {
	useFilmNavigationControls,
} from '../src/components/film/FilmNavigationProvider'

test('film arrows and mobile counter stay mounted through loading, then update for the new film', async () => {
	const dom = new JSDOM('<div id="root"></div>')
	const globals = {
		window: dom.window,
		document: dom.window.document,
		HTMLElement: dom.window.HTMLElement,
		IS_REACT_ACT_ENVIRONMENT: true,
	}
	const descriptors = Object.keys(globals).map(
		(key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
	)
	for (const [key, value] of Object.entries(globals)) {
		Object.defineProperty(globalThis, key, { configurable: true, value })
	}
	const root = createRoot(dom.window.document.getElementById('root')!)
	const films = ['one', 'two', 'three', 'four']
	const query = '?sort=year&order=desc&winners=1&view=list'
	let setPathname: (pathname: string) => void
	let finishLoading: () => void
	let loaded = false
	const data = new Promise<void>((resolve) => {
		finishLoading = resolve
	})
	const visited: string[] = []
	const router = {
		bfcacheId: 'film-controls-test',
		push(href: string) {
			visited.push(href)
			setPathname(href.split('?')[0])
		},
		replace() {},
		refresh() {},
		back() {},
		forward() {},
		prefetch() {},
	}
	function Film({ pathname }: { pathname: string }) {
		const { setNavigation } = useFilmNavigationControls()
		useLayoutEffect(() => {
			const index = films.indexOf(pathname.split('/').at(-1)!)
			const target = (slug: string | undefined) =>
				slug
					? {
							href: `/en/film/${slug}${query}`,
							title: slug,
						}
					: null
			setNavigation({
				pathname,
				currentIndex: index,
				total: films.length,
				previous: target(films[index - 1]),
				next: target(films[index + 1]),
			})
		}, [pathname, setNavigation])
		if (pathname === '/en/film/three' && !loaded) throw data
		return <h1>{pathname}</h1>
	}
	function App() {
		const [pathname, updatePathname] = useState('/en/film/two')
		setPathname = updatePathname
		return (
			<AppRouterContext.Provider value={router}>
				<PathnameContext.Provider value={pathname}>
					<FilmNavigationProvider>
						<Suspense key={pathname} fallback={<p>Loading film</p>}>
							<Film pathname={pathname} />
						</Suspense>
					</FilmNavigationProvider>
				</PathnameContext.Provider>
			</AppRouterContext.Provider>
		)
	}
	try {
		await act(async () => root.render(<App />))
		const buttons = Array.from(
			dom.window.document.querySelectorAll<HTMLButtonElement>('nav button'),
		)
		assert.equal(
			buttons.length,
			4,
			'mobile and desktop each render both arrows',
		)
		assert.ok(buttons.every((button) => !button.disabled))
		const counter = dom.window.document.querySelector('nav [role="status"]')
		assert.ok(counter, 'the mobile counter is part of the persistent navigation')
		assert.equal(counter.textContent, '2/4')
		await act(async () => buttons[1].click())
		assert.deepEqual(visited, [`/en/film/three${query}`])
		assert.match(dom.window.document.body.textContent!, /Loading film/)
		assert.ok(buttons.every((button) => button.isConnected && button.disabled))
		assert.ok(counter.isConnected, 'the counter stays mounted during loading')
		assert.equal(counter.textContent, '2/4')
		assert.ok(
			Array.from(dom.window.document.querySelectorAll('nav')).every(
				(nav) => nav.getAttribute('aria-busy') === 'true',
			),
		)
		await act(async () => buttons[1].click())
		assert.equal(
			visited.length,
			1,
			'the stale next-film target cannot be clicked during loading',
		)

		await act(async () => {
			loaded = true
			finishLoading!()
		})
		assert.ok(buttons.every((button) => button.isConnected && !button.disabled))
		assert.equal(buttons[0].title, 'two')
		assert.equal(buttons[1].title, 'four')
		assert.ok(counter.isConnected)
		assert.equal(counter.textContent, '3/4')
		assert.match(dom.window.document.body.textContent!, /3\/4/)
		await act(async () => buttons[0].click())
		assert.deepEqual(visited, [
			`/en/film/three${query}`,
			`/en/film/two${query}`,
		])
		assert.equal(buttons[1].title, 'three')
		assert.equal(counter.textContent, '2/4')
	} finally {
		await act(async () => root.unmount())
		dom.window.close()
		for (const [key, descriptor] of descriptors) {
			if (descriptor) Object.defineProperty(globalThis, key, descriptor)
			else Reflect.deleteProperty(globalThis, key)
		}
	}
})
