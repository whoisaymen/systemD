'use client'

import { useEffect, useRef, useState, type ImgHTMLAttributes } from 'react'

export default function ProgressiveImage({
	placeholder,
	placeholderFit = 'cover',
	alt = '',
	src,
	srcSet,
	style,
	onLoad,
	...props
}: ImgHTMLAttributes<HTMLImageElement> & {
	placeholder: string
	placeholderFit?: 'cover' | 'contain'
}) {
	const ref = useRef<HTMLImageElement>(null)
	const source = `${src}|${srcSet}`
	const [loadedSource, setLoadedSource] = useState<string | null>(null)
	const pending = loadedSource !== source

	useEffect(() => {
		// Cached images can finish before React attaches the load handler.
		if (ref.current?.complete && ref.current.naturalWidth > 0) {
			setLoadedSource(source)
		}
	}, [source])

	return (
		// Sanity's CDN supplies the responsive, optimized image URLs.
		// eslint-disable-next-line @next/next/no-img-element
		<img
			{...props}
			alt={alt}
			ref={ref}
			src={src}
			srcSet={srcSet}
			data-image-placeholder={pending || undefined}
			style={{
				...(pending && {
					backgroundImage: `url("${placeholder}")`,
					backgroundSize: placeholderFit,
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}),
				...style,
			}}
			onLoad={(event) => {
				setLoadedSource(source)
				onLoad?.(event)
			}}
		/>
	)
}
