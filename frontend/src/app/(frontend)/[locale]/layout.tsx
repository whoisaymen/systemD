import { cache } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

import { NuqsAdapter } from 'nuqs/adapters/next/app'

import VisualEditingControls from '@/ui/VisualEditingControls'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '@/styles/app.css'
import { GeistSans } from 'geist/font/sans'
import { ViewTransitions } from 'next-view-transitions'
import NavBar from '@/components/navigation/NavBar'
import { Metadata } from 'next'
import NavBarMobile from '@/components/navigation/NavBarMobile'
import { getSite } from '@/sanity/lib/queries'
import { buildThemeInitializerScript, resolveThemeCombos } from '@/lib/theme'

const FALLBACK_TITLE = 'System_D | Empowering self-made filmmakers'
const FALLBACK_DESCRIPTION =
	'System_D supports self-taught filmmakers by offering resources for research, production, and distribution. Focusing on decolonization and amplifying diverse voices, it creates a platform for emerging creators to share alternative stories and engage with professional feedback.'

const getOptionalSite = cache(async () => {
	try {
		return await getSite()
	} catch {
		return null
	}
})

export async function generateMetadata(): Promise<Metadata> {
	const site = await getOptionalSite()
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

	return {
		metadataBase: baseUrl ? new URL(baseUrl) : undefined,
		title: site?.title || FALLBACK_TITLE,
		description: site?.description || FALLBACK_DESCRIPTION,
		icons: site?.favicon
			? {
					icon: [{ url: site.favicon }],
				}
			: undefined,
		openGraph: {
			type: 'website',
			title: site?.title || FALLBACK_TITLE,
			description: site?.description || FALLBACK_DESCRIPTION,
			images: site?.ogimage ? [site.ogimage] : undefined,
		},
	}
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
	const site = await getOptionalSite()
	const themes = resolveThemeCombos(site)
	const themeInitializer = buildThemeInitializerScript(themes)

	return (
		<ViewTransitions>
			<html
				lang={locale}
				suppressHydrationWarning
				data-scroll-behavior="smooth"
				className="no-scrollbar"
			>
				<head>
					<script dangerouslySetInnerHTML={{ __html: themeInitializer }} />
				</head>
				{/* <GoogleTagManager gtmId='' /> */}

				<body
					className={`${GeistSans.className} relative bg-dark text-ink antialiased`}
				>
					{/* <ThemeProvider attribute="class" defaultTheme="dark"> */}
					<NextIntlClientProvider messages={messages}>
						<NuqsAdapter>
							<NavBar locale={locale} social={site?.social} themes={themes} />
							<NavBarMobile
								locale={locale}
								social={site?.social}
								themes={themes}
							/>

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
