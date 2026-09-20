import Image from 'next/image'

export type PartnerLogoAsset = {
	url?: string
	mimeType?: string
	metadata?: {
		dimensions?: { width?: number; height?: number }
	}
}

export default function PartnerLogo({
	asset,
	name,
}: {
	asset?: PartnerLogoAsset
	name: string
}) {
	if (!asset?.url) return null

	if (
		asset.mimeType === 'image/svg+xml' ||
		/\.svg(?:[?#]|$)/i.test(asset.url)
	) {
		// Paint the SVG silhouette with the active palette's primary token.
		const mask = `url(${JSON.stringify(asset.url)}) center / contain no-repeat`
		return (
			<span
				role="img"
				aria-label={name || undefined}
				aria-hidden={name ? undefined : true}
				className="mx-auto block h-10 w-full lg:h-12"
				style={{
					backgroundColor: 'var(--color-primary)',
					mask,
					WebkitMask: mask,
				}}
			/>
		)
	}

	return (
		<Image
			width={asset.metadata?.dimensions?.width ?? 180}
			height={asset.metadata?.dimensions?.height ?? 90}
			loading="lazy"
			src={asset.url}
			alt={name}
			className="mx-auto h-10 w-auto max-w-full object-contain lg:h-12"
		/>
	)
}
