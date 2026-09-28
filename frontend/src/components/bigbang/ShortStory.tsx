'use client'

import { type RefObject } from 'react'
import BackToTopButton from '../common/BackToTop'
import { renderParagraph } from '../common/RenderParagraph'
import { localizedRichText } from '@/lib/richText'
import { EDITORIAL_BODY_TEXT } from '@/components/common/editorialStyles'
import StoryIllustration from './StoryIllustration'

type ShortStoryBlock = { _key: string } & (
	| { _type: 'customParagraph'; text?: unknown }
	| {
			_type: 'storyIllustration'
			svgMarkup?: string
			size?: 'wide' | 'compact'
	  }
)

const ShortStory = ({
	content,
	lang,
	scrollContainerRef,
}: {
	content: ShortStoryBlock[]
	lang: string
	scrollContainerRef: RefObject<HTMLDivElement | null>
}) => (
	<div
		id="short-story"
		className="mx-auto flex w-full flex-col gap-6 pb-24 sm:gap-10 lg:max-w-[60rem] lg:pb-16"
	>
		<div className="fixed bottom-4 right-12 z-50">
			<BackToTopButton targetId="navbar-mobile" />
		</div>
		{content.map((block) => (
			<div
				key={block._key}
				className="flex w-full flex-col items-center justify-center gap-6 px-4 text-center sm:gap-10"
			>
				{block._type === 'customParagraph' && !!block.text && (
					<div className="theme-bigbang-short-story-copy relative px-4 sm:mx-40">
						<div className={`${EDITORIAL_BODY_TEXT} text-center text-primary`}>
							{renderParagraph(
								{ value: localizedRichText(block.text, lang) },
								[],
								'bg-primary text-dark',
							)}
						</div>
					</div>
				)}
				{block._type === 'storyIllustration' && block.svgMarkup && (
					<StoryIllustration
						markup={block.svgMarkup}
						lang={lang}
						compact={block.size === 'compact'}
						scrollContainerRef={scrollContainerRef}
					/>
				)}
			</div>
		))}
	</div>
)

export default ShortStory
