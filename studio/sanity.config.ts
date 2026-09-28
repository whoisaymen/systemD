import '@sanity/ui/styles.css'
import { TitleLabelStyle } from './src/sanity/components/TitleLabelStyle'
import { AlignedTextBlock, TextAlignmentPlugins } from './src/sanity/components/TextAlignment'
import { CENTER_TEXT_MARK } from './src/sanity/lib/textAlignmentBehavior'
import { FiAlignCenter } from 'react-icons/fi'
import { defineArrayMember, defineConfig, defineField } from 'sanity'
import { projectId, dataset } from '@/sanity/lib/env'
import { structure } from './src/sanity/structure'
import { presentation } from './src/sanity/presentation'
import {
	dashboardTool,
	projectInfoWidget,
	projectUsersWidget,
} from '@sanity/dashboard'
import { infoWidget } from './src/sanity/InfoWidget'
import { vercelWidget } from 'sanity-plugin-dashboard-widget-vercel'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { colorInput } from '@sanity/color-input'
import { schemaTypes } from './src/sanity/schemas'

import { frFRLocale } from '@sanity/locale-fr-fr'
import { internationalizedArray } from 'sanity-plugin-internationalized-array'
import { documentInternationalization } from '@sanity/document-internationalization'
import StudioLogo from '@/components/StudioLogo'
// import { media } from 'sanity-plugin-media'

const singletonTypes = ['site', 'filmSubmissionSettings']

const localizedRichText = defineField({
	name: 'richText',
	title: 'Texte enrichi',
	type: 'array',
	description:
		'Entrée crée un paragraphe. Majuscule + Entrée insère un saut de ligne. Le bouton « Centrer le texte » centre le paragraphe ou les blocs sélectionnés, sans changer leur style. Cliquez à nouveau pour rétablir l’alignement.',
	components: {
		portableText: { plugins: TextAlignmentPlugins },
	},
	of: [
		defineArrayMember({
			type: 'block',
			components: { block: AlignedTextBlock },
			styles: [
				{ title: 'Normal', value: 'normal' },
				{ title: 'Titre de niveau 2', value: 'h2' },
				{ title: 'Titre de niveau 3', value: 'h3' },
				{ title: 'Titre en étiquette', value: 'titleLabel', component: TitleLabelStyle },
				{ title: 'Quote', value: 'blockquote' },
			],
			lists: [
				{ title: 'Bullet list', value: 'bullet' },
				{ title: 'Numbered list', value: 'number' },
			],
			marks: {
				decorators: [
					{ title: 'Bold', value: 'strong' },
					{ title: 'Italic', value: 'em' },
					{ title: 'Underline', value: 'underline' },
					{ title: 'Strikethrough', value: 'strike-through' },
					{ title: 'Centrer le texte', value: CENTER_TEXT_MARK, icon: FiAlignCenter },
				],
				annotations: [
					defineField({
						name: 'link',
						title: 'Link',
						type: 'object',
						fields: [
							defineField({
								name: 'href',
								title: 'URL',
								type: 'url',
								validation: (Rule) =>
									Rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
							}),
							defineField({ name: 'blank', title: 'Open in a new tab', type: 'boolean', initialValue: false }),
						],
					}),
				],
			},
		}),
	],
})

export default defineConfig({
	icon: StudioLogo,
	title: 'System D',
	projectId,
	dataset,
	// theme,

	// studio: {
	// 	components: {
	// 		navbar: NewNavbar,
	// 	},
	// },

	plugins: [
		// media(),
		frFRLocale(),
		structure,
		presentation,
		dashboardTool({
			name: 'deployment',
			title: 'Deployment',
			widgets: [vercelWidget()],
		}),
		dashboardTool({
			name: 'info',
			title: 'Info',
			widgets: [projectInfoWidget(), projectUsersWidget(), infoWidget()],
		}),
		visionTool(),
		codeInput(),
		colorInput(),

		internationalizedArray({
			languages: [
				{ id: 'en', title: 'English' },
				{ id: 'fr', title: 'French' },
				{ id: 'nl', title: 'Dutch' },
			],
			defaultLanguages: ['en'],
			fieldTypes: ['string', 'text', localizedRichText],
		}),

		documentInternationalization({
			// Required configuration
			supportedLanguages: [
				{ id: 'en', title: 'English' },
				{ id: 'fr', title: 'French' },
				{ id: 'nl', title: 'Dutch' },
			],
			schemaTypes: ['event'],
			languageField: `language` /* Optional configuration */,
		}),
	],

	tasks: { enabled: false },
	scheduledPublishing: { enabled: false },

	schema: {
		types: schemaTypes,
		templates: (templates) =>
			templates.filter(
				({ schemaType }) => !singletonTypes.includes(schemaType),
			),
	},

	document: {
		actions: (input, { schemaType }) =>
			singletonTypes.includes(schemaType)
				? input.filter(
						({ action }) =>
							action &&
							['publish', 'discardChanges', 'restore'].includes(action),
					)
				: input,
	},
})
