import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { JSDOM } from 'jsdom'

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||= 'test1234'
process.env.NEXT_PUBLIC_SANITY_DATASET ||= 'production'
const carouselModule = import('../src/components/equipe/TeamCarousel')

const member = {
	_id: 'team-member',
	name: 'Alex Martin',
	role: [
		{ _key: 'fr', language: 'fr', value: 'Coordination & production' },
		{ _key: 'en', language: 'en', value: 'Coordination & producing' },
	],
}

test('team member roles render in the selected language below the plain name', async () => {
	const { default: TeamCarousel } = await carouselModule
	for (const [language, expected] of [
		['fr', 'Coordination & production'],
		['en', 'Coordination & producing'],
	]) {
		const html = renderToStaticMarkup(
			<TeamCarousel persons={[member]} language={language} />,
		)
		const document = new JSDOM(html).window.document
		const name = document.querySelector('.team-member-name')!
		assert.equal(name.textContent, 'AlexMartin')
		const role = document.querySelector('.team-member-role')!
		assert.equal(role.textContent, expected)
		assert.ok(name.compareDocumentPosition(role) & 4)
		assert.equal(
			document
				.querySelector('[aria-label="Alex Martin"]')
				?.getAttribute('aria-pressed'),
			'true',
		)
	}
})

test('team members without a role keep their name and have no empty role label', async () => {
	const { default: TeamCarousel } = await carouselModule
	const html = renderToStaticMarkup(
		<TeamCarousel persons={[{ ...member, role: undefined }]} language="fr" />,
	)
	const document = new JSDOM(html).window.document
	assert.ok(document.querySelector('.team-member-name'))
	assert.equal(document.querySelector('.team-member-role'), null)
})

test('the carousel starts with the first CMS member even when they have no photo', async () => {
	const { default: TeamCarousel } = await carouselModule
	const memberWithPhoto = {
		_id: 'member-with-photo',
		name: 'Sam Dupont',
		image: { asset: { _ref: 'image-example-600x900-jpg' } },
	}
	for (const persons of [[member, memberWithPhoto], [memberWithPhoto, member]]) {
		const html = renderToStaticMarkup(
			<TeamCarousel persons={persons} language="fr" />,
		)
		const document = new JSDOM(html).window.document
		assert.equal(
			document.querySelector('[aria-pressed="true"]')?.getAttribute('aria-label'),
			persons[0].name,
		)
		assert.deepEqual(
			Array.from(document.querySelectorAll('button[aria-pressed]'), (button) =>
				button.getAttribute('aria-label'),
			),
			persons.map((person) => person.name),
		)
	}
})

test('inactive portraits are hidden on the first render before animations start', async () => {
	const { default: TeamCarousel } = await carouselModule
	const persons = ['Alex Martin', 'Sam Dupont', 'Jo Bernard'].map((name, index) => ({
		_id: `member-${index}`,
		name,
		image: { asset: { _ref: 'image-example-600x900-jpg' } },
	}))
	const html = renderToStaticMarkup(
		<TeamCarousel persons={persons} language="fr" />,
	)
	const document = new JSDOM(html).window.document
	for (const card of document.querySelectorAll('button[aria-pressed]')) {
		const portrait = card.querySelector('img')?.parentElement
		assert.ok(portrait)
		assert.equal(
			Number(portrait.style.opacity || 1),
			card.getAttribute('aria-pressed') === 'true' ? 1 : 0,
			`${card.getAttribute('aria-label')} must start with the correct visibility`,
		)
	}
})
