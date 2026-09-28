import { migrateEditorialValue } from './editorialContent'
import { localizedRichTextPreview } from '../../src/sanity/lib/richTextPreview'

type StoryBlock = { _key: string; _type: string; [field: string]: any }

const illustrationLabels: Record<string, string> = {
	'0 0 470 187': 'Planète — Viseur',
	'0 0 469 186': 'Tuiles en orbite',
	'0 0 638 603': 'Cercles — Écosystème',
}

/** One-time content migration. Rendering then follows the saved order directly. */
export function restructureShortStoryBody(body: StoryBlock[]): StoryBlock[] {
	const usedKeys = new Set(body.map((block) => block._key))
	if (usedKeys.size !== body.length)
		throw new Error('Duplicate short-story block keys')

	return body.flatMap((block): StoryBlock[] => {
		if (block._type !== 'customParagraph') return [block]

		const textBlock = migrateEditorialValue(
			block,
			{
				type: 'customParagraph',
				fields: [{ name: 'text', type: 'internationalizedArrayRichText' }],
			},
			new Map(),
		) as StoryBlock
		delete textBlock.svgMarkup
		const textBlocks =
			textBlock.text === undefined && Object.hasOwn(block, 'svgMarkup')
				? []
				: [textBlock]
		const markup = block.svgMarkup
		if (typeof markup !== 'string' || !markup.trim()) return textBlocks

		const viewBox = markup
			.match(/\bviewBox\s*=\s*["']([^"']+)["']/)?.[1]
			.trim()
			.split(/[\s,]+/)
			.map(Number)
			.join(' ')
		// Remove only the retired drawing, preserving its paragraph and translations.
		if (viewBox === '0 0 569 216') return textBlocks

		const key = `${block._key}-illustration`
		if (usedKeys.has(key))
			throw new Error(`Illustration key already exists: ${key}`)
		usedKeys.add(key)
		const ecosystem = viewBox === '0 0 638 603'
		const illustration: StoryBlock = {
			_key: key,
			_type: 'storyIllustration',
			label:
				(viewBox && illustrationLabels[viewBox]) ||
				localizedRichTextPreview(block.title) ||
				'Illustration',
			size: ecosystem ? 'compact' : 'wide',
			svgMarkup: markup,
		}
		return ecosystem
			? [illustration, ...textBlocks]
			: [...textBlocks, illustration]
	})
}
