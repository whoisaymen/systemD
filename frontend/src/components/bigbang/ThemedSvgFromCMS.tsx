import React from 'react'

export const ThemedSvgFromCMS: React.FC<{
	svg: string
	color?: string
	className?: string
}> = ({ svg, color = 'var(--color-primary)', className }) => (
	<span
		className={className}
		style={{ color, display: 'inline-block', lineHeight: 0 }}
		dangerouslySetInnerHTML={{ __html: svg }}
		aria-hidden="true"
	/>
)
