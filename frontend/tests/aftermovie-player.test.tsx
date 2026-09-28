import assert from 'node:assert/strict'
import test from 'node:test'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { JSDOM } from 'jsdom'
import AftermoviePlayer from '../src/components/festival/AftermoviePlayer'

test('YouTube preview loads playback only on request and resets for a different edition', async () => {
	const dom = new JSDOM('<div id="root"></div>')
	const globals = {
		window: dom.window,
		document: dom.window.document,
		IS_REACT_ACT_ENVIRONMENT: true,
	}
	const descriptors = Object.keys(globals).map(
		(key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
	)
	for (const [key, value] of Object.entries(globals))
		Object.defineProperty(globalThis, key, { configurable: true, value })
	const root = createRoot(dom.window.document.getElementById('root')!)
	const document = dom.window.document
	try {
		await act(async () => root.render(
			<AftermoviePlayer source="https://youtu.be/tF9Yrss34Sc" title="Aftermovie 2023" language="fr" />,
		))
		assert.equal(document.querySelector('iframe'), null)
		assert.equal(document.querySelector('a')?.textContent, 'YouTube')
		assert.equal(document.querySelector('img')!.src, 'https://i.ytimg.com/vi/tF9Yrss34Sc/hqdefault.jpg')
		await act(async () => document.querySelector('button')!.click())
		const player = document.querySelector('iframe')!
		const embed = new URL(player.src)
		assert.equal(embed.hostname, 'www.youtube-nocookie.com')
		assert.equal(embed.pathname, '/embed/tF9Yrss34Sc')
		assert.equal(embed.searchParams.get('autoplay'), '1')
		assert.equal(player.title, 'Aftermovie 2023')
		assert.equal(document.querySelector('button, img, a'), null)
		await act(async () => root.render(
			<AftermoviePlayer source="https://www.youtube.com/watch?v=olfqP8nM1KI" title="Aftermovie 2021" language="en" />,
		))
		assert.equal(document.querySelector('iframe'), null)
		assert.equal(document.querySelector('button')?.getAttribute('aria-label'), 'Play video — Aftermovie 2021')
		assert.ok(document.querySelector('img')!.src.includes('/olfqP8nM1KI/'))
	} finally {
		await act(async () => root.unmount())
		dom.window.close()
		for (const [key, descriptor] of descriptors) {
			if (descriptor) Object.defineProperty(globalThis, key, descriptor)
			else Reflect.deleteProperty(globalThis, key)
		}
	}
})
