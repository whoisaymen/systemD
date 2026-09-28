import type { CSSProperties } from 'react'
import {
	EDITORIAL_BODY_TEXT,
	EDITORIAL_COPY_WIDTH,
	EDITORIAL_DESKTOP_TAB_STYLE,
	EDITORIAL_MOBILE_TAB_STYLE,
} from '@/components/common/editorialStyles'
import memoireStyles from '@/components/memoire/MemoireContent.module.css'
import styles from './PageSkeleton.module.css'
import fabriqueStyles from '@/components/fabrique/FabriqueContent.module.css'
import { SYSTEM_D_HEART_LABELS } from '@/components/common/systemDHeartLayout'

export type SkeletonPage =
	| 'home'
	| 'apply'
	| 'bigbang'
	| 'festival'
	| 'memoire'
	| 'fabrique'
	| 'equipe'
	| 'edition'
	| 'film'
	| 'about'
	| 'generic'

export function skeletonPageForPath(pathname: string): SkeletonPage {
	const segments = pathname.split(/[?#]/)[0].split('/').filter(Boolean)
	const route = segments[1]
	if (!route) return 'home'
	if (route === 'apply') return 'apply'
	if (route === 'festival') return segments[2] ? 'edition' : 'festival'
	if (route === 'contact' || route === 'about') return 'about'
	if (['bigbang', 'memoire', 'fabrique', 'equipe', 'film'].includes(route)) {
		return route as SkeletonPage
	}
	return 'generic'
}

function Shape({
	className = '',
	style,
}: {
	className?: string
	style?: CSSProperties
}) {
	return <div className={`${styles.shape} ${className}`} style={style} />
}

function Copy({
	lines = 4,
	mobileLines = lines,
	centered = false,
	className = '',
}: {
	lines?: number
	mobileLines?: number
	centered?: boolean
	className?: string
}) {
	return (
		<div
			className={`${EDITORIAL_BODY_TEXT} ${styles.copy} ${centered ? styles.centered : ''} ${className}`}
		>
			{Array.from({ length: Math.max(lines, mobileLines) }, (_, index) => (
				<Shape
					key={index}
					className={`${styles.line} ${index >= lines ? 'lg:hidden' : index >= mobileLines ? 'hidden lg:block' : ''}`}
					style={
						{
							'--line-width': index === lines - 1 ? '62%' : '100%',
							'--mobile-line-width': index === mobileLines - 1 ? '62%' : '100%',
						} as CSSProperties
					}
				/>
			))}
		</div>
	)
}

function MobileHeading({ lines }: { lines: number }) {
	return (
		<div className={styles.mobileHeading}>
			{Array.from({ length: lines }, (_, index) => (
				<Shape
					key={index}
					className="h-[0.8em] rounded-sm"
					style={{ width: index === lines - 1 ? '72%' : '96%' }}
				/>
			))}
		</div>
	)
}

function Tabs({
	widths,
	mobileWidths = widths,
	stacked = true,
}: {
	widths: number[]
	mobileWidths?: number[]
	stacked?: boolean
}) {
	return (
		<div
			className={`flex items-center justify-center lg:flex-row lg:flex-wrap lg:items-start ${stacked ? 'flex-col' : 'flex-wrap'}`}
		>
			{widths.map((width, index) => (
				<Shape
					key={index}
					className={`${EDITORIAL_MOBILE_TAB_STYLE} ${EDITORIAL_DESKTOP_TAB_STYLE} ${styles.tab}`}
					style={
						{
							'--tab-width': `${width}em`,
							'--mobile-tab-width': `${mobileWidths[index]}em`,
							rotate: index % 2 ? '3deg' : '-3deg',
						} as CSSProperties
					}
				/>
			))}
		</div>
	)
}

function StorySkeleton() {
	return (
		<>
			<div className="mb-2 mt-8 lg:mt-[clamp(2.25rem,4.78cqw,5rem)]">
				<Tabs widths={[7.3, 6.8]} />
			</div>
			<div className="pt-6 lg:pt-10">
				<div className="mx-auto flex w-full flex-col items-center gap-6 pb-24 sm:gap-10 lg:max-w-[60rem] lg:pb-16">
					<div className="w-full px-4">
						<div className="px-4 sm:mx-40">
							<Copy lines={3} mobileLines={4} centered />
						</div>
					</div>
					<div className="flex w-full justify-center px-4">
						<div className={styles.storyIllustration}>
							<Shape className={styles.storyCircle} />
							<Shape className={styles.storyCircle} />
							<Shape className={styles.storyCircle} />
						</div>
					</div>
					<div className="w-full px-4">
						<div className="px-4 sm:mx-40">
							<Copy lines={4} mobileLines={6} centered />
						</div>
					</div>
					<Shape className="aspect-[2/1] w-4/5 rounded-xl" />
				</div>
			</div>
		</>
	)
}

function FestivalSkeleton() {
	return (
		<>
			<div className="px-4 pb-16 pt-2 lg:hidden">
				<Tabs widths={[6.3, 8.5, 4.3]} />
				<div className="rounded-xl border-2 border-primary/15 bg-primary/10 px-3 pb-3">
					<div className="flex items-center justify-between gap-2 py-3">
						<Shape className="h-8 w-20 -rotate-3 rounded-md" />
						<div className="flex items-center gap-1">
							<Shape className="h-7 w-7 rounded" />
							<Shape className="h-5 w-24 rounded" />
							<Shape className="ml-1 h-7 w-7 rounded" />
						</div>
					</div>
					<div className="grid grid-cols-7 pb-2">
						{Array.from({ length: 7 }, (_, index) => (
							<Shape
								key={index}
								className="mx-auto my-0.5 h-3 w-5 rounded-sm"
							/>
						))}
					</div>
					<div className="grid grid-cols-7">
						{Array.from({ length: 35 }, (_, index) => (
							<div
								key={index}
								className="flex min-h-12 items-center justify-center border-t border-primary/15 py-1"
							>
								<Shape className="h-5 w-5 rounded-sm" />
							</div>
						))}
					</div>
					<div className="mt-4 border-t border-primary/20">
						{[0, 1, 2].map((index) => (
							<div
								key={index}
								className="mt-3 flex min-h-[58px] items-center gap-1.5 rounded-lg border border-primary/15 p-1.5"
							>
								<Shape className="h-8 w-7 shrink-0 rounded-sm" />
								<div className="flex-1 space-y-1.5 px-1.5">
									<Shape className="h-4 w-4/5 rounded-sm" />
									<Shape className="h-3 w-3/5 rounded-sm" />
								</div>
								<Shape className="h-7 w-8 rounded-sm" />
							</div>
						))}
					</div>
				</div>
				<Shape className="mt-6 h-[65vh] w-full" />
			</div>
			<div className="hidden lg:mt-[clamp(0.75rem,1.45cqw,1rem)] lg:block lg:py-[clamp(1.5rem,3.33cqw,4rem)]">
				<Tabs widths={[6, 4.2, 8.3]} />
				<div className="mx-[min(8rem,11.6%)] mt-[calc(min(1.5rem,1.67cqw)+2rem)] rounded-xl bg-primary/10 p-3">
					<Shape className="mb-3 h-6 w-24 -rotate-3 rounded-md" />
					<div className="grid h-[clamp(18rem,40svh,25rem)] grid-cols-4 grid-rows-3 gap-2">
						{Array.from({ length: 12 }, (_, index) => (
							<div
								key={index}
								className="rounded-lg border border-primary/15 p-[clamp(0.5rem,1.2svh,0.75rem)]"
							>
								<Shape className="h-3 w-2/3 rounded-sm" />
								{index % 3 === 0 && (
									<Shape className="mt-3 h-5 w-full rounded-sm" />
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	)
}

function MemoireSkeleton() {
	return (
		<div className="min-h-[calc(100svh-4rem)] px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] [container-type:inline-size] lg:min-h-0 lg:p-8 lg:[container-type:normal]">
			<MemoireCardsSkeleton />
		</div>
	)
}

export function MemoireCardsSkeleton() {
	return (
		<ol className={memoireStyles.collage}>
			{[0, 1, 2, 3, 4].map((index) => (
				<li
					key={index}
					className={memoireStyles.item}
					data-edition-year={index === 1 ? '2021' : undefined}
				>
					<Shape
						className={`rounded-[2rem] ${index === 0 ? 'aspect-[3/4] w-3/4' : 'aspect-[3/2] w-full'}`}
					/>
					<div className={memoireStyles.labels}>
						<Shape className="h-6 w-16 -rotate-6 rounded-md lg:h-8 lg:w-20" />
						<Shape
							className={`h-6 rotate-6 rounded-md lg:h-8 ${index === 1 ? 'w-32 lg:w-40' : 'w-16 lg:w-20'}`}
						/>
					</div>
				</li>
			))}
		</ol>
	)
}

function FabriqueSkeleton() {
	return (
		<div className="flex min-h-full flex-col pb-[calc(8rem+env(safe-area-inset-bottom))] lg:pb-4">
			<div className="pt-4 lg:hidden">
				<Tabs widths={[5.4, 11.4, 5.7]} />
				<div className={`${EDITORIAL_COPY_WIDTH} mt-8`}>
					<MobileHeading lines={3} />
				</div>
				<div className={`${EDITORIAL_COPY_WIDTH} mt-10`}>
					<Copy lines={5} />
				</div>
			</div>
			<div
				className={`${EDITORIAL_COPY_WIDTH} hidden lg:mt-[clamp(2.25rem,4.78cqw,5rem)] lg:block`}
			>
				<div className={`${styles.heading} mb-[0.8em]`}>
					<Shape className="mx-auto h-[0.8em] w-[90%] rounded-sm" />
					<Shape className="mx-auto mt-[0.4em] h-[0.8em] w-full rounded-sm" />
				</div>
				<div className="pt-8">
					<Copy lines={3} />
				</div>
			</div>
			<div className="hidden lg:block lg:pt-10">
				<Tabs widths={[5.4, 11.4, 5.7]} />
				<div className={`${EDITORIAL_COPY_WIDTH} pb-[0.89em] pt-12`}>
					<Copy lines={4} />
				</div>
			</div>
			<div className={fabriqueStyles.collage}>
				<div className={fabriqueStyles.artworkSlot}>
					<div className={`${fabriqueStyles.artwork} relative aspect-square`}>
						{SYSTEM_D_HEART_LABELS.map((label, index) => (
							<Shape
								key={index}
								className="absolute aspect-[6/1] rounded-sm"
								style={{
									left: `${label.x}%`,
									top: `${label.y}%`,
									width: `${label.width}%`,
									transform: `translate(-50%, -50%) rotate(${label.rotate}deg)`,
								}}
							/>
						))}
					</div>
				</div>
				<div className={`${EDITORIAL_COPY_WIDTH} py-2`}>
					<Shape className="mx-auto h-6 w-[85%] rounded-sm" />
				</div>
			</div>
		</div>
	)
}

function EquipeSkeleton() {
	return (
		<div className="flex min-h-full flex-col pb-28 pt-12 lg:justify-center lg:py-10">
			<div className={`${styles.teamStage} lg:pt-3`}>
				<Shape
					className={`${styles.teamSideLeft} h-[68%] w-[92px] -rotate-1 rounded-md`}
				/>
				<Shape className={`${styles.teamPortrait} shrink-0 rounded-md`} />
				<Shape
					className={`${styles.teamSideRight} h-[68%] w-[146px] rotate-1 rounded-md`}
				/>
			</div>
			<div className="relative mx-auto -mt-3.5 w-[calc(100%-2rem)] max-w-[38rem] lg:mt-5 lg:w-full lg:max-w-none">
				<div className={styles.teamName}>
					<Tabs widths={[4, 4]} stacked={false} />
				</div>
				<div className="mt-1 flex items-center justify-center gap-2">
					<Shape className="h-8 w-8 rounded-sm lg:hidden" />
					<Shape className="h-6 w-40 -rotate-3 rounded-md lg:w-56" />
					<Shape className="h-8 w-8 rounded-sm lg:hidden" />
				</div>
			</div>
			<div className={`${EDITORIAL_COPY_WIDTH} mt-5 min-h-36 lg:mt-6`}>
				<div className={`mx-auto max-w-[60ch] ${EDITORIAL_BODY_TEXT}`}>
					<Copy lines={9} mobileLines={14} />
				</div>
			</div>
		</div>
	)
}

function FilmSkeleton() {
	return (
		<div className="relative px-5 lg:px-32 lg:pb-20">
			<div className="flex items-start justify-between lg:hidden">
				<div className="flex flex-col items-start gap-1 pb-4">
					<Shape className="aspect-[76/61] w-10 rounded-md" />
					<Shape className="h-6 w-28 -rotate-3 rounded-md" />
				</div>
				<Shape className="mr-2 mt-2 h-5 w-8 rounded-sm" />
			</div>
			<Shape className="absolute left-6 top-5 hidden h-7 w-10 rounded-md lg:block" />
			<Shape className="absolute left-6 top-14 hidden h-6 w-20 -rotate-3 rounded-md lg:block" />
			<div className="relative z-10 hidden translate-y-24 lg:block">
				<Tabs widths={[10, 6]} />
			</div>
			<Shape className="mx-1 aspect-video rounded-md lg:mx-0 lg:mt-24 lg:w-full lg:rounded-xl" />
			<div className="mt-2 flex flex-col items-center gap-2 px-6 lg:hidden">
				<div className="flex w-full flex-col items-center">
					<Shape className="h-10 w-[72%] -rotate-1 rounded-md" />
					<Shape className="-mt-1 h-10 w-[36%] rotate-1 rounded-md" />
					<Shape className="h-6 w-3/5 -rotate-1 rounded-md" />
					<Shape className="h-6 w-1/5 rotate-1 rounded-md" />
					<Shape className="h-7 w-14 -rotate-6 rounded-md sm:hidden" />
				</div>
				<div className="mt-2 flex w-full flex-col items-center gap-1.5">
					{[0, 1].map((row) => (
						<div key={row} className="flex w-full justify-center gap-4">
							<Shape className="h-4 w-24 rounded-sm" />
							<Shape className="h-4 w-20 rounded-sm" />
						</div>
					))}
				</div>
			</div>
			<div className="mt-2 hidden justify-center gap-4 lg:flex">
				{[0, 1, 2].map((index) => (
					<Shape key={index} className="h-4 w-20 rounded-sm" />
				))}
			</div>
			<div className="px-2 pb-6 pt-5 sm:pt-7 lg:mt-8 lg:p-0">
				<Copy lines={5} />
			</div>
		</div>
	)
}

function EditionSkeleton() {
	return (
		<div className="relative px-4 pb-24 [container-type:inline-size] lg:px-0 lg:pb-0 lg:[container-type:normal]">
			<Shape className="absolute left-4 top-1 h-7 w-7 rounded-lg lg:hidden" />
			<Shape className="absolute -top-1 right-4 h-5 w-12 -rotate-6 rounded-md lg:hidden" />
			<div className="pt-7 max-[374px]:pt-8 lg:mt-[clamp(0.75rem,1.45cqw,1rem)] lg:px-24 lg:py-[clamp(1.5rem,3.33cqw,4rem)]">
				<Tabs widths={[5, 5, 4, 5]} mobileWidths={[8.4, 9.2, 8.4, 3.3]} />
			</div>
			<div className="w-full pt-7 lg:px-[13%] lg:pt-6">
				<div className="mb-4 lg:hidden">
					<MobileHeading lines={4} />
				</div>
				<Copy lines={6} mobileLines={4} />
				<div className="mt-4">
					<Copy lines={4} />
				</div>
				<div className="mt-4 lg:hidden">
					<Copy lines={5} />
				</div>
				<div className="mt-4 lg:hidden">
					<Copy lines={6} />
				</div>
				<Shape className="mt-8 aspect-video w-full" />
			</div>
		</div>
	)
}

function AboutSkeleton() {
	return (
		<div className="flex flex-col gap-2 px-4 pb-24 pt-2 [container-type:inline-size] lg:grid lg:h-full lg:grid-rows-[auto_minmax(16rem,1fr)] lg:gap-1 lg:p-0 lg:[container-type:normal]">
			<div className="rounded-xl bg-dark px-4 pb-8 lg:px-8 lg:pb-4 lg:pt-[clamp(2.25rem,4.78cqw,5rem)]">
				<Tabs widths={[5, 6, 5]} mobileWidths={[5.8, 4.8, 5.2]} />
				<div className="mx-auto max-w-lg px-4 pt-4 lg:max-w-xs lg:px-0 lg:py-8">
					<Copy lines={4} centered className={styles.contactCopy} />
				</div>
				<div className="mb-2 mt-2 flex justify-between lg:hidden">
					{[0, 1, 2, 3].map((index) => (
						<div
							key={index}
							className="flex h-9 w-9 items-center justify-center"
						>
							<Shape className="h-5 w-5 rounded-sm" />
						</div>
					))}
				</div>
			</div>
			<div className="px-4 py-2 lg:hidden">
				<Shape className="mx-auto h-5 w-4/5 rounded-sm" />
			</div>
			<Shape className="min-h-[18rem] rounded-[2rem] lg:min-h-0 lg:rounded-xl" />
		</div>
	)
}

function HomeSkeleton() {
	return (
		<div className="relative flex h-svh items-center justify-center overflow-hidden lg:h-full">
			<Shape className="absolute inset-0" />
			<Shape className="h-[24vw] w-[85vw] -rotate-6 rounded-md sm:hidden" />
		</div>
	)
}

function ApplySkeleton() {
	return (
		<div className="my-1 px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-8 sm:px-8 lg:my-0 lg:pt-10">
			<div className="mx-auto max-w-2xl">
				<div className="mb-8">
					<Shape className="mb-4 h-9 w-4/5 rounded-md sm:h-10" />
					<div className="space-y-3">
						<Copy lines={2} className={styles.formCopy} />
						<Copy lines={1} className={styles.formCopy} />
					</div>
				</div>
				<div className="mb-8">
					<div className="mb-2 flex justify-between">
						{[0, 1, 2, 3].map((index) => (
							<Shape key={index} className="h-8 w-8 rounded-full" />
						))}
					</div>
					<Shape className="h-2 w-full rounded-full" />
				</div>
				<div className="rounded-xl border border-primary/15 p-5 sm:p-8">
					<Shape className="mb-2 h-8 w-3/4 rounded-md" />
					<Shape className="mb-6 h-5 w-full rounded-sm" />
					<div className="space-y-6">
						{[0, 1, 2, 3].map((index) => (
							<div key={index}>
								<Shape className="mb-2 h-5 w-1/3 rounded-sm" />
								<Shape className="h-12 w-full rounded-lg" />
							</div>
						))}
					</div>
				</div>
				<Shape className="ml-auto mt-6 h-12 w-28 rounded-lg" />
			</div>
		</div>
	)
}

const contents = {
	home: HomeSkeleton,
	apply: ApplySkeleton,
	bigbang: StorySkeleton,
	festival: FestivalSkeleton,
	memoire: MemoireSkeleton,
	fabrique: FabriqueSkeleton,
	equipe: EquipeSkeleton,
	film: FilmSkeleton,
	edition: EditionSkeleton,
	about: AboutSkeleton,
	generic: () => (
		<div className={`${EDITORIAL_COPY_WIDTH} py-10`}>
			<Copy lines={4} />
		</div>
	),
}

// The navigation overlay and route fallbacks share the very same layout.
export default function PageSkeleton({
	page = 'generic',
}: {
	page?: SkeletonPage
}) {
	const Content = contents[page]
	return (
		<div
			role="status"
			aria-label="Loading"
			aria-busy="true"
			data-skeleton-page={page}
			className={`theme-main-content-surface theme-loading-surface lg:shadowtest ${styles.surface} w-full text-primary [container-type:inline-size] lg:my-1 lg:h-[calc(100svh-8px)] lg:overflow-hidden lg:rounded-xl ${page === 'film' ? 'bg-transparent lg:bg-dark' : 'bg-dark'}`}
		>
			<div
				aria-hidden="true"
				className={`flow-root h-full motion-safe:animate-pulse ${page === 'about' ? 'lg:bg-[var(--navigation-background)]' : ''}`}
			>
				<Content />
			</div>
		</div>
	)
}
