'use client'

import { useRef, useMemo } from 'react'
import { motion, useInView, useScroll, useTransform } from 'motion/react'

import Img from '@/ui/Img'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { renderParagraph } from '../common/RenderParagraph'
import LogoShortTsx from '../svgs/LogoShort'
import FabriqueBracketsIcon from './FabriqueBracketsIcon'
import BackToTopButton from '../common/BackToTop'
import FestivalSparkleIcon from '../festival/FestivalSparkleIcon'

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

// Utility functions
const capitalizeFirstLetter = (str: string): string => {
	if (!str) return ''
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const getLocalizedValue = (array: any[], lang: string): string => {
	if (!Array.isArray(array)) return ''
	const item = array.find((entry) => entry._key === lang)
	return item?.value || ''
}

const getLocalizedText = (array: any[], lang: string): string => {
	if (!Array.isArray(array)) return ''
	const item = array.find((entry) => entry._key === lang)
	return item?.value || ''
}

// Vision Block Component
const VisionBlock: React.FC<{
	vision: any[]
	visionTitle: any[]
	language: string
}> = ({ vision, visionTitle, language }) => (
	<div className="lg:shadowtest mt-20 lg:flex">
		<div className="relative mb-12 lg:w-full">
			<div className="flex items-center justify-center">
				<FabriqueBracketsIcon
					className="w-[75vw] sm:w-1/4 lg:hidden"
					theme={{ fill: 'var(--color-primary)' }}
				/>
			</div>
			<h1 className="absolute left-1/2 top-1/2 mx-auto max-w-64 -translate-x-1/2 -translate-y-1/2 px-2 py-24 text-center text-5xl font-bold leading-[1] tracking-tight text-primary sm:py-4 sm:text-4xl">
				{getLocalizedValue(visionTitle, language) || 'Vision'}
			</h1>
		</div>

		<div className="pt-2">
			{vision.map((visionItem: any, index: number) => (
				<div key={index} className="mt-8">
					<div className="relative rounded-t-3xl px-4">
						<h2 className="text-lg font-bold leading-[1.2] tracking-tight text-primary lg:px-32 lg:text-xl">
							{getLocalizedValue(visionItem.title, language)}
						</h2>
						<p className="mx-auto py-2 text-base font-normal leading-[1.2] tracking-tight text-primary lg:px-16 lg:text-xl">
							{getLocalizedText(visionItem.text, language) ||
								'No description available'}
						</p>
					</div>
				</div>
			))}
		</div>
	</div>
)

// Logo Collage Component
const LogoCollage: React.FC = () => {
	const collageRef = useRef(null)
	const isInView = useInView(collageRef, {
		once: true,
		margin: '-20% 0px -20% 0px',
	})

	return (
		<div className="relative z-50 flex flex-wrap items-center justify-center gap-2 rounded-none px-4 py-4 lg:mx-auto">
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

			<p className="mx-auto py-2 pt-40 text-center text-3xl font-bold leading-[1.2] tracking-tight text-primary sm:pt-52 sm:text-4xl">
				For our Brussels stories, resourceful and proud.
			</p>
		</div>
	)
}

// Render Action Content Function
const renderActionContent = (
	action: any,
	language: string,
	subTitle: string,
) => {
	if (!action.text?.[language]) return null

	return (
		<div className="relative px-0 py-4 text-primary sm:py-10">
			{subTitle && (
				<div className="flex items-center justify-center">
					<h2 className="-mt-4 inline-block -rotate-1 rounded-md border-2 border-dark bg-primary px-2 py-0 text-center text-lg font-medium tracking-tight text-dark lg:-mt-8 lg:border-0 lg:text-lg">
						{subTitle}
					</h2>
				</div>
			)}
			{action.text[language].map((block: any) => {
				const blockKey = block._key

				// Render h6 blocks as styled paragraphs
				if (block.style === 'h6' && !block.listItem) {
					return (
						<div key={blockKey} className="flex justify-start lg:ml-28">
							<p className="-z-10 m-4 -mb-4 -rotate-0 rounded-md border-2 border-dark bg-grayDark px-2 py-0 text-center text-base font-medium tracking-tight text-dark">
								{block.children.map((child: any, idx: number) => (
									<span key={child._key || idx}>{child.text}</span>
								))}
							</p>
						</div>
					)
				}

				// Render bullet list items
				if (block.listItem === 'bullet') {
					const isBold = block.style === 'h6'
					return (
						<ul key={blockKey} className="px-9 lg:px-36">
							<li
								className={`relative mt-4 text-base font-normal leading-[1.2] tracking-tight lg:px-0 lg:text-xl ${
									isBold ? 'font-bold' : ''
								}`}
							>
								{block.children.map((child: any, idx: number) => (
									<span className="ml-0.5" key={child._key || idx}>
										{child.text}
									</span>
								))}

								{/* Replace the div with FestivalSparkleIcon */}
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

				// Render regular paragraphs
				return (
					<p
						key={blockKey}
						className="mt-4 px-4 text-base font-normal leading-[1.2] tracking-tight first:mt-0 lg:px-32 lg:text-xl"
					>
						{block.children.map((child: any, idx: number) => (
							<span key={child._key || idx}>{child.text}</span>
						))}
					</p>
				)
			})}
		</div>
	)
}

// Main Component
const FabriqueContent: React.FC<FabriqueContentProps> = ({
	fabrique,
	language,
}) => {
	const ref = useRef(null)
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start 0vh', 'end center'],
	})

	const borderRadius = useTransform(scrollYProgress, [0, 1], [10, 120])

	// Memoize computed values
	const memoizedValues = useMemo(
		() => ({
			title: getLocalizedValue(fabrique?.title, language),
			description: getLocalizedValue(fabrique?.description, language),
			visionTitle: fabrique?.visionTitle,
			vision: fabrique?.vision,
			actions: fabrique?.actions,
			image: fabrique?.image,
		}),
		[fabrique, language],
	)

	if (!fabrique) {
		return <p>No data available.</p>
	}

	return (
		<div
			ref={ref}
			className="no-scrollbar lg:shadowtest flex h-full w-full flex-col overflow-y-scroll px-4 py-32 pt-0 text-base font-medium leading-[1.2] tracking-tight text-dark lg:my-1 lg:h-[calc(100svh-10px)] lg:rounded-xl"
		>
			<div className="fixed bottom-4 right-12 z-50">
				<BackToTopButton targetId="navbar-mobile" />
			</div>

			{/* Image */}
			{memoizedValues.image?.asset && (
				<Img
					image={memoizedValues.image}
					src={`/${memoizedValues.image.asset._ref.split('-')[1]}-${memoizedValues.image.asset._ref.split('-')[2]}.${memoizedValues.image.asset._ref.split('-')[3]}`}
					alt={fabrique.name}
					className="my-4 h-48 w-48 rounded-md object-cover"
				/>
			)}

			{/* Single Accordion for all Actions */}
			{memoizedValues.actions && (
				<Accordion
					type="single"
					collapsible
					className="mb-0 pt-4 lg:pb-0 lg:pt-16"
				>
					{memoizedValues.actions.map((action: any, index: number) => {
						const actionTitle = getLocalizedValue(action.title, language)
						const [mainTitle, subTitle] = actionTitle.split(' - ')
						const triggerRotation =
							TRIGGER_ROTATIONS[index % TRIGGER_ROTATIONS.length]

						return (
							<AccordionItem
								key={index}
								value={`action-${index}`}
								className="flex flex-col items-center justify-center"
							>
								<AccordionTrigger className={`${triggerRotation} sm:text-5xl`}>
									<div className="flex flex-col items-center">
										<div className="z-10 inline-block w-fit text-3xl tracking-tight lg:text-5xl">
											<span className="text-center">
												{capitalizeFirstLetter(mainTitle)}
											</span>
										</div>
									</div>
								</AccordionTrigger>
								<AccordionContent>
									{renderActionContent(action, language, subTitle)}
								</AccordionContent>
							</AccordionItem>
						)
					})}
				</Accordion>
			)}

			{/* Description */}
			<div className="shadowtest relative mt-8 rounded-md bg-primary p-4 text-dark lg:mb-4 lg:bg-transparent lg:p-0 lg:shadow-none">
				<p className="mx-auto py-0 text-xl font-bold leading-[1.2] tracking-tight text-dark sm:py-4 sm:text-4xl lg:mx-16 lg:text-primary">
					{memoizedValues.description
						? renderParagraph(
								{ value: memoizedValues.description },
								[],
								'bg-dark text-primary lg:bg-grayDark lg:text-dark',
							)
						: 'No description available'}
				</p>
			</div>

			<p className="mt-8 text-base font-normal leading-[1.2] tracking-tight text-primary first:mt-0 lg:mt-0 lg:px-16 lg:pb-8 lg:pt-0 lg:text-xl">
				This festival was like a warm embrace in winter, without covid masks
				this time. People were happy to see each other, to connect with the
				community, particularly as the situation in Gaza was rapidly
				degenerating. Sbeul collective kicked off the festival with an electric
				performance of As Salem Aleykoum that absolutely brought down the house.
				Their assertivity, dignity and love were reflected in all other facets
				of the festival. A retrospective video installation by Maxime Bourlet
				revisited favorite films of the previous editions, a photo exhibit
				curated by Neima B Reyale reminded us of the little things we share
				while the salon du TURFU by Imiskill and Face B invited radical new
				imaginations of our future.
			</p>

			{/* Vision */}
			{/* {memoizedValues.vision && (
				<VisionBlock
					vision={memoizedValues.vision}
					visionTitle={memoizedValues.visionTitle}
					language={language}
				/>
			)} */}

			{/* Logo Collage */}
			<LogoCollage />
		</div>
	)
}

export default FabriqueContent
