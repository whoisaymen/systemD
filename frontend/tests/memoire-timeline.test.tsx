import assert from 'node:assert/strict'
import test from 'node:test'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { JSDOM } from 'jsdom'
import { PathnameContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime'
import './helpers/css'

test('mobile timeline limits animated surfaces to visible connectors and ignores height-only viewport changes', async () => {
	const dom = new JSDOM(
		'<div id="navbar-mobile"><svg viewBox="0 0 321 62"></svg></div><div id="root"></div>',
		{ pretendToBeVisual: true },
	)
	let hidden = false
	let width = 390
	const mediaListeners = new Set<() => void>()
	const desktop = {
		matches: false,
		addEventListener: (_: string, callback: () => void) =>
			mediaListeners.add(callback),
		removeEventListener: (_: string, callback: () => void) =>
			mediaListeners.delete(callback),
	}
	Object.defineProperty(dom.window.document, 'hidden', { get: () => hidden })
	Object.defineProperties(dom.window, {
		innerWidth: { get: () => width },
		matchMedia: { value: () => desktop },
	})
	const logo = dom.window.document.querySelector('svg')!
	Object.defineProperty(logo, 'viewBox', {
		value: { baseVal: { width: 321, height: 62 } },
	})
	logo.getBoundingClientRect = () =>
		new dom.window.DOMRect(16, 8, width - 32, ((width - 32) * 62) / 321)
	Object.defineProperties(dom.window.HTMLElement.prototype, {
		offsetWidth: { get: () => width - 32 },
		offsetHeight: { get: () => 760 },
	})
	dom.window.HTMLElement.prototype.getBoundingClientRect = function () {
		if (this.hasAttribute('data-memoire-card')) {
			return new dom.window.DOMRect(
				40,
				100 + Number(this.dataset.index) * 220,
				240,
				180,
			)
		}
		return new dom.window.DOMRect(16, 80, width - 32, 760)
	}
	const intersections: Observer[] = []
	class Observer {
		disconnected = false
		constructor(readonly callback: IntersectionObserverCallback) {
			intersections.push(this)
		}
		observe() {}
		disconnect() {
			this.disconnected = true
		}
		intersect(visible: boolean) {
			this.callback(
				[{ isIntersecting: visible } as IntersectionObserverEntry],
				this as unknown as IntersectionObserver,
			)
		}
	}
	let nextFrame = 0
	const pendingFrames = new Map<number, FrameRequestCallback>()
	const globals = {
		window: dom.window,
		document: dom.window.document,
		getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
		IntersectionObserver: Observer,
		ResizeObserver: class {
			observe() {}
			unobserve() {}
			disconnect() {}
		},
		MutationObserver: dom.window.MutationObserver,
		requestAnimationFrame: (callback: FrameRequestCallback) => {
			pendingFrames.set(++nextFrame, callback)
			return nextFrame
		},
		cancelAnimationFrame: (id: number) => pendingFrames.delete(id),
		IS_REACT_ACT_ENVIRONMENT: true,
	}
	const descriptors = Object.keys(globals).map(
		(key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
	)
	for (const [key, value] of Object.entries(globals))
		Object.defineProperty(globalThis, key, { configurable: true, value })
	const host = dom.window.document.getElementById('root')!
	const root = createRoot(host)
	const flushFrames = () =>
		act(async () => {
			const callbacks = [...pendingFrames.values()]
			pendingFrames.clear()
			callbacks.forEach((callback) => callback(0))
		})
	try {
		const { default: MemoireTimeline } =
			await import('../src/components/memoire/MemoireTimeline')
		await act(async () =>
			root.render(
				<PathnameContext.Provider value="/fr/memoire">
					<section className="section-folder-content--memoire">
						<MemoireTimeline>
							<ol>
								{[2023, 2021, 2016].map((year, index) => (
									<li
										key={year}
										style={{ rotate: `${index % 2 === 0 ? 2 : -3}deg` }}
									>
										<a
											href={`/fr/festival/${year}`}
											data-memoire-card
											data-index={index}
											style={{ borderRadius: 16 }}
										>
											<span>{year}</span>
										</a>
									</li>
								))}
							</ol>
						</MemoireTimeline>
					</section>
				</PathnameContext.Provider>,
			),
		)
		const connectors = [
			...host.querySelectorAll<SVGSVGElement>(
				'[data-memoire-connection="mobile"]',
			),
		]
		assert.equal(connectors.length, 3)
		const logoConnector = host.querySelector(
			'[data-memoire-logo-connection="mobile"]',
		)!
		const endpoint = logoConnector
			.querySelector('.connection')!
			.getAttribute('d')!
			.match(/-?\d+(?:\.\d+)?/g)!
			.slice(-2)
			.map(Number)
		assert.ok(
			Math.abs(endpoint[0] - (80.4 * (width - 32)) / 321) < 0.001,
			'the first connection is embedded in the centre of the first play triangle',
		)
		assert.ok(
			Math.abs(endpoint[1] - (8 + (30.82 * (width - 32)) / 321 - 80)) < 0.001,
		)
		const firstFrame = logoConnector.querySelector('rect[fill="black"]')!
		const firstJoin = logoConnector.querySelector(
			'[data-memoire-concave-join]',
		)!
		const [joinX, joinY, joinAngle] = firstJoin
			.getAttribute('transform')!
			.match(/-?[\d.]+/g)!
			.map(Number)
		const cardWidth = Number(firstFrame.getAttribute('width'))
		const cardHeight = Number(firstFrame.getAttribute('height'))
		const cardX = Number(firstFrame.getAttribute('x')) + cardWidth / 2
		const cardY = Number(firstFrame.getAttribute('y')) + cardHeight / 2
		const angle = (2 * Math.PI) / 180
		assert.ok(
			Math.abs(
				joinX -
					(cardX -
						(cardWidth / 2) * Math.cos(angle) +
						(cardHeight / 4) * Math.sin(angle)),
			) < 0.001,
		)
		assert.ok(
			Math.abs(
				joinY -
					(cardY -
						(cardWidth / 2) * Math.sin(angle) -
						(cardHeight / 4) * Math.cos(angle)),
			) < 0.001,
		)
		assert.equal(
			joinAngle,
			92,
			'the header connection leaves the tilted left edge',
		)
		const logoCoordinates = logoConnector
			.querySelector('.connection')!
			.getAttribute('d')!
			.match(/-?[\d.]+(?:e[-+]?\d+)?/g)!
			.map(Number)
		const [approachX, approachY] = logoCoordinates.slice(-4, -2)
		assert.ok(
			approachX === endpoint[0] && approachY > endpoint[1],
			'the final bend enters directly beneath the first play centre',
		)

		assert.equal(
			host.querySelectorAll('animateMotion').length,
			0,
			'offscreen arrows do not start',
		)
		for (const connector of connectors) {
			assert.ok(
				parseFloat(connector.style.height) <
					(connector === logoConnector ? 260 : 200),
				'the moving surface spans only its own connection',
			)
			assert.equal(
				connector.querySelector('filter'),
				null,
				'mobile edges use crisp unfiltered vectors',
			)
			const path = connector.querySelector('.connection')!.getAttribute('d')!
			const coordinates = path.match(/-?[\d.]+(?:e[-+]?\d+)?/g)!.map(Number)
			const joins = [
				...connector.querySelectorAll('[data-memoire-concave-join]'),
			]
			const cardCutouts = [
				...connector.querySelectorAll(
					'[data-memoire-card-occlusion] rect[fill="black"]',
				),
			]
			assert.equal(
				cardCutouts.length,
				joins.length,
				'both card edges hide travelling arrows',
			)
			for (const cutout of cardCutouts) {
				assert.ok(
					Number(cutout.getAttribute('width')) > 100 &&
						Number(cutout.getAttribute('height')) > 100,
					'occlusion covers the whole card, not only its border',
				)
				assert.match(
					cutout.getAttribute('transform')!,
					/^rotate\(-?[23] /,
					'occlusion follows the card rotation',
				)
			}
			joins.forEach((join, index) => {
				const [anchorX, anchorY, angle] = join
					.getAttribute('transform')!
					.match(/-?[\d.]+(?:e[-+]?\d+)?/g)!
					.map(Number)
				const [neckX, neckY] =
					index === 0 ? coordinates.slice(2, 4) : coordinates.slice(-4, -2)
				const shape = join
					.getAttribute('d')!
					.match(/-?[\d.]+/g)!
					.map(Number)
				const radius = shape[6]
				const halfWidth = shape[7]
				const radians = (angle * Math.PI) / 180
				const dx = neckX - anchorX
				const dy = neckY - anchorY
				assert.ok(
					Math.hypot(dx, dy) >= radius + halfWidth - 0.001,
					'the straight neck covers the full join before bending',
				)
				assert.ok(
					Math.abs(dx * Math.cos(radians) + dy * Math.sin(radians)) < 0.001,
					'the neck follows the tilted card normal without exposing a square edge',
				)
			})
		}
		assert.equal(
			host.querySelector('.connections filter'),
			null,
			'the page-height surface has no blur',
		)
		assert.equal(
			host.querySelectorAll('[data-memoire-concave-join]').length,
			5,
			'card edges retain their concave vector joins',
		)

		await act(async () => intersections[0].intersect(true))
		assert.equal(
			logoConnector.querySelector('linearGradient'),
			null,
			'the logo covers the arrow directly without a special fade',
		)
		assert.ok(
			logoConnector.querySelector('g[mask] animateMotion'),
			'the travelling arrow uses the card occlusion mask',
		)
		assert.equal(
			logoConnector.querySelector('.connection')!.getAttribute('mask'),
			null,
			'the connection itself remains continuous',
		)
		assert.equal(connectors[0].querySelectorAll('animateMotion').length, 1)
		assert.equal(connectors[1].querySelectorAll('animateMotion').length, 0)
		hidden = true
		await act(async () =>
			dom.window.document.dispatchEvent(
				new dom.window.Event('visibilitychange'),
			),
		)
		assert.equal(host.querySelectorAll('animateMotion').length, 0)
		hidden = false
		await act(async () =>
			dom.window.document.dispatchEvent(
				new dom.window.Event('visibilitychange'),
			),
		)
		assert.equal(host.querySelectorAll('animateMotion').length, 1)
		await act(async () => intersections[0].intersect(false))
		assert.equal(host.querySelectorAll('animateMotion').length, 0)

		await act(async () =>
			dom.window.dispatchEvent(new dom.window.Event('resize')),
		)
		assert.equal(
			pendingFrames.size,
			0,
			'browser chrome height changes do not rebuild geometry',
		)
		width = 430
		await act(async () =>
			dom.window.dispatchEvent(new dom.window.Event('resize')),
		)
		assert.equal(
			pendingFrames.size,
			1,
			'actual width changes still rebuild geometry',
		)
		await flushFrames()
		assert.match(
			host.querySelector('.connections')!.getAttribute('viewBox')!,
			/398/,
		)

		desktop.matches = true
		await act(async () => mediaListeners.forEach((callback) => callback()))
		await flushFrames()
		assert.equal(
			host.querySelectorAll('[data-memoire-connection="mobile"]').length,
			0,
		)
		assert.equal(
			host.querySelectorAll('animateMotion').length,
			2,
			'desktop retains its existing full timeline',
		)
		assert.ok(host.querySelector('.connections filter'))
		assert.ok(intersections.every((observer) => observer.disconnected))
	} finally {
		await act(async () => root.unmount())
		assert.equal(pendingFrames.size, 0)
		assert.equal(mediaListeners.size, 0)
		dom.window.close()
		for (const [key, descriptor] of descriptors) {
			if (descriptor) Object.defineProperty(globalThis, key, descriptor)
			else Reflect.deleteProperty(globalThis, key)
		}
	}
})
