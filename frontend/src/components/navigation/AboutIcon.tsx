import type { SVGProps } from 'react'

/** A circular information mark with a transparent, italic “i”. */
export default function AboutIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="2 2 60 60"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
			focusable="false"
			{...props}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M32 2a30 30 0 1 0 0 60 30 30 0 0 0 0-60Zm3.4 10.6a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2ZM25.2 28.4c3.2-2.6 11.2-3.6 14.2-1 1.6 1.8 1 5.2-.2 8.6l-3.4 9.2c-.8 2.1-.3 3.3 1.8 3.3 1.6 0 3.4-.9 4.6-1.8l-1 3.9c-2.8 1.9-7 3-10.4 2.4-4-.6-5.2-3.2-3.8-7.7l3.4-9.9c1-3.1.9-4.1-.6-4.1-1.7 0-3.3.7-5.6 2.1l1-5Z"
			/>
		</svg>
	)
}
