export default function Loading() {
	return (
		<div className="lg:shadowtest lg:no-scrollbar flex h-screen w-screen items-center justify-center lg:my-1 lg:h-[calc(100svh-10px)] lg:overflow-y-auto lg:rounded-xl">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 200 200"
				className="h-auto w-[15vw] sm:w-[5vw]"
			>
				<circle
					fill="var(--color-primary)"
					stroke="var(--color-primary)"
					strokeWidth="15"
					r="15"
					cx="40"
					cy="65"
				>
					<animate
						attributeName="cy"
						calcMode="spline"
						dur="2"
						values="65;135;65;"
						keySplines=".5 0 .5 1;.5 0 .5 1"
						repeatCount="indefinite"
						begin="-.4"
					></animate>
				</circle>
				<circle
					fill="var(--color-primary)"
					stroke="var(--color-primary)"
					strokeWidth="15"
					r="15"
					cx="100"
					cy="65"
				>
					<animate
						attributeName="cy"
						calcMode="spline"
						dur="2"
						values="65;135;65;"
						keySplines=".5 0 .5 1;.5 0 .5 1"
						repeatCount="indefinite"
						begin="-.2"
					></animate>
				</circle>
				<circle
					fill="var(--color-primary)"
					stroke="var(--color-primary)"
					strokeWidth="15"
					r="15"
					cx="160"
					cy="65"
				>
					<animate
						attributeName="cy"
						calcMode="spline"
						dur="2"
						values="65;135;65;"
						keySplines=".5 0 .5 1;.5 0 .5 1"
						repeatCount="indefinite"
						begin="0"
					></animate>
				</circle>
			</svg>
		</div>
	)
}
