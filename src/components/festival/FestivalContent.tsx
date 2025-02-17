import Img from '@/ui/Img'
import { PortableText } from 'next-sanity'
import FestivalTicket from './FestivalTicket'

interface FestivalContentProps {
	festival: any
	language: string
}

const FestivalContent: React.FC<FestivalContentProps> = ({
	festival,
	language,
}) => {
	const getLocalizedValue = (array: any[], lang: string) => {
		if (!Array.isArray(array)) {
			return ''
		}
		const item = array.find((entry) => entry._key === lang)
		return item ? item.value : ''
	}

	if (!festival) {
		return <div>No content available</div>
	}
	console.log(festival, 'festival')

	return (
		<div className="flex h-full w-full flex-col space-y-1 rounded-md">
			{festival.title && (
				<h1 className="text-3xl font-bold">{festival.title}</h1>
			)}
			{festival.description && <p>{festival.description}</p>}
			{festival.blocks &&
				festival.blocks.map((block: any, index: number) => {
					switch (block._type) {
						case 'mediaTeaserBlock':
							const imageUrl = block.image?.asset?._ref
								? `/${block.image.asset._ref.split('-')[1]}-${block.image.asset._ref.split('-')[2]}.${block.image.asset._ref.split('-')[3]}`
								: ''
							return (
								<div key={index} className="h-[50vh] w-auto">
									{imageUrl && (
										<Img
											image={block.image}
											src={imageUrl}
											alt={block.text}
											className="h-full w-full rounded-md object-cover"
										/>
									)}
									{block.text && (
										<p>{getLocalizedValue(block.text, language)}</p>
									)}
								</div>
							)
						case 'yellowBannerBlock':
							return (
								<>
									{/* Highlighted Festival Info */}
									<div
										key={index}
										className="relative rounded-md bg-[#fff] px-6 py-10 dark:bg-[#DEFE04]"
										style={{ backgroundColor: block.color?.hex || '#DEFE04' }}
									>
										{/* Camera Viewfinder Corners */}
										<div className="pointer-events-none absolute inset-0 px-4 py-4">
											{/* Top-left corner */}
											<div className="absolute left-6 top-6 h-[40px] w-[40px] border-l-4 border-t-4 border-black"></div>
											{/* Top-right corner */}
											<div className="absolute right-6 top-6 h-[40px] w-[40px] border-r-4 border-t-4 border-black"></div>
											{/* Bottom-left corner */}
											<div className="absolute bottom-6 left-6 h-[40px] w-[40px] border-b-4 border-l-4 border-black"></div>
											{/* Bottom-right corner */}
											<div className="absolute bottom-6 right-6 h-[40px] w-[40px] border-b-4 border-r-4 border-black"></div>
										</div>

										{/* Text Content */}
										{block.text && (
											<p className="mx-auto max-w-4xl py-4 text-center text-4xl font-bold tracking-tighter">
												{getLocalizedValue(block.text, language)}
											</p>
										)}
									</div>
								</>
							)
						case 'whiteTextBlock':
							if (!block.show) return null
							return (
								<div
									key={index}
									className="flex items-center rounded-md px-32 py-52 text-2xl font-medium leading-tight tracking-tight !text-[#8C8C8F]"
									style={{
										backgroundColor: block.backgroundColor?.hex || '#FFFFFF',
										color: block.textColor?.hex || '#000000',
									}}
								>
									<div className="flex w-1/2 items-center justify-center">
										<h1 className="font-anisette mb-8 inline-block -rotate-0 rounded-md bg-[#DEFE04] px-3 text-4xl font-bold tracking-tighter">
											Call to action
										</h1>
										<span className="font-anisette bg-grayLight text-dark mb-8 inline-block rotate-12 rounded-md px-3 text-[5rem] font-bold leading-none tracking-tighter">
											!
										</span>
									</div>
									<div className="w-1/2">
										{block.content && block.content[language] && (
											<PortableText value={block.content[language]} />
										)}
									</div>
								</div>
							)
						case 'juryBlock':
							if (!block.show) return null
							const duplicatedJuryMembers = Array(4).fill(block.juryMembers[0])
							return (
								// <div
								// 	key={index}
								// 	className="relative rounded-md p-0 text-2xl font-medium leading-tight tracking-tight !text-[#8C8C8F]"
								// 	style={{
								// 		backgroundColor: block.backgroundColor?.hex || '#FFFFFF',
								// 		color: block.textColor?.hex || '#000000',
								// 	}}
								// >
								// </div>
								<div className="relative my-0 flex flex-wrap items-center gap-1">
									{block.juryMembers && block.juryMembers.length > 0 ? (
										block.juryMembers.map(
											(member: any, memberIndex: number) => (
												<div
													key={memberIndex}
													className="my-0 w-[calc(25%-0.2rem)]"
												>
													{/* <div className="absolute left-0 top-0 z-30 h-full w-[2%] bg-[url('/assets/svg/filmroll.svg')] bg-[length:12px_30px] bg-center bg-repeat-y"></div>
													<div className="absolute right-0 top-0 z-30 h-full w-[2%] bg-[url('/assets/svg/filmroll.svg')] bg-[length:12px_30px] bg-center bg-repeat-y"></div> */}
													{member.image && (
														<Img
															image={member.image}
															src={member.image.asset.url}
															alt={member.name}
															className="aspect-square h-full w-full rounded-md object-cover saturate-0 hover:saturate-100"
														/>
													)}
													{member.name && (
														<h3 className="mt-6 border-2 text-2xl font-semibold tracking-tight text-[#8C8C8F]">
															{member.name}
														</h3>
													)}
													{member.biography && (
														<p className="truncate">
															{getLocalizedValue(member.biography, language)}
														</p>
													)}
												</div>
											),
										)
									) : (
										<p>No jury members found</p>
									)}
								</div>
							)

						case 'ticketBlock':
							if (!block.show) return null
							const ticketItems = block.items.map((item: any) => ({
								smallTitle: getLocalizedValue(item.smallTitle, language),
								text: getLocalizedValue(item.text, language),
							}))
							return (
								<FestivalTicket
									key={index}
									items={ticketItems}
									block={block}
									language={language}
									getLocalizedValue={getLocalizedValue}
								/>
							)
						case 'onTourBlock':
							if (!block.show) return null
							return (
								<div key={index} className="on-tour-block">
									<h2 className="text-2xl font-bold">On Tour</h2>
									<ul>
										{block.events.map((event: any, eventIndex: number) => (
											<li key={eventIndex}>
												<h3>{getLocalizedValue(event.title, language)}</h3>
												<p>
													{new Date(event.date).toLocaleDateString(language)}
												</p>
												<p>{event.location || 'Location not specified'}</p>
											</li>
										))}
									</ul>
								</div>
							)
						default:
							return null
					}
				})}
		</div>
	)
}

export default FestivalContent
