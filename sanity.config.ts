'use client'

import { defineConfig } from 'sanity'
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
import { theme } from '@/sanity/utils/theme'

import { frFRLocale } from '@sanity/locale-fr-fr'
import { internationalizedArray } from 'sanity-plugin-internationalized-array'
import { documentInternationalization } from '@sanity/document-internationalization'
import StudioLogo from '@/components/StudioLogo'
// import { media } from 'sanity-plugin-media'

const singletonTypes = ['site']

export default defineConfig({
	icon: StudioLogo,
	title: 'System D',
	projectId,
	dataset,
	basePath: '/admin',
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
			fieldTypes: ['string', 'text'],
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
