export default function SkipToContent() {
	return (
		<a
			href="#main-content"
			className="absolute left-0 top-0 z-20 bg-canvas text-ink [&:not(:focus)]:sr-only"
			tabIndex={0}
		>
			Skip to content
		</a>
	)
}
