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

	if (!film) {
		return <div>No content available</div>
	}

	return (
		<div className="no-scrollbar flex h-full w-full flex-col space-y-4 overflow-y-scroll rounded-md bg-white p-6">
			{film.poster && (
				<Img
					image={film.poster}
					src={film.poster.asset.url}
					alt={getLocalizedValue(film.title, language)}
					className="h-auto w-full rounded-md"
				/>
			)}
			{film.title && (
				<h1 className="text-3xl font-bold">
					{getLocalizedValue(film.title, language)}
				</h1>
			)}
			{film.description && (
				<p>{getLocalizedValue(film.description, language)}</p>
			)}
			<p className="text-lg font-semibold">Director: {film.director}</p>
			<p className="text-lg">Production: {film.production}</p>
			<p className="text-lg">Year: {film.year}</p>
			{film.genre && film.genre.title && (
				<p className="text-lg">
					Genre: {getLocalizedValue(film.genre.title, language)}
				</p>
			)}
		</div>
	)
}

export default FilmContent
