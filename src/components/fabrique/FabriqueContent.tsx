import Img from '@/ui/Img'

interface FabriqueContentProps {
	fabrique: any
	language: string
}

const FabriqueContent: React.FC<FabriqueContentProps> = ({
	fabrique,
	language,
}) => {
	const getLocalizedValue = (array: any[], lang: string) => {
		if (!Array.isArray(array)) return ''
		const item = array.find((entry) => entry._key === lang)
		return item ? item.value : ''
	}

	const getLocalizedText = (block: any, lang: string) => {
		if (!block || !block[lang]) return ''
		return block[lang]
			.map((textBlock: any) =>
				textBlock.children.map((child: any) => child.text).join(' '),
			)
			.join(' ')
	}

	return (
		<div className="p-4">
			<h1 className="text-3xl font-bold">
				{getLocalizedValue(fabrique.title, language)}
			</h1>
			<p className="mt-16 text-xl font-normal">
				{getLocalizedValue(fabrique.description, language)}
			</p>
			<div className="mt-4">
				<h3 className="text-lg font-bold">Actions</h3>
				{fabrique.actions?.map((action: any, index: number) => (
					<div key={index} className="mt-4">
						<h4 className="text-md font-anisette font-semibold">
							{getLocalizedValue(action.title, language).split(' -')[0]}
						</h4>
						{action.image?.asset && (
							<Img
								image={action.image}
								src={`/${action.image.asset._ref.split('-')[1]}-${action.image.asset._ref.split('-')[2]}.${action.image.asset._ref.split('-')[3]}`}
								alt={getLocalizedValue(action.title, language)}
								className="my-4 h-48 w-48 rounded-md object-cover"
							/>
						)}
						<p>{getLocalizedText(action.text, language)}</p>
					</div>
				))}
			</div>
			<div className="mt-4">
				<h3 className="text-lg font-bold">Vision</h3>
				{fabrique.vision?.map((vision: any, index: number) => (
					<div key={index} className="mt-2">
						<h4 className="text-md font-semibold">
							{getLocalizedValue(vision.title, language)}
						</h4>
						<p>{getLocalizedText(vision.text, language)}</p>
					</div>
				))}
			</div>
		</div>
	)
}

export default FabriqueContent
