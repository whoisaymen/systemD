'use client'
import { cubicBezier } from 'motion/react'
import { createRef, type RefObject, useEffect, useMemo } from 'react'
import BackToTopButton from '../common/BackToTop'
import { renderParagraph } from '../common/RenderParagraph'
import { localizedRichText } from '@/lib/richText'
import { EDITORIAL_BODY_TEXT } from '@/components/common/editorialStyles'

const scrollEase = cubicBezier(0.76, 0, 0.24, 1)
// Reserve only the illustration's largest displayed size in the document flow.
const illustrationLayoutScale = 0.8
const initialIllustrationScale = 0.5 / illustrationLayoutScale

const ShortStory = ({
	content,
	lang,
	scrollContainerRef,
}: {
	content: any[]
	lang: any
	scrollContainerRef: RefObject<HTMLDivElement | null>
}) => {
	const paragraphRefs = useMemo(
		() => content.map(() => createRef<HTMLDivElement>()),
		[content],
	)
	const imageRefs = useMemo(
		() => content.map(() => createRef<HTMLDivElement>()),
		[content],
	)

	useEffect(() => {
		const mediaQuery = window.matchMedia('(min-width: 1024px)')
		let animationFrame = 0
		let removeScrollListener = () => {}

		const clamp = (value: number) => Math.min(1, Math.max(0, value))
		const scaleForProgress = (progress: number) => {
			const triangleProgress =
				progress <= 0.5 ? progress * 2 : (1 - progress) * 2

			return (
				(0.5 + scrollEase(clamp(triangleProgress)) * 0.3) /
				illustrationLayoutScale
			)
		}

		const updateScales = () => {
			animationFrame = 0
			const innerScroller = mediaQuery.matches
				? scrollContainerRef.current
				: null
			const scrollerRect = innerScroller?.getBoundingClientRect()
			const viewportTop = scrollerRect?.top ?? 0
			const viewportHeight = innerScroller?.clientHeight ?? window.innerHeight
			const viewportBottom = viewportTop + viewportHeight

			imageRefs.forEach((imageRef, index) => {
				const image = imageRef.current
				const isFinalBlock = index === content.length - 1

				if (isFinalBlock) return

				const target = paragraphRefs[index + 1]?.current

				if (!image || !target) return

				const targetRect = target.getBoundingClientRect()
				const targetCenter = targetRect.top + targetRect.height / 2
				const progress = clamp((viewportBottom - targetCenter) / viewportHeight)

				image.style.transform = `scale(${scaleForProgress(progress)})`
			})
		}

		const scheduleScaleUpdate = () => {
			if (animationFrame) return
			animationFrame = window.requestAnimationFrame(updateScales)
		}

		const bindScrollListener = () => {
			removeScrollListener()
			const scrollTarget = mediaQuery.matches
				? scrollContainerRef.current
				: window

			scrollTarget?.addEventListener('scroll', scheduleScaleUpdate, {
				passive: true,
			})
			removeScrollListener = () =>
				scrollTarget?.removeEventListener('scroll', scheduleScaleUpdate)
			scheduleScaleUpdate()
		}

		bindScrollListener()
		mediaQuery.addEventListener('change', bindScrollListener)
		window.addEventListener('resize', scheduleScaleUpdate)

		return () => {
			removeScrollListener()
			mediaQuery.removeEventListener('change', bindScrollListener)
			window.removeEventListener('resize', scheduleScaleUpdate)
			if (animationFrame) window.cancelAnimationFrame(animationFrame)
		}
	}, [content.length, imageRefs, paragraphRefs, scrollContainerRef])

	return (
		<div className="mx-auto flex w-full flex-col gap-6 pb-12 sm:gap-10 sm:pb-16 lg:max-w-[60rem]">
			{content.map((block: any, index: number) => (
				<StoryBlock
					key={block._key}
					block={block}
					lang={lang}
					paragraphRef={paragraphRefs[index]}
					imageRef={imageRefs[index]}
					isFinalBlock={index === content.length - 1}
				/>
			))}
		</div>
	)
}

const StoryBlock = ({
	block,
	lang,
	paragraphRef,
	imageRef,
	isFinalBlock,
}: {
	block: any
	lang: any
	paragraphRef: RefObject<HTMLDivElement | null>
	imageRef: RefObject<HTMLDivElement | null>
	isFinalBlock: boolean
}) => {
	return (
		<div
			className="flex w-full flex-col items-center justify-center gap-6 px-4 text-center sm:gap-10"
			id="short-story"
		>
			<div className="fixed bottom-4 right-12 z-50">
				<BackToTopButton targetId="navbar-mobile" />
			</div>
			{block.text && (
				<div
					ref={paragraphRef}
					className="theme-bigbang-short-story-copy relative px-4 sm:mx-40"
				>
					<div className={`${EDITORIAL_BODY_TEXT} text-center text-primary`}>
						{renderParagraph(
							{ value: localizedRichText(block.text, lang) },
							[],
							'theme-bigbang-system-d-tag',
						)}
					</div>
				</div>
			)}

			{block.svgMarkup && (
				<div
					ref={imageRef}
					style={
						isFinalBlock
							? undefined
							: {
									transform: `scale(${initialIllustrationScale})`,
									transformOrigin: 'center',
								}
					}
					className={`relative ${
						isFinalBlock
							? 'w-[35%] px-2'
							: 'w-4/5 px-[0.4rem] will-change-transform sm:px-[1.6rem]'
					}`}
				>
					{block.svgMarkup && (
						<div
							className="theme-bigbang-short-story-art h-auto w-full"
							style={{ color: 'var(--color-grayDark)' }}
							dangerouslySetInnerHTML={{ __html: block.svgMarkup }}
						/>
					)}
				</div>
			)}
		</div>
	)
}

export default ShortStory
