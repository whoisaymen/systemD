'use client'
import React, { useState } from 'react'
import ShortStory from './ShortStory'
// import LongStory from './LongStory'

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
		<div className="h-full w-full space-y-20 rounded-md pt-24 sm:bg-white md:pt-6">
			<div className="flex items-center justify-evenly gap-2 text-lg font-bold uppercase tracking-tight sm:justify-center">
				<h2
					className={`h-full cursor-pointer rounded-md border-2 border-grayDark bg-grayDark px-4 py-0 leading-none ${
						activeTab === 'short'
							? 'bg-grayDark text-primary'
							: 'bg-primary text-grayDark'
					}`}
					onClick={() => setActiveTab('short')}
				>
					Short Story
				</h2>
				<h2
					className={`h-full cursor-pointer rounded-md border-2 border-black border-grayDark bg-none px-4 py-0 leading-none ${
						activeTab === 'long'
							? 'bg-grayDark text-primary'
							: 'bg-primary text-grayDark'
					}`}
					onClick={() => setActiveTab('long')}
				>
					Long Story
				</h2>
			</div>
			{activeTab === 'short' ? (
				<ShortStory content={shortStory.body} lang={locale} />
			) : (
				<div>Long story goes here.</div>
			)}
		</div>
	)
}

export default BigBangContent
