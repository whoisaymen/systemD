import { defineBehavior, execute } from '@portabletext/editor/behaviors'
import { getSelectedTextBlocks } from '@portabletext/editor/selectors'
import type { ChildPath } from '@portabletext/editor'

export const CENTER_TEXT_MARK = 'alignCenter'

// Alignment belongs to the whole text block, even when only the caret or a
// few words are selected. Keep styles, annotations and other marks intact.
export const textAlignmentBehavior = defineBehavior({
	on: 'decorator.toggle',
	guard: ({ event, snapshot }) => {
		if (event.decorator !== CENTER_TEXT_MARK) return false
		const selection = event.at ?? snapshot.context.selection
		const blocks = getSelectedTextBlocks({
			...snapshot,
			context: { ...snapshot.context, selection },
		})
		return blocks.length ? blocks : false
	},
	actions: [(_, blocks) => {
		const centered = blocks.every(({ node }) =>
			node.children.some((child) =>
				Array.isArray(child.marks) && child.marks.includes(CENTER_TEXT_MARK),
			),
		)

		return blocks.flatMap(({ node, path }) => node.children.flatMap((child) => {
			if (typeof child.text !== 'string') return []
			const marks = (Array.isArray(child.marks) ? child.marks : [])
				.filter((mark) => mark !== CENTER_TEXT_MARK)
			if (!centered) marks.push(CENTER_TEXT_MARK)
			return [execute({
				type: 'child.set',
				at: [...path, 'children', { _key: child._key }] as ChildPath,
				props: { marks },
			})]
		}))
	}],
})
