interface ExpressiveLetteringProps {
	className?: string
	text: string
}

const Y_OFFSETS = [0.02, -0.15, 0.07, -0.03, 0.16, -0.08, 0, 0.1]
const X_OFFSETS = [0, -0.04, 0.02, -0.02, 0.03, -0.03, 0.01, 0]
const X_SCALES = [1.08, 1.03, 1.1, 1.05, 1.09, 1.04, 1.07, 1.02]
const SCALES = [1.02, 0.96, 1.04, 0.99, 1.08, 0.97, 1.01, 0.95]

const ExpressiveLettering: React.FC<ExpressiveLetteringProps> = ({
	className,
	text,
}) => {
	const words = text.trim().split(/\s+/).filter(Boolean)
	let letterOffset = 0

	return (
		<span
			role="img"
			aria-label={text}
			className={`inline-flex w-fit flex-col items-start font-black uppercase italic leading-[0.78] tracking-[-0.035em] text-primary ${className ?? ''}`}
		>
			{words.map((word, wordIndex) => {
				const wordStart = letterOffset
				letterOffset += word.length

				return (
					<span
						key={`${word}-${wordIndex}`}
						aria-hidden="true"
						className={`flex w-fit whitespace-nowrap ${wordIndex > 0 ? '-mt-[0.04em]' : ''}`}
					>
						{Array.from(word).map((letter, letterIndex) => {
							const patternIndex = (wordStart + letterIndex) % Y_OFFSETS.length

							return (
								<span
									key={`${letter}-${letterIndex}`}
									className="relative mr-[0.025em] inline-block last:mr-0"
									style={{
										fontWeight: 900,
										transform: `translate(${X_OFFSETS[patternIndex]}em, ${Y_OFFSETS[patternIndex]}em) scale(${SCALES[patternIndex]}) scaleX(${X_SCALES[patternIndex]})`,
									}}
								>
									<span
										aria-hidden="true"
										className="pointer-events-none absolute inset-0 text-transparent"
										style={{
											WebkitTextStroke: '0.065em var(--color-dark)',
										}}
									>
										{letter}
									</span>
									<span className="relative">{letter}</span>
								</span>
							)
						})}
					</span>
				)
			})}
		</span>
	)
}

export default ExpressiveLettering
