type IllustrationKind = 'planet' | 'tiles' | 'ecosystem'

// Identify the existing CMS drawings, rather than assigning motion by story order.
// An unfamiliar illustration keeps its original static rendering.
const drawings: Record<string, IllustrationKind> = {
	'0 0 470 187': 'planet',
	'0 0 469 186': 'tiles',
	'0 0 638 603': 'ecosystem',
}

export function getStoryIllustrationKind(markup: string) {
	const viewBox = markup.match(/\bviewBox\s*=\s*["']([^"']+)["']/)?.[1]
	return viewBox
		? drawings[
				viewBox
					.trim()
					.split(/[\s,]+/)
					.map(Number)
					.join(' ')
			]
		: undefined
}

export function playStoryIllustration(
	svg: SVGSVGElement,
	kind: IllustrationKind,
): Animation[] {
	const animations: Animation[] = []
	const group = svg.querySelector(':scope > g')
	const paths = Array.from(
		(group ?? svg).querySelectorAll<SVGPathElement>(':scope > path'),
	)
	const tiles = Array.from(
		group?.querySelectorAll<SVGRectElement>(':scope > rect') ?? [],
	)
	const circle = group?.querySelector('circle')
	const ease = 'cubic-bezier(0.45, 0, 0.2, 1)'

	const animate = (
		elements: (SVGElement | undefined | null)[],
		keyframes: Keyframe[],
		{ duration = 1900, delay = 0, origin = '0px 0px' } = {},
	) => {
		for (const element of elements) {
			if (!element?.animate) continue
			animations.push(
				element.animate(
					keyframes.map((frame) => ({
						...frame,
						transformBox: 'view-box',
						transformOrigin: origin,
					})),
					{ duration, delay, easing: ease },
				),
			)
		}
	}
	const move = (x: number, y: number, rotation = 0) =>
		`translate(${x}px, ${y}px) rotate(${rotation}deg)`

	// A viewfinder squeezes in to take a picture. Keep all four corners paired.
	const focus = (amount: number, duration = 1900) => {
		const directions = [
			[-1, -1],
			[-1, 1],
			[1, -1],
			[1, 1],
		]
		paths.slice(0, 4).forEach((path, index) => {
			const [x, y] = directions[index]
			animate(
				[path],
				[
					{ transform: move(0, 0), offset: 0 },
					{ transform: move(x * amount, y * amount * 0.4), offset: 0.2 },
					{
						transform: move(x * amount * 0.65, y * amount * 0.25),
						offset: 0.32,
					},
					{
						transform: move(x * amount * 0.65, y * amount * 0.25),
						offset: 0.64,
					},
					{ transform: move(0, 0), offset: 1 },
				],
				{ duration },
			)
		})
	}

	if (kind === 'planet' && paths.length === 8 && circle) {
		focus(24)
		// Hemisphere, outline, and equator turn as one little planet.
		animate(
			[paths[5], circle, paths[6]],
			[
				{ transform: move(0, 0), offset: 0 },
				{ transform: move(-18, 5, -22), offset: 0.18 },
				{ transform: move(26, -16, 195), offset: 0.48 },
				{ transform: move(-5, 3, 372), offset: 0.77 },
				{ transform: move(0, 0, 360), offset: 1 },
			],
			{ origin: '235.014px 88.248px' },
		)
		;[paths[4], paths[7]].forEach((path, index) => {
			const direction = index === 0 ? -1 : 1
			animate(
				[path],
				[
					{ transform: move(0, 0), offset: 0 },
					{ transform: move(direction * 18, 0), offset: 0.22 },
					{ transform: move(-direction * 12, 0), offset: 0.48 },
					{ transform: move(direction * 4, 0), offset: 0.76 },
					{ transform: move(0, 0), offset: 1 },
				],
			)
		})
	}

	if (kind === 'tiles' && tiles.length === 4 && paths.length === 4) {
		// Four satellites chase each other around an oval, each doing a cartwheel.
		const angles = [
			0,
			-0.12,
			Math.PI * 0.55,
			Math.PI * 1.2,
			Math.PI * 1.8,
			Math.PI * 2,
		]
		const offsets = [0, 0.12, 0.36, 0.62, 0.85, 1]
		tiles.forEach((tile, index) => {
			const x =
				Number(tile.getAttribute('x')) + Number(tile.getAttribute('width')) / 2
			const y =
				Number(tile.getAttribute('y')) + Number(tile.getAttribute('height')) / 2
			const dx = x - 234.77
			const dy = y - 92.5
			animate(
				[tile],
				angles.map((angle, frame) => ({
					transform: move(
						dx * Math.cos(angle) - dy * (100 / 52) * Math.sin(angle) - dx,
						dx * (52 / 100) * Math.sin(angle) + dy * Math.cos(angle) - dy,
						(angle / (Math.PI * 2)) * 360,
					),
					offset: offsets[frame],
				})),
				{ duration: 2100, delay: index * 65, origin: `${x}px ${y}px` },
			)
		})
	}

	if (kind === 'ecosystem' && paths.length === 20) {
		// Each circle and its outline travel together; the overlap shading rests
		// while they separate, then returns when the three circles meet again.
		const hops = [
			[0, -42],
			[-38, 22],
			[38, 22],
		]
		hops.forEach(([x, y], index) => {
			animate(
				[paths[index], paths[index + 3]],
				[
					{ transform: move(0, 0), offset: 0 },
					{ transform: move(-x * 0.3, -y * 0.3), offset: 0.16 },
					{ transform: move(x, y), offset: 0.38 },
					{ transform: move(x * 0.85, y * 0.85), offset: 0.58 },
					{ transform: move(-x * 0.16, -y * 0.16), offset: 0.8 },
					{ transform: move(0, 0), offset: 1 },
				],
				{ duration: 2200, delay: index * 75 },
			)
		})
		for (const path of [...paths.slice(6, 12), ...paths.slice(16, 19)]) {
			const opacity = Number(path.getAttribute('opacity') ?? 1)
			animate(
				[path],
				[
					{ opacity, offset: 0 },
					{ opacity: 0, offset: 0.12 },
					{ opacity: 0, offset: 0.8 },
					{ opacity, offset: 1 },
				],
				{ duration: 2350 },
			)
		}
		animate(
			paths.slice(12, 16),
			[
				{ transform: 'rotate(0deg)', offset: 0 },
				{ transform: 'rotate(-8deg)', offset: 0.2 },
				{ transform: 'rotate(8deg)', offset: 0.52 },
				{ transform: 'rotate(-3deg)', offset: 0.8 },
				{ transform: 'rotate(0deg)', offset: 1 },
			],
			{ duration: 2200, origin: '320px 344px' },
		)
		animate(
			[paths[19]],
			[
				{ transform: 'rotate(0deg)', offset: 0 },
				{ transform: 'rotate(-30deg)', offset: 0.18 },
				{ transform: 'rotate(190deg)', offset: 0.66 },
				{ transform: 'rotate(180deg)', offset: 1 },
			],
			{ duration: 2200, origin: '320px 343px' },
		)
	}

	return animations
}
