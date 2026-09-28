import assert from 'node:assert/strict'
import test from 'node:test'
import React, { act, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { JSDOM } from 'jsdom'
import Scheduler from '../src/ui/Scheduler'
import CustomHTML from '../src/ui/modules/CustomHTML'
import { filterPosts } from '../src/ui/modules/blog/BlogList/filterPosts'

test('scheduled content supports unscheduled, future, expired, and active windows', () => {
	const render = (props: React.ComponentProps<typeof Scheduler>) =>
		renderToStaticMarkup(<Scheduler {...props}>Scheduled content</Scheduler>)

	assert.equal(render({}), 'Scheduled content')
	assert.equal(render({ start: '2999-01-01T00:00:00Z' }), '')
	assert.equal(render({ end: '2000-01-01T00:00:00Z' }), '')
	assert.equal(
		render({ start: '2000-01-01T00:00:00Z', end: '2999-01-01T00:00:00Z' }),
		'Scheduled content',
	)
})

test('blog category filtering is pure and retains uncategorized posts in All', () => {
	const posts = [
		{ _id: 'film', categories: [{ slug: { current: 'film' } }] },
		{ _id: 'music', categories: [{ slug: { current: 'music' } }] },
		{ _id: 'uncategorized' },
	] as Sanity.BlogPost[]

	assert.deepEqual(filterPosts(posts, 'All'), posts)
	assert.deepEqual(filterPosts(posts, 'film'), [posts[0]])
	assert.deepEqual(filterPosts(posts, 'music'), [posts[1]])
	assert.deepEqual(filterPosts(posts, 'unknown'), [])
	assert.deepEqual(posts.map(({ _id }) => _id), ['film', 'music', 'uncategorized'])
})

async function withClientRoot(
	check: (
		host: HTMLElement,
		render: (element: React.ReactNode) => Promise<void>,
	) => Promise<void>,
) {
	const dom = new JSDOM('<div id="root"></div>')
	const globals = {
		window: dom.window,
		document: dom.window.document,
		IS_REACT_ACT_ENVIRONMENT: true,
	}
	const originalDescriptors = Object.keys(globals).map((key) => [
		key,
		Object.getOwnPropertyDescriptor(globalThis, key),
	] as const)
	for (const [key, value] of Object.entries(globals)) {
		Object.defineProperty(globalThis, key, { configurable: true, value })
	}

	const host = dom.window.document.getElementById('root')!
	const root = createRoot(host)
	const render = async (element: React.ReactNode) => {
		await act(async () => root.render(<StrictMode>{element}</StrictMode>))
	}

	try {
		await check(host, render)
	} finally {
		await act(async () => root.unmount())
		dom.window.close()
		for (const [key, descriptor] of originalDescriptors) {
			if (descriptor) Object.defineProperty(globalThis, key, descriptor)
			else Reflect.deleteProperty(globalThis, key)
		}
	}
}

test('changing a mounted schedule keeps hook order and uses the current dates', async () => {
	await withClientRoot(async (host, render) => {
		await render(<Scheduler>Visible</Scheduler>)
		assert.equal(host.textContent, 'Visible')
		await render(<Scheduler start="2999-01-01T00:00:00Z">Visible</Scheduler>)
		assert.equal(host.textContent, '')
		await render(<Scheduler>Visible</Scheduler>)
		assert.equal(host.textContent, 'Visible')
		await render(<Scheduler end="2000-01-01T00:00:00Z">Visible</Scheduler>)
		assert.equal(host.textContent, '')
		await render(
			<Scheduler start="2000-01-01T00:00:00Z" end="2999-01-01T00:00:00Z">
				Visible
			</Scheduler>,
		)
		assert.equal(host.textContent, 'Visible')
	})
})

test('custom HTML can change between script, empty, and plain content without duplicates', async () => {
	await withClientRoot(async (host, render) => {
		const code = '<b>Script one</b><script>window.widgetVersion = 1</script>'
		await render(<CustomHTML html={{ code }} />)
		assert.equal(host.querySelectorAll('script').length, 1)
		const firstScript = host.querySelector('script')

		await render(<CustomHTML html={{ code }} className="updated" />)
		assert.equal(host.querySelector('script'), firstScript)
		assert.equal(host.querySelectorAll('b').length, 1)

		await render(
			<CustomHTML html={{ code: '<b>Script two</b><SCRIPT>window.widgetVersion = 2</SCRIPT>' }} />,
		)
		assert.equal(host.querySelectorAll('script').length, 1)
		assert.equal(host.querySelectorAll('b').length, 1)
		assert.equal(host.querySelector('b')?.textContent, 'Script two')
		assert.equal(firstScript?.isConnected, false)

		await render(<CustomHTML />)
		assert.equal(host.innerHTML, '')
		await render(<CustomHTML html={{ code: '<b>Plain content</b>' }} />)
		assert.equal(host.querySelector('b')?.textContent, 'Plain content')
		assert.equal(host.querySelectorAll('script').length, 0)
		await render(<CustomHTML html={{ code }} />)
		assert.equal(host.querySelector('b')?.textContent, 'Script one')
		assert.equal(host.querySelectorAll('script').length, 1)
		await render(<CustomHTML html={{ code: '<b>Plain again</b>' }} />)
		assert.equal(host.querySelector('b')?.textContent, 'Plain again')
		assert.equal(host.querySelectorAll('script').length, 0)
	})
})
