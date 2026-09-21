import type { CSSProperties } from 'react'
import {
	EDITORIAL_BODY_TEXT,
	EDITORIAL_COPY_WIDTH,
	EDITORIAL_DESKTOP_TAB_STYLE,
} from '@/components/common/editorialStyles'
import MobileLoading from './MobileLoading'
import MobileFilmLoading from './MobileFilmLoading'
import memoireStyles from '@/components/memoire/MemoireContent.module.css'
import styles from './PageSkeleton.module.css'
import fabriqueStyles from '@/components/fabrique/FabriqueContent.module.css'
import { SYSTEM_D_HEART_LABELS } from '@/components/common/systemDHeartLayout'

export type SkeletonPage =
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
	centered = false,
}: {
	lines?: number
	centered?: boolean
}) {
	return (
		<div
			className={`${EDITORIAL_BODY_TEXT} ${styles.copy} ${centered ? styles.centered : ''}`}
		>
			{Array.from({ length: lines }, (_, index) => (
				<Shape
					key={index}
					className={styles.line}
					style={{ width: index === lines - 1 ? '62%' : '100%' }}
				/>
			))}
		</div>
	)
}

function Tabs({ widths }: { widths: number[] }) {
	return (
		<div className="flex flex-wrap items-start justify-center">
			{widths.map((width, index) => (
				<Shape
					key={index}
					className={`${EDITORIAL_DESKTOP_TAB_STYLE} ${styles.tab}`}
					style={{ width: `${width}em`, rotate: index % 2 ? '3deg' : '-3deg' }}
				/>
			))}
		</div>
	)
}

function StorySkeleton() {
	return (
		<>
			<div className="mb-2 mt-[clamp(2.25rem,4.78cqw,5rem)]">
				<Tabs widths={[7.3, 6.8]} />
			</div>
			<div className="pt-10">
				<div className="mx-auto flex w-full max-w-[60rem] flex-col items-center gap-10 pb-16">
					<div className="w-full px-4">
						<div className="mx-40 px-4">
							<Copy lines={3} centered />
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
						<div className="mx-40 px-4">
							<Copy lines={4} centered />
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
			<div className="mt-[clamp(0.75rem,1.45cqw,1rem)] py-[clamp(1.5rem,3.33cqw,4rem)]">
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
		<div className="p-8">
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
					style={index === 1 ? { translate: '0 -1.5rem' } : undefined}
				>
					<Shape
						className={`rounded-[2rem] ${index === 0 ? 'aspect-[3/4] w-3/4' : 'aspect-[3/2] w-full'}`}
					/>
					<div className={memoireStyles.labels}>
						<Shape className="h-8 w-20 -rotate-6 rounded-md" />
						<Shape
							className={`h-8 rotate-6 rounded-md ${index === 1 ? 'w-40' : 'w-20'}`}
						/>
					</div>
				</li>
			))}
		</ol>
	)
}

function FabriqueSkeleton() {
	return (
		<div className="flex min-h-full flex-col pb-4">
			<div
				className={`${EDITORIAL_COPY_WIDTH} mt-[clamp(2.25rem,4.78cqw,5rem)]`}
			>
				<div className={`${styles.heading} mb-[0.8em]`}>
					<Shape className="mx-auto h-[0.8em] w-[90%] rounded-sm" />
					<Shape className="mx-auto mt-[0.4em] h-[0.8em] w-full rounded-sm" />
				</div>
				<div className="pt-8">
					<Copy lines={3} />
				</div>
			</div>
			<div className="pt-10">
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
		<div className="flex min-h-full flex-col justify-center py-10">
			<div className={`${styles.teamStage} pt-3`}>
				<Shape
					className={`${styles.teamSideLeft} h-[68%] w-[92px] -rotate-1 rounded-md`}
				/>
				<Shape className={`${styles.teamPortrait} shrink-0 rounded-md`} />
				<Shape
					className={`${styles.teamSideRight} h-[68%] w-[146px] rotate-1 rounded-md`}
				/>
			</div>
			<div className="mx-auto mt-5 w-full">
				<Tabs widths={[4, 4]} />
				<Shape className="mx-auto mt-1 h-6 w-56 -rotate-3 rounded-md" />
			</div>
			<div className={`${EDITORIAL_COPY_WIDTH} mt-6 min-h-36`}>
				<div className={`mx-auto max-w-[60ch] ${EDITORIAL_BODY_TEXT}`}>
					<Copy lines={9} />
				</div>
			</div>
		</div>
	)
}

function FilmSkeleton() {
	return (
		<div className="relative px-32 pb-20">
			<Shape className="absolute left-6 top-5 h-7 w-10 rounded-md" />
			<Shape className="absolute left-6 top-14 h-6 w-20 -rotate-3 rounded-md" />
			<div className="relative z-10 translate-y-24">
				<Tabs widths={[10, 6]} />
			</div>
			<Shape className="mt-24 aspect-video w-full rounded-xl" />
			<div className="mt-2 flex justify-center gap-4">
				{[0, 1, 2].map((index) => (
					<Shape key={index} className="h-4 w-20 rounded-sm" />
				))}
			</div>
			<div className="mt-8">
				<Copy lines={5} />
			</div>
		</div>
	)
}

function EditionSkeleton() {
	return (
		<>
			<div className="mt-[clamp(0.75rem,1.45cqw,1rem)] px-24 py-[clamp(1.5rem,3.33cqw,4rem)]">
				<Tabs widths={[5, 5, 4, 5]} />
			</div>
			<div className={`${EDITORIAL_COPY_WIDTH} pt-6`}>
				<Copy lines={6} />
				<div className="mt-4">
					<Copy lines={4} />
				</div>
				<Shape className="mt-8 aspect-video w-full" />
			</div>
		</>
	)
}

function AboutSkeleton() {
	return (
		<div className="grid h-full grid-rows-[auto_minmax(16rem,1fr)] gap-1">
			<div className="rounded-xl bg-dark px-8 pb-4 pt-[clamp(2.25rem,4.78cqw,5rem)]">
				<Tabs widths={[5, 6, 5]} />
				<div className="mx-auto max-w-xs py-8">
					<Copy lines={4} centered />
				</div>
			</div>
			<Shape className="min-h-0 rounded-xl" />
		</div>
	)
}

const contents = {
	bigbang: StorySkeleton,
	festival: FestivalSkeleton,
	memoire: MemoireSkeleton,
	fabrique: FabriqueSkeleton,
	equipe: EquipeSkeleton,
	film: FilmSkeleton,
	edition: EditionSkeleton,
	about: AboutSkeleton,
	generic: () => (
		<div className="px-[13%] py-10">
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
		<>
			<div className="w-full lg:hidden">
				{page === 'film' ? <MobileFilmLoading /> : <MobileLoading />}
			</div>
			<div
				role="status"
				aria-label="Loading"
				aria-busy="true"
				data-skeleton-page={page}
				className={`theme-main-content-surface theme-loading-surface lg:shadowtest ${styles.surface} hidden w-full bg-dark text-primary [container-type:inline-size] lg:my-1 lg:block lg:h-[calc(100svh-8px)] lg:overflow-hidden lg:rounded-xl`}
			>
				<div
					aria-hidden="true"
					className={`h-full motion-safe:animate-pulse ${page === 'about' ? 'bg-[var(--navigation-background)]' : ''}`}
				>
					<Content />
				</div>
			</div>
		</>
	)
}
