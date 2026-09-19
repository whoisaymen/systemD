import assert from 'node:assert/strict'
import test from 'node:test'
import { mergeFestivalDescription } from '../../studio/migrations/lib/festivalDescription'

const block = (text: string, key = 'paragraph') => ({
	_key: key,
	_type: 'block',
	style: 'normal',
	markDefs: [],
	children: [{ _key: 'span', _type: 'span', text, marks: [] }],
})

test('merges the 2023 lead and body per language, preserving marks and links', () => {
	const body = {
		...block('Body'),
		markDefs: [{ _key: 'link', _type: 'link', href: '/fr/festival' }],
		children: [
			{ _key: 'span', _type: 'span', text: 'Body', marks: ['strong', 'link'] },
		],
	}
	const source = {
		year: 2023,
		description: [{ _key: 'fr-entry', language: 'fr', value: 'Opening' }],
		text: {
			_type: 'internationalizedBlock',
			fr: [body],
			nl: [block('Dutch body')],
		},
	}
	const before = structuredClone(source)
	const next = mergeFestivalDescription(source)
	assert.equal(next.description[0].value[0].style, 'h2')
	assert.deepEqual(next.description[0].value[1], body)
	assert.equal(next.description[0]._key, 'fr-entry')
	assert.equal(next.description[0]._type, 'internationalizedArrayRichTextValue')
	assert.deepEqual(next.description[1].value, [block('Dutch body')])
	assert.equal(next.text, undefined)
	assert.deepEqual(source, before)
	assert.deepEqual(mergeFestivalDescription(next), next)
})

test('keeps draft and published copy independent and preserves chosen heading styles', () => {
	const published = {
		year: 2023,
		description: [{ language: 'fr', _key: 'fr', value: 'Published' }],
		text: { fr: [block('Published body')] },
	}
	const draft = {
		...published,
		description: [
			{
				language: 'fr',
				_key: 'fr',
				value: [{ ...block('Draft lead'), style: 'h3' }],
			},
		],
		text: { fr: [block('Draft body')] },
	}
	assert.equal(
		mergeFestivalDescription(published).description[0].value[0].children[0]
			.text,
		'Published',
	)
	assert.equal(
		mergeFestivalDescription(draft).description[0].value[0].style,
		'h3',
	)
	assert.equal(
		mergeFestivalDescription(draft).description[0].value[1].children[0].text,
		'Draft body',
	)
})

test('retains body-only editions and avoids duplicate block keys', () => {
	const description = [
		{
			_key: 'en',
			language: 'en',
			_type: 'internationalizedArrayRichTextValue',
			value: [block('Intro')],
		},
	]
	const existing = { year: 2021, description }
	assert.deepEqual(mergeFestivalDescription(existing), existing)
	const merged = mergeFestivalDescription({
		...existing,
		text: { en: [block('More'), block('Again', 'body-paragraph')] },
	})
	assert.deepEqual(
		merged.description[0].value.map((item: any) => item.children[0].text),
		['Intro', 'More', 'Again'],
	)
	assert.equal(
		new Set(merged.description[0].value.map((item: any) => item._key)).size,
		3,
	)
	assert.equal(merged.description[0].value[0].style, 'normal')
})
