import { defineField, defineType } from 'sanity'
import { FaImage, FaVideo } from 'react-icons/fa'
import { localizedRichTextPreview } from '../../lib/richTextPreview'

export default defineType({
	name: 'internationalizedImageBlock',
	title: 'Image',
	type: 'object',
	icon: FaImage,
	fields: [
		defineField({
			name: 'file',
			title: 'Fichier',
			type: 'image',
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: 'caption',
			title: 'Caption',
			type: 'internationalizedArrayRichText',
		}),
		defineField({
			name: 'video',
			title: 'Vidéo',
			type: 'url',
		}),
		defineField({
			name: 'uploadedVideo',
			title: 'Vidéo (Upload)',
			type: 'file',
			options: {
				accept: 'video/*',
			},
		}),
	],
	preview: {
		select: {
			image: 'file',
			imageName: 'file.asset.originalFilename',
			caption: 'caption',
			video: 'video',
			uploadedVideo: 'uploadedVideo',
			videoName: 'uploadedVideo.asset.originalFilename',
		},
		prepare({ image, imageName, caption, video, uploadedVideo, videoName }) {
			const hasVideo = Boolean(video || uploadedVideo?.asset)
			const hasImage = Boolean(image?.asset)
			const label = hasVideo ? 'Vidéo' : 'Image'
			const filename = hasVideo ? (video ? undefined : videoName) : imageName

			return {
				title: localizedRichTextPreview(caption) || filename || label,
				subtitle: hasVideo
					? video ? 'Vidéo externe' : 'Vidéo importée'
					: hasImage ? 'Image' : 'Aucune image sélectionnée',
				media: hasVideo ? FaVideo : hasImage ? image : FaImage,
			}
		},
	},
})
