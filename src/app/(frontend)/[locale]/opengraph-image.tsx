import LogoShortTsx from '@/components/svgs/LogoShort'
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Image metadata
export const alt = 'About Acme'
export const size = {
	width: 1200,
	height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
	return new ImageResponse(
		(
			// ImageResponse JSX element
			<div
				style={{
					fontSize: 128,
					background: '#000',
					backgroundImage:
						'url(https://systemd.brussels/assets/images/teaser-img.png)',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<LogoShortTsx fillColor="#AAAAAF" />
			</div>
		),
		// ImageResponse options
		{
			// For convenience, we can re-use the exported opengraph-image
			// size config to also set the ImageResponse's width and height.
			...size,
		},
	)
}
