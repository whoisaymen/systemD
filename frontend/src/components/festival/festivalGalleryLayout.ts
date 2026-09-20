export type GalleryRect = {
	height: number
	left: number
	top: number
	width: number
}

export type GalleryLayout = {
	gap: number
	stage: GalleryRect
	perforations: {
		count: number
		width: number
		height: number
		padding: number
		railHeight: number
	}
}

export function getGalleryLayout(
	viewport: { width: number; height: number },
	fullscreenImage = false,
): GalleryLayout {
	const { width, height } = viewport
	const isDesktop = width >= 1024
	const padding = Math.min(16, Math.max(4, height * 0.018))
	const holeHeight = Math.min(64, Math.max(8, height * 0.065), width / 24)
	const holeWidth = holeHeight * 0.75
	const railHeight = padding * 2 + holeHeight
	const clearance = Math.min(16, Math.max(6, height * 0.014))
	// The photos and perforations share these bounds, including on short screens.
	const verticalInset = Math.min(
		height * 0.4,
		Math.max(
			railHeight + clearance,
			isDesktop ? Math.max(72, height * 0.1) : Math.max(84, height * 0.16),
		),
	)
	const horizontalInset = Math.min(isDesktop ? 24 : 16, width * 0.05)

	return {
		gap: isDesktop ? Math.max(28, width * 0.02) : Math.max(16, width * 0.04),
		perforations: {
			count: Math.max(2, Math.floor((width - padding * 2) / (holeWidth * 1.8))),
			width: holeWidth,
			height: holeHeight,
			padding,
			railHeight,
		},
		stage: fullscreenImage
			? { height, left: 0, top: 0, width }
			: {
					height: height - verticalInset * 2,
					left: horizontalInset,
					top: verticalInset,
					width: width - horizontalInset * 2,
				},
	}
}

export const getWrappedIndex = (index: number, length: number) =>
	length > 0 ? ((index % length) + length) % length : 0

function getImageAspectRatio(photo: any): number {
	const dimensions = photo?.asset?.metadata?.dimensions
	if (
		Number.isFinite(dimensions?.width) &&
		Number.isFinite(dimensions?.height) &&
		dimensions.width > 0 &&
		dimensions.height > 0
	) {
		return dimensions.width / dimensions.height
	}
	for (const candidate of [
		photo?.asset?.url,
		photo?.asset?._ref,
		photo?.asset?._id,
		photo?._ref,
		photo?._id,
	]) {
		if (typeof candidate !== 'string') continue
		const match = candidate.match(/-(\d+)x(\d+)(?:[.-])/)
		if (match && Number(match[1]) > 0 && Number(match[2]) > 0)
			return Number(match[1]) / Number(match[2])
	}
	return 3 / 2
}

export function getActivePhotoRect(
	layout: GalleryLayout,
	photo: any,
	fillStage = false,
): GalleryRect {
	if (fillStage) return layout.stage
	const area = layout.stage
	const ratio = getImageAspectRatio(photo)
	const width = Math.min(area.width, area.height * ratio)
	const height = width / ratio
	return {
		height,
		left: area.left + (area.width - width) / 2,
		top: area.top + (area.height - height) / 2,
		width,
	}
}

export function getGalleryFrames(
	layout: GalleryLayout,
	photos: { photo: any }[],
	position: number,
) {
	if (!photos.length) return []
	const frame = (page: number) => {
		const index = getWrappedIndex(page, photos.length)
		return {
			page,
			index,
			rect: getActivePhotoRect(layout, photos[index].photo),
		}
	}
	const active = frame(position)
	const frames = [active]
	if (photos.length === 1) return frames
	let left = active.rect.left
	let right = active.rect.left + active.rect.width
	const viewportWidth = layout.stage.width + layout.stage.left * 2
	// Keep an extra viewport of film on either side, including narrow portraits.
	for (
		let offset = 1;
		left > -viewportWidth || right < viewportWidth * 2;
		offset++
	) {
		if (left > -viewportWidth) {
			const previous = frame(position - offset)
			left -= layout.gap + previous.rect.width
			previous.rect.left = left
			frames.unshift(previous)
		}
		if (right < viewportWidth * 2) {
			const next = frame(position + offset)
			next.rect.left = right + layout.gap
			right = next.rect.left + next.rect.width
			frames.push(next)
		}
	}
	return frames
}
