import { defineField, defineType } from 'sanity'
import { VscMilestone } from 'react-icons/vsc'

export default defineType({
	name: 'homepage',
	title: 'Page d’accueil',
	icon: VscMilestone,
	type: 'document',
	fieldsets: [{ name: 'video', title: 'Vidéo de la page d’accueil' }],
	fields: [
		defineField({
			name: 'backgroundVideo',
			title: 'Fichier vidéo',
			fieldset: 'video',
			description:
				'Vidéo diffusée sur la page d’accueil. Le fichier importé est prioritaire sur l’URL.',
			type: 'file',
			options: { accept: 'video/*' },
		}),
		defineField({
			name: 'backgroundVideoUrl',
			title: 'URL de la vidéo',
			fieldset: 'video',
			description:
				'Adresse directe du fichier vidéo, en l’absence de fichier importé.',
			type: 'string',
			validation: (Rule) =>
				Rule.custom(
					(value) =>
						!value ||
						/^(https?:\/\/|\/(?!\/))/.test(value) ||
						'Utilisez un lien http(s) direct vers une vidéo ou un chemin local commençant par /.',
				),
		}),
	],
	preview: {
		prepare: () => ({ title: 'Page d’accueil' }),
	},
})
