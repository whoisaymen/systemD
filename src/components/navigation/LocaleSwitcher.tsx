import { useLocale, useTranslations } from 'next-intl'
import { routing } from '@/i18n/routing'
import LocaleSwitcherSelect from './LocaleSwitcherSelect'
import LocaleSwitcherDropdown from './LocaleSwitcherDropdown'

export default function LocaleSwitcher() {
	const locale = useLocale()

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

// 	return (
// 		<LocaleSwitcherDropdown defaultValue={locale}>
// 			{routing.locales.map((cur) => ({
// 				value: cur,
// 				label: cur.toUpperCase(),
// 			}))}
// 		</LocaleSwitcherDropdown>
// 	)
// }
