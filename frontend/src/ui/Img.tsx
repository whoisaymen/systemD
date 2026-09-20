import { urlFor } from '@/sanity/lib/image'
import { preload } from 'react-dom'
import { stegaClean } from 'next-sanity'
import ProgressiveImage from './ProgressiveImage'

const SIZES = [
	120, 240, 360, 480, 640, 720, 800, 880, 960, 1280, 1440, 1600, 1800, 2000,
]

type ImageBuilder = ReturnType<typeof urlFor>

type ImageOptions = {
	imageBuilder?: (builder: ImageBuilder) => ImageBuilder
}

export default function Img({
	image,
	imageWidth,
	imageSizes = SIZES,
	alt = '',
	options,
	className,
	sizes = '100vw',
	loading,
	placeholderFit = 'cover',
	...props
}: {
	image: Sanity.Image | undefined
	imageWidth?: number
	imageSizes?: number[]
	options?: ImageOptions
	placeholderFit?: 'cover' | 'contain'
} & React.ImgHTMLAttributes<HTMLImageElement>) {
	if (!image?.asset) return null

	const { src, width, height } = getImageProps(image, imageWidth, options)
	const responsive = generateSrcset(image, {
		width: imageWidth,
		sizes: imageSizes,
		options,
	})
	const resolvedLoading = loading || stegaClean(image.loading) || 'lazy'
	const placeholder = image.asset?.metadata?.lqip

	if (resolvedLoading === 'eager' && props.fetchPriority === 'high') {
		preload(src, {
			as: 'image',
			imageSrcSet: responsive.srcSet,
			imageSizes: sizes,
		})
	}

	const imageProps: React.ImgHTMLAttributes<HTMLImageElement> = {
		src,
		...responsive,
		sizes,
		width,
		height,
		alt: image.alt || alt,
		loading: resolvedLoading,
		decoding: 'async',
		...props,
		className,
	}

	return placeholder ? (
		<ProgressiveImage
			{...imageProps}
			placeholder={placeholder}
			placeholderFit={placeholderFit}
		/>
	) : (
		// Sanity's CDN supplies the responsive, optimized image URLs.
		// eslint-disable-next-line @next/next/no-img-element
		<img {...imageProps} alt={imageProps.alt || ''} />
	)
}

export function Source({
	image,
	imageWidth,
	imageSizes = SIZES,
	options,
	media = '(max-width: 768px)',
}: {
	image: Sanity.Image | undefined
	imageWidth?: number
	imageSizes?: number[]
	options?: ImageOptions
	media?: string
}) {
	if (!image?.asset) return null

	const { src, width, height } = getImageProps(image, imageWidth, options)

	if (stegaClean(image.loading) === 'eager') {
		preload(src, { as: 'image' })
	}

	return (
		<source
			{...generateSrcset(image, {
				width: imageWidth,
				sizes: imageSizes,
				options,
			})}
			width={width}
			height={height}
			media={media}
		/>
	)
}

function getImageProps(
	image: Sanity.Image,
	imageWidth?: number,
	options?: ImageOptions,
) {
	const dimensions = getImageDimensions(image)
	const width = Math.min(
		imageWidth || SIZES.at(-1)!,
		dimensions?.width || Infinity,
	)
	const height = dimensions
		? Math.round((width / dimensions.width) * dimensions.height)
		: undefined

	return {
		src: buildImageUrl(image, width, options),
		width,
		height,
	}
}

export function getImageDimensions(image: Sanity.Image) {
	const dimensions = image.asset?.metadata?.dimensions
	const ref = image.asset?._ref || image.asset?._id
	const match = ref?.match(/-(\d+)x(\d+)-/)
	const width = dimensions?.width || (match && Number(match[1]))
	const height = dimensions?.height || (match && Number(match[2]))
	if (!width || !height) return undefined

	return {
		width: Math.max(
			1,
			Math.round(
				width * (1 - (image.crop?.left || 0) - (image.crop?.right || 0)),
			),
		),
		height: Math.max(
			1,
			Math.round(
				height * (1 - (image.crop?.top || 0) - (image.crop?.bottom || 0)),
			),
		),
	}
}

function buildImageUrl(
	image: Sanity.Image,
	width: number,
	options?: ImageOptions,
) {
	const base = urlFor(image).fit('max')
	const builder = options?.imageBuilder?.(base) || base
	return builder.width(width).auto('format').url()
}

function generateSrcset(
	image: Sanity.Image,
	{
		width,
		sizes = SIZES,
		options,
	}: {
		width?: number
		sizes: number[]
		options?: ImageOptions
	},
) {
	const maximum = Math.min(
		width || sizes.at(-1) || 2000,
		getImageDimensions(image)?.width || Infinity,
	)
	const filtered = [
		...new Set([...sizes.filter((size) => size < maximum), maximum]),
	]

	return {
		srcSet:
			filtered
				.map((size) => `${buildImageUrl(image, size, options)} ${size}w`)
				.join(', ') || undefined,

		sizes: '100vw',
	}
}
