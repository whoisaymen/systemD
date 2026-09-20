'use client'
import { useState, type CSSProperties } from 'react'
import styles from './SparkleEffect.module.css'

interface SparkleProps {
	count?: number
	colors?: {
		fill?: string
		stroke?: string
	}[]
	speed?: [number, number] // Min/max speed in seconds
	size?: [number, number] // Min/max size in pixels
	wind?: [number, number] // Min/max horizontal drift
}

const positions = [
	{ x: 4, size: 34, rotate: -8 },
	{ x: 17, size: 18, rotate: 13 },
	{ x: 29, size: 24, rotate: -22 },
	{ x: 44, size: 20, rotate: 18 },
	{ x: 58, size: 28, rotate: -11 },
	{ x: 68, size: 26, rotate: 10 },
	{ x: 81, size: 24, rotate: -18 },
	{ x: 94, size: 32, rotate: 15 },
	{ x: 12, size: 22, rotate: 7 },
	{ x: 36, size: 30, rotate: -15 },
	{ x: 64, size: 24, rotate: 20 },
	{ x: 89, size: 20, rotate: -6 },
	{ x: 23, size: 16, rotate: 12 },
	{ x: 73, size: 18, rotate: -20 },
	{ x: 96, size: 26, rotate: 9 },
]

const SparkleIcon = ({
	fill,
	className,
}: {
	fill?: string
	className?: string
}) => (
	<svg
		viewBox="0 0 86 113"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		aria-hidden="true"
	>
		<path
			d="M83.8463 54.7098C58.9345 49.5013 48.2272 34.0878 43.7605 1.43056C43.5008 -0.476854 41.5304 -0.476854 41.2706 1.43056C36.8039 34.0878 26.0967 49.5013 1.18477 54.7098C0.437162 54.8639 0.0443497 55.6538 0 56.4759C0.0443497 57.298 0.437162 58.0815 1.18477 58.242C26.0967 63.4505 36.8039 78.864 41.2706 111.521C41.5304 113.429 43.5008 113.429 43.7605 111.521C48.2272 78.864 58.9345 63.4505 83.8463 58.242C84.594 58.0879 84.9868 57.298 85.0311 56.4759C84.9868 55.6538 84.594 54.8703 83.8463 54.7098Z"
			fill={fill}
		/>
	</svg>
)

interface SparkleParticleProps {
	x: number
	size: number
	rotate: number
	speed: number
	windDrift: number
	delay: number
	color: { fill?: string; stroke?: string }
	scale: number
}

const SparkleParticle = ({ sparkle }: { sparkle: SparkleParticleProps }) => {
	const [shooting, setShooting] = useState(false)
	const [departureOpacity, setDepartureOpacity] = useState(0.85)
	const [cycle, setCycle] = useState(0)
	const direction = sparkle.x < 50 ? 1 : -1

	return (
		<div
			key={cycle}
			className={styles.particle}
			data-shooting={shooting}
			style={
				{
					left: `${sparkle.x}%`,
					width: sparkle.size,
					height: sparkle.size,
					color: sparkle.color.fill ?? 'var(--color-primary)',
					'--fall-duration': `${sparkle.speed}s`,
					'--fall-delay': `${cycle === 0 ? sparkle.delay : 0.8 + sparkle.x / 100}s`,
					'--wind-drift': `${sparkle.windDrift}px`,
					'--star-rotation': `${sparkle.rotate}deg`,
					'--star-scale': sparkle.scale,
					'--departure-opacity': departureOpacity,
					'--flight-x': `calc(${direction} * clamp(200px, 25vw, 360px))`,
					'--flight-y': 'clamp(96px, 12vw, 172.8px)',
					'--flight-angle': `${direction === 1 ? 25.64 : 154.36}deg`,
				} as CSSProperties
			}
			onPointerEnter={(event) => {
				if (event.pointerType === 'touch' || shooting) return
				const flight = event.currentTarget.firstElementChild
				if (!flight) return
				// Keep the current brightness so a faint star never flashes on hover.
				setDepartureOpacity(Number(getComputedStyle(flight).opacity))
				setShooting(true)
			}}
		>
			<div
				className={styles.flight}
				onAnimationEnd={(event) => {
					// Ignore the head and trail finishing inside the flight.
					if (event.target !== event.currentTarget || !shooting) return
					setShooting(false)
					setCycle((previous) => previous + 1)
				}}
			>
				<span className={styles.trajectory}>
					<span className={styles.trail} />
				</span>
				<span className={styles.head}>
					<span className={styles.spin}>
						<SparkleIcon fill="currentColor" className="h-full w-full" />
					</span>
				</span>
			</div>
		</div>
	)
}

const SparkleEffect: React.FC<SparkleProps> = ({
	count = 15,
	colors = [{ fill: 'var(--color-primary)', stroke: 'var(--color-dark)' }],
	speed = [15, 25],
	size = [10, 40],
	wind = [0, 0],
}) => {
	const sparkles = Array.from({ length: count }).map((_, index) => {
		const preset = positions[index % positions.length]
		const speedRange = speed[1] - speed[0]
		const windRange = wind[1] - wind[0]
		const duration = speed[0] + ((index * 7) % 10) * (speedRange / 10)

		return {
			...preset,
			size: Math.max(size[0], Math.min(size[1], preset.size || size[0])),
			speed: duration,
			windDrift: wind[0] + ((index * 3) % 10) * (windRange / 10),
			delay: -((index * 2.7) % duration),
			color: colors[index % colors.length],
			scale: 0.9 + ((index * 5) % 4) * 0.08,
		}
	})

	return (
		<div
			className={`pointer-events-none absolute inset-0 z-[48] overflow-hidden ${styles.field}`}
			aria-hidden="true"
		>
			{sparkles.map((sparkle, index) => (
				<SparkleParticle key={index} sparkle={sparkle} />
			))}
		</div>
	)
}

export default SparkleEffect
