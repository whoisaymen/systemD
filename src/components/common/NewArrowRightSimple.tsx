'use client'

interface NewArrowRightSimpleProps {
	theme: {
		fill?: string
		stroke?: string
		gradient?: string
	}
	className?: string
}

const NewArrowRightSimple: React.FC<NewArrowRightSimpleProps> = ({
	theme,
	className,
}) => (
	<svg
		className={className}
		viewBox="0 0 39 61"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M9 9L30.5 30.5L9 52"
			stroke={theme.stroke}
			strokeWidth="12"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
)

export default NewArrowRightSimple
