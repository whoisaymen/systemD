'use client'

import Img, { getImageDimensions } from '@/ui/Img'
import Link from 'next/link'
import { renderParagraph } from '../common/RenderParagraph'
import BackToTopButton from '../common/BackToTop'
import RichText from '@/components/common/RichText'
import { EDITORIAL_BODY_TEXT } from '@/components/common/editorialStyles'
import { localizedRichText, richTextToPlainText } from '@/lib/richText'
import styles from './MemoireContent.module.css'
import MemoireTimeline from './MemoireTimeline'

interface MemoireContentProps {
	memoire: any
	language: string
}

const MemoireContent: React.FC<MemoireContentProps> = ({
	memoire,
	language,
}) => {
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

	const renderFestivalCard = (festival: any, index: number) => {
		const dimensions = festival.visual?.asset
			? getImageDimensions(festival.visual)
			: undefined
		const ratio = dimensions ? dimensions.width / dimensions.height : undefined
		return (
			<li
				key={festival._id || index}
				className={styles.item}
				data-edition-year={festival.year}
			>
				<Link
					href={`/${language}/festival/${festival.year}`}
					draggable={false}
					onNavigate={() => {
						sessionStorage.removeItem('currentFilmSlug')
						sessionStorage.removeItem('festivalScroll')
					}}
					className={styles.print}
					data-memoire-card
				>
					<div className={`interactive-title-motion ${styles.labels}`}>
						<div className="relative z-20 -rotate-6 rounded-md bg-primary px-2 text-xl font-black leading-tight tracking-tight text-dark lg:text-3xl">
							<span>{festival.year}</span>
						</div>
						<div className="relative z-10 -mt-0.5 rotate-6 rounded-md bg-dark px-2 text-xl font-semibold leading-tight tracking-tight text-primary lg:text-3xl">
							<RichText value={festival.venue} inline allowLinks={false} />
						</div>
					</div>
					{festival.visual?.asset ? (
						<Img
							image={festival.visual}
							draggable={false}
							imageWidth={1000}
							loading={index < 2 ? 'eager' : 'lazy'}
							fetchPriority={index === 0 ? 'high' : undefined}
							style={
								ratio
									? {
											width: `calc(${Math.min(1, ratio) * 100}cqw - var(--memoire-frame-width) * 2)`,
										}
									: undefined
							}
							sizes="(min-width: 1024px) 30vw, (min-width: 640px) 42vw, 80vw"
							alt={
								festival.title
									? richTextToPlainText(
											localizedRichText(festival.title, language),
										)
									: 'Festival image'
							}
							className={styles.photo}
						/>
					) : (
						<div className={styles.placeholder} />
					)}
				</Link>
			</li>
		)
	}

	return (
		<div className="no-scrollbar relative flex min-h-[calc(100svh-4rem)] w-full min-w-0 flex-col gap-1 px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] tracking-tight [container-type:inline-size] lg:my-1 lg:h-[calc(100svh-8px)] lg:min-h-0 lg:overflow-x-hidden lg:p-0">
			<div className="fixed bottom-0 right-0 z-50 mb-4 flex items-center justify-end px-8 lg:hidden">
				<BackToTopButton targetId="navbar-mobile" />
			</div>
			<section
				id="memoire-description"
				className="lg:shadowtest section-folder-content section-folder-content--memoire no-scrollbar relative z-10 flex min-w-0 flex-col text-primary lg:h-full lg:overflow-y-auto lg:overflow-x-hidden lg:rounded-xl lg:rounded-tr-none lg:bg-dark lg:p-8"
			>
				<div className="hidden w-full lg:px-6 xl:px-12">
					<div
						className={`${EDITORIAL_BODY_TEXT} py-0 text-dark sm:py-4 lg:mx-auto lg:max-w-[36rem] lg:py-8 lg:text-center lg:text-primary 2xl:py-12`}
					>
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
						className="relative z-10 min-h-[18rem] shrink-0 overflow-visible text-primary"
					>
						<MemoireTimeline>
							<ol className={styles.collage}>
								{filteredFestivals.map((festival: any, index: number) =>
									renderFestivalCard(festival, index),
								)}
							</ol>
						</MemoireTimeline>
					</section>
				)}
			</section>
		</div>
	)
}

export default MemoireContent
