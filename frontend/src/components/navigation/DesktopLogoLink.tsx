'use client'

import { useEffect, useState, type PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import Link from 'next/link'
import LogoShortAnimated from '../svgs/LogoShortAnimated'
import SystemDHeart from '../common/SystemDHeart'
import styles from './DesktopLogoLink.module.css'

const CAN_PLAY =
	'(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

export default function DesktopLogoLink({ onClick }: { onClick: () => void }) {
	const [playing, setPlaying] = useState(false)

	useEffect(() => {
		if (!playing) return
		const media = window.matchMedia(CAN_PLAY)
		const cancel = () => {
			if (!media.matches) setPlaying(false)
		}
		media.addEventListener('change', cancel)
		return () => media.removeEventListener('change', cancel)
	}, [playing])

	const playHeart = (event: PointerEvent<HTMLAnchorElement>) => {
		if (
			!playing &&
			event.pointerType === 'mouse' &&
			window.matchMedia(CAN_PLAY).matches
		) {
			setPlaying(true)
		}
	}

	return (
		<>
			<Link
				href="/"
				aria-label="System D"
				onPointerEnter={playHeart}
				onClick={() => {
					setPlaying(false)
					onClick()
				}}
				className="group block w-full shrink-0 rounded-md border-0 border-dark px-2 py-1 transition-opacity hover:opacity-80"
			>
				<LogoShortAnimated className="block h-auto w-full rounded-md text-primary" />
			</Link>
			{playing &&
				createPortal(
					<div
						className={styles.overlay}
						aria-hidden="true"
						data-system-d-heart
					>
						<motion.div
							className={styles.heart}
							initial={{ opacity: 0, scale: 1, y: 0 }}
							animate={{
								opacity: [0, 1, 1, 0],
								scale: [1, 1, 1, 0.96],
								y: [0, 0, 0, -16],
							}}
							transition={{
								duration: 3.8,
								times: [0, 0.08, 0.82, 1],
								ease: 'easeInOut',
							}}
							onAnimationComplete={() => setPlaying(false)}
						>
							<SystemDHeart />
						</motion.div>
					</div>,
					document.body,
				)}
		</>
	)
}
