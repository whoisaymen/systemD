import { defineField, defineType } from 'sanity'
import { PiFlowArrow } from 'react-icons/pi'
import processSlug from '@/sanity/lib/processSlug'

const regex = /^(\/|https?:\/\/)/

export default defineType({
	name: 'redirect',
	title: 'Redirect',
	icon: PiFlowArrow,
	type: 'document',
	fields: [
		defineField({
			name: 'source',
			description: 'Redirect from',
			placeholder: 'e.g. /old-path, /old-blog/:slug',
			type: 'string',
			validation: (Rule) => Rule.required().regex(regex),
		}),
		defineField({
			name: 'destination',
			description: 'Redirect to',
			type: 'link',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'permanent',
			type: 'boolean',
			initialValue: true,
			description:
				'Une redirection permanente utilise le code 308 et peut être conservée dans le cache. Une redirection temporaire utilise le code 307.',
		}),
	],
	preview: {
		select: {
			title: 'source',
			_type: 'destination.internal._type',
			internal: 'destination.internal.metadata.slug.current',
			params: 'destination.params',
			external: 'destination.external',
		},
		prepare: ({ title, _type, internal, params, external }) => ({
			title,
			subtitle:
				(external || internal) &&
				`to ${external || processSlug({ _type, internal, params })}`,
		}),
	},
})
