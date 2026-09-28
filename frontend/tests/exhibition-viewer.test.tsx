import assert from 'node:assert/strict'
import test from 'node:test'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { JSDOM } from 'jsdom'
import { NextIntlClientProvider } from 'next-intl'
import messages from '../messages/en.json'
import './helpers/css'

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||= 'test1234'
process.env.NEXT_PUBLIC_SANITY_DATASET ||= 'production'

test('exhibition images persist through opening, swipe once, pinch without navigating, and tap to close', async () => {
	const dom = new JSDOM(
		'<button id="trigger">Open</button><button id="return-thumbnail">Second photo</button><div id="root"></div>',
		{ pretendToBeVisual: true },
	)
	Object.defineProperties(dom.window, {
		innerWidth: { value: 390 },
		innerHeight: { value: 844 },
		matchMedia: {
			value: () => ({
				matches: false,
				addEventListener() {},
				removeEventListener() {},
				addListener() {},
				removeListener() {},
			}),
		},
	})
	dom.window.HTMLElement.prototype.setPointerCapture = () => {}
	const globals = {
		window: dom.window,
		document: dom.window.document,
		HTMLElement: dom.window.HTMLElement,
		Element: dom.window.Element,
		SVGElement: dom.window.SVGElement,
		getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
		requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window),
		cancelAnimationFrame: dom.window.cancelAnimationFrame.bind(dom.window),
		IS_REACT_ACT_ENVIRONMENT: true,
	}
	const descriptors = Object.keys(globals).map(
		(key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
	)
	for (const [key, value] of Object.entries(globals))
		Object.defineProperty(globalThis, key, { configurable: true, value })
	const root = createRoot(dom.window.document.getElementById('root')!)
	const returnThumbnail = dom.window.document.getElementById('return-thumbnail')!
	let thumbnailWasRevealed = false
	let requestedThumbnail = -1
	returnThumbnail.getBoundingClientRect = () => {
		const top = thumbnailWasRevealed ? 300 : 1200
		return {
			x: 200, y: top, left: 200, top, right: 374, bottom: top + 232,
			width: 174, height: 232, toJSON() {},
		}
	}
	returnThumbnail.scrollIntoView = () => { thumbnailWasRevealed = true }
	const tick = async (ms = 60) => {
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, ms))
		})
	}
	const photos = Array.from({ length: 1000 }, (_, index) => ({
		artistName: `Artist ${index + 1}`,
		photo: {
			asset: {
				_ref: `image-${String(index).padStart(40, '0')}-1200x1600-jpg`,
				metadata: {
					dimensions: { width: 1200, height: 1600 },
					lqip: 'data:image/jpeg;base64,/9j/2w==',
				},
			},
		},
	}))
	const image = (number: number) =>
		dom.window.document.querySelector<HTMLImageElement>(
			`[data-exhibition-photo="${number}"] img`,
		)!
	const activeFrame = () =>
		dom.window.document.querySelector<HTMLElement>(
			'[data-exhibition-photo][data-active="true"]',
		)!
	const endTransition = async () => {
		const event = new dom.window.Event('transitionend', { bubbles: true })
		Object.defineProperty(event, 'propertyName', { value: 'width' })
		await act(async () => {
			activeFrame().dispatchEvent(event)
		})
	}
	const gestureSurface = () => {
		const element = activeFrame().querySelector<HTMLDivElement>(
			'[data-zoomable-photo]',
		)!
		Object.defineProperties(element, {
			clientWidth: { configurable: true, value: 358 },
			clientHeight: { configurable: true, value: 478 },
		})
		element.getBoundingClientRect = () => ({
			x: 16,
			y: 183,
			left: 16,
			top: 183,
			right: 374,
			bottom: 661,
			width: 358,
			height: 478,
			toJSON() {},
		})
		return element
	}
	const pointer = (
		element: Element,
		type: string,
		id: number,
		x: number,
		y = 400,
	) => {
		const event = new dom.window.MouseEvent(type, {
			bubbles: true,
			clientX: x,
			clientY: y,
			button: 0,
		})
		Object.defineProperty(event, 'pointerId', { value: id })
		element.dispatchEvent(event)
	}
	const tap = (element: Element) => {
		pointer(element, 'pointerdown', 1, 190)
		pointer(element, 'pointerup', 1, 190)
		element.dispatchEvent(
			new dom.window.MouseEvent('click', {
				bubbles: true,
				clientX: 190,
				clientY: 400,
			}),
		)
	}
	let closes = 0
	try {
		const { default: FestivalCarousel } =
			await import('../src/components/festival/FestivalCarousel')
		dom.window.document.getElementById('trigger')!.focus()
		await act(async () =>
			root.render(
				<NextIntlClientProvider
					locale="en"
					timeZone="Europe/Brussels"
					messages={messages}
				>
					<FestivalCarousel
						photos={photos}
						variant="image"
						imageFit="contain"
						originRect={{ left: 16, top: 300, width: 174, height: 232 }}
						originSrc="https://example.test/loaded-thumbnail.jpg"
						getThumbnail={(index) => {
							requestedThumbnail = index
							return returnThumbnail
						}}
						onClose={() => closes++}
					/>
				</NextIntlClientProvider>,
			),
		)
		const openingImage = image(1)
		const openingCredit = activeFrame().querySelector<HTMLElement>(
			'[data-exhibition-credit]',
		)
		assert.ok(openingCredit, 'the artist credit is visible from the first opening frame')
		assert.match(openingCredit.textContent!, /Artist 1/)
		assert.ok(
			openingImage.style.backgroundImage.includes('loaded-thumbnail.jpg'),
		)
		assert.equal(
			dom.window.document.querySelectorAll('[data-exhibition-photo] img')
				.length,
			1,
		)
		await act(async () =>
			openingImage.dispatchEvent(new dom.window.Event('load')),
		)
		await tick()
		await endTransition()
		assert.equal(
			image(1),
			openingImage,
			'opening must not replace the loaded image node',
		)
		assert.equal(openingImage.style.backgroundImage, '')
		assert.equal(
			dom.window.document.querySelectorAll('[data-exhibition-photo] img')
				.length,
			3,
		)
		assert.equal(image(2).getAttribute('fetchpriority'), 'low')
		const nextImage = image(2)
		const outgoingCredit = activeFrame().querySelector<HTMLElement>(
			'[data-exhibition-credit]',
		)!
		assert.equal(outgoingCredit, openingCredit, 'opening never removes or replaces the artist credit')
		const incomingCredit = nextImage.closest('[data-exhibition-photo]')!
			.querySelector<HTMLElement>('[data-exhibition-credit]')!
		assert.match(outgoingCredit.textContent!, /Artist 1/)
		assert.match(incomingCredit.textContent!, /Artist 2/)
		let surface = gestureSurface()
		await act(async () => {
			tap(surface)
			pointer(surface, 'pointerdown', 1, 300)
			pointer(surface, 'pointermove', 1, 120)
		})
		await tick()
		for (const [credit, photo] of [
			[outgoingCredit, openingImage],
			[incomingCredit, nextImage],
		] as const) {
			const movingFrame = credit.parentElement!
			assert.ok(movingFrame.contains(photo), 'each credit moves with its own photo')
			assert.match(movingFrame.style.transform, /rotateY\(/, 'both photos tilt during the swipe')
			assert.equal(movingFrame.style.opacity, '1', 'incoming photos stay fully bright')
		}
		await act(async () => {
			pointer(surface, 'pointerup', 1, 120)
			surface.dispatchEvent(
				new dom.window.MouseEvent('click', { bubbles: true }),
			)
		})
		await tick(400)
		assert.equal(
			activeFrame().dataset.exhibitionPhoto,
			'2',
			'one swipe advances exactly one photo',
		)
		assert.equal(
			image(2),
			nextImage,
			'the neighbouring photo must not remount on arrival',
		)
		assert.equal(
			activeFrame().querySelector('[data-exhibition-credit]'),
			incomingCredit,
			'the incoming credit remains attached as its photo becomes active',
		)
		assert.ok(
			!incomingCredit.parentElement!.style.transform.includes('rotateY('),
			'the selected photo and credit settle flat',
		)
		assert.equal(
			closes,
			0,
			'the click generated after a swipe must not dismiss the viewer',
		)
		assert.equal(
			dom.window.document.querySelectorAll('[data-exhibition-photo] img')
				.length,
			3,
			'a swipe cancels a pending tap instead of starting to close mid-gesture',
		)
		surface = gestureSurface()
		const normalSize = nextImage.sizes
		await act(async () => {
			pointer(surface, 'pointerdown', 1, 145)
			pointer(surface, 'pointerdown', 2, 245)
			pointer(surface, 'pointermove', 1, 95)
			pointer(surface, 'pointermove', 2, 295)
		})
		assert.equal(
			nextImage.sizes,
			normalSize,
			'pinching must not request a new size on every movement',
		)
		await act(async () => {
			pointer(surface, 'pointerup', 2, 295)
			pointer(surface, 'pointerup', 1, 95)
		})
		await tick()
		assert.equal(
			nextImage.sizes,
			'716px',
			'request more detail after zooming in',
		)
		assert.match(
			(surface.firstElementChild as HTMLElement).style.transform,
			/scale\(2\)/,
		)
		await act(async () => {
			pointer(surface, 'pointerdown', 1, 200)
			pointer(surface, 'pointermove', 1, 160)
			pointer(surface, 'pointerup', 1, 160)
		})
		assert.equal(
			activeFrame().dataset.exhibitionPhoto,
			'2',
			'dragging while zoomed pans the same photo',
		)
		await act(async () => {
			tap(surface)
			tap(surface)
		})
		await tick(330)
		assert.equal(closes, 0, 'double tap zooms without closing')
		assert.ok(
			!(surface.firstElementChild as HTMLElement).style.transform.includes(
				'scale(2)',
			),
		)
		await act(async () => tap(surface))
		await tick(330)
		await tick()
		assert.equal(requestedThumbnail, 1, 'closing resolves the current photo after swiping')
		assert.equal(thumbnailWasRevealed, true, 'an offscreen thumbnail is brought into view')
		assert.deepEqual(
			[activeFrame().style.left, activeFrame().style.top, activeFrame().style.width, activeFrame().style.height],
			['200px', '300px', '174px', '232px'],
			'closing lands on the current thumbnail, measured after revealing it',
		)
		assert.equal(
			activeFrame().querySelector('[data-exhibition-credit]'),
			incomingCredit,
			'the artist credit stays attached throughout closing',
		)
		await endTransition()
		assert.equal(closes, 1, 'a single image tap closes even a portrait photo')
	} finally {
		await act(async () => root.unmount())
		assert.equal(dom.window.document.activeElement, returnThumbnail, 'focus returns to the current photo')
		assert.equal(dom.window.document.body.style.overflow, '')
		dom.window.close()
		for (const [key, descriptor] of descriptors) {
			if (descriptor) Object.defineProperty(globalThis, key, descriptor)
			else Reflect.deleteProperty(globalThis, key)
		}
	}
})
