'use client'
import Img from '@/ui/Img'
import { motion } from 'motion/react'

interface FabriqueContentProps {
	fabrique: any
	language: string
}

const FabriqueContent: React.FC<FabriqueContentProps> = ({
	fabrique,
	language,
}) => {
	if (!fabrique) return <p>No data available.</p>

	console.log(fabrique, 'fabrique')

	// Function to get localized values
	const getLocalizedValue = (array: any[], lang: string) => {
		if (!Array.isArray(array)) return ''
		const item = array.find((entry) => entry._key === lang)
		return item?.value || ''
	}

	// Function to get localized text (specifically for `biography`)
	const getLocalizedText = (array: any[], lang: string) => {
		if (!Array.isArray(array)) return ''
		const item = array.find((entry) => entry._key === lang)
		return item?.value || ''
	}

	return (
		<div className="no-scrollbar flex h-full w-full flex-col space-y-4 overflow-y-scroll rounded-md px-4 py-32 text-base font-medium leading-tight tracking-tighter text-dark dark:text-primary sm:space-y-0 sm:bg-white sm:px-0 sm:pt-0">
			<h1 className="text-3xl font-extrabold dark:font-bold">
				{getLocalizedValue(fabrique.title, language) || 'No title available'}
			</h1>
			{/* Biography */}
			<p className="mt-4 text-xl font-normal tracking-tighter">
				{getLocalizedText(fabrique.description, language) ||
					'No description available'}
			</p>
			{/* Image */}
			{fabrique.image?.asset && (
				<Img
					image={fabrique.image}
					src={`/${fabrique.image.asset._ref.split('-')[1]}-${fabrique.image.asset._ref.split('-')[2]}.${fabrique.image.asset._ref.split('-')[3]}`}
					alt={fabrique.name}
					className="my-4 h-48 w-48 rounded-md object-cover"
				/>
			)}
		</div>
	)
}

export default FabriqueContent
