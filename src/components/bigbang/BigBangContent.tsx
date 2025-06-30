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
		<div className="w-full">
			<div className="sticky left-0 top-0 z-10 flex w-full justify-between gap-2 px-4 py-2 text-lg font-bold tracking-tighter lg:py-1">
				<button
					onClick={() => setActiveTab('short')}
					className={`w-auto border-[2.5px] border-grayDark px-4 py-0 pb-0.5 ${
						activeTab === 'short'
							? 'bg-grayDark text-dark'
							: 'border-grayDark bg-grayDark text-primary dark:border-grayDark dark:bg-dark dark:text-grayDark'
					} rounded-md transition-all`}
				>
					Short Story
				</button>
				<button
					onClick={() => setActiveTab('long')}
					className={`w-auto border-[2.5px] border-grayDark px-4 py-0 pb-0.5 ${
						activeTab === 'long'
							? 'bg-grayDark text-dark'
							: 'bg-dark text-dark dark:bg-dark dark:text-grayDark'
					} rounded-md transition-all`}
				>
					Long Story
				</button>
			</div>

			<div className="flex flex-col space-y-1 rounded-md sm:my-1 sm:min-h-svh sm:p-0">
				{/* <div className="hidden h-full w-full bg-gradient-to-b from-grayLight to-grayDark/25 px-64 py-20 shadow-inner dark:from-dark dark:to-grayDark/25 sm:block">
					<BigBangLogoMobile
						theme={themeColors.memoire}
						className="overflow-visible text-grayDark dark:text-dark"
					/>

					<FestivalDesktopWithBorder theme={themeColors.memoire} className="" />
				</div> */}
				{activeTab === 'short' ? (
					<ShortStory content={shortStory.body} lang={locale} />
				) : (
					<LongStory content={longStory.body} lang={locale} />
				)}
			</div>
		</div>
	)
}

export default BigBangContent
