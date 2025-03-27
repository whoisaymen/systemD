'use client'

import clsx from 'clsx'
import { useParams } from 'next/navigation'
import { ChangeEvent, ReactNode, useTransition } from 'react'
import { Locale, usePathname, useRouter } from '@/i18n/routing'

type Props = {
	children: ReactNode
	defaultValue: string
	label: string
}

export default function LocaleSwitcherSelect({
	children,
	defaultValue,
	label,
}: Props) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const pathname = usePathname()
	const params = useParams()

	function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
		const nextLocale = event.target.value as Locale
		startTransition(() => {
			router.replace(
				// @ts-expect-error -- TypeScript will validate that only known `params`
				// are used in combination with a given `pathname`. Since the two will
				// always match for the current route, we can skip runtime checks.
				{ pathname, params },
				{ locale: nextLocale },
			)
		})
	}

	return (
		<label
			className={clsx(
				'relative text-gray-400',
				isPending && '!outline-none transition-opacity [&:disabled]:opacity-30',
			)}
		>
			<p className="sr-only">{label}</p>
			<select
				className="inline-flex h-full w-full appearance-none rounded-r-none bg-primary px-2 text-base font-bold tracking-tighter text-dark !outline-none dark:bg-dark dark:text-primary sm:text-2xl sm:dark:bg-transparent"
				defaultValue={defaultValue}
				disabled={isPending}
				onChange={onSelectChange}
			>
				{children}
			</select>
			{/* <span className="pointer-events-none absolute right-2 top-[8px]">⌄</span> */}
		</label>
	)
}
