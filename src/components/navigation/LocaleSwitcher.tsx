import { useLocale, useTranslations } from 'next-intl'
import { routing } from '@/i18n/routing'
import LocaleSwitcherSelect from './LocaleSwitcherSelect'

const availableLocales = [
	{ code: 'en', label: 'English' },
	{ code: 'fr', label: 'Français' },
]

export default function LocaleSwitcher() {
	const locale = useLocale()

	console.log(locale, 'locale')

	return (
		<LocaleSwitcherSelect defaultValue={locale} label="Select language">
			{routing.locales.map((cur) => (
				<option key={cur} value={cur}>
					{cur.toUpperCase()}
				</option>
			))}
		</LocaleSwitcherSelect>
	)
}
