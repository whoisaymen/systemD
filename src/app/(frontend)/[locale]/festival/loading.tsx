export default function Loading() {
	return (
		<div className="relative z-50 h-dvh w-full items-center justify-center text-9xl font-black text-black">
			<div className="no-scrollbar flex h-full w-full flex-col space-y-4 overflow-y-scroll rounded-md px-4 py-24 text-base font-medium leading-tight tracking-tighter text-grayDark sm:space-y-0 sm:bg-white sm:px-0 sm:pt-0">
				<div className="border-md relative -mt-10 h-[20vh] rounded-full border-2 border-dark px-4 py-10 shadow-sm dark:bg-secondary sm:py-10"></div>

				<div className="mx-0 h-[70vh] w-auto animate-pulse rounded-full rounded-b-md border-2 border-primary bg-grayLight sm:h-[50vh]"></div>
			</div>
		</div>
	)
}
