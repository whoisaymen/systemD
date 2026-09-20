import { richTextTileSeed } from '@/lib/richTextLines'

const creditTilts = [-3, 2, -2, 3, -4, 4]

export function photoCreditRotation(name: unknown, lineIndex = 0) {
	const index = (richTextTileSeed(name) + lineIndex) % creditTilts.length
	return `${creditTilts[index]}deg`
}
