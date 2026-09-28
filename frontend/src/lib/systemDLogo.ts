/** Mark brand mentions without changing the saved text or its existing annotations. */
export function markSystemDLogos(blocks: any[]): any[] {
	return blocks.map(block => ({
		...block,
		children: block.children?.flatMap((child: any, childIndex: number) => {
			if (child._type !== 'span' || typeof child.text !== 'string' || child.marks?.includes('systemDLogo')) return child
			return child.text.split(/((?<![\p{L}\p{N}_@])syst(?:em|ème)[\s_-]+d(?![\p{L}\p{N}_@]))/giu).filter(Boolean).map((text: string, index: number) => ({
				...child,
				_key: `${child._key ?? childIndex}-${index}`,
				text,
				marks: [...(child.marks ?? []), ...(/^syst(?:em|ème)[\s_-]+d$/iu.test(text) ? ['systemDLogo'] : [])],
			}))
		}),
	}))
}
