import React from 'react'
import ShortStory from './ShortStory'

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
	console.log(locale, 'locale')
	return (
		<div className="mt-10 space-y-20">
			<div className="font-anisette flex h-auto w-full items-center justify-center gap-2 text-lg font-bold tracking-tight">
				<h2 className="h-full rounded-md border-[0px] border-black bg-[#DEFE04] px-4 py-0 text-[#8C8C8F]">
					ShOrT StOrY
				</h2>
				<h2 className="h-full rounded-md border-[0px] border-black bg-[#8C8C8F] bg-none px-4 py-0 text-[#fff]/40">
					LOng StOrY
				</h2>
			</div>
			<ShortStory content={shortStory.body} lang={locale} />
		</div>
	)
}

export default BigBangContent
