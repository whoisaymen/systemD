import Img from '@/ui/Img'
import Link from 'next/link'
import LogoShortTsx from '../svgs/LogoShort'

const ShortStory = ({ content, lang }: { content: any; lang: any }) => {
	return (
		<div className="flex flex-col space-y-32">
			{content.map((block: any) => (
				<div
					key={block._key}
					className="flex w-full flex-col items-center justify-center space-y-12 text-center"
				>
					{/* {block.title && (
						<div>
							{block.title
								.map((title: any, index: number) => (
									<h3 key={index} className="font-bold">
										{title.value}
									</h3>
								))
								.slice(0, 1)}
						</div>
					)} */}

					{block.text && (
						<div className="max-w-[50vw]">
							{block.text
								.filter((paragraph: any) => paragraph._key === lang) // Filter the text by the selected language key
								.map((paragraph: any, index: number) => (
									<p
										key={index}
										className="relative text-2xl font-medium leading-tight tracking-tight text-[#8C8C8F]"
									>
										{renderParagraph(
											paragraph,
											block.title.map((title: any) => title.value),
										)}
									</p>
								))}
						</div>
					)}
					{block.image && (
						<div className="">
							<Img
								image={block.image}
								src={`/${block.image.asset._ref.split('-')[1]}-${block.image.asset._ref.split('-')[2]}.${block.image.asset._ref.split('-')[3]}`}
								alt="Story Image"
								className="h-auto w-[30vw]"
							/>
						</div>
					)}
				</div>
			))}
		</div>
	)
}

const renderParagraph = (paragraph: any, titles: string[]) => {
	if (!paragraph?.value) return null

	const words = paragraph.value.split(' ')
	return words.map((word: string, index: number) => {
		const cleanedWord = word.replace(/[^a-zA-Z0-9_]/g, '')
		const isTitle = titles
			.map((t) => t.trim().toLowerCase())
			.includes(cleanedWord.toLowerCase())
		const isSystemD = cleanedWord === 'SYSTEM_D'

		return (
			<span key={index} className={isTitle ? 'font-bold' : ''}>
				{isSystemD ? (
					<>
						<Link
							href="/"
							className="bg-grayLight absolute -left-10 top-0 h-auto w-[15rem] rounded-md px-4 py-1 dark:bg-[#DEFE04]"
							style={{ transform: `rotate(${10}deg)` }}
						>
							<LogoShortTsx className="text-primary dark:text-grayLight w-full" />
						</Link>
						<span className="text-grayLight px-[6.5rem]"></span>
					</>
				) : (
					word
				)}
				{index !== words.length - 1 && ' '}
			</span>
		)
	})
}

export default ShortStory
