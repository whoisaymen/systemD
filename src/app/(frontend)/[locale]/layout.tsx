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
	params: { locale: string }
}) {
	const { locale } = await params
	const messages = await getMessages()

	return (
		<ViewTransitions>
			<html lang={locale} suppressHydrationWarning>
				{/* <GoogleTagManager gtmId='' /> */}

				<body
					className={`${GeistSans.className} bg-[#DADADA] text-ink antialiased`}
				>
					<ThemeProvider attribute="class" defaultTheme="dark">
						<NextIntlClientProvider messages={messages}>
							<NuqsAdapter>
								<SkipToContent />
								<Announcement />
								<NavBar locale={locale} />
								{/* <Header /> */}
								{/* <main id="main-content" role="main" tabIndex={-1}>
						{children}
					</main> */}
								<main className="flex h-screen w-full items-center justify-center">
									<div className="no-scrollbar z-40 flex h-[calc(100svh-0.50rem)] w-[calc(100vw-2*var(--width-column-width))] items-start justify-center overflow-y-scroll rounded-md">
										{children}
									</div>
								</main>

								{/* <Footer /> */}

								<VisualEditingControls />
							</NuqsAdapter>

							<Analytics />
							<SpeedInsights />
						</NextIntlClientProvider>
					</ThemeProvider>
				</body>
			</html>
		</ViewTransitions>
	)
}
