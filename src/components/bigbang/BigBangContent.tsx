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
		<>
			<Accordion
				type="multiple"
				className="fixed left-0 top-0 z-50 mt-12 flex hidden h-[15vh] w-full items-center justify-evenly gap-2 overflow-hidden text-lg font-bold uppercase tracking-tight sm:hidden sm:justify-center"
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
			</Accordion>
			<div className="mt-32 flex h-full w-full flex-col space-y-1 rounded-md p-2 sm:my-1 sm:overflow-hidden sm:p-0">
				{activeTab === 'short' ? (
					<ShortStory content={shortStory.body} lang={locale} />
				) : (
					<div className="px-16 pt-6 text-3xl font-bold tracking-tighter text-dark dark:font-semibold dark:text-primary">
						Long story goes here.
					</div>
				)}
			</div>
		</>
	)
}

export default BigBangContent
