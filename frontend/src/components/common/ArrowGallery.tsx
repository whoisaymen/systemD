'use client'

interface ArrowGalleryProps {
	theme: {
		fill?: string
		gradient?: string
	}
	className?: string
}

const ArrowGallery: React.FC<ArrowGalleryProps> = ({ theme, className }) => (
	<svg
		className={className}
		viewBox="0 0 44 52"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M0 46.6256L0 5.01436C0 1.08864 4.31691 -1.30581 7.64726 0.772662L40.9842 21.5783C44.1212 23.5361 44.1212 28.1039 40.9842 30.0617L7.64725 50.8673C4.3169 52.9458 0 50.5514 0 46.6256Z"
			fill={theme.fill}
		/>
	</svg>
)

export default ArrowGallery
