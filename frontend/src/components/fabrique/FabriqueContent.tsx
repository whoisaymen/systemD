'use client'

import { useRef, useMemo, type RefObject } from 'react'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import SystemDHeart from '../common/SystemDHeart'
import styles from './FabriqueContent.module.css'
import BackToTopButton from '../common/BackToTop'
import RichText from '@/components/common/RichText'
import {
	EDITORIAL_BODY_TEXT,
	EDITORIAL_COPY_WIDTH,
	EDITORIAL_DESKTOP_TAB_STYLE,
	EDITORIAL_RICH_TEXT_HEADINGS,
} from '@/components/common/editorialStyles'
import FestivalSparkleIcon from '../festival/FestivalSparkleIcon'
import { FILM_LABEL_TEXT } from '../film/filmLabelStyles'
import {
	localizedRichText,
	richTextBlockAlignment,
	richTextToPlainText,
	textToRichText,
} from '@/lib/richText'

// Types
interface FabriqueContentProps {
	fabrique: any
	language: string
}

// Constants
const TRIGGER_ROTATIONS = [
	'-rotate-6',
	'rotate-3',
	'-rotate-3',
	'rotate-1',
	'-rotate-2',
	'rotate-3',
]

// Logo Collage Component
const LogoCollage = ({
	text,
	originRef,
}: {
	text: any
	originRef: RefObject<HTMLDivElement | null>
}) => {
	return (
		<div className={`theme-fabrique-logo-collage ${styles.collage}`}>
			<div className={styles.artworkSlot}>
				<div className={styles.artwork}>
					<SystemDHeart entrance="corners" originRef={originRef} />
				</div>
			</div>

			<RichText
				className={`theme-fabrique-conclusion ${EDITORIAL_BODY_TEXT} ${EDITORIAL_COPY_WIDTH} ${EDITORIAL_RICH_TEXT_HEADINGS} mx-auto shrink-0 py-2 text-center text-primary`}
				value={text}
			/>
		</div>
	)
}

// Keep the artwork and section layout while rendering the editor's formatting.
const renderActionContent = (action: any, language: string) => (
	<div
		className={`${EDITORIAL_BODY_TEXT} relative pb-4 pt-12 text-primary lg:pb-[0.89em] lg:pt-8`}
	>
		<div className={EDITORIAL_COPY_WIDTH}>
			{textToRichText(localizedRichText(action.text, language)).map(
				(block: any, index: number) => {
					const blockKey = block._key ?? index
					if (block.style === 'h6' && !block.listItem) {
						return (
							<div key={blockKey} className="mt-4 flex justify-start first:mt-0">
								<p className="rounded-md border-2 border-dark bg-grayDark px-[0.3em] py-0 text-center font-medium text-dark">
									<RichText value={[block]} inline />
								</p>
							</div>
						)
					}
					if (block.listItem === 'bullet') {
						return (
							<ul key={blockKey} className="mt-4 pl-[1.5em] first:mt-0">
								<li
									className={`relative ${block.style === 'h6' ? 'font-bold' : ''}`}
									style={{ textAlign: richTextBlockAlignment(block) }}
								>
									<RichText value={[{ ...block, listItem: undefined }]} inline />
									<FestivalSparkleIcon
										className="absolute -left-[1.5em] top-[0.6em] h-[1em] w-[1em] -translate-y-1/2"
										theme={{
											fill: 'var(--color-primary)',
											stroke: 'var(--color-dark)',
										}}
									/>
								</li>
							</ul>
						)
					}
					return (
						<div key={blockKey} className="mt-4 first:mt-0">
							<RichText
								value={[block]}
								className={EDITORIAL_RICH_TEXT_HEADINGS}
							/>
						</div>
					)
				},
			)}
		</div>
	</div>
)

// Main Component
const FabriqueContent: React.FC<FabriqueContentProps> = ({
	fabrique,
	language,
}) => {
	const ref = useRef<HTMLDivElement>(null)

	// Memoize computed values
	const memoizedValues = useMemo(
		() => ({
			description: localizedRichText(fabrique?.description, language),
			actions: fabrique?.actions ?? [],
		}),
		[fabrique, language],
	)

	if (!fabrique) {
		return null
	}

	const renderActionItems = () =>
		memoizedValues.actions.map((action: any, index: number) => {
			const actionTitle = localizedRichText(action.title, language)
			// Older content combined the heading and subtitle in one plain string.
			const [legacyTitle, legacySubtitle] =
				typeof actionTitle === 'string' ? actionTitle.split(' - ') : []
			const mainTitle = legacySubtitle ? legacyTitle : actionTitle
			const subTitle =
				localizedRichText(action.subtitle, language) || legacySubtitle
			const triggerRotation =
				TRIGGER_ROTATIONS[index % TRIGGER_ROTATIONS.length]

			return (
				<AccordionItem
					key={index}
					value={`action-${index}`}
					className="group/action flex flex-col items-center justify-center lg:contents"
				>
					<div className="relative z-20">
						<AccordionTrigger
							className={`theme-fabrique-dropdown-label ${triggerRotation} text-3xl ${EDITORIAL_DESKTOP_TAB_STYLE}`}
						>
							<RichText value={mainTitle} inline allowLinks={false} />
						</AccordionTrigger>
						{richTextToPlainText(subTitle) && (
							<div className="theme-fabrique-action-subtitle absolute left-1/2 top-full z-30 mt-0 hidden w-max max-w-[min(22rem,calc(100cqw-2rem))] -translate-x-1/2 group-data-[state=open]/action:block lg:max-w-[min(22rem,40cqw)]">
								<span
									style={{ rotate: index % 2 === 0 ? '3deg' : '-3deg' }}
									className={`block rounded-md border-2 border-dark bg-primary px-1.5 py-0 text-center text-dark ${FILM_LABEL_TEXT}`}
								>
									<RichText value={subTitle} inline />
								</span>
							</div>
						)}
					</div>
					<AccordionContent>
						{renderActionContent(action, language)}
					</AccordionContent>
				</AccordionItem>
			)
		})

	return (
		<div
			ref={ref}
			className="lg:shadowtest section-folder-content section-folder-content--fabrique theme-fabrique-main-content no-scrollbar relative isolate z-0 flex h-auto w-full flex-col overflow-x-clip pb-[calc(8rem+env(safe-area-inset-bottom))] pt-0 lg:overflow-y-auto text-base font-medium leading-[1.2] tracking-tight text-dark [container-type:inline-size] lg:my-1 lg:h-[calc(100svh-8px)] lg:rounded-xl lg:pb-4"
		>
			<div className="fixed bottom-4 right-12 z-50">
				<BackToTopButton targetId="navbar-mobile" />
			</div>

			{/* Desktop titles share a row; each panel opens below the whole row. */}
			{memoizedValues.actions && (
				<div className="theme-fabrique-actions mb-0 pt-4 lg:pb-0 lg:pt-10">
					<Accordion type="single" collapsible className="lg:hidden">
						{renderActionItems()}
					</Accordion>
					<Accordion
						type="single"
						collapsible
						orientation="horizontal"
						defaultValue="action-0"
						className="hidden lg:flex lg:flex-wrap lg:items-start lg:justify-center lg:gap-y-[min(1.5rem,1.67cqw)] lg:[&>div>[role=region]]:order-1 lg:[&>div>[role=region]]:basis-full"
					>
						{renderActionItems()}
					</Accordion>
				</div>
			)}

			{richTextToPlainText(memoizedValues.description) && (
				<RichText
					value={memoizedValues.description}
					className={`theme-fabrique-description ${EDITORIAL_BODY_TEXT} ${EDITORIAL_COPY_WIDTH} ${EDITORIAL_RICH_TEXT_HEADINGS} mt-8 text-primary [&>h2]:mb-[0.8em] [&>p]:min-h-[1.2em]`}
				/>
			)}

			<LogoCollage
				text={localizedRichText(fabrique.closingText, language)}
				originRef={ref}
			/>
		</div>
	)
}

export default FabriqueContent
