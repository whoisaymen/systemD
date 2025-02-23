import { useState } from 'react'

interface ReadMoreProps {
	text: string
	link?: string
}

const ReadMore: React.FC<ReadMoreProps> = ({ text, link }) => {
	const [expanded, setExpanded] = useState(false)

	return (
		<div className="relative px-0 sm:px-4">
			<p
				className={`transition-all duration-300 ${
					expanded ? 'max-h-full' : 'max-h-20 overflow-hidden'
				}`}
			>
				{text}

				{/* Press Link inside the paragraph, only if link exists and expanded */}
				{link && expanded && (
					<a
						href={link}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-4 inline-block text-dark underline"
					>
						Press Link
					</a>
				)}
			</p>

			{/* Fade effect only when collapsed */}
			{!expanded && (
				<div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-grayLight sm:to-white"></div>
			)}

			{/* Read More Button */}
			<button
				onClick={() => setExpanded(!expanded)}
				className="relative z-50 mt-2 text-grayDark underline focus:outline-none"
			>
				{expanded ? 'Read Less' : 'Read More'}
			</button>
		</div>
	)
}

export default ReadMore
