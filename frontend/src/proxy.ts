import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const handleI18nRouting = createMiddleware(routing)

export function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname.replace(/\/$/, '')
	const locale = routing.locales.find((locale) => pathname === `/${locale}/contact`)
	if (pathname === '/contact' || locale) {
		const destination = request.nextUrl.clone()
		destination.pathname = locale ? `/${locale}/about` : '/about'
		return NextResponse.redirect(destination, 308)
	}

	return handleI18nRouting(request)
}

export const config = {
	// Match only internationalized pathnames
	matcher: [
		'/',
		'/:locale(fr|en)/((?!admin|api|_next|_vercel|.*\\..*).*)',
		'/(fr|en)/:path*',
		'/((?!admin|api|_next|_vercel|.*\\..*).*)',
	],
}
