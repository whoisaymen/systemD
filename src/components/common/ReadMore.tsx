import { useState } from 'react'

interface ReadMoreProps {
	text: string
	link?: string
}

const ReadMore: React.FC<ReadMoreProps> = ({ text, link }) => {
	const [expanded, setExpanded] = useState(false)

	return (
		<div className="relative mt-2 rounded-md border-2 border-dark bg-[#fff] px-4 py-10 shadow-sm dark:bg-secondary sm:py-10">
			<p
				className={`mx-auto py-2 text-center text-xl font-bold leading-[1.2] tracking-tighter text-dark transition-all duration-300 sm:py-4 sm:text-4xl ${
					expanded ? 'max-h-full' : 'max-h-24 overflow-hidden'
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
				<div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-grayLight dark:to-dark sm:to-white"></div>
			)}

			{/* Read More Button */}
			<button
				onClick={() => setExpanded(!expanded)}
				className="absolute inset-x-0 z-40 mt-2 text-dark focus:outline-none"
			>
				{expanded ? 'Read Less' : 'Read More'}
			</button>
		</div>
	)
}

export default ReadMore
