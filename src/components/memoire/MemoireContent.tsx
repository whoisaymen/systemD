import Img from '@/ui/Img'
import MemoireFwdIcon from './MemoireFwdIcon'
import Logo from '@/sanity/schemas/documents/logo'
import { LogoShort } from '../svgs'
import LogoShortTsx from '../svgs/LogoShort'
import Link from 'next/link'

interface MemoireContentProps {
	memoire: any
	language: string
}

const MemoireContent: React.FC<MemoireContentProps> = ({
	memoire,
	language,
}) => {
	const getLocalizedValue = (array: any[], lang: string) => {
		if (!Array.isArray(array)) {
			return ''
		}
		const item = array.find((entry) => entry._key === lang)
		return item ? item.value : ''
	}

	if (!memoire) {
		return <div>No content available</div>
	}

	return (
		<div className="no-scrollbar flex h-full w-full flex-col space-y-1 overflow-y-scroll rounded-md bg-white p-12">
			<div className="flex h-auto w-full items-center justify-center space-x-8">
				<div className="flex h-full w-1/2 items-center justify-center rounded-lg bg-none py-12">
					<MemoireFwdIcon className="text-primary group-hover:text-primary px-16" />
				</div>

				<div className="w-1/2">
					{memoire.title && (
						<h1 className="text-grayLight text-3xl font-bold">
							{getLocalizedValue(memoire.title, language)}
						</h1>
					)}
					{memoire.description && (
						<p>{getLocalizedValue(memoire.description, language)}</p>
					)}
				</div>
			</div>

			{memoire.pastFestivals && memoire.pastFestivals.length > 0 && (
				<div>
					<h2 className="mb-4 text-2xl font-bold">Past Festivals</h2>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{memoire.pastFestivals.map((festival: any, index: number) => (
							<Link
								key={index}
								href={`/${language}/festival/${festival.year}`}
								className="relative block rounded-md border p-4 shadow-md transition-shadow duration-300 hover:shadow-lg"
							>
								<div className="absolute left-2 top-2 rounded-md bg-white bg-opacity-75 p-2">
									<p className="text-sm font-semibold">{festival.year}</p>
									<p className="text-xs">{festival.venue}</p>
								</div>
								{festival.visual ? (
									<Img
										image={festival.visual}
										src={festival.visual.asset.url}
										alt={
											festival.title
												? getLocalizedValue(festival.title, language)
												: 'Festival image'
										}
										className="h-48 w-full rounded-md object-cover"
									/>
								) : (
									<div className="flex h-48 w-full items-center justify-center rounded-md bg-gray-200">
										<p>No image available</p>
									</div>
								)}
								<h3 className="mt-4 text-xl font-semibold">
									{festival.title
										? getLocalizedValue(festival.title, language)
										: 'No title available'}
								</h3>
								<p className="mt-2 text-sm">
									{festival.description
										? getLocalizedValue(festival.description, language)
										: 'No description available'}
								</p>
							</Link>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export default MemoireContent
