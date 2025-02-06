import Img from '@/ui/Img'

interface EquipeContentProps {
	person: any
	language: string
}

const EquipeContent: React.FC<EquipeContentProps> = ({ person, language }) => {
	const getLocalizedValue = (array: any[], lang: string) => {
		const item = array.find((entry) => entry._key === lang)
		return item ? item.value : ''
	}

	return (
		<div className="p-4">
			<h1 className="text-3xl font-bold">{person.name}</h1>
			<Img
				image={person.image}
				src={`/${person.image.asset._ref.split('-')[1]}-${person.image.asset._ref.split('-')[2]}.${person.image.asset._ref.split('-')[3]}`}
				alt={person.name}
				className="my-4 h-48 w-48 rounded-md object-cover"
			/>
			<h2 className="font-anisette text-xl font-semibold">
				{getLocalizedValue(person.title, language)}
			</h2>
			<p className="mt-2 text-lg">
				{getLocalizedValue(person.biography, language)}
			</p>
		</div>
	)
}

export default EquipeContent
