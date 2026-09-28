import type { BlockStyleProps } from 'sanity'

export function TitleLabelStyle({ children }: BlockStyleProps) {
	return (
		<div style={{ textAlign: 'center', padding: '0.5em 0' }}>
			<span style={{ display: 'inline-block', transform: 'rotate(-3deg)', border: '1px solid currentColor', borderRadius: 4, padding: '0.15em 0.5em', fontWeight: 500 }}>
				{children}
			</span>
		</div>
	)
}
