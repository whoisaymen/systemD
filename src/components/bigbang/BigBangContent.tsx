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
	return (
		<div className="w-full space-y-20 rounded-md bg-white pt-6">
			<div className="flex items-center justify-center gap-2 text-lg font-bold uppercase tracking-tight">
				<h2 className="h-full rounded-md border-[0px] border-black bg-[#DEFE04] px-4 py-0 text-[#8C8C8F]">
					ShOrT StOrY
				</h2>
				<h2 className="text-primary h-full rounded-md border-[0px] border-black bg-[#8C8C8F] bg-none px-4 py-0">
					LOng StOrY
				</h2>
				{/* <h2 className="h-full rounded-md border-[0px] border-black px-4 py-0 text-[#8C8C8F]">
					System
				</h2>
				<h2 className="-mx-6 -my-6 h-full rounded-md border-[0px] border-black py-0 text-[#8C8C8F]">
					_
				</h2>
				<h2 className="h-full rounded-md border-[0px] border-black px-4 py-0 text-[#8C8C8F]">
					D
				</h2> */}
			</div>
			<ShortStory content={shortStory.body} lang={locale} />
		</div>
	)
}

export default BigBangContent
