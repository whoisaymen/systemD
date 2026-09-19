import assert from 'node:assert/strict'
import test from 'node:test'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { JSDOM } from 'jsdom'
import ThemeSwitch from '../src/components/ThemeSwitch'
import ThemeDevPanel from '../src/components/ThemeDevPanel'
import { FALLBACK_THEME_COMBOS, THEME_STORAGE_KEY } from '../src/lib/theme'

test('leaving Noir Lab restores the full palette and synchronizes both theme controls', async () => {
	const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost' })
	const blue = FALLBACK_THEME_COMBOS[0]
	const noir = FALLBACK_THEME_COMBOS.at(-1)!
	const draft = {
		primary: '#FFAA55', text: '#F0EEDD', dark: '#112233',
		content: '#334455', grayDark: '#998877', boxEdge: '#665544',
	}
	dom.window.localStorage.setItem(THEME_STORAGE_KEY, noir.key)
	dom.window.sessionStorage.setItem(`system-d-theme-lab:${noir.key}`, JSON.stringify(draft))
	const globals = {
		window: dom.window,
		document: dom.window.document,
		localStorage: dom.window.localStorage,
		CustomEvent: dom.window.CustomEvent,
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
	const html = dom.window.document.documentElement
	const assertBlue = () => {
		assert.equal(html.dataset.theme, blue.key)
		assert.equal(html.style.getPropertyValue('--color-dark'), blue.dark)
		assert.equal(html.style.getPropertyValue('--color-dark-rgb'), '18 61 166')
		assert.equal(html.style.getPropertyValue('--color-primary'), blue.primary)
		assert.equal(html.style.getPropertyValue('--color-grayDark'), blue.grayDark)
		for (const name of ['content', 'content-rgb', 'text', 'box-edge']) {
			assert.equal(html.style.getPropertyValue(`--color-theme-${name}`), '')
		}
		for (const control of host.querySelectorAll('button.toggler')) {
			assert.equal(control.getAttribute('aria-label'), `Change color theme (current: ${blue.name})`)
		}
	}
	const toggle = async (index: number) => {
		await act(async () => {
			host.querySelectorAll<HTMLButtonElement>('button.toggler')[index].click()
		})
	}
	try {
		await act(async () => root.render(<>
			<ThemeSwitch />
			<ThemeSwitch framed={false} />
			<ThemeDevPanel theme={noir} />
		</>))
		assert.equal(html.style.getPropertyValue('--color-theme-content'), draft.content)
		assert.equal(html.style.getPropertyValue('--color-theme-text'), draft.text)
		await toggle(0)
		assertBlue()

		// Alternating controls must continue the same cycle, without stale indices.
		for (let index = 1; index < FALLBACK_THEME_COMBOS.length; index++) {
			await toggle(index % 2)
			assert.equal(html.dataset.theme, FALLBACK_THEME_COMBOS[index].key)
		}
		assert.equal(html.style.getPropertyValue('--color-theme-content'), draft.content)
		assert.equal(html.style.getPropertyValue('--color-primary'), draft.primary)
		await toggle(1)
		assertBlue()
		assert.equal(dom.window.localStorage.getItem(THEME_STORAGE_KEY), blue.key)
	} finally {
		await act(async () => root.unmount())
		dom.window.close()
		for (const [key, descriptor] of originalDescriptors) {
			if (descriptor) Object.defineProperty(globalThis, key, descriptor)
			else Reflect.deleteProperty(globalThis, key)
		}
	}
})
