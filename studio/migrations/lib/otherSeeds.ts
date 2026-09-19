import { localizeText } from './editorialContent'
import copyDefaults from '../../../frontend/src/content/filmSubmissionCopy.json'
import fr from '../../../frontend/messages/fr.json'
import en from '../../../frontend/messages/en.json'
import nl from '../../../frontend/messages/nl.json'

/** Seed only missing controls; preserve intentional empty values and all existing edits. */
export function seedOtherContent(document: any): any {
	const result = structuredClone(document)
	const seed = (name: string, values: Record<string, string>) => {
		if (result[name] === undefined) result[name] = localizeText(values)
	}
	if (result._type === 'contact') {
		for (const [field, message] of Object.entries({
			contactTitle: 'contact',
			partnersTitle: 'partners',
			mapLinkLabel: 'viewOnMap',
		})) {
			seed(field, {
				fr: (fr.contactPage as any)[message],
				en: (en.contactPage as any)[message],
				nl: (nl.contactPage as any)[message],
			})
		}
	}
	if (result._type === 'filmSubmissionSettings' && !Array.isArray(result.filmSubmissionContent)) {
		const existing = result.filmSubmissionContent
		// Preserve an intentionally cleared field. Missing and legacy keyed content become shared-shape entries.
		if (existing === undefined || (existing && typeof existing === 'object')) {
			const groups = [
				'intro',
				'steps',
				'labels',
				'consent',
				'success',
				'navigation',
				'placeholders',
				'errors',
			]
			result.filmSubmissionContent = Object.entries(copyDefaults)
				.sort(
					([, first], [, second]) =>
						groups.indexOf(first.group) - groups.indexOf(second.group),
				)
				.map(([name, field]) => {
					const saved = existing?.[name]
					const value =
						saved !== undefined
							? saved
							: field.native
								? ['fr', 'en', 'nl'].map((language) => ({
										_type: 'internationalizedArrayStringValue',
										_key: language,
										language,
										value: field.value,
									}))
								: localizeText({
										fr: field.value,
										en: field.value,
										nl: field.value,
									})
					return {
						_type: 'formCopyEntry',
						_key: name,
						name,
						[field.native ? 'nativeText' : 'richContent']: value,
					}
				})
		}
	}
	return result
}
