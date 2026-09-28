import { richTextToPlainText } from '@/lib/richText'
import { richTextLines, richTextTileSeed } from '@/lib/richTextLines'

const creditTilts = [-3, 2, -2, 3, -4, 4]

export function photoCreditRotation(name: unknown, lineIndex = 0) {
	const index = (richTextTileSeed(name) + lineIndex) % creditTilts.length
	return `${creditTilts[index]}deg`
}

/** Keep the first word separate and the rest together, retaining editor marks. */
export function photoCreditNameParts(value: unknown) {
	const firstWord = richTextToPlainText(value).trim().match(/^\S+/)?.[0]
	if (!firstWord) return []
	const [first, ...rest] = richTextLines(value, Infinity, firstWord.length)
	return [first, rest.flat()].filter((part) => part?.length)
}
