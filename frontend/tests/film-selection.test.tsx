import assert from 'node:assert/strict'
import test from 'node:test'
import { sortFilmSelection } from '../src/lib/filmSelection'
import { textToRichText } from '../src/lib/richText'

const films = [
	{ _id: 'beast', title: 'La bête immonde', director: 'Black Genius', year: 2023 },
	{ _id: 'drag', title: '1001 Drag King', director: 'Imis Kill', year: 2023, isWinner: true },
	{ _id: 'old', title: 'Zombies', director: 'Baloji', year: 2019, isWinner: true },
	{ _id: 'shell', title: 'A Shell of Hate', director: 'El Kouais Mohamed Ali', year: 2023, isWinner: true },
]
const ids = (selection: { _id: string }[]) => selection.map((film) => film._id)

test('year sorting keeps A Shell of Hate after 1001 Drag King in both directions', () => {
	for (const order of ['asc', 'desc']) {
		const expected = order === 'asc'
			? ['old', 'drag', 'shell', 'beast']
			: ['drag', 'shell', 'beast', 'old']
		// The edition and film queries return equal-year films in different orders.
		for (const source of [films, [...films].reverse()]) {
			const selection = sortFilmSelection(source, { language: 'fr', sort: 'year', order })
			assert.deepEqual(ids(selection), expected)
			assert.equal(selection[selection.findIndex((film) => film._id === 'drag') + 1]._id, 'shell')
		}
	}
	assert.equal(films[0]._id, 'beast', 'sorting must not mutate the source selection')
})

test('default and explicit title sorts agree, including links without query parameters', () => {
	assert.deepEqual(ids(sortFilmSelection(films, { language: 'fr' })), ['drag', 'shell', 'beast', 'old'])
	assert.deepEqual(ids(sortFilmSelection(films, { language: 'fr', sort: 'title', order: 'desc' })), ['old', 'beast', 'shell', 'drag'])
})

test('all sort modes and winner filtering ignore the order returned by the API', () => {
	for (const sort of ['title', 'director', 'year']) {
		for (const order of ['asc', 'desc']) {
			for (const winnersOnly of [false, true]) {
				const options = { language: 'fr', sort, order, winnersOnly }
				const selection = sortFilmSelection(films, options)
				assert.deepEqual(ids(selection), ids(sortFilmSelection([...films].reverse(), options)))
				assert.equal(selection.length, winnersOnly ? 3 : 4)
				if (winnersOnly) assert.ok(selection.every((film) => film.isWinner))
			}
		}
	}
	assert.deepEqual(ids(sortFilmSelection(films, { language: 'fr', sort: 'director' })), ['old', 'beast', 'shell', 'drag'])
})

test('localized rich-text titles break equal-year and equal-director ties', () => {
	const translations = [
		{ _id: 'a', year: 2023, director: textToRichText('Same director'), title: [
			{ language: 'fr', value: textToRichText('Zèbre') },
			{ language: 'nl', value: textToRichText('Aap') },
		] },
		{ _id: 'b', year: 2023, director: 'Same director', title: [
			{ language: 'fr', value: 'Abeille' },
			{ language: 'nl', value: 'Zebra' },
		] },
	]
	for (const sort of ['title', 'year', 'director']) {
		assert.deepEqual(ids(sortFilmSelection(translations, { language: 'fr', sort })), ['b', 'a'])
		assert.deepEqual(ids(sortFilmSelection(translations, { language: 'nl', sort })), ['a', 'b'])
	}
})

test('missing years and directors stay last, with deterministic ordering for duplicate titles', () => {
	const incomplete = [
		{ _id: 'b', title: 'Same', director: 'Same', year: 2023 },
		{ _id: 'missing', title: 'A missing value', director: '', year: null },
		{ _id: 'a', title: 'Same', director: 'Same', year: 2023 },
	]
	for (const sort of ['year', 'director']) {
		for (const order of ['asc', 'desc']) {
			assert.deepEqual(ids(sortFilmSelection(incomplete, { language: 'fr', sort, order })), ['a', 'b', 'missing'])
		}
	}
})
