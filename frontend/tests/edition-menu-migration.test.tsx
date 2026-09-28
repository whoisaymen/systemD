import assert from 'node:assert/strict'
import test from 'node:test'
import {
	planEditionMenuMigration,
	retiredEditionMenuFields,
} from '../../studio/migrations/lib/editionMenu'
import { localizeText } from '../../studio/migrations/lib/editorialContent'
import { seedFestivalContent } from '../../studio/migrations/lib/festivalSeeds'
import { localizedRichText, richTextToPlainText } from '../src/lib/richText'

const memoire = {
	_id: 'memoire',
	_type: 'memoire',
	description: 'Published introduction',
}
const draftMemoire = {
	_id: 'drafts.memoire',
	_type: 'memoire',
	description: 'Draft introduction',
}
const title = (menu: any, field: string, locale = 'en') =>
	richTextToPlainText(localizedRichText(menu[field], locale))
function applyPlans(documents: any[]) {
	const plans = planEditionMenuMigration(documents)
	return documents.map((document) => {
		const plan = plans.find((item) => item.document._id === document._id)
		const next = { ...document, ...plan?.set }
		for (const field of plan?.unset ?? []) delete next[field]
		return next
	})
}

test('moves shared labels, renames the exhibition, preserves formatting and unrelated content, and is idempotent', () => {
	const exhibitionTitle: any[] = localizeText({
		en: 'Photo Exhibition',
		fr: 'Expo Photo',
		nl: 'Foto-expo',
	})
	exhibitionTitle[0].value[0].children = [
		{ _type: 'span', _key: 'photo', text: 'Photo ', marks: [] },
		{
			_type: 'span',
			_key: 'exhibition',
			text: 'Exhibition',
			marks: ['strong'],
		},
	]
	const edition = {
		_id: 'edition',
		_type: 'festival',
		year: 2023,
		filmsTitle: localizeText({ en: 'Our films', fr: 'Nos films' }),
		exhibitionTitle,
		overviewTitle: localizeText({ en: 'Overview' }),
		photoGallery: [
			{
				_key: 'gallery',
				photos: [{ _key: 'photo', asset: { _ref: 'image-asset' } }],
			},
		],
	}
	const before = structuredClone(edition)
	const [savedMemoire, savedEdition] = applyPlans([memoire, edition])
	assert.equal(title(savedMemoire.menu, 'exhibitionTitle'), 'Exhibition')
	assert.equal(title(savedMemoire.menu, 'exhibitionTitle', 'fr'), 'Exposition')
	assert.equal(
		title(savedMemoire.menu, 'exhibitionTitle', 'nl'),
		'Tentoonstelling',
	)
	assert.deepEqual(
		savedMemoire.menu.exhibitionTitle[0].value[0].children[1].marks,
		['strong'],
	)
	assert.equal(title(savedMemoire.menu, 'filmsTitle'), 'Our films')
	assert.deepEqual(savedMemoire.menu.filmsTitle.slice(0, 2), edition.filmsTitle)
	assert.deepEqual(savedEdition.photoGallery, edition.photoGallery)
	assert.equal(savedMemoire.description, memoire.description)
	for (const field of retiredEditionMenuFields)
		assert.equal(savedEdition[field], undefined)
	assert.deepEqual(edition, before)
	assert.deepEqual(planEditionMenuMigration([savedMemoire, savedEdition]), [])
})

test('keeps unpublished labels in the La Mémoire draft and does not publish draft content', () => {
	const published = {
		_id: 'edition',
		_type: 'festival',
		filmsTitle: localizeText({ en: 'Published films' }),
	}
	const draft = {
		...published,
		_id: 'drafts.edition',
		filmsTitle: localizeText({ en: 'Draft films' }),
	}
	const saved = applyPlans([memoire, draftMemoire, published, draft])
	assert.equal(title(saved[0].menu, 'filmsTitle'), 'Published films')
	assert.equal(title(saved[1].menu, 'filmsTitle'), 'Draft films')
	assert.equal(saved[1].description, 'Draft introduction')
	assert.deepEqual(planEditionMenuMigration(saved), [])
})

test('merges missing translations, supports legacy language keys, and respects existing shared labels', () => {
	const documents = [
		{
			...memoire,
			menu: { filmsTitle: localizeText({ en: 'Shared films', nl: '' }) },
		},
		{
			_id: 'older',
			_type: 'festival',
			year: 2021,
			filmsTitle: [
				{ _key: 'en', value: 'Old films' },
				{ _key: 'fr', value: 'Cinéma' },
			],
		},
		{
			_id: 'newer',
			_type: 'festival',
			year: 2023,
			photosTitle: localizeText({ en: 'Our photos' }),
		},
	]
	const [saved] = applyPlans(documents)
	assert.equal(title(saved.menu, 'filmsTitle'), 'Shared films')
	assert.equal(title(saved.menu, 'filmsTitle', 'fr'), 'Cinéma')
	assert.equal(title(saved.menu, 'filmsTitle', 'nl'), '')
	assert.equal(title(saved.menu, 'photosTitle'), 'Our photos')
})

test('refuses conflicting per-edition translations before removing them', () => {
	assert.throws(
		() =>
			planEditionMenuMigration([
				memoire,
				{
					_id: 'one',
					_type: 'festival',
					filmsTitle: localizeText({ en: 'One' }),
				},
				{
					_id: 'two',
					_type: 'festival',
					filmsTitle: localizeText({ en: 'Two' }),
				},
			]),
		/Conflicting edition labels for filmsTitle.en/,
	)
})

test('editorial seeds only create shared labels and never reintroduce edition fields', () => {
	const edition = { _id: 'edition', _type: 'festival', year: 2023 }
	assert.deepEqual(seedFestivalContent(edition), edition)
	const seeded = seedFestivalContent(memoire)
	assert.equal(title(seeded.menu, 'exhibitionTitle'), 'Exhibition')
	assert.deepEqual(seedFestivalContent(seeded), seeded)
})
