import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscListOrdered } from 'react-icons/vsc'
import { getBlockText } from '@/sanity/lib/utils'

export default defineType({
	name: 'step-list',
	title: 'Step list',
	icon: VscListOrdered,
	type: 'object',
	fields: [
		defineField({
			name: 'intro',
			type: 'array',
			of: [{ type: 'block' }],
		}),
		defineField({
			name: 'steps',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					icon: VscListOrdered,
					fields: [
						defineField({
							name: 'content',
							type: 'array',
							of: [{ type: 'block' }],
						}),
					],
					preview: {
						select: {
							content: 'content',
						},
						prepare: ({ content }) => ({
							title: getBlockText(content),
						}),
					},
				}),
			],
		}),
	],
	preview: {
		select: {
			intro: 'intro',
		},
		prepare: ({ intro }) => ({
			title: getBlockText(intro),
			subtitle: 'Step list',
		}),
	},
})
