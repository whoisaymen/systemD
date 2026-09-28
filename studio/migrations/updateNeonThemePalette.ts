import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-12-01' })

async function updateNeonThemePalette() {
	const primaryColor = colorValue('#FF9D4D')
	const darkColor = colorValue('#253237')
	const grayDarkColor = colorValue('#7C6E6E')

	await client
		.patch('theme-system-d-neon-black')
		.set({ primaryColor, darkColor, grayDarkColor })
		.commit()

	console.log('Updated Noir / Néon palette defaults.')
}

updateNeonThemePalette().catch((error) => {
	console.error(error)
	process.exitCode = 1
})

function colorValue(hex: string) {
	const { r, g, b } = hexToRgb(hex)
	const { h, s, l } = rgbToHsl(r, g, b)
	const { s: hsvS, v } = rgbToHsv(r, g, b)

	return {
		_type: 'color',
		hex,
		alpha: 1,
		rgb: { _type: 'rgbaColor', r, g, b, a: 1 },
		hsl: { _type: 'hslaColor', h, s, l, a: 1 },
		hsv: { _type: 'hsvaColor', h, s: hsvS, v, a: 1 },
	}
}

function hexToRgb(hex: string) {
	const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)

	if (!match) throw new Error(`Invalid hex color: ${hex}`)

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
	const delta = max - min
	const l = (max + min) / 2

	let h = 0
	let s = 0

	if (delta !== 0) {
		s = delta / (1 - Math.abs(2 * l - 1))

		if (max === red) h = 60 * (((green - blue) / delta) % 6)
		if (max === green) h = 60 * ((blue - red) / delta + 2)
		if (max === blue) h = 60 * ((red - green) / delta + 4)
	}

	return { h: h < 0 ? h + 360 : h, s, l }
}

function rgbToHsv(r: number, g: number, b: number) {
	const red = r / 255
	const green = g / 255
	const blue = b / 255
	const max = Math.max(red, green, blue)
	const min = Math.min(red, green, blue)
	const delta = max - min

	return {
		s: max === 0 ? 0 : delta / max,
		v: max,
	}
}
