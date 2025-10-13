// import { GoogleTagManager } from '@next/third-parties/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

import { NuqsAdapter } from 'nuqs/adapters/next/app'
import SkipToContent from '@/ui/SkipToContent'
import Announcement from '@/ui/Announcement'

import VisualEditingControls from '@/ui/VisualEditingControls'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '@/styles/app.css'
import { GeistSans } from 'geist/font/sans'
import { ThemeProvider } from 'next-themes'
import { ViewTransitions } from 'next-view-transitions'
import NavBar from '@/components/navigation/NavBar'
import localFont from 'next/font/local'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Metadata } from 'next'
import NavBarMobile from '@/components/navigation/NavBarMobile'
import Link from 'next/link'
import LogoShortAnimated from '@/components/svgs/LogoShortAnimated'
import SectionOverlay from '@/components/navigation/SectionOverlay'

export const metadata: Metadata = {
	title: 'System_D | Empowering self-made filmmakers',
	description:
		'System_D supports self-taught filmmakers by offering resources for research, production, and distribution. Focusing on decolonization and amplifying diverse voices, it creates a platform for emerging creators to share alternative stories and engage with professional feedback.',
}

export default async function RootLayout({
	children,
	params,
}: {
	children: React.ReactNode
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const messages = await getMessages()

	return (
		<ViewTransitions>
			<html lang={locale} suppressHydrationWarning className="no-scrollbar">
				{/* <GoogleTagManager gtmId='' /> */}

				<body
					className={`${GeistSans.className} relative bg-dark text-ink antialiased`}
				>
					{/* <ThemeProvider attribute="class" defaultTheme="dark"> */}
					<NextIntlClientProvider messages={messages}>
						<NuqsAdapter>
							<NavBar locale={locale} />
							<NavBarMobile locale={locale} />

							{/* <Header /> */}
							{/* <main id="main-content" role="main" tabIndex={-1}>
						{children}
					</main> */}

							<main className="z-40 w-full rounded-md lg:flex lg:min-h-[calc(100svh-1rem)] lg:w-full lg:items-center lg:justify-center lg:px-[calc(var(--width-column-width))]">
								{children}
							</main>

							<VisualEditingControls />
						</NuqsAdapter>

						<Analytics />
						<SpeedInsights />
					</NextIntlClientProvider>
					{/* </ThemeProvider> */}
				</body>
			</html>
		</ViewTransitions>
	)
}
