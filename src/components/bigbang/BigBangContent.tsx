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
		<div className="w-full">
			<div className="sticky left-0 top-2 z-10 m-2 mx-auto flex w-fit justify-between gap-2 rounded-full bg-primary px-2 py-2 text-lg font-bold tracking-tighter sm:justify-center lg:py-1">
				<button
					onClick={() => handleTabClick('short')}
					className={`w-auto px-4 py-0 pb-0.5 ${
						activeTab === 'short' ? 'bg-dark text-primary' : 'text-dark'
					} rounded-full transition-all`}
				>
					Short Story
				</button>
				<button
					onClick={() => handleTabClick('long')}
					className={`w-auto px-4 py-0 pb-0.5 ${
						activeTab === 'long' ? 'bg-dark text-primary' : 'text-dark'
					} rounded-full transition-all`}
				>
					Long Story
				</button>
			</div>
			<div className="flex flex-col space-y-1 rounded-md sm:my-1 sm:min-h-svh sm:p-0">
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
