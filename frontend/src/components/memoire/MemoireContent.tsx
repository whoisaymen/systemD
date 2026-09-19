'use client'

import Img from '@/ui/Img'
import Link from 'next/link'
import { renderParagraph } from '../common/RenderParagraph'
import RichText from '@/components/common/RichText'
import { EDITORIAL_BODY_TEXT } from '@/components/common/editorialStyles'
import { localizedRichText, richTextToPlainText } from '@/lib/richText'
import { useTranslations } from 'next-intl'

interface MemoireContentProps {
	memoire: any
	language: string
}

const MemoireContent: React.FC<MemoireContentProps> = ({
	memoire,
	language,
}) => {
	const tMemoire = useTranslations('memoire')

	if (!memoire) {
		return null
	}

	const description = localizedRichText(memoire.description, language)
	const pastFestivals = Array.isArray(memoire.pastFestivals)
		? memoire.pastFestivals
		: []

	const filteredFestivals = [...pastFestivals]
		.filter(Boolean)
		.sort((a: any, b: any) => b.year - a.year)

	const renderFestivalCard = (festival: any, index: number) => (
		<Link
			key={festival._id || index}
			href={`/${language}/festival/${festival.year}`}
			className="group relative block min-w-0"
		>
			<div className="relative isolate aspect-[4/3] w-full overflow-hidden rounded-xl border-[3px] border-primary bg-dark lg:rounded-md lg:border-0">
				<div
					aria-hidden="true"
					className="shadowtest pointer-events-none absolute inset-0 z-30 hidden [border-radius:inherit] lg:block"
				/>
				<div className="absolute left-1/2 top-[43%] z-20 -translate-x-1/2 -rotate-6 rounded-md bg-primary px-2 text-xl font-black tracking-tight text-dark lg:top-[47%] lg:text-3xl">
					<span>{festival.year}</span>
				</div>
				<div className="absolute left-1/2 top-[55%] z-10 -translate-x-1/2 rotate-6 rounded-md bg-dark px-2 text-xl font-semibold tracking-tight text-primary lg:top-[57%] lg:text-3xl">
					<RichText value={festival.venue} inline allowLinks={false} />
				</div>
				{festival.visual?.asset ? (
					<Img
						image={festival.visual}
						src={festival.visual.asset.url}
						alt={
							festival.title
								? richTextToPlainText(
										localizedRichText(festival.title, language),
									)
								: 'Festival image'
						}
						className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-primary" />
				)}
			</div>
		</Link>
	)

	return (
		<div className="no-scrollbar relative flex min-h-[calc(100svh-4rem)] w-full min-w-0 flex-col gap-1 overflow-x-hidden px-4 pb-16 tracking-tight [container-type:inline-size] sm:mt-1 sm:px-0 lg:my-1 lg:h-[calc(100svh-8px)] lg:min-h-0 lg:p-0">
			<section
				id="memoire-description"
				className="lg:shadowtest section-folder-content section-folder-content--memoire no-scrollbar relative z-10 mt-8 flex min-w-0 flex-col overflow-x-hidden rounded-md bg-grayDark px-4 pb-10 pt-4 text-dark sm:mx-0 lg:mt-0 lg:h-full lg:overflow-y-auto lg:overflow-x-hidden lg:rounded-xl lg:rounded-tr-none lg:bg-dark lg:p-8 lg:text-primary"
			>
				<div className="hidden w-full lg:px-6 xl:px-12">
					<div className={`${EDITORIAL_BODY_TEXT} py-0 text-dark sm:py-4 lg:mx-auto lg:max-w-[36rem] lg:py-8 lg:text-center lg:text-primary 2xl:py-12`}>
						{renderParagraph(
							{ value: description },
							[],
							'theme-text-color bg-dark text-primary lg:bg-dark lg:text-primary',
						)}
					</div>
				</div>
				{filteredFestivals.length > 0 && (
					<section
						data-testid="memoire-cards-area"
						className="relative z-10 mt-10 min-h-[18rem] shrink-0 overflow-visible py-6 text-primary lg:mt-0 lg:p-0"
					>
						<div>
							<h2 className="mb-5 text-xl font-black leading-tight text-primary sm:text-2xl lg:hidden">
								<RichText
									value={
										localizedRichText(memoire.pastFestivalsTitle, language) ||
										tMemoire('previousEditions')
									}
									inline
								/>
							</h2>
							<div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-2">
								{filteredFestivals.map((festival: any, index: number) =>
									renderFestivalCard(festival, index),
								)}
							</div>
						</div>
					</section>
				)}
			</section>
		</div>
	)
}

export default MemoireContent
