import { urlFor } from '@/sanity/lib/image'
import { preload } from 'react-dom'
import { stegaClean } from 'next-sanity'
import { cn } from '@/lib/utils'

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
	themeGrade = true,
	className,
	...props
}: {
	image: Sanity.Image | undefined
	imageWidth?: number
	imageSizes?: number[]
	options?: ImageOptions
	themeGrade?: boolean
} & React.ImgHTMLAttributes<HTMLImageElement>) {
	if (!image?.asset) return null

	const { src, width, height } = getImageProps(image, imageWidth, options)

	if (stegaClean(image.loading) === 'eager') {
		preload(src, { as: 'image' })
	}

	return (
		<img
			src={src}
			{...generateSrcset(image, { width: imageWidth, sizes: imageSizes })}
			width={width}
			height={height}
			alt={image.alt || alt}
			loading={stegaClean(image.loading) || 'lazy'}
			decoding="async"
			{...props}
			className={cn(themeGrade && 'theme-graded-image', className)}
		/>
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
			{...generateSrcset(image, { width: imageWidth, sizes: imageSizes })}
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
	const builder = imageWidth
		? urlFor(image).width(imageWidth)
		: options?.imageBuilder?.(urlFor(image)) || urlFor(image)
	const dimensions = getImageDimensions(image)
	const width = imageWidth || dimensions?.width
	const height =
		imageWidth && dimensions
			? Math.round((imageWidth / dimensions.width) * dimensions.height)
			: dimensions?.height

	return {
		src: builder.auto('format').url(),
		width,
		height,
	}
}

function getImageDimensions(image: Sanity.Image) {
	const dimensions = image.asset?.metadata?.dimensions
	if (dimensions?.width && dimensions?.height) {
		return dimensions
	}

	const ref = image.asset?._ref || image.asset?._id
	const match = ref?.match(/-(\d+)x(\d+)-/)
	if (!match) return undefined

	return {
		width: Number(match[1]),
		height: Number(match[2]),
	}
}

function generateSrcset(
	image: Sanity.Image,
	{
		width,
		sizes = SIZES,
	}: {
		width?: number
		sizes: number[]
	},
) {
	const filtered = sizes.filter((size) => !width || size <= width)

	return {
		srcSet:
			filtered
				.map(
					(size) =>
						`${urlFor(image).width(size).auto('format').url()} ${size}w`,
				)
				.join(', ') || undefined,

		sizes:
			filtered
				.map(
					(size, i) =>
						`${i < filtered.length - 1 ? `(max-width: ${size + 1}px) ` : ''}${size}px`,
				)
				.join(', ') || undefined,
	}
}
