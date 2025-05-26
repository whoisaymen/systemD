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
			<div className="sticky left-0 top-0 z-10 flex w-full justify-between gap-2 px-4 py-4 text-xl font-bold tracking-tighter">
				<button
					onClick={() => setActiveTab('short')}
					className={`w-auto border-[2.5px] border-primary px-4 py-0 pb-0.5 ${
						activeTab === 'short'
							? 'bg-primary text-dark'
							: 'border-dark bg-dark text-primary dark:border-primary dark:bg-dark dark:text-primary'
					} rounded-full transition-all`}
				>
					Short Story
				</button>
				<button
					onClick={() => setActiveTab('long')}
					className={`w-auto border-[2.5px] border-primary px-4 py-0 pb-0.5 ${
						activeTab === 'long'
							? 'bg-primary text-dark'
							: 'bg-primary text-dark dark:bg-dark dark:text-primary'
					} rounded-full transition-all`}
				>
					Long Story
				</button>
			</div>

			<div className="flex w-full flex-col space-y-1 rounded-md p-2 sm:my-1 sm:min-h-svh sm:p-0">
				<div className="hidden h-full w-full bg-gradient-to-b from-grayLight to-grayDark/25 px-64 py-20 shadow-inner dark:from-dark dark:to-grayDark/25 sm:block">
					<BigBangLogoMobile
						theme={themeColors.memoire}
						className="overflow-visible text-grayDark dark:text-dark"
					/>

					<FestivalDesktopWithBorder theme={themeColors.memoire} className="" />
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
