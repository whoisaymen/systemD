import assert from 'node:assert/strict'
import test from 'node:test'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { JSDOM } from 'jsdom'
import './helpers/css'

test('artwork repeats consistently on mobile and desktop and stops when hidden, offscreen, or reduced motion is enabled', async (context) => {
	const dom = new JSDOM('<div id="root"></div>', { pretendToBeVisual: true })
	let hidden = false
	Object.defineProperty(dom.window.document, 'hidden', { get: () => hidden })
	const media = (matches: boolean) => {
		const listeners = new Set<() => void>()
		return {
			matches,
			listeners,
			addEventListener: (_: string, callback: () => void) =>
				listeners.add(callback),
			removeEventListener: (_: string, callback: () => void) =>
				listeners.delete(callback),
			change(value: boolean) {
				this.matches = value
				listeners.forEach((callback) => callback())
			},
		}
	}
	const desktop = media(false)
	const reducedMotion = media(false)
	Object.defineProperty(dom.window, 'matchMedia', {
		value: (query: string) =>
			query.includes('reduced-motion') ? reducedMotion : desktop,
	})
	const observers: Observer[] = []
	class Observer {
		disconnected = false
		constructor(
			readonly callback: IntersectionObserverCallback,
			readonly options: IntersectionObserverInit,
		) {
			observers.push(this)
		}
		observe() {}
		disconnect() {
			this.disconnected = true
		}
		intersect(ratio: number) {
			this.callback(
				[
					{
						isIntersecting: ratio > 0,
						intersectionRatio: ratio,
					} as IntersectionObserverEntry,
				],
				this as unknown as IntersectionObserver,
			)
		}
	}
	class MockAnimation {
		playState = 'running'
		private resolve!: () => void
		private reject!: () => void
		finished = new Promise<void>((resolve, reject) => {
			this.resolve = resolve
			this.reject = () => reject(new Error('Animation cancelled'))
		})
		constructor(
			readonly keyframes: Keyframe[],
			readonly options: KeyframeAnimationOptions,
		) {
			void this.finished.catch(() => {})
		}
		finish() {
			this.playState = 'finished'
			this.resolve()
		}
		cancel() {
			this.playState = 'idle'
			this.reject()
		}
	}
	const animations: MockAnimation[] = []
	Object.defineProperty(dom.window.SVGElement.prototype, 'animate', {
		value: (frames: Keyframe[], options: KeyframeAnimationOptions) => {
			const animation = new MockAnimation(frames, options)
			animations.push(animation)
			return animation
		},
	})
	const globals = {
		window: dom.window,
		document: dom.window.document,
		IntersectionObserver: Observer,
		IS_REACT_ACT_ENVIRONMENT: true,
	}
	const descriptors = Object.keys(globals).map(
		(key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
	)
	for (const [key, value] of Object.entries(globals))
		Object.defineProperty(globalThis, key, { configurable: true, value })
	context.mock.timers.enable({ apis: ['setTimeout'] })
	let random = 0.25
	context.mock.method(Math, 'random', () => random)
	const host = dom.window.document.querySelector<HTMLDivElement>('#root')!
	const root = createRoot(host)
	const running = () =>
		animations.filter((animation) => animation.playState === 'running')
	const finish = () =>
		act(async () => running().forEach((animation) => animation.finish()))
	const tick = () =>
		act(async () => {
			context.mock.timers.tick(1000)
		})
	let unmounted = false
	try {
		const { default: StoryIllustration } =
			await import('../src/components/bigbang/StoryIllustration')
		const markup = `<svg viewBox="0 0 470 187"><g>${'<path d="M0 0 L1 1"/>'.repeat(8)}<circle r="10"/></g></svg>`
		await act(async () =>
			root.render(
				<StoryIllustration
					markup={markup}
					lang="en"
					compact={false}
					scrollContainerRef={{ current: host }}
				/>,
			),
		)
		assert.equal(observers[0].options.root, null)
		await act(async () => observers[0].intersect(0.3))
		const cycleSize = animations.length
		assert.ok(
			cycleSize > 0,
			'motion starts before the whole drawing enters the viewport',
		)
		const firstFrames = animations.map((animation) => animation.keyframes)
		await finish()
		random = 0.75
		await tick()
		assert.equal(
			animations.length,
			cycleSize * 2,
			'mobile repeats without a tap or hover',
		)
		assert.notDeepEqual(
			animations.slice(cycleSize).map((animation) => animation.keyframes),
			firstFrames,
		)
		assert.notEqual(
			animations[0].options.duration,
			animations[cycleSize].options.duration,
		)

		await act(async () => observers[0].intersect(0))
		assert.equal(running().length, 0)
		await tick()
		assert.equal(
			animations.length,
			cycleSize * 2,
			'offscreen artwork stays stopped',
		)
		await act(async () => observers[0].intersect(0.8))
		assert.equal(running().length, cycleSize)
		hidden = true
		await act(async () =>
			dom.window.document.dispatchEvent(
				new dom.window.Event('visibilitychange'),
			),
		)
		assert.equal(running().length, 0)
		hidden = false
		await act(async () =>
			dom.window.document.dispatchEvent(
				new dom.window.Event('visibilitychange'),
			),
		)
		assert.equal(running().length, cycleSize)
		await act(async () => reducedMotion.change(true))
		assert.equal(running().length, 0)
		await tick()
		assert.equal(running().length, 0)
		await act(async () => reducedMotion.change(false))
		assert.equal(
			running().length,
			cycleSize,
			'motion resumes when the preference is restored',
		)

		await act(async () => desktop.change(true))
		assert.equal(observers.at(-1)!.options.root, host)
		await act(async () => observers.at(-1)!.intersect(0.3))
		assert.equal(running().length, cycleSize)
		assert.deepEqual(
			running().map((animation) => animation.keyframes),
			animations.slice(cycleSize, cycleSize * 2).map((animation) => animation.keyframes),
			'desktop uses the same expressive movement as mobile',
		)
		await finish()
		const desktopCount = animations.length
		await tick()
		assert.equal(
			animations.length,
			desktopCount + cycleSize,
			'desktop repeats without a tap or hover',
		)
		await act(async () => observers.at(-1)!.intersect(0.1))
		assert.equal(running().length, 0)
		await tick()
		assert.equal(animations.length, desktopCount + cycleSize)
		await act(async () => observers.at(-1)!.intersect(0.8))
		await finish()
		const beforeUnmount = animations.length
		await act(async () => root.unmount())
		unmounted = true
		await tick()
		assert.equal(
			animations.length,
			beforeUnmount,
			'unmount clears a pending replay',
		)
		assert.ok(observers.every((observer) => observer.disconnected))
		assert.equal(desktop.listeners.size + reducedMotion.listeners.size, 0)
	} finally {
		if (!unmounted) await act(async () => root.unmount())
		context.mock.timers.reset()
		dom.window.close()
		for (const [key, descriptor] of descriptors) {
			if (descriptor) Object.defineProperty(globalThis, key, descriptor)
			else Reflect.deleteProperty(globalThis, key)
		}
	}
})
