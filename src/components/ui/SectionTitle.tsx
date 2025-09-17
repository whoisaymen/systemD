'use client'

import React from 'react'

interface SectionTitleProps {
	text: string
	className?: string
}

const SectionTitle: React.FC<SectionTitleProps> = ({ text, className }) => {
	const words = text.split(' ')

	return (
		<div
			className={`flex flex-wrap items-center justify-center gap-3 ${className}`}
		>
			{words.map((word, wordIdx) => (
				<span key={wordIdx} className="inline-flex">
					{word.split('').map((char, charIdx) => {
						if (char === ' ') return <span key={charIdx}>&nbsp;</span>

						// Random vertical shift & font size variation
						const shiftY = Math.floor(Math.random() * 10) - 5 // -5px to 5px
						const scale = 1 + (Math.random() * 0.15 - 0.05) // 0.95–1.1

						return (
							<span
								key={charIdx}
								className="inline-block font-black uppercase italic text-primary"
								style={{
									fontSize: `${3.5 * scale}rem`, // base size ~3.5rem with variation
									marginTop: `${shiftY}px`,
									lineHeight: 1,
									textShadow: `
                    2px 2px 0 #555,
                    3px 3px 0 #555,
                    4px 4px 0 #555
                  `,
								}}
							>
								{char}
							</span>
						)
					})}
				</span>
			))}
		</div>
	)
}

export default SectionTitle
