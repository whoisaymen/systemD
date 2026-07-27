'use client'

interface NewArrowRightFullProps {
	theme: {
		fill?: string
		stroke?: string
		gradient?: string
	}
	className?: string
}

const NewArrowRightFull: React.FC<NewArrowRightFullProps> = ({
	theme,
	className,
}) => (
	<svg
		className={className}
		viewBox="0 0 76 61"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M46 9L67.5 30.5M67.5 30.5L46 52M67.5 30.5H8.5"
			stroke={theme.stroke}
			strokeWidth="13"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
)

export default NewArrowRightFull
