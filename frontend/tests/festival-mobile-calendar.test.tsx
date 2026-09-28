import assert from 'node:assert/strict'
import test from 'node:test'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { JSDOM } from 'jsdom'
import { NextIntlClientProvider } from 'next-intl'
import messages from '../messages/en.json'
import { getCalendarDays } from '../src/components/festival/calendar'
import './helpers/css'

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||= 'test1234'
process.env.NEXT_PUBLIC_SANITY_DATASET ||= 'production'

const localized = (value: string) => [{ language: 'en', value }]

test('mobile starts in the current month, filters days, and carries multi-day events across years', async (context) => {
	context.mock.timers.enable({
		apis: ['Date'],
		now: new Date(2026, 11, 15, 12),
	})
	const dom = new JSDOM('<div id="navbar-mobile"></div><div id="root"></div>', {
		pretendToBeVisual: true,
	})
	let scrolls = 0
	let restoredScroll: number | undefined
	Object.defineProperty(dom.window, 'matchMedia', {
		value: (query: string) => ({
			matches: query.includes('prefers-reduced-motion'),
			addEventListener() {},
			removeEventListener() {},
			addListener() {},
			removeListener() {},
		}),
	})
	dom.window.scrollTo = ((options: ScrollToOptions) => {
		restoredScroll = options.top
	}) as typeof dom.window.scrollTo
	dom.window.HTMLElement.prototype.scrollIntoView = () => {
		scrolls++
	}
	const globals = {
		window: dom.window,
		document: dom.window.document,
		Element: dom.window.Element,
		HTMLElement: dom.window.HTMLElement,
		SVGElement: dom.window.SVGElement,
		getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
		requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window),
		cancelAnimationFrame: dom.window.cancelAnimationFrame.bind(dom.window),
		ResizeObserver: class {
			observe() {}
			disconnect() {}
		},
		IS_REACT_ACT_ENVIRONMENT: true,
	}
	const descriptors = Object.keys(globals).map(
		(key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
	)
	for (const [key, value] of Object.entries(globals))
		Object.defineProperty(globalThis, key, { configurable: true, value })
	const host = dom.window.document.getElementById('root')!
	const root = createRoot(host)
	const events = [
		{
			_id: 'screening',
			date: new Date(2026, 11, 18, 19).toISOString(),
			title: localized('Screening'),
			description: localized('A film and discussion.'),
		},
		{
			_id: 'workshop',
			date: new Date(2026, 11, 18, 15).toISOString(),
			title: localized('Workshop'),
		},
		{
			_id: 'new-year',
			date: new Date(2026, 11, 31, 18).toISOString(),
			endDate: new Date(2027, 0, 2, 20).toISOString(),
			title: localized('New year festival'),
		},
	]
	const provider = (children: React.ReactNode) => (
		<NextIntlClientProvider
			locale="en"
			timeZone="Europe/Brussels"
			messages={messages}
		>
			{children}
		</NextIntlClientProvider>
	)
	const click = async (selector: string) => {
		const button = host.querySelector<HTMLButtonElement>(selector)
		assert.ok(button, selector)
		await act(async () => button.click())
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 60))
		})
	}
	const agenda = () =>
		host.querySelector('[data-testid="festival-mobile-agenda"]')!
	try {
		const { default: MobileEventsCalendar } =
			await import('../src/components/festival/MobileEventsCalendar')
		await act(async () =>
			root.render(
				provider(<MobileEventsCalendar events={events} language="en" />),
			),
		)
		assert.match(host.textContent!, /December/)
		assert.ok(host.querySelector('h3 [aria-label="3 events"]'))
		assert.equal(agenda().querySelectorAll('article').length, 3)
		const groups = agenda().querySelectorAll('[role="group"]')
		assert.equal(groups.length, 2, 'events on the same date share a group')
		assert.match(groups[0].getAttribute('aria-label')!, /December 18, 2026/)
		assert.equal(groups[0].querySelectorAll(':scope > time').length, 1)
		assert.deepEqual(
			Array.from(groups[0].querySelectorAll('article'), (article) =>
				article.textContent!.replace(/\d{2}:\d{2}/g, '').trim(),
			),
			['Workshop', 'Screening'],
			'events within a day stay in chronological order',
		)
		assert.match(groups[1].getAttribute('aria-label')!, /December 31, 2026/)
		assert.equal(
			host.querySelector('[data-testid="festival-month-card"]'),
			null,
		)
		await click('button[aria-label*="December 18, 2026"]')
		assert.equal(agenda().querySelectorAll('article').length, 2)
		assert.equal(agenda().querySelectorAll('[role="group"]').length, 1)
		assert.ok(host.querySelector('h3 [aria-label="3 events"]'))
		assert.match(agenda().querySelector('article')!.textContent!, /Workshop/)
		Object.defineProperty(dom.window, 'scrollY', {
			configurable: true,
			value: 420,
		})
		await click('article:nth-of-type(2) > button')
		assert.equal(
			agenda(),
			null,
			'event details replace the calendar and agenda',
		)
		assert.match(
			host.querySelector('[data-testid="festival-mobile-event-detail"]')!
				.textContent!,
			/A film and discussion/,
		)
		assert.equal(
			dom.window.document.activeElement?.getAttribute('aria-label'),
			'Back to calendar',
		)
		assert.equal(dom.window.document.activeElement?.textContent, '')
		assert.match(
			host.querySelector('[data-testid="festival-mobile-event-detail"] time')!
				.textContent!,
			/Friday, December 18, 2026 · /,
		)
		await click('button[aria-label="Close event details"]')
		assert.equal(
			host.querySelector('[data-testid="festival-mobile-event-detail"]'),
			null,
		)
		assert.equal(agenda().querySelectorAll('article').length, 2)
		assert.equal(agenda().querySelectorAll('[role="group"]').length, 1)
		assert.equal(
			host
				.querySelector('button[aria-label*="December 18, 2026"]')
				?.getAttribute('aria-pressed'),
			'true',
		)
		assert.equal(restoredScroll, 420)
		assert.match(dom.window.document.activeElement!.textContent!, /Screening/)
		await click('article:nth-of-type(2) > button')
		await act(async () => {
			dom.window.dispatchEvent(
				new dom.window.KeyboardEvent('keydown', { key: 'Escape' }),
			)
		})
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 60))
		})
		assert.ok(agenda(), 'Escape also returns to the calendar')
		assert.equal(host.querySelectorAll('button[aria-current="date"]').length, 1)
		await click('button[aria-label*="December 19, 2026"]')
		assert.match(agenda().textContent!, /No events scheduled/)
		await click('button[aria-label="Next month"]')
		assert.match(host.textContent!, /2027.*January/)
		assert.ok(host.querySelector('h3 [aria-label="1 event"]'))
		assert.equal(agenda().querySelectorAll('article').length, 1)
		await click('button[aria-label*="January 2, 2027"]')
		assert.match(agenda().textContent!, /New year festival/)
		assert.match(
			agenda().querySelector('[role="group"]')!.getAttribute('aria-label')!,
			/January 2, 2027/,
			'multi-day events use the selected day for their group',
		)
		await click('button[aria-label="Previous month"]')
		assert.equal(agenda().querySelectorAll('article').length, 3)
		assert.equal(host.querySelector('button[aria-pressed="true"]'), null)

		const { default: FestivalContent } =
			await import('../src/components/festival/FestivalContent')
		scrolls = 0
		await act(async () =>
			root.render(
				provider(
					<FestivalContent
						language="en"
						festival={{
							_id: 'festival',
							blocks: [
								{
									_type: 'visionBlock',
									visionTitle: localized('Our vision'),
									vision: [{ text: localized('Our vision content') }],
								},
								{ _type: 'onTourBlock', events },
								{
									_type: 'customTextBlock',
									title: localized('Entry'),
									content: localized('Entry content'),
								},
								{
									_type: 'customTextBlock',
									title: localized('Hidden'),
									show: false,
								},
							],
						}}
					/>,
				),
			),
		)
		const menu = host.querySelector('[data-testid="festival-mobile-menu"]')!
		assert.equal(menu.querySelectorAll('button').length, 3)
		assert.equal(
			menu.querySelector('[aria-pressed="true"]')?.textContent,
			'Events',
		)
		assert.equal(menu.lastElementChild?.textContent, 'Events')
		await click(
			'[data-testid="festival-mobile-menu"] button[aria-controls="festival-panel-vision-0"]',
		)
		assert.match(
			host.querySelector('[role="region"][data-state="open"]')!.textContent!,
			/Our vision content/,
		)
		assert.equal(menu.querySelectorAll('button').length, 3)
		assert.equal(menu.lastElementChild?.textContent, 'Our vision')
		assert.equal(scrolls, 1)
		await click(
			'[data-testid="festival-mobile-menu"] button[aria-controls="festival-panel-vision-0"]',
		)
		assert.equal(
			scrolls,
			1,
			'tapping the selected section should not close it or scroll',
		)
		await click(
			'[data-testid="festival-mobile-menu"] button[aria-controls="festival-panel-events-1"]',
		)
		assert.equal(menu.lastElementChild?.textContent, 'Events')
		assert.ok(host.querySelector('[data-testid="festival-mobile-calendar"]'))
	} finally {
		await act(async () => root.unmount())
		dom.window.close()
		for (const [key, descriptor] of descriptors) {
			if (descriptor) Object.defineProperty(globalThis, key, descriptor)
			else Reflect.deleteProperty(globalThis, key)
		}
	}
})

test('calendar days use Monday-first weeks and include leap day', () => {
	const days = getCalendarDays(2028, 1)
	assert.equal(days[0], null)
	assert.equal(days[1]?.getDate(), 1)
	assert.equal(days.at(-1)?.getDate(), 29)
})
