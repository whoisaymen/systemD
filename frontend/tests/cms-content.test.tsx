import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import RichText from '../src/components/common/RichText'
import { filmTextLines } from '../src/components/film/filmTextLines'
import { richTextWordTiles } from '../src/lib/richTextLines'
import {
	localizedRichText,
	richTextToPlainText,
	safeRichTextHref,
	textToRichText,
} from '../src/lib/richText'
import {
	changedFields,
	migrateEditorialValue,
} from '../../studio/migrations/lib/editorialContent'

const blocks = [
	{
		_type: 'block',
		_key: 'intro',
		style: 'normal',
		markDefs: [
			{
				_type: 'link',
				_key: 'website',
				href: 'https://example.com',
				blank: true,
			},
		],
		children: [
			{
				_type: 'span',
				_key: 'one',
				text: 'Our vision',
				marks: ['strong', 'em', 'website'],
			},
		],
	},
]

test('localized copy supports legacy keys, current language IDs, and explicit empty values', () => {
	assert.equal(
		localizedRichText(
			[
				{ _key: 'random', language: 'fr', value: 'Bonjour' },
				{ _key: 'en', value: 'Hello' },
			],
			'fr',
		),
		'Bonjour',
	)
	assert.equal(
		localizedRichText(
			[
				{ _key: 'fr', value: '' },
				{ _key: 'en', value: 'Hello' },
			],
			'fr',
		),
		'',
	)
	assert.deepEqual(localizedRichText({ fr: blocks }, 'fr'), blocks)
	assert.deepEqual(localizedRichText(blocks, 'nl'), blocks)
	assert.equal(richTextToPlainText(blocks), 'Our vision')
	assert.equal(
		richTextToPlainText(textToRichText('First\nline\n\nSecond paragraph')),
		'First\nline\n\nSecond paragraph',
	)
})

test('renderer preserves bold, italic, links and block layout', () => {
	const html = renderToStaticMarkup(<RichText value={blocks} />)
	assert.match(html, /<strong[^>]*>/)
	assert.match(html, /<em[^>]*>/)
	assert.match(html, /href="https:\/\/example.com"/)
	assert.match(html, /rel="noopener noreferrer"/)
	assert.match(html, /<p /)
	const list = renderToStaticMarkup(
		<RichText value={[{ ...blocks[0], listItem: 'bullet', level: 1 }]} />,
	)
	assert.match(list, /<ul /)
	assert.match(list, /<li>/)
	const heading = renderToStaticMarkup(
		<RichText value={[{ ...blocks[0], style: 'h2' }]} />,
	)
	assert.match(heading, /<h2 /)
})

test('inline content avoids block markup and nested links in clickable cards', () => {
	const html = renderToStaticMarkup(
		<a href="/festival">
			<RichText value={blocks} inline allowLinks={false} />
		</a>,
	)
	assert.equal((html.match(/<a /g) ?? []).length, 1)
	assert.doesNotMatch(html, /<(p|div|ul|li|h2)[ >]/)
	assert.match(html, /<strong/)
})

test('film title wrapping preserves legacy text and marks across pill boundaries', () => {
	const title = [
		{
			...blocks[0],
			children: [
				{ _type: 'span', _key: 'first', text: 'Alpha ', marks: ['strong'] },
				{
					_type: 'span',
					_key: 'second',
					text: 'Beta Gamma',
					marks: ['em', 'website'],
				},
			],
		},
	]
	const original = structuredClone(title)
	const lines = filmTextLines(title, 7)
	assert.deepEqual(lines.map(richTextToPlainText), ['Alpha', 'Beta', 'Gamma'])
	assert.deepEqual(
		filmTextLines('Alpha Beta Gamma', 7).map(richTextToPlainText),
		['Alpha', 'Beta', 'Gamma'],
	)
	assert.deepEqual(lines[0][0].children[0].marks, ['strong'])
	for (const line of lines.slice(1)) {
		assert.deepEqual(line[0].children[0].marks, ['em', 'website'])
		assert.deepEqual(line[0].markDefs, title[0].markDefs)
		const html = renderToStaticMarkup(<RichText value={line} inline />)
		assert.match(html, /<em[^>]*>/)
		assert.match(html, /href="https:\/\/example.com"/)
	}
	assert.deepEqual(title, original)
})

test('film title wrapping handles empty copy, long words, and separate paragraphs', () => {
	assert.deepEqual(filmTextLines(undefined, 7), [])
	assert.deepEqual(filmTextLines('   ', 7), [])
	assert.deepEqual(filmTextLines('ABCDEFGHIJ', 4).map(richTextToPlainText), [
		'ABCD',
		'EFGH',
		'IJ',
	])
	assert.deepEqual(
		filmTextLines('First\n\nSecond', 20).map(richTextToPlainText),
		['First', 'Second'],
	)
})

test('rich links accept site paths, email and telephone but reject executable URLs', () => {
	for (const href of [
		'/fr/contact',
		'#vision',
		'mailto:info@example.com',
		'tel:+321234',
	])
		assert.equal(safeRichTextHref(href), href)
	for (const href of [
		'javascript:alert(1)',
		'data:text/html,test',
		'//example.com',
		'java\nscript:alert(1)',
	])
		assert.equal(safeRichTextHref(href), undefined)
	const html = renderToStaticMarkup(
		<RichText
			value={[
				{
					...blocks[0],
					markDefs: [
						{ _key: 'website', _type: 'link', href: 'javascript:alert(1)' },
					],
				},
			]}
		/>,
	)
	assert.doesNotMatch(html, /<a /)
})

test('migration follows nested schemas, preserves annotations and IDs, and is idempotent', () => {
	const types = new Map<string, any>([
		[
			'page',
			{
				type: 'document',
				fields: [
					{ name: 'title', type: 'internationalizedArrayRichText' },
					{ name: 'blocks', type: 'array', of: [{ type: 'visionBlock' }] },
					{ name: 'slug', type: 'slug' },
				],
			},
		],
		[
			'visionBlock',
			{
				type: 'object',
				fields: [
					{ name: 'text', type: 'internationalizedArrayRichText' },
					{ name: 'author', type: 'array', of: [{ type: 'block' }] },
				],
			},
		],
	])
	const document = {
		_id: 'drafts.page',
		_rev: 'original',
		title: [
			{
				_key: 'fr',
				_type: 'internationalizedArrayStringValue',
				value: 'Bonjour\n\nSuite',
			},
		],
		blocks: [
			{
				_type: 'visionBlock',
				_key: 'stable-key',
				text: [{ _key: 'entry', language: 'fr', value: blocks }],
				author: 'A person',
			},
		],
		slug: { current: 'stay-unchanged' },
	}
	const migrated = migrateEditorialValue(document, { type: 'page' }, types)
	assert.equal(migrated._id, document._id)
	assert.equal(migrated._rev, document._rev)
	assert.equal(migrated.title[0].language, 'fr')
	assert.equal(migrated.title[0]._type, 'internationalizedArrayRichTextValue')
	assert.equal(migrated.title[0].value.length, 2)
	assert.equal(migrated.blocks[0]._key, 'stable-key')
	assert.deepEqual(migrated.blocks[0].text[0].value, blocks)
	assert.equal(richTextToPlainText(migrated.blocks[0].author), 'A person')
	assert.deepEqual(migrated.slug, document.slug)
	assert.deepEqual(
		migrateEditorialValue(migrated, { type: 'page' }, types),
		migrated,
	)
	assert.deepEqual(Object.keys(changedFields(document, migrated)), [
		'title',
		'blocks',
	])
	assert.equal(typeof document.title[0].value, 'string')
})

test('migration preserves older plain and locale-object content shapes', () => {
	const schema = { type: 'internationalizedArrayRichText' }
	const fromString = migrateEditorialValue('Original copy', schema, new Map())
	assert.equal(fromString.length, 3)
	assert.equal(
		richTextToPlainText(localizedRichText(fromString, 'nl')),
		'Original copy',
	)
	const fromObject = migrateEditorialValue(
		{ fr: blocks, nl: 'Tekst' },
		schema,
		new Map(),
	)
	assert.deepEqual(localizedRichText(fromObject, 'fr'), blocks)
	assert.equal(
		richTextToPlainText(localizedRichText(fromObject, 'nl')),
		'Tekst',
	)
})

test('vision migration merges the heading into the prose editor exactly once', () => {
	const types = new Map<string, any>([
		[
			'visionBlock',
			{
				type: 'object',
				fields: [{ name: 'text', type: 'internationalizedArrayRichText' }],
			},
		],
	])
	const original = {
		_type: 'visionBlock',
		_key: 'vision',
		title: [{ _key: 'fr', value: 'Our heading' }],
		text: [{ _key: 'fr', value: blocks }],
	}
	const result = migrateEditorialValue(original, { type: 'visionBlock' }, types)
	assert.equal(result.title, undefined)
	assert.equal(result.text[0].value[0].style, 'titleLabel')
	assert.equal(
		richTextToPlainText(result.text[0].value),
		'Our heading\n\nOur vision',
	)
	assert.deepEqual(result.text[0].value[1].markDefs, blocks[0].markDefs)
	assert.deepEqual(
		migrateEditorialValue(result, { type: 'visionBlock' }, types),
		result,
	)
	assert.ok(original.title)
})

test('retired titles are removed without injecting unseen text into the page', () => {
	const types = new Map<string, any>([
		[
			'memoire',
			{
				type: 'document',
				fields: [
					{ name: 'description', type: 'internationalizedArrayRichText' },
				],
			},
		],
	])
	const result = migrateEditorialValue(
		{
			_type: 'memoire',
			title: 'Previously invisible',
			description: [{ _key: 'fr', value: blocks }],
		},
		{ type: 'memoire' },
		types,
	)
	assert.equal(result.title, undefined)
	assert.equal(richTextToPlainText(result.description[0].value), 'Our vision')
})

test('migration converts inline array objects with legacy implicit type names', () => {
	const schema = {
		type: 'array',
		of: [
			{
				type: 'object',
				fields: [
					{ name: 'artistName', type: 'array', of: [{ type: 'block' }] },
				],
			},
		],
	}
	const value = [
		{ _key: 'photo', _type: 'legacyPhoto', artistName: 'Photographer' },
	]
	const result = migrateEditorialValue(value, schema, new Map())
	assert.equal(richTextToPlainText(result[0].artistName), 'Photographer')
	assert.ok(Array.isArray(result[0].artistName))
	assert.equal(result[0]._key, 'photo')
})

test('label headings preserve links and emphasis within phrase tiles', () => {
	const title = [{
		...blocks[0],
		style: 'titleLabel',
		children: [{ ...blocks[0].children[0], text: 'Artistic response to political problems' }],
	}]
	const html = renderToStaticMarkup(<RichText value={title} />)
	assert.match(html, /<h3/)
	assert.match(html, /bg-primary/)
	assert.match(html, /<strong/)
	const tiles = richTextWordTiles(title)
	assert.equal(tiles.map(richTextToPlainText).join(' '), 'Artistic response to political problems')
	assert.deepEqual(richTextWordTiles(title), tiles)
	assert.equal((html.match(/href="https:\/\/example.com"/g) ?? []).length, tiles.length)
	assert.equal((html.match(/<strong/g) ?? []).length, tiles.length)
	const inline = renderToStaticMarkup(<RichText value={title} inline allowLinks={false} />)
	assert.doesNotMatch(inline, /<h3|<a /)
})

test('vision style upgrade preserves manually chosen headings and existing marks', () => {
	const types = new Map<string, any>([['visionBlock', { type: 'object', fields: [{ name: 'text', type: 'internationalizedArrayRichText' }] }]])
	const source = { _type: 'visionBlock', text: [{ _key: 'en', language: 'en', value: [{ ...blocks[0], _key: 'heading-0', style: 'h3' }, { ...blocks[0], _key: 'manual', style: 'h3' }] }] }
	const result = migrateEditorialValue(source, { type: 'visionBlock' }, types)
	assert.equal(result.text[0].value[0].style, 'titleLabel')
	assert.equal(result.text[0].value[1].style, 'h3')
	assert.deepEqual(result.text[0].value[0].markDefs, blocks[0].markDefs)
	assert.deepEqual(migrateEditorialValue(result, { type: 'visionBlock' }, types), result)
})

test('plain section labels migrate all translations without losing their identifiers', () => {
	const source = [{ _key: 'en', language: 'en', value: blocks }]
	const schema = { type: 'internationalizedArrayString' }
	const result = migrateEditorialValue(source, schema, new Map())
	assert.equal(result[0].value, 'Our vision')
	assert.equal(result[0]._type, 'internationalizedArrayStringValue')
	assert.equal(result[0]._key, 'en')
	assert.deepEqual(migrateEditorialValue(result, schema, new Map()), result)
})

test('rich text renders brand variants as accessible logo pills while preserving links and emphasis', () => {
	const value = [{ ...blocks[0], children: [{ _type: 'span', _key: 'brand', text: 'System D, System_D, Système-D.', marks: ['strong', 'em', blocks[0].markDefs[0]._key] }] }]
	const html = renderToStaticMarkup(<RichText value={value} />)
	assert.equal((html.match(/data-system-d-logo/g) ?? []).length, 3)
	assert.equal((html.match(/aria-label="System D"/g) ?? []).length, 3)
	assert.match(html, /<strong/)
	assert.match(html, /<em/)
	assert.match(html, /href=/)
	assert.equal((renderToStaticMarkup(<RichText value="System Design and system_d_archive" />).match(/data-system-d-logo/g) ?? []).length, 0)
})
