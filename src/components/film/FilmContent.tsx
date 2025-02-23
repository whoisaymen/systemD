import { getRandomRotationClass } from '@/lib/utils'
import Img from '@/ui/Img'

interface FilmContentProps {
	film: any
	language: string
}

const FilmContent: React.FC<FilmContentProps> = ({ film, language }) => {
	const getLocalizedValue = (array: any[], lang: string) => {
		if (!Array.isArray(array)) {
			return ''
		}
		const item = array.find((entry) => entry._key === lang)
		return item ? item.value : ''
	}

	console.log(film, 'film')

	if (!film) {
		return <div>No content available</div>
	}

	return (
		<div className="no-scrollbar flex h-full w-full flex-col space-y-8 overflow-y-scroll rounded-md px-4 py-24 tracking-tighter sm:bg-white">
			{film.affiche && (
				<Img
					image={film.affiche}
					src={film.affiche.asset.url}
					alt={getLocalizedValue(film.title, language)}
					className="mt-8 h-auto w-full rounded-md border-2 border-primary"
				/>
			)}
			<div className="flex flex-col items-center">
				{film.title && (
					<h1 className="rounded-md border-2 border-dark bg-primary px-2 text-center text-3xl font-black italic text-dark">
						{getLocalizedValue(film.title, language)}
					</h1>
				)}
				<p
					className={`z-10 inline-block w-auto rounded-md border-2 border-primary bg-dark px-2 py-0 text-center font-medium tracking-tight text-primary ${getRandomRotationClass()}`}
				>
					{film.director}
				</p>
			</div>
			{film.synopsis && <p>{getLocalizedValue(film.synopsis, language)}</p>}

			<div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
				{film.production && (
					<div className="flex flex-col">
						<span className="text-xs font-bold uppercase">Production</span>
						<span>{film.production}</span>
					</div>
				)}

				{film.year && (
					<div className="flex flex-col">
						<span className="text-xs font-bold uppercase">Year</span>
						<span>{film.year}</span>
					</div>
				)}

				{film.genre && film.genre.title && (
					<div className="flex flex-col">
						<span className="text-xs font-bold uppercase">Genre</span>
						<span>{getLocalizedValue(film.genre.title, language)}</span>
					</div>
				)}

				{film.city && (
					<div className="flex flex-col">
						<span className="text-xs font-bold uppercase">City</span>
						<span>{getLocalizedValue(film.city, language)}</span>
					</div>
				)}

				{film.length && (
					<div className="flex flex-col">
						<span className="text-xs font-bold uppercase">Length</span>
						<span>{film.length} minutes</span>
					</div>
				)}

				{film.playFilmUrl && (
					<a
						href={film.playFilmUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-500 underline"
					>
						Watch Film
					</a>
				)}
			</div>
		</div>
	)
}

export default FilmContent
