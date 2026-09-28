import { ThemeContext } from 'styled-components'

interface ColorSwitchProps {
	theme: {
		left?: string
		right?: string
		stroke?: string
	}
	className?: string
}

const ColorSwitch: React.FC<ColorSwitchProps> = ({ theme, className }) => (
	<svg
		className={className}
		viewBox="0 0 100 100"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M0 50C0 22.3858 22.3858 0 50 0V100C22.3858 100 0 77.6142 0 50Z"
			fill={theme.left}
		/>
		<path
			d="M50 0C77.6142 0 100 22.3858 100 50C100 77.6142 77.6142 100 50 100V0Z"
			fill={theme.right}
		/>

		<circle
			cx="50"
			cy="50"
			r="49" // Slightly smaller than the viewBox to avoid clipping
			stroke={theme.stroke} // Border color
			strokeWidth="7" // Border thickness
			fill="none" // Transparent fill
		/>
	</svg>
)

export default ColorSwitch
