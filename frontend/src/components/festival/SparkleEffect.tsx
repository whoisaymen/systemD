'use client'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import FestivalSparkleIcon from './FestivalSparkleIcon'

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

const SparkleEffect: React.FC<SparkleProps> = ({
	count = 15,
	colors = [{ fill: 'var(--color-primary)', stroke: 'var(--color-dark)' }],
	speed = [15, 25],
	size = [10, 40],
	wind = [0, 0],
}) => {
	const [sparkles, setSparkles] = useState<
		Array<{
			id: number
			startX: number
			size: number
			speed: number
			delay: number
			rotate: number
			rotateSpeed: number
			windDrift: number
			color: (typeof colors)[0]
		}>
	>([])

	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		// Generate sparkle configurations
		const newSparkles = Array.from({ length: count }).map((_, i) => {
			const randomSize = size[0] + Math.random() * (size[1] - size[0])
			const randomSpeed = speed[0] + Math.random() * (speed[1] - speed[0])
			const randomWindDrift = wind[0] + Math.random() * (wind[1] - wind[0])
			const randomColor = colors[Math.floor(Math.random() * colors.length)]

			return {
				id: i,
				startX: Math.random() * 100, // Random horizontal position (%)
				size: randomSize,
				speed: randomSpeed,
				delay: Math.random() * 10, // Shorter random start delay
				rotate: Math.random() * 360, // Initial rotation
				rotateSpeed: Math.random() * 10 - 5, // Rotation speed
				windDrift: randomWindDrift,
				color: randomColor,
			}
		})

		setSparkles(newSparkles)
	}, [
		count,
		JSON.stringify(colors),
		JSON.stringify(speed),
		JSON.stringify(size),
		JSON.stringify(wind),
	])

	return (
		<div
			ref={containerRef}
			className="pointer-events-none absolute inset-0 z-[48] overflow-hidden"
		>
			{sparkles.map((sparkle) => (
				<motion.div
					key={sparkle.id}
					className="absolute"
					style={{
						left: `${sparkle.startX}%`,
						top: -sparkle.size, // Start just above container
						width: sparkle.size,
						height: sparkle.size,
					}}
					initial={{
						top: -sparkle.size,
						rotate: sparkle.rotate,
					}}
					animate={{
						top: '100%', // End at bottom of container
						x: sparkle.windDrift,
						rotate: sparkle.rotate + sparkle.rotateSpeed * 360,
					}}
					transition={{
						duration: sparkle.speed,
						ease: 'linear',
						delay: sparkle.delay,
						repeat: Infinity,
						repeatDelay: Math.random() * 2,
					}}
				>
					<FestivalSparkleIcon
						theme={{
							fill: sparkle.color.fill,
							stroke: sparkle.color.stroke,
						}}
						className="h-full w-full"
					/>
				</motion.div>
			))}
		</div>
	)
}

export default SparkleEffect
