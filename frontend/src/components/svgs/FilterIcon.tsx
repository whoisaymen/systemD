interface FilterIconProps {
	theme: {
		upArrow?: string
		downArrow?: string
	}
	className?: string
}

const FilterIcon: React.FC<FilterIconProps> = ({ theme, className }) => (
	<svg
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		strokeWidth="1.8"
		strokeLinecap="round"
		strokeLinejoin="round"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
		focusable="false"
	>
		<path d="M7 20V4 M2.5 8.5 7 4l4.5 4.5" stroke={theme.upArrow} />
		<path d="M17 4v16 M12.5 15.5 17 20l4.5-4.5" stroke={theme.downArrow} />
	</svg>
)

export default FilterIcon
