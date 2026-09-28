// A single square coordinate system keeps the notch, lobes and tip in proportion.
const OUTLINE = [
	[50, 30],
	[28, 10],
	[8, 36],
	[22, 62],
	[50, 90],
	[78, 62],
	[92, 36],
	[72, 10],
] as const

export const SYSTEM_D_HEART_LABELS = OUTLINE.map(([x, y], index) => {
	const [nextX, nextY] = OUTLINE[(index + 1) % OUTLINE.length]
	const angle = (Math.atan2(nextY - y, nextX - x) * 180) / Math.PI
	return {
		x: (x + nextX) / 2,
		y: (y + nextY) / 2,
		width: Math.hypot(nextX - x, nextY - y) + 4,
		// Keep the wordmark upright on both sides of the heart.
		rotate: angle > 90 ? angle - 180 : angle < -90 ? angle + 180 : angle,
		delay: [0.3, 0.1, 0.7, 1.1, 1.3, 0.9, 0.5, 0.3][index],
	}
})
