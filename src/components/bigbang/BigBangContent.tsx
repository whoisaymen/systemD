'use client'
import React, { useEffect, useState } from 'react'
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

	useEffect(() => {
		document
			.getElementById('navbar-mobile')
			?.scrollIntoView({ behavior: 'smooth' })
	}, [activeTab])

	const handleTabClick = (tab: 'short' | 'long') => {
		setActiveTab(tab)
	}

	return (
		<div className="lg:shadowtest lg:no-scrollbar w-full lg:my-1 lg:h-[calc(100svh-10px)] lg:overflow-y-auto lg:rounded-xl">
			<div className="sticky left-0 top-2 z-10 m-6 mx-auto mb-2 flex w-fit justify-between gap-2 rounded-full bg-primary px-1 py-1 text-base font-bold tracking-tighter sm:justify-center lg:my-2 lg:px-2 lg:py-1 lg:py-2 lg:text-lg">
				<button
					onClick={() => handleTabClick('short')}
					className={`w-auto px-2.5 py-0 lg:px-4 lg:pb-0.5 ${
						activeTab === 'short' ? 'bg-dark text-primary' : 'text-dark'
					} rounded-full transition-all`}
				>
					Short Story
				</button>
				<button
					onClick={() => handleTabClick('long')}
					className={`w-auto px-2.5 py-0 lg:px-4 lg:pb-0.5 ${
						activeTab === 'long' ? 'bg-dark text-primary' : 'text-dark'
					} rounded-full transition-all`}
				>
					Long Story
				</button>
			</div>
			<div className="flex flex-col space-y-1 rounded-md sm:p-0">
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
