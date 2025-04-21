import LogoShortTsx from '@/components/svgs/LogoShort'

export const renderParagraph = (paragraph: any, titles: string[]) => {
	if (!paragraph?.value) return null

	// Define acceptable variations of "System D"
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

	return paragraph.value
		.split(
			new RegExp(`(${systemDVariations.join('|')})`, 'gi'), // Match any variation, case-insensitive
		)
		.map((part: string, index: number) => {
			const isTitle = titles.some(
				(title) => title.trim().toLowerCase() === part.trim().toLowerCase(),
			)
			const isSystemD = systemDVariations.some(
				(variation) => variation.toLowerCase() === part.trim().toLowerCase(),
			)

			return isSystemD ? (
				<LogoShortTsx
					key={index}
					className="mr-[0.10rem] inline-block h-auto w-[9rem] -rotate-6 rounded-md bg-dark px-2 py-1 text-primary dark:bg-dark sm:w-[15rem]"
				/>
			) : (
				<span key={index} className={isTitle ? 'font-bold' : ''}>
					{part}
				</span>
			)
		})
}
