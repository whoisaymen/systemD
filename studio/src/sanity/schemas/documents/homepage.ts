import { defineField, defineType } from 'sanity'
import { VscMilestone } from 'react-icons/vsc'

export default defineType({
	name: 'homepage',
	title: "Page d'accueil",
	icon: VscMilestone,
	type: 'document',
	fields: [
		defineField({
			name: 'backgroundType',
			title: 'Type de fond d’écran',
			type: 'string',
			options: {
				list: [
					{ title: 'Couleur', value: 'color' },
					{ title: 'Image', value: 'image' },
					{ title: 'Vidéo', value: 'video' },
				],
				layout: 'radio',
			},
		}),
		defineField({
			name: 'backgroundColor',
			title: 'Couleur de fond',
			type: 'color',
			hidden: ({ parent }) => parent?.backgroundType !== 'color',
		}),
		defineField({
			name: 'backgroundImage',
			title: 'Image de fond',
			type: 'image',
			hidden: ({ parent }) => parent?.backgroundType !== 'image',
		}),
		defineField({
			name: 'backgroundVideo',
			title: 'Vidéo de fond',
			type: 'file',
			hidden: ({ parent }) => parent?.backgroundType !== 'video',
		}),
		defineField({
			name: 'logo',
			title: 'Logo',
			type: 'image',
		}),
		defineField({
			name: 'showLogo',
			title: 'Montrer le logo',
			type: 'boolean',
			initialValue: true,
		}),
		defineField({
			name: 'subtitle',
			title: 'Sous-titre',
			type: 'image',
		}),
		defineField({
			name: 'showSubtitle',
			title: 'Montrer le sous-titre',
			type: 'boolean',
			initialValue: true,
		}),
	],
	preview: {
		prepare: () => ({
			title: 'Page d’accueil',
		}),
	},
})
