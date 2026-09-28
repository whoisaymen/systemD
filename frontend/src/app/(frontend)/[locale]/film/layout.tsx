import type { ReactNode } from 'react'
import FilmNavigationProvider from '@/components/film/FilmNavigationProvider'

export default function FilmLayout({ children }: { children: ReactNode }) {
	return <FilmNavigationProvider>{children}</FilmNavigationProvider>
}
