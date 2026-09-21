'use client'
import React, { useLayoutEffect, useRef, useState } from 'react'
import ShortStory from './ShortStory'
import LongStory from './LongStory'
import { motion } from 'motion/react'
import { localizedRichText, richTextToPlainText } from '@/lib/richText'
import { EDITORIAL_DESKTOP_TAB_STYLE } from '@/components/common/editorialStyles'

const STORY_TAB_STYLE = `relative w-auto rounded-[0.12em] px-[0.16em] py-[0.07em] leading-none ${EDITORIAL_DESKTOP_TAB_STYLE} lg:border-primary lg:bg-dark lg:text-primary lg:transition-colors lg:hover:border-grayDark lg:hover:bg-grayDark lg:hover:text-dark lg:aria-pressed:border-grayDark lg:aria-pressed:bg-grayDark lg:aria-pressed:text-dark`

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
	const scrollContainerRef = useRef<HTMLDivElement>(null)

	useLayoutEffect(() => {
		if (window.matchMedia('(min-width: 1024px)').matches) {
			// Reset the panel after the story changes, before the new content paints.
			scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'instant' })
			return
		}
		document
			.getElementById('navbar-mobile')
			?.scrollIntoView({ behavior: 'smooth' })
	}, [activeTab])

	const handleTabClick = (tab: 'short' | 'long') => {
		setActiveTab(tab)
	}

	return (
		<div
			ref={scrollContainerRef}
			className={`lg:shadowtest section-folder-content section-folder-content--bigbang lg:no-scrollbar w-full [container-type:inline-size] lg:my-1 lg:h-[calc(100svh-8px)] lg:overflow-y-auto lg:rounded-xl lg:rounded-bl-none ${
				activeTab === 'short'
					? 'theme-bigbang-short-story'
					: 'theme-bigbang-long-story'
			}`}
		>
			<div className="theme-bigbang-story-tabs sticky left-0 top-2 z-10 mx-auto mb-2 mt-8 flex w-fit justify-between gap-2 text-base font-bold tracking-tight text-primary sm:justify-center lg:top-[clamp(2.25rem,4.78cqw,5rem)] lg:mb-2 lg:mt-[clamp(2.25rem,4.78cqw,5rem)] lg:gap-0">
				<button
					type="button"
					onClick={() => handleTabClick('short')}
					aria-pressed={activeTab === 'short'}
					className={`interactive-title-motion ${STORY_TAB_STYLE} lg:translate-y-0.5 lg:-rotate-3`}
				>
					<span className="relative z-10">
						{richTextToPlainText(localizedRichText(shortStory?.tabLabel, locale)) || 'Short story'}
					</span>
					{activeTab === 'short' && <StoryTabActivePill />}
				</button>
				<button
					type="button"
					onClick={() => handleTabClick('long')}
					aria-pressed={activeTab === 'long'}
					className={`interactive-title-motion ${STORY_TAB_STYLE} lg:-translate-y-0.5 lg:rotate-3`}
				>
					<span className="relative z-10">
						{richTextToPlainText(localizedRichText(longStory?.tabLabel, locale)) || 'Long story'}
					</span>
					{activeTab === 'long' && <StoryTabActivePill />}
				</button>
			</div>
			<div className="relative z-0 flex flex-col space-y-1 rounded-md pt-6 lg:pt-10">
				{activeTab === 'short' ? (
					<ShortStory
						content={shortStory?.body ?? []}
						lang={locale}
						scrollContainerRef={scrollContainerRef}
					/>
				) : (
					<LongStory content={longStory?.body ?? []} lang={locale} />
				)}
			</div>
		</div>
	)
}

export default BigBangContent

function StoryTabActivePill() {
	return (
		<motion.span
			layoutId="bigbang-story-tab-active-pill"
			className="absolute inset-0 rounded-[0.12em] bg-grayDark lg:hidden"
			transition={{ type: 'spring', stiffness: 420, damping: 34 }}
		/>
	)
}
