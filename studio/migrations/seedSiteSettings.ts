import fs from 'node:fs'
import path from 'node:path'
import { getCliClient } from 'sanity/cli'

const dryRun = process.argv.includes('--dry-run')
const client = getCliClient({ apiVersion: '2024-12-01' })

type SanityReference = {
	_key?: string
	_ref: string
	_type: 'reference'
}

type ThemeSeed = {
	id: string
	title: string
	slug: string
	primary: string
	dark: string
	grayDark: string
	imageGrade: {
		gray: number
		sepia: number
		saturate: number
		hue: number
		contrast: number
		brightness: number
	}
}

const themes: ThemeSeed[] = [
	{
		id: 'theme-system-d-yellow-blue',
		title: 'Jaune / Bleu',
		slug: 'system-d-yellow-blue',
		primary: '#DEFE04',
		dark: '#123DA6',
		grayDark: '#8C8C8F',
		imageGrade: {
			gray: 1,
			sepia: 0.72,
			saturate: 2,
			hue: 174,
			contrast: 0.92,
			brightness: 1.08,
		},
	},
	{
		id: 'theme-system-d-violet-ice',
		title: 'Violet / Ice',
		slug: 'system-d-violet-ice',
		primary: '#554FF1',
		dark: '#D0DCDC',
		grayDark: '#636363',
		imageGrade: {
			gray: 1,
			sepia: 0.68,
			saturate: 1.85,
			hue: 180,
			contrast: 0.92,
			brightness: 1.09,
		},
	},
	{
		id: 'theme-system-d-gray-black',
		title: 'Gris / Noir',
		slug: 'system-d-gray-black',
		primary: '#8C8C8F',
		dark: '#222223',
		grayDark: '#8C8C8F',
		imageGrade: {
			gray: 1,
			sepia: 0,
			saturate: 0.85,
			hue: 0,
			contrast: 0.9,
			brightness: 1.06,
		},
	},
	{
		id: 'theme-system-d-orange-cream',
		title: 'Orange / Crème',
		slug: 'system-d-orange-cream',
		primary: '#DE5325',
		dark: '#FAFAEC',
		grayDark: '#DE5325',
		imageGrade: {
			gray: 1,
			sepia: 0.64,
			saturate: 1.55,
			hue: -18,
			contrast: 0.9,
			brightness: 1.1,
		},
	},
	{
		id: 'theme-system-d-neon-black',
		title: 'Noir / Néon',
		slug: 'system-d-neon-black',
		primary: '#DFFF00',
		dark: '#10110B',
		grayDark: '#A855F7',
		imageGrade: {
			gray: 0.25,
			sepia: 0.18,
			saturate: 1.65,
			hue: 150,
			contrast: 1.08,
			brightness: 0.9,
		},
	},
]

const socialLinks = [
	{
		key: 'vimeo',
		label: 'Vimeo',
		external: 'https://vimeo.com/systemdbrussels',
	},
	{
		key: 'youtube',
		label: 'YouTube',
		external: 'https://www.youtube.com/@systemdbrussels',
	},
	{
		key: 'facebook',
		label: 'Facebook',
		external: 'https://www.facebook.com/systemdbrussels',
	},
	{
		key: 'instagram',
		label: 'Instagram',
		external: 'https://www.instagram.com/systemdbrussels',
	},
]

const defaultDescription =
	'System_D accompagne les cinéastes autodidactes à Bruxelles avec des ressources pour créer, produire et diffuser leurs films.'

const ref = (_ref: string, _key?: string): SanityReference => ({
	_key,
	_ref,
	_type: 'reference',
})

async function seedThemes() {
	for (const theme of themes) {
		const document = {
			_id: theme.id,
			_type: 'theme',
			title: theme.title,
			slug: {
				_type: 'slug',
				current: theme.slug,
			},
			primaryColor: colorValue(theme.primary),
			darkColor: colorValue(theme.dark),
			grayDarkColor: colorValue(theme.grayDark),
			imageGrade: theme.imageGrade,
		}

		console.log(
			`${dryRun ? 'Would create or replace' : 'Creating or replacing'} ${theme.id}.`,
		)

		if (!dryRun) {
			await client.createOrReplace(document)
		}
	}
}

async function seedSocialNavigation() {
	const document = {
		_id: 'navigation-social',
		_type: 'navigation',
		title: 'Réseaux sociaux',
		items: socialLinks.map((link) => ({
			_key: link.key,
			_type: 'link',
			label: link.label,
			type: 'external',
			external: link.external,
		})),
	}

	console.log(
		`${dryRun ? 'Would create or replace' : 'Creating or replacing'} navigation-social.`,
	)

	if (!dryRun) {
		await client.createOrReplace(document)
	}
}

async function seedSite() {
	const logoSvg = readLogoSvg()
	const faviconAssetId = await getOrUploadFavicon()
	const themeReferences = themes.map((theme) => ref(theme.id, theme.slug))

	console.log(`${dryRun ? 'Would ensure' : 'Ensuring'} site settings document.`)

	if (!dryRun) {
		await client.createIfNotExists({
			_id: 'site',
			_type: 'site',
			title: 'System_D',
		})
	}

	let patch = client.patch('site').setIfMissing({
		title: 'System_D',
		description: defaultDescription,
	})

	patch = patch.set({
		description: defaultDescription,
		logo: {
			_type: 'logo',
			name: 'System_D',
			svg: logoSvg,
		},
		themes: themeReferences,
		social: ref('navigation-social'),
	})
	patch = patch.unset(['defaultTheme'])

	if (faviconAssetId) {
		patch = patch.set({
			favicon: {
				_type: 'file',
				asset: ref(faviconAssetId),
			},
		})
	}

	console.log(`${dryRun ? 'Would patch' : 'Patching'} site settings.`)

	if (!dryRun) {
		await patch.commit()
	}
}

async function getOrUploadFavicon() {
	const filename = 'system-d-favicon.ico'
	const existing = await client.fetch<{ _id: string } | null>(
		`*[_type == "sanity.fileAsset" && originalFilename == $filename][0]{_id}`,
		{ filename },
	)

	if (existing?._id) {
		console.log(`Using existing favicon asset ${existing._id}.`)
		return existing._id
	}

	if (dryRun) {
		console.log(`Would upload ${filename}.`)
		return null
	}

	const faviconPath = path.resolve(
		process.cwd(),
		'../frontend/src/app/icon.ico',
	)

	if (!fs.existsSync(faviconPath)) {
		console.log(`Skipping favicon upload: ${faviconPath} does not exist.`)
		return null
	}

	const asset = await client.assets.upload(
		'file',
		fs.createReadStream(faviconPath),
		{
			filename,
			contentType: 'image/x-icon',
		},
	)

	console.log(`Uploaded favicon asset ${asset._id}.`)
	return asset._id
}

function readLogoSvg() {
	const logoPath = path.resolve(
		process.cwd(),
		'../frontend/public/assets/svg/logo-black.svg',
	)

	if (!fs.existsSync(logoPath)) {
		throw new Error(`Logo SVG not found at ${logoPath}`)
	}

	return fs
		.readFileSync(logoPath, 'utf8')
		.replace(/\swidth="[^"]*"/, '')
		.replace(/\sheight="[^"]*"/, '')
		.replace(/fill="#1C1C1E"/g, 'fill="currentColor"')
}

function colorValue(hex: string) {
	const { r, g, b } = hexToRgb(hex)
	const { h, s, l } = rgbToHsl(r, g, b)
	const { s: hsvS, v } = rgbToHsv(r, g, b)

	return {
		_type: 'color',
		hex,
		alpha: 1,
		rgb: {
			_type: 'rgbaColor',
			r,
			g,
			b,
			a: 1,
		},
		hsl: {
			_type: 'hslaColor',
			h,
			s,
			l,
			a: 1,
		},
		hsv: {
			_type: 'hsvaColor',
			h,
			s: hsvS,
			v,
			a: 1,
		},
	}
}

function hexToRgb(hex: string) {
	const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)

	if (!match) {
		throw new Error(`Invalid hex color: ${hex}`)
	}

	return {
		r: parseInt(match[1], 16),
		g: parseInt(match[2], 16),
		b: parseInt(match[3], 16),
	}
}

function rgbToHsl(r: number, g: number, b: number) {
	const red = r / 255
	const green = g / 255
	const blue = b / 255
	const max = Math.max(red, green, blue)
	const min = Math.min(red, green, blue)
	const lightness = (max + min) / 2

	if (max === min) {
		return { h: 0, s: 0, l: lightness }
	}

	const delta = max - min
	const saturation =
		lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min)
	const hue =
		max === red
			? (green - blue) / delta + (green < blue ? 6 : 0)
			: max === green
				? (blue - red) / delta + 2
				: (red - green) / delta + 4

	return { h: hue * 60, s: saturation, l: lightness }
}

function rgbToHsv(r: number, g: number, b: number) {
	const red = r / 255
	const green = g / 255
	const blue = b / 255
	const max = Math.max(red, green, blue)
	const min = Math.min(red, green, blue)
	const delta = max - min
	const saturation = max === 0 ? 0 : delta / max
	const hue =
		delta === 0
			? 0
			: max === red
				? ((green - blue) / delta + (green < blue ? 6 : 0)) * 60
				: max === green
					? ((blue - red) / delta + 2) * 60
					: ((red - green) / delta + 4) * 60

	return { h: hue, s: saturation, v: max }
}

async function run() {
	await seedThemes()
	await seedSocialNavigation()
	await seedSite()
}

run().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
