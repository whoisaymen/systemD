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

	return (
		<div className="mt-48 flex h-full w-full flex-col space-y-1 rounded-md p-2 sm:mt-0 sm:p-1">
			<div className="flex items-center justify-evenly gap-2 text-lg font-bold uppercase tracking-tight sm:justify-center">
				<Accordion type="single" collapsible>
					<AccordionItem
						value="item-1"
						className="absolute left-0 top-24 flex flex-col items-center justify-center"
					>
						<AccordionTrigger
							className={`relative z-50 mt-10 -rotate-6 scale-[0.8]`}
							onClick={() => setActiveTab('short')}
						>
							Short Story
						</AccordionTrigger>
					</AccordionItem>
					<AccordionItem
						value="item-2"
						className="absolute right-0 top-32 flex flex-col items-center justify-center"
					>
						<AccordionTrigger
							className={`relative z-50 mt-10 rotate-3 scale-[0.8]`}
							onClick={() => setActiveTab('long')}
						>
							Long Story
						</AccordionTrigger>
					</AccordionItem>
				</Accordion>
			</div>
			{activeTab === 'short' ? (
				<ShortStory content={shortStory.body} lang={locale} />
			) : (
				<div className="px-16 pt-6 text-3xl font-bold tracking-tighter text-dark dark:font-semibold dark:text-primary">
					Long story goes here.
				</div>
			)}
		</div>
	)
}

export default BigBangContent
