import Img from '@/ui/Img'

interface EquipeContentProps {
	person: any
	language: string
}

const EquipeContent: React.FC<EquipeContentProps> = ({ person, language }) => {
	console.log(person, 'person')

	const getLocalizedValue = (array: any[], lang: string) => {
		const item = array.find((entry) => entry._key === lang)
		return item ? item.value : ''
	}

	const imageUrl = person.image.asset._ref
		? `/${person.image.asset._ref.split('-')[1]}-${person.image.asset._ref.split('-')[2]}.${person.image.asset._ref.split('-')[3]}`
		: ''

	return (
		<div className="mt-12 flex h-full w-full flex-col items-center space-y-20 rounded-md px-2 pt-6 sm:mt-0 sm:bg-white">
			<div className="h-32"></div>
			{imageUrl && (
				<div className="relative">
					<Img
						image={person.image}
						src={imageUrl}
						alt={person.name}
						className="my-4 h-48 w-48 rounded-md object-cover"
					/>
					<h1 className="bg-dark text-primary absolute right-10 top-0 w-full -rotate-12 rounded-md px-2 text-xl font-black uppercase italic tracking-tighter">
						{person.name}
					</h1>
				</div>
			)}
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
