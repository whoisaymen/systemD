'use client'

import {
	createContext,
	useContext,
	useState,
	useTransition,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import NewArrowRightSimple from '../common/NewArrowRightSimple'
import NewArrowRightFull from '../common/NewArrowRightFull'

interface FilmTarget {
	href: string
	title: string
}

interface FilmNavigationState {
	pathname: string
	currentIndex: number
	total: number
	previous: FilmTarget | null
	next: FilmTarget | null
}

const FilmNavigationContext = createContext<{
	setNavigation: Dispatch<SetStateAction<FilmNavigationState | null>>
	isPending: boolean
} | null>(null)

export function useFilmNavigationControls() {
	const context = useContext(FilmNavigationContext)
	if (!context)
		throw new Error('Film navigation requires the shared film layout')
	return context
}

export default function FilmNavigationProvider({
	children,
}: {
	children: ReactNode
}) {
	const [navigation, setNavigation] = useState<FilmNavigationState | null>(null)
	const [isTransitionPending, startTransition] = useTransition()
	const pathname = usePathname()
	const router = useRouter()
	// The URL can commit before the film data arrives. Retain the controls, but
	// disable stale destinations until the new page registers its navigation.
	const isPending =
		isTransitionPending ||
		Boolean(navigation && navigation.pathname !== pathname)
	const navigate = (target: FilmTarget | null) => {
		if (!target || isPending) return
		startTransition(() => router.push(target.href))
	}
	const directions = navigation
		? [
				{
					key: 'previous',
					label: 'Previous film',
					target: navigation.previous,
					rotation: 'rotate-180',
				},
				{
					key: 'next',
					label: 'Next film',
					target: navigation.next,
					rotation: '',
				},
			]
		: []

	return (
		<FilmNavigationContext.Provider value={{ setNavigation, isPending }}>
			<div className="relative w-full">
				{children}
				{navigation && navigation.currentIndex >= 0 && (
					<>
						<nav
							aria-label="Film navigation"
							aria-busy={isPending}
							className="pointer-events-none fixed inset-x-0 bottom-0 z-50 mb-4 flex items-center justify-between px-8 lg:hidden"
						>
							<span
								role="status"
								className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 rounded-md border-2 border-dark bg-grayDark px-2 text-base tabular-nums tracking-tighter text-dark"
							>
								{navigation.currentIndex + 1}/{navigation.total}
							</span>
							{directions.map(({ key, label, target, rotation }) =>
								target ? (
									<button
										key={key}
										type="button"
										className="pointer-events-auto"
										onClick={() => navigate(target)}
										disabled={isPending}
										aria-label={label}
										title={target.title}
									>
										<NewArrowRightSimple
											theme={{ stroke: 'var(--color-dark)' }}
											className={`h-10 w-10 rounded-lg border-2 border-dark bg-grayDark p-2 ${rotation}`}
										/>
									</button>
								) : (
									<div key={key} className="w-10" />
								),
							)}
						</nav>
						<nav
							aria-label="Film navigation"
							aria-busy={isPending}
							className="absolute bottom-8 left-1/2 z-50 hidden -translate-x-1/2 items-center rounded-md bg-dark px-2 text-primary lg:flex"
						>
							{directions.map(({ key, label, target, rotation }, index) => (
								<div key={key} className="flex items-center">
									{index === 1 && (
										<span className="translate-y-1 text-base tabular-nums">
											{navigation.currentIndex + 1}/{navigation.total}
										</span>
									)}
									<button
										type="button"
										onClick={() => navigate(target)}
										disabled={!target || isPending}
										aria-label={label}
										title={target?.title}
										className={`relative aspect-[76/61] w-10 rounded-md transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary enabled:hover:opacity-70 ${target ? '' : 'opacity-30'}`}
									>
										<NewArrowRightFull
											theme={{ stroke: 'var(--color-primary)' }}
											strokeWidth={8}
											className={`absolute inset-0 h-full w-full translate-y-1 scale-[0.55] ${rotation}`}
										/>
									</button>
								</div>
							))}
						</nav>
					</>
				)}
			</div>
		</FilmNavigationContext.Provider>
	)
}
