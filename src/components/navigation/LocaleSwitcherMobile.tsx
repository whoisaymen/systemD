import { useLocale, useTranslations } from 'next-intl'
import { routing } from '@/i18n/routing'
import LocaleSwitcherSelect from './LocaleSwitcherSelect'

export default function LocaleSwitcherMobile() {
	const locale = useLocale()

	return (
		<LocaleSwitcherSelect defaultValue={locale} label="Select language">
			{routing.locales.map((cur) => (
				<option key={cur} value={cur} className="">
					{cur.toUpperCase()}
				</option>
			))}
		</LocaleSwitcherSelect>
	)
}
