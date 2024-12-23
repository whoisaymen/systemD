const languages = [
	{ id: 'en', title: 'English', isDefault: true },
	{ id: 'nl', title: 'Dutch' },
	{ id: 'fr', title: 'French' },
]

const defaultLanguage = languages.find((item) => item.isDefault)

if (!defaultLanguage) {
	throw new Error('Default language not found')
}

const i18n = {
	languages,
	base: defaultLanguage.id,
}

const googleTranslateLanguages = languages.map(({ id, title }) => ({
	id,
	title,
}))

// For v2 studio
// module.exports = {i18n, googleTranslateLanguages}

// For v3 studio
export { i18n, googleTranslateLanguages }
