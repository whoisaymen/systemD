// import { GoogleTagManager } from '@next/third-parties/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

import { NuqsAdapter } from 'nuqs/adapters/next/app'
import SkipToContent from '@/ui/SkipToContent'
import Announcement from '@/ui/Announcement'
import Header from '@/ui/header'
import Footer from '@/ui/footer'
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
	description: 'The official Next.js Course Dashboard, built with App Router.',
	metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
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
					className={`${GeistSans.className} bg-black text-ink antialiased`}
				>
					<NextIntlClientProvider messages={messages}>
						<NuqsAdapter>
							<SkipToContent />
							<Announcement />
							{/* <NavBar locale={locale} /> */}
							{/* <Header /> */}
							{/* <main id="main-content" role="main" tabIndex={-1}>
						{children}
					</main> */}
							<ThemeProvider attribute="class">{children}</ThemeProvider>

							{/* <Footer /> */}

							<VisualEditingControls />
						</NuqsAdapter>

						<Analytics />
						<SpeedInsights />
					</NextIntlClientProvider>
				</body>
			</html>
		</ViewTransitions>
	)
}
