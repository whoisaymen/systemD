// import { GoogleTagManager } from '@next/third-parties/google'
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

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			{/* <GoogleTagManager gtmId='' /> */}

			<body className={`${GeistSans.className} bg-canvas text-ink antialiased`}>
				<NuqsAdapter>
					<SkipToContent />
					<Announcement />
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
			</body>
		</html>
	)
}
