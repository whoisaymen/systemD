export default function MobileFilmLoading() {
	return (
		<div className="theme-main-content-surface lg:shadowtest no-scrollbar flex w-full items-start justify-center border-0 bg-dark p-6 lg:my-1 lg:h-[calc(100svh-8px)] lg:overflow-y-auto lg:rounded-xl lg:pt-32">
			<div className="w-full lg:px-16">
				<div className="animate-pulse">
					{/* Poster skeleton */}
					<div className="mx-auto mb-6 h-[30vh] w-full rounded-lg bg-primary/50 lg:h-[50vh]" />
					{/* Meta info skeleton */}
					<div className="mb-6 flex flex-wrap items-center justify-center gap-2">
						<div className="h-5 w-24 rounded bg-primary/25 lg:h-8" />
						<div className="h-5 w-20 rounded bg-primary/25 lg:h-8" />
						<div className="h-5 w-16 rounded bg-primary/25 lg:h-8" />
						<div className="h-5 w-20 rounded bg-primary/25 lg:h-8" />
					</div>
					{/* Synopsis skeleton */}
					<div className="mb-8 px-2 py-6">
						<div className="mb-2 h-6 w-full rounded bg-primary/25" />
						<div className="mb-2 h-6 w-3/4 rounded bg-primary/25" />
						<div className="h-6 w-[90%] rounded bg-primary/25" />
					</div>
					{/* Social links skeleton */}
					<div className="mx-2 flex items-center justify-center gap-2 pb-16">
						<div className="h-5 w-16 rounded bg-primary/25 lg:h-8" />
						<div className="h-5 w-20 rounded bg-primary/25 lg:h-8" />
						<div className="h-5 w-12 rounded bg-primary/25 lg:h-8" />
						<div className="h-5 w-16 rounded bg-primary/25 lg:h-8" />
					</div>
				</div>
			</div>
		</div>
	)
}
