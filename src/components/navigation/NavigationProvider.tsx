'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface NavigationContextType {
	isSliding: boolean
	currentPath: string | null
	slideContent: (path: string) => void
	closeContent: () => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(
	undefined,
)

export function NavigationProvider({
	children,
	locale,
}: {
	children: ReactNode
	locale: string
}) {
	const [isSliding, setIsSliding] = useState(false)
	const [currentPath, setCurrentPath] = useState<string | null>(null)
	const router = useRouter()

	const slideContent = (path: string) => {
		setCurrentPath(path)
		setIsSliding(true)
		// Update URL without full page navigation
		window.history.pushState({}, '', path)
	}

	const closeContent = () => {
		setIsSliding(false)
		// Redirect to home page
		router.push(`/${locale}`)
		setCurrentPath(null)
	}

	return (
		<NavigationContext.Provider
			value={{ isSliding, currentPath, slideContent, closeContent }}
		>
			{children}
		</NavigationContext.Provider>
	)
}

export function useNavigation() {
	const context = useContext(NavigationContext)
	if (context === undefined) {
		throw new Error('useNavigation must be used within a NavigationProvider')
	}
	return context
}
