import LogoShortTsx from '@/components/svgs/LogoShort'
import RichText from './RichText'

export const renderParagraph = (
	paragraph: any,
	titles: string[],
	logoStyle?: string,
) => {
	if (!paragraph?.value) return null
	if (Array.isArray(paragraph.value)) {
		// A mark keeps the surrounding bold/italic/link annotations on the logo.
		const blocks = paragraph.value.map((block: any, blockIndex: number) => ({
			...block,
			children: block.children?.flatMap((child: any, childIndex: number) => {
				if (child._type !== 'span' || typeof child.text !== 'string')
					return child
				return child.text
					.split(/(\bsyst(?:em|ème)[ _-]d\b)/gi)
					.filter(Boolean)
					.map((text: string, index: number) => ({
						...child,
						_key: `${child._key ?? `${blockIndex}-${childIndex}`}-${index}`,
						text,
						marks: [
							...(child.marks ?? []),
							...(/^syst(?:em|ème)[ _-]d$/i.test(text) ? ['systemDLogo'] : []),
						],
					}))
			}),
		}))
		return (
			<RichText
				value={blocks}
				components={{
					marks: {
						systemDLogo: () => (
							<>{renderParagraph({ value: 'System D' }, titles, logoStyle)}</>
						),
					},
				}}
			/>
		)
	}
	if (typeof paragraph.value !== 'string') return null

	const systemDVariations = [
		'system d',
		'system_d',
		'system-d',
		'système d',
		'système_d',
		'système-d',
		'SYSTEM D',
		'SYSTEM_D',
		'SYSTEM-D',
		'SYSTÈME D',
		'SYSTÈME_D',
		'SYSTÈME-D',
	]

	// Define a few fun rotation classes
	const rotations = [
		'-rotate-6',
		'-rotate-3',
		'rotate-12',
		'-rotate-12',
		'rotate-3',
		'rotate-6',
	]

	return paragraph.value
		.split(new RegExp(`(${systemDVariations.join('|')})`, 'gi'))
		.map((part: string, index: number) => {
			const isTitle = titles.some(
				(title) => title.trim().toLowerCase() === part.trim().toLowerCase(),
			)

			// Check if the part matches a System D variation and is not part of another word
			const isSystemD =
				systemDVariations.some(
					(variation) => variation.toLowerCase() === part.trim().toLowerCase(),
				) &&
				// Ensure it's surrounded by spaces, punctuation, or is at the start/end of the string
				/^\s*$|[\s.,!?;:"'(){}\[\]]/.test(
					paragraph.value[paragraph.value.indexOf(part) - 1] || ' ',
				) &&
				/^\s*$|[\s.,!?;:"'(){}\[\]]/.test(
					paragraph.value[paragraph.value.indexOf(part) + part.length] || ' ',
				)

			if (isSystemD) {
				const rotation = rotations[index % rotations.length]

				return (
					<span
						key={index}
						role="img"
						aria-label="System D"
						data-system-d-logo
						className="relative z-10 mx-[0.06em] inline-block align-[-0.08em] leading-none"
					>
						<LogoShortTsx
							className={`box-content inline-block h-[0.72em] w-auto rounded-[0.12em] px-[0.16em] py-[0.07em] ${rotation} ${logoStyle ?? ''}`}
						/>
					</span>
				)
			}

			return (
				<span key={index} className={isTitle ? 'font-bold' : ''}>
					{part}
				</span>
			)
		})
}
