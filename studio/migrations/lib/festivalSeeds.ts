import { localizeText } from './editorialContent'

const editionLabels: Record<string, Record<string, string>> = {
	overviewTitle: {
		fr: 'Aperçu',
		en: 'Overview',
		nl: 'Overzicht',
	},
	filmsTitle: {
		fr: 'Sélection films',
		en: 'Film Selection',
		nl: 'Filmselectie',
	},
	exhibitionTitle: {
		fr: 'Expo Photo',
		en: 'Photo Exhibition',
		nl: 'Foto-expo',
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
	if (result._type === 'festival') {
		for (const [field, translations] of Object.entries(editionLabels))
			seed(field, translations)
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
