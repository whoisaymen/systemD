export default function Loading() {
	return (
		<div className="relative z-50 h-dvh w-full items-center justify-center text-9xl font-black text-black">
			<div className="no-scrollbar flex h-full w-full flex-col space-y-4 overflow-y-scroll rounded-md px-4 py-24 text-base font-medium leading-tight tracking-tighter text-grayDark sm:space-y-0 sm:bg-white sm:px-0 sm:pt-0">
				<div className="absolute left-[60%] top-16 z-10 h-8 w-24 animate-pulse rounded-md bg-primary sm:hidden"></div>
				<div className="absolute left-1/2 top-14 z-10 h-8 w-32 -translate-x-1/2 animate-pulse rounded-md bg-grayDark sm:hidden"></div>

				<div className="h-[50vh] sm:h-[50vh]">
					<div className="h-full w-full animate-pulse rounded-md bg-dark sm:rounded-b-none"></div>
				</div>

				<div className="pt-8">
					<div className="h-24 w-full animate-pulse rounded-md bg-gray-300"></div>
				</div>

				<div className="pt-8">
					<div className="h-8 w-32 animate-pulse rounded-md bg-gray-300"></div>
					<div className="grid w-full grid-cols-2 gap-2 pt-4 sm:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: 6 }).map((_, index) => (
							<div
								key={index}
								className="h-40 w-full animate-pulse rounded-md bg-gray-300"
							></div>
						))}
					</div>
				</div>

				<div className="flex h-auto w-full items-center justify-between px-0 pt-0 sm:px-4">
					<h2 className="h-8 w-32 animate-pulse rounded-md bg-gray-300"></h2>
					<div className="flex h-full w-1/2 items-center justify-end gap-1">
						<div className="h-10 w-10 animate-pulse rounded-md bg-gray-300"></div>
						<div className="h-10 w-10 animate-pulse rounded-md bg-gray-300"></div>
					</div>
				</div>

				<ul className="grid grid-cols-2 gap-2 px-0 sm:grid-cols-2 sm:px-4 lg:grid-cols-3">
					{Array.from({ length: 6 }).map((_, index) => (
						<li
							key={index}
							className="relative h-40 w-full animate-pulse rounded-md bg-gray-300"
						></li>
					))}
				</ul>
			</div>
		</div>
	)
}
