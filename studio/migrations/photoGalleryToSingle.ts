import { createClient } from 'next-sanity'
import { projectId, dataset, apiVersion } from '@/sanity/lib/env'
import { dev } from '@/lib/env'

interface SanityAsset {
	_type: string
	asset: {
		_ref: string
		_type: string
	}
	hotspot?: {
		x: number
		y: number
		height: number
		width: number
	}
	crop?: {
		top: number
		bottom: number
		left: number
		right: number
	}
}

interface PhotoGalleryBlock {
	_type: 'photoGalleryBlock'
	photos?: SanityAsset[]
}

interface Festival {
	_id: string
	photoGallery?: PhotoGalleryBlock[]
}

const client = createClient({
	projectId,
	dataset,
	apiVersion,
	token:
		'skZWf1rVgT7WpcppWEPiem7oriHw9dyDA81ok3rc9b0CTCRsGFXA20f22DTGj1f8nnenxZJToYuSdcXrYMpa6maRAcol6bm3SO7l5PB8zqHNe2ayIUYKyjjx7b83vCtvN3uEbUKu5by7SobhHm1WWbcxKOPc20EP3ffYP0F1vveHCJ4mQdma', // You'll need a token with write access
	useCdn: false,
})

// Migration script
async function migratePhotoGallery() {
	// Get all festivals
	const festivals = await client.fetch(`*[_type == "festival"]`)

	// Process each festival
	for (const festival of festivals) {
		if (
			Array.isArray(festival.photoGallery) &&
			festival.photoGallery.length > 0
		) {
			// Take the first photoGalleryBlock and its photos
			const firstGalleryBlock = festival.photoGallery[0]

			// If there are additional photos in other blocks, merge them
			const allPhotos = festival.photoGallery.reduce(
				(acc: SanityAsset[], block: PhotoGalleryBlock) => {
					if (block.photos) {
						return [...acc, ...block.photos]
					}
					return acc
				},
				[],
			)

			// Create the new structure
			const newPhotoGallery = {
				_type: 'photoGalleryBlock',
				photos: allPhotos,
			}

			// Update the document
			await client
				.patch(festival._id)
				.set({ photoGallery: newPhotoGallery })
				.commit()
				.then((updatedFestival) => {})
				.catch((err) => {
					console.error(`Failed to update festival ${festival._id}:`, err)
				})
		}
	}
}

// Run the migration
migratePhotoGallery().catch(console.error)
