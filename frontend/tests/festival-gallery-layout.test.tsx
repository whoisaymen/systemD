import assert from 'node:assert/strict'
import test from 'node:test'
import {
	getActivePhotoRect,
	getGalleryFrames,
	getExhibitionFrames,
	getGalleryLayout,
	getWrappedIndex,
} from '../src/components/festival/festivalGalleryLayout'

const photo = (width: number, height: number) => ({
	asset: { metadata: { dimensions: { width, height } } },
})

test('large exhibitions keep only the current photo and its two neighbours mounted', () => {
	const layout = getGalleryLayout({ width: 390, height: 844 })
	const photos = Array.from({ length: 10000 }, () => ({
		photo: photo(1200, 1600),
	}))
	const first = getExhibitionFrames(layout, photos, 0)
	assert.deepEqual(
		first.map(({ index }) => index),
		[9999, 0, 1],
	)
	assert.equal(first[1].rect.left - first[0].rect.left, 390)
	assert.equal(first[2].rect.left - first[1].rect.left, 390)
	const next = getExhibitionFrames(layout, photos, 1)
	assert.equal(
		first[2].page,
		next[1].page,
		'the preloaded next photo keeps its React key',
	)
	assert.equal(getExhibitionFrames(layout, photos.slice(0, 1), 0).length, 1)
	assert.deepEqual(getExhibitionFrames(layout, [], 0), [])
})

test('mobile film fills the screen width and leaves space outside for dismissal', () => {
	for (const [width, height] of [
		[390, 844],
		[320, 568],
		[844, 390],
		[640, 240],
	]) {
		const layout = getGalleryLayout({ width, height }, false, true)
		assert.equal(layout.compactFilm, true)
		for (const [imageWidth, imageHeight] of [
			[3000, 2000],
			[2000, 3000],
			[1000, 5000],
		]) {
			const rect = getActivePhotoRect(layout, photo(imageWidth, imageHeight))
			const filmTop = rect.top - layout.perforations.railHeight
			const filmBottom = rect.top + rect.height + layout.perforations.railHeight
			assert.ok(filmTop >= 24, 'space above the film remains tappable')
			assert.ok(
				filmBottom <= height - 24,
				'space below the film remains tappable',
			)
			assert.ok(rect.left - layout.perforations.padding >= 0)
			assert.ok(rect.left + rect.width + layout.perforations.padding <= width)
		}
		assert.equal(layout.stage.left - layout.perforations.padding, 0)
		assert.equal(layout.stage.width + layout.perforations.padding * 2, width)
	}
	assert.deepEqual(
		getGalleryLayout({ width: 1280, height: 720 }, false, true),
		getGalleryLayout({ width: 1280, height: 720 }),
		'desktop retains its existing layout',
	)
	assert.equal(
		getGalleryLayout({ width: 390, height: 844 }, true, true).compactFilm,
		false,
	)
})

test('photos stay between both perforation rails on laptops and small screens', () => {
	for (const [width, height] of [
		[1280, 720],
		[1280, 640],
		[1440, 800],
		[1440, 900],
		[1366, 768],
		[1680, 1050],
		[1920, 1080],
		[2560, 1440],
		[1024, 600],
		[390, 844],
		[320, 568],
		[844, 390],
		[640, 240],
	]) {
		const layout = getGalleryLayout({ width, height })
		const { perforations, stage } = layout
		assert.ok(
			stage.top > perforations.railHeight,
			`${width} × ${height}: top rail`,
		)
		assert.ok(stage.top + stage.height < height - perforations.railHeight)
		assert.ok(
			perforations.count * perforations.width <=
				width - perforations.padding * 2,
		)
		for (const [imageWidth, imageHeight] of [
			[3000, 2000],
			[2000, 3000],
			[5000, 1000],
			[1000, 5000],
		]) {
			const rect = getActivePhotoRect(layout, photo(imageWidth, imageHeight))
			assert.ok(rect.top >= stage.top - 1e-8)
			assert.ok(rect.top + rect.height <= stage.top + stage.height + 1e-8)
			assert.ok(rect.left >= stage.left - 1e-8)
			assert.ok(rect.left + rect.width <= stage.left + stage.width + 1e-8)
			assert.ok(
				Math.abs(rect.width / rect.height - imageWidth / imageHeight) < 1e-8,
			)
		}
	}
})

test('neighboring photos move together in either direction without changing size', () => {
	const layout = getGalleryLayout({ width: 1280, height: 720 })
	const photos = [photo(3000, 2000), photo(2000, 3000), photo(5000, 1800)].map(
		(photo) => ({ photo }),
	)
	for (const position of [-1, 0, 2, 3]) {
		const before = getGalleryFrames(layout, photos, position)
		for (const direction of [-1, 1]) {
			const after = getGalleryFrames(layout, photos, position + direction)
			const offsets = before.flatMap((frame) => {
				const moved = after.find((next) => next.page === frame.page)
				if (!moved) return []
				assert.equal(frame.index, moved.index)
				assert.equal(frame.rect.width, moved.rect.width)
				assert.equal(frame.rect.height, moved.rect.height)
				return [moved.rect.left - frame.rect.left]
			})
			assert.ok(offsets.length >= 3)
			assert.ok(offsets.every((offset) => offset * direction < 0))
			assert.ok(offsets.every((offset) => Math.abs(offset - offsets[0]) < 1e-8))
		}
	}
})

test('looping keeps unique frame identities and covers the viewport for narrow portraits', () => {
	const layout = getGalleryLayout({ width: 1440, height: 600 })
	const photos = [{ photo: photo(500, 4000) }, { photo: photo(600, 4000) }]
	const frames = getGalleryFrames(layout, photos, -1)
	assert.equal(getWrappedIndex(-1, photos.length), 1)
	assert.equal(getWrappedIndex(2, photos.length), 0)
	assert.equal(new Set(frames.map((frame) => frame.page)).size, frames.length)
	assert.ok(frames[0].rect.left < -1440)
	assert.ok(frames.at(-1)!.rect.left + frames.at(-1)!.rect.width > 2880)
	assert.equal(frames.find((frame) => frame.page === -1)?.index, 1)
})

test('empty and single-photo galleries do not create duplicate slides', () => {
	const layout = getGalleryLayout({ width: 1280, height: 720 })
	assert.deepEqual(getGalleryFrames(layout, [], 0), [])
	assert.equal(
		getGalleryFrames(layout, [{ photo: photo(3000, 2000) }], 0).length,
		1,
	)
})

test('asset IDs provide dimensions and the plain-image cover variant still fills the viewport', () => {
	const viewport = { width: 1280, height: 720 }
	const layout = getGalleryLayout(viewport)
	const rect = getActivePhotoRect(layout, {
		asset: { _ref: 'image-id-2000x3000-jpg' },
	})
	assert.ok(Math.abs(rect.width / rect.height - 2 / 3) < 1e-8)
	assert.deepEqual(
		getActivePhotoRect(getGalleryLayout(viewport, true), {}, true),
		{
			left: 0,
			top: 0,
			...viewport,
		},
	)
	assert.ok(getActivePhotoRect(layout, {}).width > 0)
})
