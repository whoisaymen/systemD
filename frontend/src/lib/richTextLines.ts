import { richTextToPlainText, textToRichText } from '@/lib/richText'

const wordTilePatterns = [
	[1, 3, 2],
	[2, 1, 3],
	[3, 1, 2],
	[1, 2, 3],
	[2, 3, 1],
	[3, 2, 1],
]

/** Keep the playful arrangement stable across server rendering and hydration. */
export function richTextTileSeed(value: any): number {
	let seed = 0
	for (const character of richTextToPlainText(value)) {
		seed = (Math.imul(seed, 31) + character.charCodeAt(0)) >>> 0
	}
	return seed
}

/** Vary one-to-three-word tiles without discarding editor marks or links. */
export function richTextWordTiles(value: any): any[][] {
	return textToRichText(value).flatMap((block: any) => {
		const children = block.children ?? []
		const text = children.map((child: any) => child.text ?? '').join('')
		const words = Array.from(text.matchAll(/\S+/g)) as RegExpMatchArray[]
		const pattern = wordTilePatterns[richTextTileSeed([block]) % wordTilePatterns.length]
		const tiles: any[][] = []
		let wordIndex = 0
		while (wordIndex < words.length) {
			const start = words[wordIndex].index!
			const count = Math.min(
				pattern[tiles.length % pattern.length],
				words.length - wordIndex,
			)
			const lastWord = words[wordIndex + count - 1]
			const end = lastWord.index! + lastWord[0].length
			let offset = 0
			const wordChildren = children.flatMap((child: any, index: number) => {
				const childText = child.text ?? ''
				const childStart = offset
				offset += childText.length
				const from = Math.max(start, childStart)
				const to = Math.min(end, offset)
				return from < to
					? [
							{
								...child,
								_key: child._key ?? `span-${index}`,
								text: childText.slice(from - childStart, to - childStart),
							},
						]
					: []
			})
			tiles.push([{ ...block, children: wordChildren }])
			wordIndex += count
		}
		return tiles
	})
}

/** Wrap title pills without discarding editor marks or link annotations. */
export function richTextLines(value: any, maxLength: number): any[][] {
	const result: any[][] = []
	for (const block of textToRichText(value)) {
		const children = block.children ?? []
		const text = children.map((child: any) => child.text ?? '').join('')
		let start = 0
		while (start < text.length) {
			while (/\s/.test(text[start] ?? '') && start < text.length) start++
			if (start >= text.length) break
			let end = text.length
			if (end - start > maxLength) {
				const space = text.lastIndexOf(' ', start + maxLength)
				end = space > start ? space : start + maxLength
			}
			let trimmedEnd = end
			while (trimmedEnd > start && /\s/.test(text[trimmedEnd - 1])) trimmedEnd--
			let offset = 0
			const lineChildren = children.flatMap((child: any, index: number) => {
				const childText = child.text ?? ''
				const childStart = offset
				offset += childText.length
				const from = Math.max(start, childStart)
				const to = Math.min(trimmedEnd, offset)
				return from < to
					? [
							{
								...child,
								_key: child._key ?? `span-${index}`,
								text: childText.slice(from - childStart, to - childStart),
							},
						]
					: []
			})
			if (lineChildren.length)
				result.push([{ ...block, children: lineChildren }])
			start = end
		}
	}
	return result
}
