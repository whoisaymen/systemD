'use client'
import React, { useState } from 'react'
import ShortStory from './ShortStory'
// import LongStory from './LongStory'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import BigBangLogoMobile from './BigBangLogoMobile'
import FestivalDesktopWithBorder from './FestivalDesktopWithBorder'
import LongStory from './LongStory'

interface BigBangContentProps {
	shortStory: any
	longStory: any
	locale: string
}

const BigBangContent: React.FC<BigBangContentProps> = ({
	shortStory,
	longStory,
	locale,
}) => {
	const [activeTab, setActiveTab] = useState<'short' | 'long'>('short')
	const themeColors = {
		dark: {
			fill: 'var(--color-dark)',
			stroke: 'var(--color-primary)',
			icon: 'var(--color-primary)',
		},
		sparkle: {
			fill: 'var(--color-primary)',
			stroke: 'var(--color-dark)',
		},
		festival: {
			fill: 'var(--color-dark)',
			stroke: 'var(--color-primary)',
			icon: 'var(--color-grayDark)',
		},
		memoire: {
			fill: 'var(--color-dark)',
			stroke: 'var(--color-primary)',
			icon: 'var(--color-primary)',
		},
	}

	return (
		<>
			<div className="fixed left-0 top-0 z-10 flex w-full justify-between gap-2 px-4 py-4 pt-[7rem] text-xl font-bold tracking-tighter">
				<button
					onClick={() => setActiveTab('short')}
					className={`w-auto border-[2.5px] border-primary px-4 py-0 ${
						activeTab === 'short'
							? 'bg-primary text-dark'
							: 'border-dark bg-dark text-primary dark:border-primary dark:bg-dark dark:text-primary'
					} rounded-full transition-all`}
				>
					Short Story
				</button>
				<button
					onClick={() => setActiveTab('long')}
					className={`w-auto border-[2.5px] border-primary px-4 py-0 ${
						activeTab === 'long'
							? 'bg-primary text-dark'
							: 'bg-primary text-dark dark:bg-dark dark:text-primary'
					} rounded-full transition-all`}
				>
					Long Story
				</button>
			</div>
			{/* <Accordion
				type="multiple"
				className="fixed left-0 top-0 z-50 mt-12 flex h-[15vh] w-full items-center justify-evenly gap-2 overflow-hidden text-lg font-bold uppercase tracking-tight sm:hidden sm:justify-center"
			>
				<AccordionItem
					value="item-1"
					className="flex flex-col items-center justify-center"
				>
					<AccordionTrigger
						className={`relative z-50 mt-10 rotate-6 scale-[0.8]`}
						onClick={() => setActiveTab('short')}
					>
						Short
					</AccordionTrigger>
				</AccordionItem>
				<AccordionItem
					value="item-2"
					className="flex flex-col items-center justify-center"
				>
					<AccordionTrigger
						className={`relative z-50 mt-10 -rotate-12 scale-[0.8]`}
						onClick={() => setActiveTab('long')}
					>
						Long
					</AccordionTrigger>
				</AccordionItem>
			</Accordion> */}

			<div className="mt-32 flex w-full flex-col space-y-1 rounded-md p-2 sm:my-1 sm:min-h-svh sm:p-0">
				<div className="hidden h-full w-full bg-gradient-to-b from-grayLight to-grayDark/25 px-64 py-20 shadow-inner dark:from-dark dark:to-grayDark/25 sm:block">
					<BigBangLogoMobile
						theme={themeColors.memoire}
						className="overflow-visible text-grayDark dark:text-dark"
					/>

					<FestivalDesktopWithBorder theme={themeColors.memoire} className="" />
					{/* <div className="relative bg-dark text-[10rem] tracking-[-0.05em] text-grayDark">
						<h1 className="text-stroke-dark text-stroke-[1rem] absolute inset-0 font-black italic">
							BIG BANG
						</h1>
						<h1 className="relative font-black italic">BIG BANG</h1>
					</div> */}
				</div>
				{activeTab === 'short' ? (
					<ShortStory content={shortStory.body} lang={locale} />
				) : (
					<LongStory content={longStory.body} lang={locale} />
				)}
			</div>
		</>
	)
}

export default BigBangContent
