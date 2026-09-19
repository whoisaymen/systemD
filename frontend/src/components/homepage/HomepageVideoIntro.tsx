'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import LogoShortAnimated from '@/components/svgs/LogoShortAnimated'
import MediaExpandIcon from '@/components/common/MediaExpandIcon'

const INTRO_DELAY_MS = 1000
const SQUEEZE_DURATION_MS = 1000
const SQUEEZE_EASE = 'cubic-bezier(0.76, 0, 0.24, 1)'
const HOME_VIDEO_EXPANDED_EVENT = 'homepage-video-expanded-change'
export const SKIP_HOME_INTRO_KEY = 'system-d-skip-home-intro-once'

const getInitialIntroState = () => {
	if (typeof window === 'undefined') {
		return {
			isExpanded: true,
			shouldRunIntro: true,
			showControl: false,
		}
	}

	const shouldSkipIntro =
		window.sessionStorage.getItem(SKIP_HOME_INTRO_KEY) === 'true'

	if (shouldSkipIntro) {
		window.sessionStorage.removeItem(SKIP_HOME_INTRO_KEY)
	}

	return {
		isExpanded: !shouldSkipIntro,
		shouldRunIntro: !shouldSkipIntro,
		showControl: shouldSkipIntro,
	}
}

const publishExpandedState = (expanded: boolean) => {
	document.documentElement.dataset.homepageVideoExpanded = expanded
		? 'true'
		: 'false'
	window.dispatchEvent(
		new CustomEvent(HOME_VIDEO_EXPANDED_EVENT, {
			detail: { expanded },
		}),
	)
}

const VideoChrome = () => (
	<>
		<div className="pointer-events-none absolute inset-0 z-20">
			<div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
				<div className="border-b border-r border-grayLight opacity-20" />
				<div className="border-b border-r border-grayLight opacity-20" />
				<div className="border-b border-grayLight opacity-20" />
				<div className="border-b border-r border-grayLight opacity-20" />
				<div className="border-b border-r border-grayLight opacity-20" />
				<div className="border-b border-grayLight opacity-20" />
				<div className="border-r border-grayLight opacity-20" />
				<div className="border-r border-grayLight opacity-20" />
				<div />
			</div>
		</div>

		<div className="absolute left-4 top-4 z-30 h-8 w-8 border-l-[2px] border-t-[2px] border-[#fff] mix-blend-overlay" />
		<div className="absolute right-4 top-4 z-30 h-8 w-8 border-r-[2px] border-t-[2px] border-[#fff] mix-blend-overlay" />
		<div className="absolute bottom-4 left-4 z-30 h-8 w-8 border-b-[2px] border-l-[2px] border-[#fff] mix-blend-overlay" />
		<div className="absolute bottom-4 right-4 z-30 h-8 w-8 border-b-[2px] border-r-[2px] border-[#fff] mix-blend-overlay" />

		<div className="absolute z-30 flex items-center justify-center sm:hidden">
			<LogoShortAnimated
				className="w-[85vw] -rotate-6 text-primary"
				theme={{ fill: 'var(--color-primary)', stroke: 'var(--color-dark)' }}
			/>
		</div>
	</>
)

const HomepageVideo = ({ homepage }: { homepage?: any }) => {
	const src =
		homepage?.backgroundVideoUrlResolved || homepage?.backgroundVideoUrl
	if (!src) return null
	return (
		<video
			key={src}
			className="h-full w-full transform rounded-none border-0 object-cover"
			autoPlay
			loop
			muted
			playsInline
			src={src}
		/>
	)
}

const HomepageVideoIntro = ({ homepage }: { homepage?: any }) => {
	const reduceMotion = useReducedMotion()
	const shouldReduceMotion = reduceMotion === true
	const [initialIntroState] = useState(getInitialIntroState)
	const [isExpanded, setIsExpanded] = useState(initialIntroState.isExpanded)
	const [showControl, setShowControl] = useState(initialIntroState.showControl)
	const [shouldAnimateShell, setShouldAnimateShell] = useState(
		initialIntroState.shouldRunIntro,
	)

	const updateExpandedState = useCallback((expanded: boolean) => {
		publishExpandedState(expanded)
		setIsExpanded(expanded)
	}, [])

	useEffect(() => {
		publishExpandedState(isExpanded)
	}, [isExpanded])

	useEffect(() => {
		if (shouldReduceMotion) {
			setShouldAnimateShell(false)
			return
		}

		if (initialIntroState.shouldRunIntro) {
			setShouldAnimateShell(true)
			return
		}

		const transitionFrame = window.requestAnimationFrame(() => {
			setShouldAnimateShell(true)
		})

		return () => {
			window.cancelAnimationFrame(transitionFrame)
		}
	}, [initialIntroState.shouldRunIntro, shouldReduceMotion])

	useEffect(() => {
		if (!initialIntroState.shouldRunIntro) return

		if (shouldReduceMotion) {
			updateExpandedState(false)
			setShowControl(true)
			return
		}

		const shrinkTimer = window.setTimeout(() => {
			updateExpandedState(false)
		}, INTRO_DELAY_MS)
		const controlTimer = window.setTimeout(() => {
			setShowControl(true)
		}, INTRO_DELAY_MS + SQUEEZE_DURATION_MS)

		return () => {
			window.clearTimeout(shrinkTimer)
			window.clearTimeout(controlTimer)
		}
	}, [
		initialIntroState.shouldRunIntro,
		shouldReduceMotion,
		updateExpandedState,
	])

	return (
		<>
			<div className="relative flex h-svh w-full items-center justify-center overflow-hidden tracking-tight lg:hidden">
				<VideoChrome />
				<HomepageVideo homepage={homepage} />
			</div>

			<div
				data-testid="homepage-video-shell"
				data-expanded={isExpanded}
				className={`group/homepage-video shadowtest fixed z-40 hidden overflow-hidden bg-dark tracking-tight transition-[left,right,top,bottom,border-radius] lg:block ${
					shouldAnimateShell ? 'duration-[1000ms]' : 'duration-0'
				} ${
					isExpanded
						? 'bottom-0 left-0 right-0 top-0 rounded-none'
						: 'bottom-1 left-[var(--width-column-width)] right-[var(--width-column-width)] top-1 rounded-xl'
				}`}
				style={{
					transitionTimingFunction: SQUEEZE_EASE,
				}}
			>
				<VideoChrome />
				<HomepageVideo homepage={homepage} />

				{showControl && (
					<motion.button
						data-testid="homepage-video-toggle"
						type="button"
						onClick={() => {
							if (!shouldReduceMotion) {
								setShouldAnimateShell(true)
							}
							updateExpandedState(!isExpanded)
						}}
						className="pointer-events-none absolute right-8 top-8 z-40 flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border-[1.5px] border-primary bg-dark/90 text-[color:var(--color-primary)] opacity-0 shadow-md backdrop-blur transition-[color,background-color,opacity] duration-200 hover:bg-primary hover:text-dark focus:outline-none focus-visible:pointer-events-auto focus-visible:opacity-100 group-hover/homepage-video:pointer-events-auto group-hover/homepage-video:opacity-100"
						aria-label={
							isExpanded
								? 'Narrow video and show menu columns'
								: 'Widen video and hide menu columns'
						}
						initial={{ scale: 0.8, y: 8 }}
						animate={{ scale: 1, y: 0 }}
						whileHover={{ scale: 1.06 }}
						transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
					>
						<MediaExpandIcon expanded={isExpanded} />
					</motion.button>
				)}
			</div>
		</>
	)
}

export default HomepageVideoIntro
