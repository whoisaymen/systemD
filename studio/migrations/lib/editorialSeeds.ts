import { seedStoryContent } from './storySeeds'
import { seedFestivalContent } from './festivalSeeds'
import { seedOtherContent } from './otherSeeds'

/** Add missing fields while preserving existing customer copy. */
export function seedEditorialContent(document: any, documents: any[]): any {
	const result = seedOtherContent(
		seedFestivalContent(seedStoryContent(structuredClone(document))),
	)
	if (result._type === 'lefestival' && !result.vision?.length) {
		const draft = result._id.startsWith('drafts.')
		const fabrique =
			documents.find(
				(item) =>
					item._type === 'fabrique' && item._id.startsWith('drafts.') === draft,
			) ??
			documents.find(
				(item) => item._type === 'fabrique' && !item._id.startsWith('drafts.'),
			)
		if (fabrique?.vision) result.vision = structuredClone(fabrique.vision)
	}
	return result
}
