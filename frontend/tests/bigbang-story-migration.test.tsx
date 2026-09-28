import assert from 'node:assert/strict'
import test from 'node:test'
import { restructureShortStoryBody } from '../../studio/migrations/lib/shortStoryBlocks'
import { localizedRichText, richTextToPlainText } from '../src/lib/richText'

const drawings = ['0 0 470 187', '0 0 469 186', '0 0 569 216', '0 0 638 603']
const legacyBody = () =>
	drawings.map((viewBox, index) => ({
		_key: `paragraph-${index}`,
		_type: 'customParagraph',
		text: ['fr', 'en', 'nl'].map((language) => ({
			_key: `translation-${language}-${index}`,
			_type: 'internationalizedArrayTextValue',
			language,
			value: `${language} paragraph ${index}`,
		})),
		svgMarkup: `<svg viewBox="${viewBox}"><path d="M0 0"/></svg>`,
		title: [{ _key: 'fr', value: 'Retired heading' }],
		image: { _type: 'image', asset: { _ref: `old-image-${index}` } },
	}))

test('story migration saves three independent illustrations with the circles before the closing text', () => {
	const source = legacyBody()
	const original = structuredClone(source)
	const result = restructureShortStoryBody(source)
	assert.deepEqual(source, original)
	assert.deepEqual(
		result.map((block) => block._key),
		[
			'paragraph-0',
			'paragraph-0-illustration',
			'paragraph-1',
			'paragraph-1-illustration',
			'paragraph-2',
			'paragraph-3-illustration',
			'paragraph-3',
		],
	)
	const illustrations = result.filter(
		(block) => block._type === 'storyIllustration',
	)
	assert.deepEqual(
		illustrations.map((block) => block.svgMarkup),
		[source[0].svgMarkup, source[1].svgMarkup, source[3].svgMarkup],
	)
	assert.deepEqual(
		illustrations.map((block) => block.size),
		['wide', 'wide', 'compact'],
	)
	result
		.filter((block) => block._type === 'customParagraph')
		.forEach((block, index) => {
			for (const language of ['fr', 'en', 'nl']) {
				assert.equal(
					richTextToPlainText(localizedRichText(block.text, language)),
					`${language} paragraph ${index}`,
				)
			}
			assert.equal(block.svgMarkup, undefined)
			assert.equal(block.image, undefined)
			assert.equal(block.title, undefined)
		})
	assert.deepEqual(restructureShortStoryBody(result), result)
})

test('later Studio reordering, sizes, and rich-text edits survive rerunning the migration', () => {
	const result = restructureShortStoryBody(legacyBody())
	const circles = result.splice(5, 1)[0]
	result.unshift(circles)
	circles.size = 'wide'
	const text = result.find((block) => block._key === 'paragraph-0')!
	text.text[0].value[0].children[0].text = 'Independently edited draft'
	text.text[0].value[0].children[0].marks = ['strong']
	result.push({ _key: 'new-empty-text', _type: 'customParagraph' })
	assert.deepEqual(restructureShortStoryBody(result), result)
	assert.notEqual(
		richTextToPlainText(
			localizedRichText(restructureShortStoryBody(legacyBody())[0].text, 'fr'),
		),
		'Independently edited draft',
	)
})

test('migration preserves unfamiliar illustrations and rejects colliding block keys', () => {
	const body = legacyBody()
	body[0].svgMarkup = '<svg viewBox="0 0 111 222"><circle r="10"/></svg>'
	assert.equal(restructureShortStoryBody(body)[1].svgMarkup, body[0].svgMarkup)
	assert.throws(
		() =>
			restructureShortStoryBody([
				...body,
				{ _key: 'paragraph-0-illustration', _type: 'storyIllustration' },
			]),
		/key already exists/,
	)
})
