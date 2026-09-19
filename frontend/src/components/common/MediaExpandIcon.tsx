export default function MediaExpandIcon({ expanded = false }: { expanded?: boolean }) {
	return (
		<svg
			aria-hidden="true"
			className="h-[1.8rem] w-[1.8rem]"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M9 6v12 M15 6v12" />
			<path
				d={expanded
					? 'M2 12h5.5 M22 12h-5.5 M4.5 9l3 3-3 3 M19.5 9l-3 3 3 3'
					: 'M9 12H2 M15 12h7 M5 9l-3 3 3 3 M19 9l3 3-3 3'}
			/>
		</svg>
	)
}
