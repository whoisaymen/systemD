'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import LogoShort from '../svgs/LogoShort'
import styles from './SystemDHeart.module.css'

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

const LABELS = OUTLINE.map(([x, y], index) => {
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

export default function SystemDHeart({
	visible = true,
	entrance = 'fall',
	originRef,
}: {
	visible?: boolean
	entrance?: 'fall' | 'corners'
	originRef?: RefObject<HTMLElement | null>
}) {
	const reduceMotion = useReducedMotion()
	const artworkRef = useRef<HTMLDivElement>(null)
	const [entranceKey, setEntranceKey] = useState(0)
	const [origins, setOrigins] = useState<{ x: number; y: number }[] | null>(
		null,
	)

	useEffect(() => {
		if (entrance !== 'corners' || !artworkRef.current || !originRef?.current)
			return
		const artwork = artworkRef.current.getBoundingClientRect()
		const panel = originRef.current.getBoundingClientRect()
		// Use the visible content panel, including on pages taller than the screen.
		const top = Math.max(panel.top, 0) + 20
		const bottom = Math.min(panel.bottom, window.innerHeight) - 20
		const corners = [
			{ x: panel.left + 20, y: top },
			{ x: panel.right - 20, y: top },
			{ x: panel.right - 20, y: bottom },
			{ x: panel.left + 20, y: bottom },
		]
		setOrigins(
			LABELS.map((label, index) => {
				const corner = corners[[0, 3, 1, 2, 0, 3, 1, 2][index]]
				return {
					x: corner.x - (artwork.left + (artwork.width * label.x) / 100),
					y: corner.y - (artwork.top + (artwork.height * label.y) / 100),
				}
			}),
		)
		// Cached routes reconnect effects while retaining their component state.
		setEntranceKey((key) => key + 1)
	}, [entrance, originRef])

	return (
		<div
			ref={artworkRef}
			className={styles.heart}
			aria-hidden="true"
			data-system-d-heart-artwork
		>
			{(entrance === 'fall' || origins) &&
				LABELS.map((label, index) => (
					<div
						key={`${entranceKey}-${index}`}
						className={styles.anchor}
						style={{
							left: `${label.x}%`,
							top: `${label.y}%`,
							width: `${label.width}%`,
						}}
					>
						<motion.div
							className={styles.label}
							initial={{
								x: origins?.[index].x ?? 0,
								y: origins?.[index].y ?? '-100vh',
								opacity: 0,
								rotate:
									label.rotate +
									(entrance === 'corners' ? (index % 2 ? 18 : -18) : 0),
							}}
							animate={{
								x: 0,
								y: visible || reduceMotion ? 0 : '-100vh',
								opacity: visible || reduceMotion ? 1 : 0,
								rotate: label.rotate,
							}}
							transition={
								reduceMotion
									? { duration: 0 }
									: {
											type: 'spring',
											stiffness: 60,
											damping: 12,
											delay:
												entrance === 'corners' ? index * 0.07 : label.delay,
										}
							}
						>
							<LogoShort />
						</motion.div>
					</div>
				))}
		</div>
	)
}
