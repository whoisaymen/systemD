import type { ReactNode } from 'react'
import Img from '@/ui/Img'
import { cn } from '@/lib/utils'

type LogoVariant = 'default' | 'light' | 'dark'

export default function CmsLogo({
	logo,
	variant = 'default',
	alt,
	className,
	fallback,
}: {
	logo?: Sanity.Logo
	variant?: LogoVariant
	alt?: string
	className?: string
	fallback?: ReactNode
}) {
	const svg = getSafeSvg(logo?.svg)

	if (svg) {
		return (
			<span
				aria-label={alt || logo?.name}
				className={cn(
					'inline-block leading-[0] [&_svg]:h-auto [&_svg]:w-full',
					className,
				)}
				dangerouslySetInnerHTML={{ __html: svg }}
			/>
		)
	}

	const image = logo?.image?.[variant] || logo?.image?.default

	if (image) {
		return (
			<Img
				image={image}
				alt={alt || logo?.name || ''}
				className={className}
				themeGrade={false}
			/>
		)
	}

	return fallback
}

function getSafeSvg(svg?: string) {
	return svg
		?.replace(/<script[\s\S]*?<\/script>/gi, '')
		.replace(/\son\w+=(["']).*?\1/gi, '')
		.trim()
}
