export default function Loading() {
	return (
		<div className="flex min-h-screen items-start justify-center bg-dark p-6">
			<div className="w-full max-w-5xl">
				<div className="animate-pulse">
					{/* Back button skeleton */}
					{/* <div className="mb-4 w-fit rounded-md bg-dark px-4 py-2">
						<div className="h-8 w-32 rounded bg-primary" />
					</div> */}
					{/* Title & director skeleton */}
					{/* <div className="mb-6 flex flex-col items-center gap-2">
						<div className="h-10 w-2/3 rounded bg-primary" />
						<div className="h-6 w-1/2 rounded bg-grayDark" />
					</div> */}
					{/* Poster skeleton */}
					<div className="mx-auto mb-6 h-[30vh] w-full rounded-lg bg-grayDark" />
					{/* Meta info skeleton */}
					<div className="mb-6 flex flex-wrap items-center justify-center gap-2">
						<div className="h-8 w-24 rounded bg-primary" />
						<div className="h-8 w-20 rounded bg-grayDark" />
						<div className="h-8 w-16 rounded bg-primary" />
						<div className="h-8 w-20 rounded bg-grayDark" />
					</div>
					{/* Synopsis skeleton */}
					<div className="mb-8 px-2 py-6">
						<div className="mb-2 h-6 w-full rounded bg-primary" />
						<div className="mb-2 h-6 w-3/4 rounded bg-primary" />
						<div className="h-6 w-1/2 rounded bg-primary" />
					</div>
					{/* Social links skeleton */}
					<div className="mx-2 flex items-center justify-center gap-2 pb-16">
						<div className="h-5 w-16 rounded bg-primary" />
						<div className="h-5 w-20 rounded bg-primary" />
						<div className="h-5 w-12 rounded bg-primary" />
						<div className="h-5 w-16 rounded bg-primary" />
					</div>
				</div>
			</div>
		</div>
	)
}
