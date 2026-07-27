import { defineType, defineField } from 'sanity'

export default defineType({
	name: 'filmSubmission',
	title: 'Film Submissions',
	type: 'document',
	fields: [
		// Level 1: Contact Info
		defineField({
			name: 'contactName',
			title: 'Full Name',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'phoneNumber',
			title: 'Phone Number',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'email',
			title: 'Email',
			type: 'string',
			validation: (Rule) => Rule.required().email(),
		}),
		defineField({
			name: 'instagram',
			title: 'Instagram',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),

		// Level 2: Film Details
		defineField({
			name: 'filmTitle',
			title: 'Film Title',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'directorProducer',
			title: 'Director/Producer',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'projectHolder',
			title: 'Project Holder',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'filmGenre',
			title: 'Film Genre',
			type: 'string',
			options: {
				list: [
					{ title: 'Documentary', value: 'documentary' },
					{ title: 'Fiction', value: 'fiction' },
					{ title: 'Animation', value: 'animation' },
					{ title: 'Experimental', value: 'experimental' },
					{ title: 'Music Video', value: 'musicVideo' },
					{ title: 'Other', value: 'other' },
				],
			},
		}),
		defineField({
			name: 'yearOfCreation',
			title: 'Year of Creation',
			type: 'number',
			validation: (Rule) =>
				Rule.required().min(1900).max(new Date().getFullYear()),
		}),
		defineField({
			name: 'languages',
			title: 'Languages',
			type: 'array',
			of: [{ type: 'string' }],
			validation: (Rule) => Rule.required().min(1),
		}),
		defineField({
			name: 'filmFormat',
			title: 'Film Format',
			type: 'string',
			options: {
				list: [
					{ title: 'Small (DV)', value: 'dv' },
					{ title: 'Medium (HD)', value: 'hd' },
					{ title: 'Large (4K)', value: '4k' },
				],
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'duration',
			title: 'Duration (in minutes)',
			type: 'number',
			validation: (Rule) => Rule.required().min(1),
		}),
		defineField({
			name: 'subtitles',
			title: 'Subtitles Available',
			type: 'array',
			of: [{ type: 'string' }],
		}),
		defineField({
			name: 'downloadLink',
			title: 'Download Link',
			type: 'url',
			validation: (Rule) => Rule.required(),
		}),

		// Level 3: Professional Background
		defineField({
			name: 'professionalSupervision',
			title: 'Professional Supervision',
			type: 'boolean',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'filmSchoolGraduates',
			title: 'Film School Graduates in Crew',
			type: 'boolean',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'previousAwards',
			title: 'Previous Awards',
			type: 'text',
		}),

		// Level 4: Consent
		defineField({
			name: 'dataConsent',
			title: 'Data Storage Consent',
			type: 'boolean',
			validation: (Rule) => Rule.required(),
		}),

		// Meta
		defineField({
			name: 'submissionDate',
			title: 'Submission Date',
			type: 'datetime',
			initialValue: () => new Date().toISOString(),
		}),
		defineField({
			name: 'status',
			title: 'Submission Status',
			type: 'string',
			options: {
				list: [
					{ title: 'Pending Review', value: 'pending' },
					{ title: 'Under Review', value: 'reviewing' },
					{ title: 'Accepted', value: 'accepted' },
					{ title: 'Rejected', value: 'rejected' },
				],
			},
			initialValue: 'pending',
		}),
	],

	preview: {
		select: {
			title: 'filmTitle',
			subtitle: 'contactName',
		},
		prepare({ title, subtitle }) {
			return {
				title: title || 'Untitled Film',
				subtitle: subtitle ? `by ${subtitle}` : 'No contact name',
			}
		},
	},
})
