'use client'

import { useRef, useMemo } from 'react'
import { motion, useInView } from 'motion/react'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import LogoShortTsx from '../svgs/LogoShort'
import BackToTopButton from '../common/BackToTop'
import RichText from '@/components/common/RichText'
import FestivalSparkleIcon from '../festival/FestivalSparkleIcon'
import {
	localizedRichText,
	richTextToPlainText,
	textToRichText,
} from '@/lib/richText'

// Types
interface FabriqueContentProps {
	fabrique: any
	language: string
}

interface LogoCollageItem {
	className: string
	delay: number
	rotate: number
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

const LOGO_COLLAGE_CONFIG: LogoCollageItem[] = [
	{
		className: 'absolute right-16 top-0 w-20 w-[9rem] sm:w-[15rem]',
		delay: 0.1,
		rotate: -50,
	},
	{
		className: 'absolute left-20 top-0 w-20 w-[9rem] sm:w-[15rem]',
		delay: 0.3,
		rotate: 25,
	},
	{
		className:
			'absolute bottom-2 -right-8 lg:-right-12 w-20 w-[9rem] sm:w-[15rem]',
		delay: 0.5,
		rotate: -60,
	},
	{
		className: 'absolute -right-8 top-4 w-20 w-[9rem] sm:w-[15rem]',
		delay: 0.7,
		rotate: 55,
	},
	{
		className: 'absolute left-0 top-12 w-20 w-[9rem] sm:w-[15rem]',
		delay: 0.9,
		rotate: -60,
	},
	{
		className:
			'absolute -bottom-2 lg:-bottom-8 -left-0 w-20 w-[9rem] sm:w-[15rem]',
		delay: 1.1,
		rotate: 60,
	},
	{
		className:
			'absolute -bottom-24 lg:-bottom-32 left-[45%] w-20 w-[9rem] sm:w-[15rem]',
		delay: 1.3,
		rotate: 40,
	},
	{
		className:
			'absolute -bottom-24 lg:-bottom-28 left-1/2 w-20 w-[9rem] sm:w-[15rem]',
		delay: 1.3,
		rotate: -40,
	},
]

// Logo Collage Component
const LogoCollage = ({ text }: { text: any }) => {
	const collageRef = useRef(null)
	const isInView = useInView(collageRef, {
		once: true,
		margin: '-20% 0px -20% 0px',
	})

	return (
		<div className="theme-fabrique-logo-collage relative flex flex-wrap items-center justify-center gap-2 rounded-none px-4 py-4 lg:mx-auto">
			<div
				className="relative mt-24 flex h-[20vh] w-full items-center justify-center lg:max-w-[29vw]"
				ref={collageRef}
			>
				{LOGO_COLLAGE_CONFIG.map((logo, i) => (
					<motion.div
						key={i}
						initial={{ y: '-100vh', opacity: 0, rotate: logo.rotate }}
						animate={
							isInView
								? {
										y: 0,
										opacity: 1,
										rotate: logo.rotate,
										x: i === 6 ? '-50%' : 0,
									}
								: {
										y: '-100vh',
										opacity: 0,
										rotate: logo.rotate,
										x: i === 6 ? '-50%' : 0,
									}
						}
						transition={{
							type: 'spring',
							stiffness: 60,
							damping: 12,
							delay: logo.delay,
						}}
						className={`${logo.className} inline-block h-auto rounded-md bg-grayDark px-2 py-1`}
						style={{ position: 'absolute' }}
					>
						<LogoShortTsx className="lg:bg-grayDark lg:text-dark" />
					</motion.div>
				))}
			</div>

			<RichText
				className="theme-fabrique-conclusion mx-auto py-2 pt-40 text-center text-base font-normal leading-[1.2] tracking-tight text-primary sm:pt-52 lg:text-xl"
				value={text}
			/>
		</div>
	)
}

// Keep the artwork and section layout while rendering the editor's formatting.
const renderActionContent = (action: any, language: string, subtitle: any) => (
	<div className="relative px-0 py-4 text-primary sm:py-10">
		{richTextToPlainText(subtitle) && (
			<div className="flex items-center justify-center">
				<h2 className="-mt-4 inline-block -rotate-1 rounded-md border-2 border-dark bg-primary px-2 py-0 text-center text-lg font-medium tracking-tight text-dark lg:-mt-8 lg:border-0 lg:text-lg">
					<RichText value={subtitle} inline />
				</h2>
			</div>
		)}

		{textToRichText(localizedRichText(action.text, language)).map(
			(block: any, index: number) => {
				const blockKey = block._key ?? index
				if (block.style === 'h6' && !block.listItem) {
					return (
						<div key={blockKey} className="flex justify-start lg:ml-28">
							<p className="-z-10 m-4 -mb-4 -rotate-0 rounded-md border-2 border-dark bg-grayDark px-2 py-0 text-center text-base font-medium tracking-tight text-dark">
								<RichText value={[block]} inline />
							</p>
						</div>
					)
				}
				if (block.listItem === 'bullet') {
					return (
						<ul key={blockKey} className="px-9 lg:px-36">
							<li
								className={`relative mt-4 text-base font-normal leading-[1.2] tracking-tight lg:px-0 lg:text-xl ${block.style === 'h6' ? 'font-bold' : ''}`}
							>
								<RichText value={[{ ...block, listItem: undefined }]} inline />
								<FestivalSparkleIcon
									className="absolute -left-6 top-3.5 h-4 w-4 -translate-y-1/2"
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
					<div
						key={blockKey}
						className="mt-4 px-4 text-base font-normal leading-[1.2] tracking-tight first:mt-0 lg:px-32 lg:text-xl"
					>
						<RichText value={[block]} />
					</div>
				)
			},
		)}
	</div>
)

// Main Component
const FabriqueContent: React.FC<FabriqueContentProps> = ({
	fabrique,
	language,
}) => {
	const ref = useRef(null)

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

	const actionValues = (memoizedValues.actions ?? []).map(
		(_: any, index: number) => `action-${index}`,
	)
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
					className="flex flex-col items-center justify-center"
				>
					<AccordionTrigger className={`theme-fabrique-dropdown-label ${triggerRotation} sm:text-5xl`}>
						<div className="flex flex-col items-center">
							<div className="z-10 inline-block w-fit text-3xl tracking-tight lg:text-5xl">
								<span className="text-center">
									<RichText value={mainTitle} inline allowLinks={false} />
								</span>
							</div>
						</div>
					</AccordionTrigger>
					<AccordionContent>
						{renderActionContent(action, language, subTitle)}
					</AccordionContent>
				</AccordionItem>
			)
		})

	return (
		<div
			ref={ref}
			className="lg:shadowtest section-folder-content section-folder-content--fabrique theme-fabrique-main-content no-scrollbar relative isolate z-0 flex h-auto w-full flex-col overflow-x-clip px-4 pb-[calc(8rem+env(safe-area-inset-bottom))] pt-0 lg:overflow-y-auto text-base font-medium leading-[1.2] tracking-tight text-dark lg:my-1 lg:h-[calc(100svh-8px)] lg:rounded-xl"
		>
			<div className="fixed bottom-4 right-12 z-50">
				<BackToTopButton targetId="navbar-mobile" />
			</div>

			{/* Single Accordion for all Actions */}
			{memoizedValues.actions && (
				<div className="theme-fabrique-actions mb-0 pt-4 lg:pb-0 lg:pt-16">
					<Accordion type="single" collapsible className="lg:hidden">
						{renderActionItems()}
					</Accordion>
					<Accordion
						type="multiple"
						defaultValue={actionValues}
						className="hidden lg:block"
					>
						{renderActionItems()}
					</Accordion>
				</div>
			)}

			{richTextToPlainText(memoizedValues.description) && (
				<RichText
					value={memoizedValues.description}
					className="theme-fabrique-description mt-8 text-base font-normal leading-[1.2] tracking-tight text-primary"
				/>
			)}

			<LogoCollage text={localizedRichText(fabrique.closingText, language)} />
		</div>
	)
}

export default FabriqueContent
