import { localizeText } from './editorialContent'

export const editionMenuLabels: Record<string, Record<string, string>> = {
	filmsTitle: {
		fr: 'Sélection films',
		en: 'Film Selection',
		nl: 'Filmselectie',
	},
	exhibitionTitle: {
		fr: 'Exposition',
		en: 'Exhibition',
		nl: 'Tentoonstelling',
	},
	photosTitle: {
		fr: 'Galerie photo',
		en: 'Photo Gallery',
		nl: 'Fotogalerij',
	},
	juryTitle: {
		fr: 'Jury',
		en: 'Jury',
		nl: 'Jury',
	},
}

/** Preserve existing fields, including deliberately empty values, when exposing labels in Studio. */
export function seedFestivalContent(document: any): any {
	const result = structuredClone(document)
	const seed = (field: string, translations: Record<string, string>) => {
		if (result[field] === undefined) result[field] = localizeText(translations)
	}
	if (result._type === 'memoire' && result.menu === undefined) {
		result.menu = Object.fromEntries(
			Object.entries(editionMenuLabels).map(([field, translations]) => [
				field,
				localizeText(translations),
			]),
		)
	}
	if (result._type === 'lefestival') {
		seed('visionTitle', {
			fr: 'Notre vision',
			en: 'Our Vision',
			nl: 'Onze visie',
		})
		result.blocks = result.blocks?.map((block: any) => {
			if (block.title !== undefined) return block
			if (block._type === 'juryBlock')
				return {
					...block,
					title: localizeText({ fr: 'Jury', en: 'Jury', nl: 'Jury' }),
				}
			if (block._type === 'onTourBlock')
				return {
					...block,
					title: localizeText({
						fr: 'Événements',
						en: 'Events',
						nl: 'Evenementen',
					}),
				}
			return block
		})
	}

	return result
}
