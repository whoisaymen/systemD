'use client'

import { useEffect, useRef, type RefObject } from 'react'
import {
	getStoryIllustrationKind,
	playStoryIllustration,
} from './storyIllustrationMotion'
import styles from './StoryIllustration.module.css'

const replayLabels: Record<string, string> = {
	fr: 'Rejouer l’animation',
	en: 'Replay animation',
	nl: 'Animatie opnieuw afspelen',
}

export default function StoryIllustration({
	markup,
	lang,
	compact,
	scrollContainerRef,
}: {
	markup: string
	lang: string
	compact: boolean
	scrollContainerRef: RefObject<HTMLDivElement | null>
}) {
	const artworkRef = useRef<HTMLSpanElement>(null)
	const replayRef = useRef(() => {})
	const kind = getStoryIllustrationKind(markup)

	useEffect(() => {
		const artwork = artworkRef.current
		const svg = artwork?.querySelector('svg')
		if (!artwork || !svg || !kind) return

		const desktop = window.matchMedia('(min-width: 1024px)')
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
		let animations: Animation[] = []
		let observer: IntersectionObserver | undefined
		let visible = false

		const stop = () => {
			animations.forEach((animation) => animation.cancel())
			animations = []
		}
		const play = () => {
			if (
				reducedMotion.matches ||
				animations.some((animation) => animation.playState === 'running')
			)
				return
			stop()
			animations = playStoryIllustration(svg, kind)
		}
		const updateMotionPreference = () => {
			if (reducedMotion.matches) stop()
		}
		const observe = () => {
			observer?.disconnect()
			stop()
			visible = false
			observer = new IntersectionObserver(
				([entry]) => {
					const inView = entry.isIntersecting && entry.intersectionRatio >= 0.45
					if (inView && !visible) play()
					if (!entry.isIntersecting) stop()
					visible = inView
				},
				{
					root: desktop.matches ? scrollContainerRef.current : null,
					threshold: [0, 0.45],
				},
			)
			observer.observe(artwork)
		}

		replayRef.current = play
		observe()
		desktop.addEventListener('change', observe)
		reducedMotion.addEventListener('change', updateMotionPreference)
		return () => {
			observer?.disconnect()
			stop()
			replayRef.current = () => {}
			desktop.removeEventListener('change', observe)
			reducedMotion.removeEventListener('change', updateMotionPreference)
		}
	}, [kind, markup, scrollContainerRef])

	const artwork = (
		<span
			ref={artworkRef}
			aria-hidden="true"
			className={`theme-bigbang-short-story-art ${styles.art}`}
			dangerouslySetInnerHTML={{ __html: markup }}
		/>
	)
	const className = `${styles.illustration} ${compact ? styles.compact : ''}`

	// New CMS artwork stays untouched until it has its own choreography.
	if (!kind) return <div className={className}>{artwork}</div>

	return (
		<button
			type="button"
			className={className}
			data-story-illustration={kind}
			aria-label={replayLabels[lang] ?? replayLabels.en}
			onPointerEnter={(event) => {
				if (event.pointerType === 'mouse') replayRef.current()
			}}
			onClick={() => replayRef.current()}
			onFocus={() => replayRef.current()}
		>
			{artwork}
		</button>
	)
}
