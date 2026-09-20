import assert from 'node:assert/strict'
import test from 'node:test'
import React, { act } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createRoot } from 'react-dom/client'
import { JSDOM } from 'jsdom'
import ProgressiveImage from '../src/ui/ProgressiveImage'

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||= 'test1234'
process.env.NEXT_PUBLIC_SANITY_DATASET ||= 'production'
const imageModule = import('../src/ui/Img')

const placeholder = 'data:image/jpeg;base64,/9j/2w=='
const image = {
	asset: {
		_ref: 'image-0123456789abcdef0123456789abcdef01234567-2400x1600-jpg',
		metadata: { dimensions: { width: 2400, height: 1600 }, lqip: placeholder },
	},
} as Sanity.Image

test('lazy thumbnails include an inline preview and use the supplied card size', async () => {
	const { default: Img } = await imageModule
	const dom = new JSDOM(
		renderToStaticMarkup(
			<Img
				image={{ ...image, loading: 'eager' }}
				imageWidth={1000}
				sizes="(min-width: 1024px) 14vw, 32vw"
				loading="lazy"
				alt="Photo"
			/>,
		),
	)
	const img = dom.window.document.querySelector('img')!
	assert.equal(img.getAttribute('loading'), 'lazy')
	assert.equal(img.getAttribute('decoding'), 'async')
	assert.equal(img.sizes, '(min-width: 1024px) 14vw, 32vw')
	assert.ok(img.style.backgroundImage.includes(placeholder))
	assert.equal(dom.window.document.querySelector('link[rel="preload"]'), null)
	const candidates = img.srcset
		.split(', ')
		.map((candidate) => candidate.split(' '))
	assert.equal(candidates.at(-1)![1], '1000w')
	for (const [src, descriptor] of candidates) {
		const url = new URL(src)
		assert.equal(url.searchParams.get('auto'), 'format')
		assert.equal(url.searchParams.get('fit'), 'max')
		assert.equal(`${url.searchParams.get('w')}w`, descriptor)
		assert.ok(Number(url.searchParams.get('w')) <= 1000)
	}
	dom.window.close()
})

test('cropped posters reserve the correct proportions and are never upscaled', async () => {
	const { default: Img, getImageDimensions } = await imageModule
	const cropped = {
		...image,
		crop: { left: 0.25, right: 0.25, top: 0.1, bottom: 0.15 },
	}
	assert.deepEqual(getImageDimensions(cropped), { width: 1200, height: 1200 })
	const dom = new JSDOM(
		renderToStaticMarkup(<Img image={cropped} imageWidth={2000} />),
	)
	const img = dom.window.document.querySelector('img')!
	assert.equal(img.width, 1200)
	assert.equal(img.height, 1200)
	assert.ok(img.srcset.endsWith('1200w'))
	assert.ok(img.src.includes('rect='))
	dom.window.close()
})

test('the main film image preloads the same responsive candidates as the displayed image', async () => {
	const { default: Img } = await imageModule
	const dom = new JSDOM(
		renderToStaticMarkup(
			<Img image={image} sizes="60vw" loading="eager" fetchPriority="high" />,
		),
	)
	const img = dom.window.document.querySelector('img')!
	const preload = dom.window.document.querySelector('link[rel="preload"]')!
	assert.equal(preload.getAttribute('imagesrcset'), img.srcset)
	assert.equal(preload.getAttribute('imagesizes'), '60vw')
	dom.window.close()
})

test('previews clear after loading, return for the next photo, and handle cached images', async () => {
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
	let loads = 0
	try {
		await act(async () =>
			root.render(
				<ProgressiveImage
					src="one.jpg"
					placeholder={placeholder}
					onLoad={() => loads++}
				/>,
			),
		)
		const img = dom.window.document.querySelector('img')!
		assert.ok(img.style.backgroundImage.includes(placeholder))
		await act(async () => img.dispatchEvent(new dom.window.Event('load')))
		assert.equal(img.style.backgroundImage, '')
		assert.equal(loads, 1)
		await act(async () =>
			root.render(<ProgressiveImage src="two.jpg" placeholder={placeholder} />),
		)
		assert.ok(img.style.backgroundImage.includes(placeholder))
		await act(async () => img.dispatchEvent(new dom.window.Event('error')))
		assert.ok(img.style.backgroundImage.includes(placeholder))
		Object.defineProperties(img, {
			complete: { value: true },
			naturalWidth: { value: 2400 },
		})
		await act(async () =>
			root.render(
				<ProgressiveImage src="cached.jpg" placeholder={placeholder} />,
			),
		)
		assert.equal(img.style.backgroundImage, '')
	} finally {
		await act(async () => root.unmount())
		dom.window.close()
		for (const [key, descriptor] of descriptors) {
			if (descriptor) Object.defineProperty(globalThis, key, descriptor)
			else Reflect.deleteProperty(globalThis, key)
		}
	}
})
