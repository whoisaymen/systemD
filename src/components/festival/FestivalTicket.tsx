interface FestivalTicketProps {
	items: { smallTitle: string; text: string }[]
	block: any
	language: string
	getLocalizedValue: (array: any[], lang: string) => string
}

const FestivalTicket: React.FC<FestivalTicketProps> = ({
	items,
	block,
	language,
	getLocalizedValue,
}) => {
	return (
		<div className="relative mx-auto flex max-w-4xl items-center justify-center py-48">
			<main className="grid w-full rotate-2 overflow-hidden rounded-md font-thin text-gray-400 sm:grid-cols-[4fr_1fr]">
				<div
					className="inv-rad-r-2 inv-rad relative space-y-6 px-6 py-6 sm:space-y-12 sm:px-10"
					style={{
						backgroundColor: block.backgroundColor?.hex || '#DEFE04',
						color: block.textColor?.hex || '#000000',
					}}
				>
					<section className="grid grid-cols-2 gap-4 px-6 py-3 text-center text-sm font-thin sm:grid-cols-4 sm:text-base">
						{items.map((item, index) => (
							<div key={index}>
								<h3>{item.smallTitle}</h3>
								<time className="font-bold text-[#8C8C8F]">{item.text}</time>
							</div>
						))}
					</section>
				</div>
				<div className="inv-rad-l-2 inv-rad grid place-content-center bg-white p-0">
					<div className="grid w-full place-content-center gap-4 py-6 sm:-rotate-90 sm:py-32">
						{/* <section className="flex justify-between gap-4 text-center text-xs font-thin sm:text-sm">
							{items.map((item, index) => (
								<div key={index}>
									<h3>{item.smallTitle}</h3>
									<time className="font-bold text-[#8C8C8F]">{item.text}</time>
								</div>
							))}
						</section> */}
						<svg
							className="w-60 max-w-xs"
							xmlns="http://www.w3.org/2000/svg"
							xmlSpace="preserve"
							xmlnsXlink="http://www.w3.org/1999/xlink"
							viewBox="0 0 92 25"
							stroke="#8C8C8F"
						>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="0.5"
								y1="0"
								x2="0.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 2 }}
								x1="3"
								y1="0"
								x2="3"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="6.5"
								y1="0"
								x2="6.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="9.5"
								y1="0"
								x2="9.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="11.5"
								y1="0"
								x2="11.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 2 }}
								x1="14"
								y1="0"
								x2="14"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="16.5"
								y1="0"
								x2="16.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="19.5"
								y1="0"
								x2="19.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="21.5"
								y1="0"
								x2="21.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="23.5"
								y1="0"
								x2="23.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="26.5"
								y1="0"
								x2="26.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 2 }}
								x1="29"
								y1="0"
								x2="29"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="31.5"
								y1="0"
								x2="31.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 2 }}
								x1="35"
								y1="0"
								x2="35"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="37.5"
								y1="0"
								x2="37.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="39.5"
								y1="0"
								x2="39.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 2 }}
								x1="42"
								y1="0"
								x2="42"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="44.5"
								y1="0"
								x2="44.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="47.5"
								y1="0"
								x2="47.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="49.5"
								y1="0"
								x2="49.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="51.5"
								y1="0"
								x2="51.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="54.5"
								y1="0"
								x2="54.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 2 }}
								x1="57"
								y1="0"
								x2="57"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="59.5"
								y1="0"
								x2="59.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="61.5"
								y1="0"
								x2="61.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="64.5"
								y1="0"
								x2="64.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 2 }}
								x1="67"
								y1="0"
								x2="67"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="69.5"
								y1="0"
								x2="69.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="71.5"
								y1="0"
								x2="71.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 2 }}
								x1="75"
								y1="0"
								x2="75"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="77.5"
								y1="0"
								x2="77.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="79.5"
								y1="0"
								x2="79.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="81.5"
								y1="0"
								x2="81.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="83.5"
								y1="0"
								x2="83.5"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 2 }}
								x1="87"
								y1="0"
								x2="87"
								y2="30"
							/>
							<line
								fill="none"
								style={{ strokeWidth: 1 }}
								x1="90.5"
								y1="0"
								x2="90.5"
								y2="30"
							/>
						</svg>
					</div>
				</div>
			</main>
		</div>
	)
}

export default FestivalTicket
