import { BehaviorPlugin } from '@portabletext/editor/plugins'
import type { BlockProps, PortableTextPluginsProps } from 'sanity'
import { CENTER_TEXT_MARK, textAlignmentBehavior } from '../lib/textAlignmentBehavior'

const behaviors = [textAlignmentBehavior]

export function TextAlignmentPlugins(props: PortableTextPluginsProps) {
	return (
		<>
			{props.renderDefault(props)}
			<BehaviorPlugin behaviors={behaviors} />
		</>
	)
}

export function AlignedTextBlock(props: BlockProps) {
	const children = props.value.children
	const centered = Array.isArray(children) && children.some((child) =>
		Array.isArray(child.marks) && child.marks.includes(CENTER_TEXT_MARK),
	)

	return (
		<div style={{ textAlign: centered ? 'center' : undefined }}>
			{props.renderDefault(props)}
		</div>
	)
}
