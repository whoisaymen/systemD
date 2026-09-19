'use client'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import Img from '@/ui/Img'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { IoGrid, IoList } from 'react-icons/io5'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import FestivalCarousel, { type GalleryRect } from './FestivalCarousel'
import BackToTopButton from '../common/BackToTop'
import RichText from '@/components/common/RichText'
import {
	EDITORIAL_BODY_TEXT,
	EDITORIAL_COPY_WIDTH,
	EDITORIAL_DESKTOP_TAB_STYLE,
} from '@/components/common/editorialStyles'
import { localizedRichText, richTextToPlainText } from '@/lib/richText'
import { richTextLines } from '@/lib/richTextLines'
import { useRouter, useSearchParams } from 'next/navigation'
import CartoonLeftArrow from '../common/CartoonLeftArrow'
import FilterIcon from '../svgs/FilterIcon'
import FilmHoverPreview from './FilmHoverPreview'

interface FestivalEditionContentProps {
	festival: any
	language: string
}

type EditionChapter = 'overview' | 'films' | 'exhibition' | 'photos' | 'jury'

const FestivalEditionContent: React.FC<FestivalEditionContentProps> = ({
	festival,
	language,
}) => {
	const tExpo = useTranslations('expo')
	const tFilmSelection = useTranslations('filmSelection')
	const tPhotoGallery = useTranslations('photoGallery')
	const tEdition = useTranslations('festivalEdition')

	const [view, setView] = useState<'grid' | 'list'>('grid')
	const [hoveredFilm, setHoveredFilm] = useState<{
		key: string
		row: HTMLTableRowElement
	} | null>(null)
	const [isFilmSectionOpen, setIsFilmSectionOpen] = useState(false)
	const [isPhotoGalleryOpen, setIsPhotoGalleryOpen] = useState(false)
	const [photoExhibitionValue, setPhotoExhibitionValue] = useState<
		string | undefined
	>()
	const [sortField, setSortField] = useState<'year' | 'title' | 'director'>('title')
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

	const [isLightboxOpen, setIsLightboxOpen] = useState(false)
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [lightboxOriginRect, setLightboxOriginRect] =
		useState<GalleryRect | null>(null)
	const [showWinnersOnly, setShowWinnersOnly] = useState(false)
	const [selectedArtist, setSelectedArtist] = useState<string | null>(null)
	const [isJuryOpen, setIsJuryOpen] = useState(false)
	const [activeChapter, setActiveChapter] = useState<EditionChapter>('overview')

	const filmSelection = useMemo(
		() => festival?.filmSelection ?? [],
		[festival?.filmSelection],
	)
	const photoGallery = useMemo(
		() => festival?.photoGallery ?? [],
		[festival?.photoGallery],
	)
	const expoPhoto = useMemo(
		() => festival?.expoPhoto ?? [],
		[festival?.expoPhoto],
	)
	const juryMembers = useMemo(() => festival?.jury ?? [], [festival?.jury])

	const selectChapter = (chapter: EditionChapter) => {
		setActiveChapter(chapter)
		setIsFilmSectionOpen(chapter === 'films')
		setPhotoExhibitionValue(chapter === 'exhibition' ? 'item-3' : undefined)
		setIsPhotoGalleryOpen(chapter === 'photos')
		setIsJuryOpen(chapter === 'jury')
	}

	const openLightbox = (index: number, trigger?: HTMLElement) => {
		const rect = trigger?.getBoundingClientRect()

		setLightboxOriginRect(
			rect
				? {
						height: rect.height,
						left: rect.left,
						top: rect.top,
						width: rect.width,
					}
				: null,
		)
		setCurrentImageIndex(index)
		setIsLightboxOpen(true)
	}

	const closeLightbox = () => {
		setIsLightboxOpen(false)
		setLightboxOriginRect(null)
	}

	function chunkArray(array: any[], size: number) {
		return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
			array.slice(i * size, i * size + size),
		)
	}
	const photoRows = useMemo(
		() =>
			chunkArray(
				photoGallery.flatMap((gallery: any) => gallery.photos ?? []),
				3,
			),
		[photoGallery],
	)

	const getLocalizedValue = (value: any, language: string) =>
		richTextToPlainText(localizedRichText(value, language))

	const hasActiveSection =
		isFilmSectionOpen ||
		isJuryOpen ||
		photoExhibitionValue === 'item-3' ||
		isPhotoGalleryOpen

	const filteredFilms = showWinnersOnly
		? filmSelection.filter((film: any) => film.isWinner)
		: filmSelection

	const sortedFilms = [...filteredFilms].sort((a: any, b: any) => {
		if (sortField === 'year') {
			if (!a.year && b.year) return 1
			if (a.year && !b.year) return -1
			return sortOrder === 'asc'
				? (a.year ?? 0) - (b.year ?? 0)
				: (b.year ?? 0) - (a.year ?? 0)
		} else if (sortField === 'title') {
			const titleA = getLocalizedValue(a.title, language).toLowerCase()
			const titleB = getLocalizedValue(b.title, language).toLowerCase()
			return sortOrder === 'asc'
				? titleA.localeCompare(titleB)
				: titleB.localeCompare(titleA)
		} else if (sortField === 'director') {
			const directorA = richTextToPlainText(a.director).trim().toLowerCase()
			const directorB = richTextToPlainText(b.director).trim().toLowerCase()
			if (!directorA && directorB) return 1
			if (directorA && !directorB) return -1
			return sortOrder === 'asc'
				? directorA.localeCompare(directorB)
				: directorB.localeCompare(directorA)
		}
		return 0
	})

	const router = useRouter()
	const searchParams = useSearchParams()

	function updateQuery(params: Record<string, string | undefined>) {
		const newParams = new URLSearchParams(searchParams.toString())
		Object.entries(params).forEach(([key, value]) => {
			if (value === undefined) {
				newParams.delete(key)
			} else {
				newParams.set(key, value)
			}
		})
		router.replace(`?${newParams.toString()}`, { scroll: false })
	}

	function scrollToFilm(filmSlug: string) {
		// Try to find the film element in the DOM
		const filmElement = document.querySelector(`[data-film-slug="${filmSlug}"]`)

		if (filmElement) {
			// Scroll to the film with some offset for better visibility
			const elementRect = filmElement.getBoundingClientRect()
			const absoluteElementTop = elementRect.top + window.pageYOffset
			const offset = 100 // Adjust this value as needed

			window.scrollTo({
				top: absoluteElementTop - offset,
				behavior: 'smooth',
			})
		} else {
			// Fallback: find the film in the sorted list and calculate approximate position
			const filmIndex = sortedFilms.findIndex(
				(f) => f.slug?.current === filmSlug,
			)
			if (filmIndex !== -1) {
				// Approximate scroll position based on index
				// Adjust these values based on your grid/list item heights
				const itemHeight = view === 'grid' ? 400 : 60 // Approximate height per item
				const approximatePosition = filmIndex * itemHeight

				window.scrollTo({
					top: approximatePosition,
					behavior: 'smooth',
				})
			}
		}
	}

	useEffect(() => {
		const sort = searchParams.get('sort')
		const order = searchParams.get('order') as 'asc' | 'desc'
		const winners = searchParams.get('winners') === '1'
		const view = searchParams.get('view') as 'grid' | 'list'

		if (sort === 'year' || sort === 'title' || sort === 'director') setSortField(sort)
		if (order) setSortOrder(order)
		setShowWinnersOnly(winners)
		if (view) setView(view)

		// Check if we're returning from a film
		const currentFilmSlug = sessionStorage.getItem('currentFilmSlug')
		const scroll = sessionStorage.getItem('festivalScroll')

		if (currentFilmSlug) {
			// We're returning from a film, open the film selection and scroll to that film
			setIsFilmSectionOpen(true)
			setActiveChapter('films')

			// Use a timeout to ensure the DOM is rendered
			setTimeout(() => {
				scrollToFilm(currentFilmSlug)
				sessionStorage.removeItem('currentFilmSlug')
			}, 100)

			return
		}

		if (scroll) {
			// Regular scroll restoration
			setIsFilmSectionOpen(true)
			setActiveChapter('films')
			window.scrollTo(0, parseInt(scroll, 10))
			sessionStorage.removeItem('festivalScroll')
			return
		}

		// Otherwise, open dropdown if any filter/sort/view param is present
		if (sort || order || winners || view) {
			setIsFilmSectionOpen(true)
			setActiveChapter('films')
		}
		// Run once on mount to hydrate URL state and restore scroll position.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (!festival) {
		return <div>No content available</div>
	}

	const festivalDescription = localizedRichText(festival.description, language)
	const sectionLabel = (field: string, fallback: string) => (
		<RichText
			value={localizedRichText(festival[field], language) || fallback}
			inline
			allowLinks={false}
		/>
	)
	const chapters: Array<{
		key: EditionChapter
		label: React.ReactNode
		titleClassName: string
	}> = [
		{
			key: 'films',
			label: sectionLabel('filmsTitle', tFilmSelection('title')),
			titleClassName: '-rotate-3 translate-y-0.5',
		},
		{
			key: 'exhibition',
			label: sectionLabel('exhibitionTitle', tExpo('title')),
			titleClassName: 'rotate-6 translate-y-1',
		},
		{
			key: 'photos',
			label: sectionLabel('photosTitle', tPhotoGallery('title')),
			titleClassName: '-rotate-6 -translate-y-1',
		},
		{
			key: 'jury',
			label: sectionLabel('juryTitle', tEdition('jury')),
			titleClassName: 'rotate-3 -translate-y-0.5',
		},
	]
	const visibleChapters = chapters.filter(
		(chapter) => chapter.key !== 'jury' || juryMembers.length > 0,
	)
	const jurySection =
		juryMembers.length > 0 ? (
			<div className={activeChapter === 'jury' ? 'lg:block' : 'lg:hidden'}>
				<Accordion
					type="single"
					collapsible
					value={isJuryOpen ? 'jury' : ''}
					onValueChange={(value) => {
						setIsJuryOpen(value === 'jury')
						setActiveChapter(value === 'jury' ? 'jury' : 'overview')
					}}
				>
					<AccordionItem
						value="jury"
						className="festival-section-layer relative -mt-5 flex flex-col items-center justify-center pb-1 lg:-mt-2"
						data-active={isJuryOpen}
						data-any-active={hasActiveSection}
						data-stack="jury"
					>
						<AccordionTrigger
							data-active={isJuryOpen}
							className="festival-section-label relative -rotate-[2deg] hover:border-grayDark lg:hidden"
						>
							{sectionLabel('juryTitle', tEdition('jury'))}
						</AccordionTrigger>
						<AccordionContent className="w-full">
							<ul className="festival-jury mx-auto my-8 grid w-full max-w-6xl grid-cols-1 items-start gap-x-[6%] gap-y-14 px-3 sm:grid-cols-2 sm:px-5 lg:my-4 lg:gap-y-16 lg:px-4">
								{juryMembers.map((member: any, index: number) => {
									const biography = localizedRichText(
										member.biography,
										language,
									)
									const memberKey =
										member._id ?? `${richTextToPlainText(member.name)}-${index}`
									const portraitTilt = [
										'-rotate-2',
										'rotate-2',
										'rotate-1',
										'-rotate-3',
										'-rotate-1',
										'rotate-3',
									][index % 6]
									const isOffset = index % 2 === 1

									return (
										<li
											key={memberKey}
											className={`min-w-0 text-primary ${isOffset ? 'sm:pt-14' : ''}`}
										>
											<div
												className={`mb-6 flex flex-col ${isOffset ? 'items-end' : 'items-start'}`}
											>
												{member.image?.asset ? (
													<Img
														image={member.image}
														alt={richTextToPlainText(member.name)}
														imageWidth={800}
														sizes="(min-width: 1024px) 28vw, (min-width: 640px) 42vw, 80vw"
														className={`h-auto max-h-[clamp(15rem,35cqw,24rem)] w-auto max-w-full rounded-sm ${portraitTilt}`}
													/>
												) : null}
												<h3
													className={`relative z-10 mx-2 w-fit max-w-[calc(100%-1rem)] rounded-sm px-1.5 py-0.5 text-lg font-bold italic leading-none tracking-tight text-dark lg:text-[clamp(1rem,2.17cqw,1.5rem)] ${member.image?.asset ? '-mt-3' : ''} ${isOffset ? '-rotate-2 bg-grayDark' : 'rotate-2 bg-primary'}`}
												>
													<RichText
														value={member.name}
														inline
														allowLinks={false}
													/>
												</h3>
											</div>

											{biography && (
												<RichText
													value={biography}
													className={`max-w-[48ch] ${EDITORIAL_BODY_TEXT}`}
												/>
											)}
										</li>
									)
								})}
							</ul>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		) : null

	return (
		<div className="theme-main-content-surface section-folder-content section-folder-content--memoire no-scrollbar lg:shadowtest relative flex h-full w-full flex-col space-y-4 rounded-md px-4 py-24 pt-0 text-base font-medium leading-tight tracking-tighter text-primary [container-type:inline-size] sm:justify-start sm:space-y-1 sm:px-0 sm:pt-1 lg:my-1 lg:h-[calc(100svh-8px)] lg:w-full lg:overflow-y-auto lg:rounded-xl lg:rounded-tr-none lg:bg-dark lg:pb-16 lg:pt-0">
			<div className="fixed bottom-4 right-12 z-50 lg:bottom-2 lg:right-[16.5%]">
				<BackToTopButton targetId="navbar-mobile" />
			</div>
			<div className="absolute -top-1 z-50 rounded-md text-3xl font-semibold text-dark lg:hidden">
				<button
					onClick={() => router.push(`/${language}/memoire`)}
					aria-label="Go back"
				>
					<CartoonLeftArrow className="h-auto w-10 scale-[0.8]" />
				</button>
			</div>

			<div className="absolute left-6 top-4 z-50 hidden w-fit items-start lg:mt-0 lg:flex lg:flex-col lg:gap-1">
				<div className="grid w-max grid-cols-[max-content] gap-2">
					<button
						type="button"
						onClick={() => router.push(`/${language}/memoire`)}
						aria-label="Go back"
						className="relative aspect-[1172/908] w-full rounded-md transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
					>
						<CartoonLeftArrow className="absolute inset-0 h-full w-full scale-[0.8]" />
					</button>
					<motion.div
						className="pointer-events-none relative z-20 rounded-md bg-grayDark px-1 text-xl font-semibold tracking-tight text-dark lg:text-[clamp(1rem,2.17cqw,1.5rem)] lg:leading-none"
						initial={{ rotate: -6 }}
						animate={{
							scale: [1, 0.9, 1, 1, 1],
							rotate: [-6, 360, -6, -6, -6],
							transition: {
								duration: 5,
								ease: [0.76, 0, 0.24, 1],
							},
						}}
					>
						<RichText value={festival.venue} inline allowLinks={false} />
					</motion.div>
				</div>
				<motion.div
					className="pointer-events-none relative z-10 rounded-md border-[0px] border-primary bg-primary px-1 text-xl font-black tracking-tight text-primary lg:bg-primary lg:text-[clamp(1rem,2.17cqw,1.5rem)] lg:leading-none lg:text-dark"
					initial={{ rotate: 6 }}
					animate={{
						scale: [1, 0.9, 1, 1, 1],
						rotate: [6, 360, 6, 6, 6],
						transition: {
							duration: 5,
							ease: [0.76, 0, 0.24, 1],
						},
					}}
				>
					<span>{festival.year}</span>
				</motion.div>
			</div>
			<motion.div
				className={`absolute -top-4 left-[3.5rem] z-10 -rotate-6 rounded-md bg-grayDark px-2 text-2xl font-semibold tracking-tighter text-dark lg:right-[1rem] lg:top-4 lg:hidden lg:w-fit lg:rounded-xl lg:border-[3px] lg:border-dark lg:px-4 lg:text-5xl`}
				initial={{ rotate: -6 }}
				animate={{
					scale: [1, 0.9, 1, 1, 1],
					rotate: [-6, 360, -6, -6, -6],
					transition: {
						duration: 5,
						ease: [0.76, 0, 0.24, 1],
					},
				}}
			>
				<RichText value={festival.venue} inline allowLinks={false} />
			</motion.div>
			<motion.div
				className={`absolute -top-3 right-[0.5rem] z-20 rotate-6 rounded-md bg-primary px-2 text-xl font-black text-dark lg:top-8 lg:hidden lg:w-fit lg:bg-dark lg:text-3xl lg:text-primary`}
				initial={{ rotate: 6 }}
				animate={{
					scale: [1, 0.9, 1, 1, 1],
					rotate: [6, 360, 6, 6, 6],
					transition: {
						duration: 5,
						ease: [0.76, 0, 0.24, 1],
					},
				}}
			>
				<span>{festival.year}</span>
			</motion.div>

			<div>
				<nav
					className="relative hidden lg:mt-[clamp(0.75rem,1.45cqw,1rem)] lg:block lg:px-24 lg:py-[clamp(1.5rem,3.33cqw,4rem)]"
					aria-label={tEdition('indexLabel')}
				>
					<ul className="flex flex-wrap items-start justify-center gap-y-[min(1.5rem,1.67cqw)]">
						{visibleChapters.map((chapter) => {
							const isActive = activeChapter === chapter.key

							return (
								<li key={chapter.key}>
									<button
										type="button"
										onClick={() =>
											selectChapter(isActive ? 'overview' : chapter.key)
										}
										aria-expanded={isActive}
										className={`relative text-center transition-colors hover:border-grayDark hover:bg-grayDark hover:text-dark ${EDITORIAL_DESKTOP_TAB_STYLE} ${chapter.titleClassName} ${
											isActive
												? 'border-grayDark bg-grayDark text-dark'
												: 'border-primary bg-dark text-primary'
										}`}
									>
										{chapter.label}
									</button>
								</li>
							)
						})}
					</ul>
				</nav>

				<main
					className={`min-w-0 lg:pt-6 ${activeChapter === 'overview' ? '' : 'lg:px-6'}`}
				>
					<div
						className={`mb-8 pt-8 lg:pt-0 ${
							activeChapter === 'films' ? 'lg:block' : 'lg:hidden'
						}`}
						id="film-selection"
					>
						<div
							className="festival-section-layer sticky top-[0px] flex flex-col items-center justify-center bg-dark pt-2 lg:static lg:mx-0 lg:items-stretch lg:pt-0"
							data-active={isFilmSectionOpen}
							data-any-active={hasActiveSection}
							data-stack="film"
						>
							<div className="flex items-center justify-center lg:hidden">
								<motion.div
									initial={{ rotate: -1 }}
									animate={{
										rotate: 1,
										transition: {
											duration: 0.3,
											repeat: Infinity,
											delay: 5,
											repeatType: 'reverse',
											ease: 'easeInOut',
										},
									}}
									onClick={() =>
										selectChapter(isFilmSectionOpen ? 'overview' : 'films')
									}
									data-active={isFilmSectionOpen}
									className={`festival-section-label relative flex w-fit cursor-pointer items-center justify-center gap-1 rounded-md border-[3px] px-2 pr-4 text-center text-4xl font-bold uppercase italic tracking-tighter shadow-sm transition-all hover:border-grayDark hover:bg-grayDark hover:text-dark lg:text-5xl ${
										isFilmSectionOpen
											? 'border-grayDark bg-grayDark text-dark'
											: 'border-primary bg-dark text-primary'
									}`}
								>
									<span>
										{sectionLabel('filmsTitle', tFilmSelection('title'))}
									</span>
								</motion.div>
							</div>

							{isFilmSectionOpen && (
								<>
									{filmSelection.length > 0 ? (
										<div
											className={`festival-film-filters mt-0 flex w-full flex-wrap items-center justify-between gap-2 bg-dark text-primary lg:mt-2 ${EDITORIAL_BODY_TEXT}`}
										>
											{[
												{
													field: 'year' as const,
													label: tFilmSelection('year'),
												},
												{
													field: 'title' as const,
													label: tFilmSelection('titleCol'),
												},
												{
													field: 'director' as const,
													label: tFilmSelection('director'),
												},
											].map(({ field, label }) => {
												const isActive = sortField === field
												return (
													<button
														key={field}
														type="button"
														onClick={() => {
															const nextOrder =
																isActive && sortOrder === 'asc' ? 'desc' : 'asc'
															setSortField(field)
															setSortOrder(nextOrder)
															updateQuery({ sort: field, order: nextOrder })
														}}
														aria-pressed={isActive}
														className="relative flex items-center justify-center py-1"
													>
														<span className="flex items-center gap-1">
															<FilterIcon
																theme={{
																	upArrow:
																		isActive && sortOrder === 'asc'
																			? 'var(--color-primary)'
																			: 'var(--color-grayDark)',
																	downArrow:
																		isActive && sortOrder === 'desc'
																			? 'var(--color-primary)'
																			: 'var(--color-grayDark)',
																}}
																className="h-[1em] w-auto shrink-0"
															/>
															<span
																className={
																	isActive ? 'underline underline-offset-4' : ''
																}
															>
																{label}
															</span>
														</span>
													</button>
												)
											})}
											<button
												type="button"
												onClick={() => {
													setShowWinnersOnly(!showWinnersOnly)
													updateQuery({
														winners: !showWinnersOnly ? '1' : undefined,
													})
												}}
												aria-pressed={showWinnersOnly}
												className="flex items-center gap-1 py-1"
											>
												{showWinnersOnly && <span aria-hidden="true">×</span>}
												<span
													className={
														showWinnersOnly
															? 'underline underline-offset-4'
															: ''
													}
												>
													{tFilmSelection('winners')}
												</span>
											</button>
											<div className="flex items-center justify-center">
												{[
													{
														icon: IoGrid,
														label: tFilmSelection('gridView'),
														value: 'grid' as const,
													},
													{
														icon: IoList,
														label: tFilmSelection('listView'),
														value: 'list' as const,
													},
												].map(({ icon: Icon, label, value }) => (
													<button
														key={value}
														type="button"
														onClick={() => {
															setView(value)
															updateQuery({ view: value })
														}}
														className="relative p-0 text-center transition-colors"
														aria-label={label}
														aria-pressed={view === value}
													>
														<motion.span
															animate={{
																scale:
																	value === 'grid'
																		? view === value
																			? 0.65
																			: 0.5
																		: view === value
																			? 0.85
																			: 0.75,
																opacity: view === value ? 1 : 0.5,
															}}
															transition={{
																type: 'spring',
																stiffness: 400,
																damping: 22,
															}}
															className="inline-block"
														>
															<Icon
																aria-hidden="true"
																size={36}
																className={
																	view === value
																		? 'text-primary'
																		: 'text-grayDark'
																}
															/>
														</motion.span>
													</button>
												))}
											</div>
										</div>
									) : (
										<div className="w-full pb-4 pt-2 text-center text-lg text-primary">
											{tFilmSelection('comingSoon')}
										</div>
									)}
								</>
							)}
						</div>

						{isFilmSectionOpen && filmSelection.length > 0 && (
							<div className="mt-0 pb-16">
								{view === 'grid' ? (
									<ul className="grid grid-cols-1 gap-2 pt-4 sm:grid-cols-2 lg:grid-cols-3">
										{sortedFilms.map((film: any, index: number) => {
											const title = getLocalizedValue(film.title, language)
											const card = (
												<article className="relative h-full">
													{film.affiche ? (
														<Img
															image={film.affiche}
															alt={title}
															className="aspect-square h-auto w-full rounded-lg border-2 border-primary object-cover lg:border-dark"
														/>
													) : (
														<div className="aspect-square w-full rounded-lg border-2 border-primary bg-grayDark/20 lg:border-dark" />
													)}

													<div className="absolute left-1/2 top-1/2 -mt-4 flex w-[90%] -translate-x-1/2 flex-col items-center">
														{title && (
															<h2 className="flex w-full flex-col items-center">
																{richTextLines(
																	localizedRichText(film.title, language),
																	16,
																).map((line, lineIndex) => (
																	<span
																		key={lineIndex}
																		className={`relative rounded-md border-2 border-primary bg-dark px-2 text-center text-3xl font-black italic text-primary lg:text-xl ${lineIndex === 0 ? 'z-10' : 'z-0 -mt-1'} ${lineIndex % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
																	>
																		<RichText
																			value={line}
																			inline
																			allowLinks={false}
																		/>
																	</span>
																))}
															</h2>
														)}
														{richTextLines(film.director, 26).map(
															(line, lineIndex) => (
																<p
																	key={lineIndex}
																	className={`relative inline-block w-auto rounded-md border-2 border-dark bg-grayDark px-2 py-0 text-center font-medium tracking-tighter text-dark ${lineIndex === 0 ? 'z-10' : 'z-0 -mt-[0.15rem]'} ${lineIndex % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
																>
																	<RichText
																		value={line}
																		inline
																		allowLinks={false}
																	/>
																</p>
															),
														)}
														{film.year && (
															<p className="relative z-0 -rotate-6 rounded-md bg-primary px-2 text-xl font-black text-dark sm:hidden">
																{film.year}
															</p>
														)}
													</div>
												</article>
											)

											return (
												<li
													key={film._id ?? index}
													className="h-full w-full"
													data-film-slug={film.slug?.current}
												>
													{film.slug?.current ? (
														<Link
															href={{
																pathname: `/${language}/film/${film.slug.current}`,
																query: searchParams
																	? Object.fromEntries(searchParams.entries())
																	: {},
															}}
															onClick={() => {
																sessionStorage.setItem(
																	'festivalScroll',
																	window.scrollY.toString(),
																)
															}}
															className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-grayDark"
														>
															{card}
														</Link>
													) : (
														card
													)}
												</li>
											)
										})}
									</ul>
								) : (
									<table className="festival-film-list relative mt-4 w-full table-auto border-collapse text-sm lg:text-lg">
										<thead className="sr-only">
											<tr>
												<th scope="col">{tFilmSelection('year')}</th>
												<th scope="col">{tFilmSelection('director')}</th>
												<th scope="col">{tFilmSelection('titleCol')}</th>
											</tr>
										</thead>
										<tbody>
											{sortedFilms.map((film: any, index: number) => {
												const filmKey = film._id ?? String(index)
												const filmHref = film.slug?.current
													? {
															pathname: `/${language}/film/${film.slug.current}`,
															query: Object.fromEntries(searchParams.entries()),
														}
													: null
												const title = getLocalizedValue(film.title, language)
												const saveScroll = () =>
													sessionStorage.setItem(
														'festivalScroll',
														window.scrollY.toString(),
													)
												const director = (
													<RichText
														value={film.director}
														inline
														allowLinks={false}
													/>
												)
												const filmTitle = (
													<>
														{film.isWinner && (
															<span aria-label={tFilmSelection('winner')}>
																★
															</span>
														)}
														<RichText
															value={localizedRichText(film.title, language)}
															inline
															allowLinks={false}
														/>
													</>
												)
												return (
													<tr
														key={filmKey}
														onMouseEnter={(event) =>
															setHoveredFilm({
																key: filmKey,
																row: event.currentTarget,
															})
														}
														onMouseLeave={() => setHoveredFilm(null)}
														className={`relative text-primary hover:bg-primary/15 ${film.isWinner ? 'font-black' : ''}`}
														data-film-slug={film.slug?.current}
													>
														<td className="border-b border-primary py-2">
															{filmHref ? (
																<Link href={filmHref} onClick={saveScroll}>
																	{film.year}
																</Link>
															) : (
																<span className="text-grayDark">
																	{film.year}
																</span>
															)}
														</td>
														<td className="border-b border-primary px-4 py-2">
															{filmHref ? (
																<Link href={filmHref} onClick={saveScroll}>
																	{director}
																</Link>
															) : (
																director
															)}
														</td>
														<td className="border-b border-primary px-4 py-2 pr-8">
															{filmHref ? (
																<Link
																	href={filmHref}
																	onClick={saveScroll}
																	className="flex gap-x-1"
																>
																	{filmTitle}
																</Link>
															) : (
																<span className="flex gap-x-1 text-grayDark">
																	{filmTitle}
																</span>
															)}
															{hoveredFilm &&
																hoveredFilm.key === filmKey &&
																film.affiche && (
																	<FilmHoverPreview
																		anchor={hoveredFilm.row}
																		onClose={() => setHoveredFilm(null)}
																	>
																		<div className="relative">
																			<Img
																				image={film.affiche}
																				alt={title}
																				className="max-h-[var(--preview-max-height)] max-w-full rounded-md border-[3px] border-primary object-contain"
																			/>
																			<div className="absolute left-1/2 top-1/2 flex w-[90%] -translate-x-1/2 flex-col items-center">
																				{film.year && (
																					<p className="relative z-10 -rotate-6 rounded-md bg-primary px-2 text-xl font-black text-dark">
																						{film.year}
																					</p>
																				)}
																				{richTextLines(film.director, 26).map(
																					(line, lineIndex) => (
																						<p
																							key={lineIndex}
																							className={`relative rounded-md border-2 border-dark bg-grayDark px-2 text-center font-medium tracking-tighter text-dark ${lineIndex ? '-mt-[0.15rem]' : ''} ${lineIndex % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
																						>
																							<RichText
																								value={line}
																								inline
																								allowLinks={false}
																							/>
																						</p>
																					),
																				)}
																			</div>
																		</div>
																	</FilmHoverPreview>
																)}
														</td>
													</tr>
												)
											})}
										</tbody>
									</table>
								)}
							</div>
						)}
					</div>

					<div
						className={
							activeChapter === 'exhibition' ? 'lg:block' : 'lg:hidden'
						}
					>
						<Accordion
							type="single"
							collapsible
							value={photoExhibitionValue}
							onValueChange={(value) => {
								setPhotoExhibitionValue(value)
								setActiveChapter(value === 'item-3' ? 'exhibition' : 'overview')
							}}
						>
							<AccordionItem
								value="item-3"
								className="festival-section-layer relative -mt-5 flex flex-col items-center justify-center pb-1 lg:-mt-2"
								data-active={photoExhibitionValue === 'item-3'}
								data-any-active={hasActiveSection}
								data-stack="exhibition"
							>
								<AccordionTrigger
									data-active={photoExhibitionValue === 'item-3'}
									className="festival-section-label relative rotate-[2deg] hover:border-grayDark lg:hidden"
								>
									{sectionLabel('exhibitionTitle', tExpo('title'))}
								</AccordionTrigger>
								<AccordionContent>
									{expoPhoto.length > 0 && (
										<div className="my-4">
											{/* Curator Name */}
											{expoPhoto.map((expo: any, expoIndex: number) => {
												// Group photos by artist
												const photosByArtist = expo.photos?.reduce(
													(acc: any, photo: any) => {
														const artistName =
															richTextToPlainText(photo.artistName) ||
															'Unknown Artist'
														if (!acc[artistName]) {
															acc[artistName] = []
														}
														acc[artistName].push(photo)
														return acc
													},
													{},
												)

												return (
													<div key={expoIndex} className="mb-4">
														<div className="flex justify-center">
															<h3 className="z-0 -mt-3 inline-block -rotate-1 rounded-md border-2 border-dark bg-primary px-2 py-0 text-center text-base font-medium tracking-tighter text-dark lg:text-lg">
																{tExpo('curatedBy')}{' '}
																<RichText value={expo.curatorName} inline />
															</h3>
														</div>

														{/* Artist Names */}
														{photosByArtist &&
														Object.keys(photosByArtist).length > 0 ? (
															<ul className="mt-2 text-base text-primary lg:text-primary">
																{Object.keys(photosByArtist).map(
																	(artistName, artistIndex) => {
																		const isExpanded =
																			selectedArtist === artistName

																		return (
																			<li
																				key={artistIndex}
																				className="border-b border-primary/50 lg:border-primary"
																			>
																				<div
																					className="flex cursor-pointer items-center justify-between py-2"
																					onClick={() =>
																						setSelectedArtist(
																							isExpanded ? null : artistName,
																						)
																					}
																				>
																					<RichText
																						value={
																							photosByArtist[artistName][0]
																								?.artistName
																						}
																						inline
																					/>
																					<span>
																						{isExpanded ? (
																							<span className="font-bold">
																								-
																							</span>
																						) : (
																							<span className="font-bold">
																								+
																							</span>
																						)}
																					</span>
																					{/* <ArrowGallery
																				className="mr-1 h-auto w-2 -rotate-90 lg:w-9"
																				theme={{
																					fill: 'var(--color-primary)',
																				}}
																			/> */}
																				</div>

																				{/* Photos for Selected Artist */}
																				{isExpanded &&
																					photosByArtist[artistName] && (
																						<div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
																							{photosByArtist[artistName].map(
																								(
																									photo: any,
																									photoIndex: number,
																								) => (
																									<figure
																										key={
																											photo.photo?._key ||
																											`${artistName}-${photoIndex}`
																										}
																									>
																										<Img
																											key={
																												photo.photo?._key ||
																												photo.photo?.asset
																													?._id ||
																												`${artistName}-${photoIndex}`
																											}
																											image={photo.photo}
																											alt={`Photo by ${artistName}`}
																											className="aspect-square h-auto w-full rounded-md object-cover"
																										/>
																									</figure>
																								),
																							)}
																						</div>
																					)}
																			</li>
																		)
																	},
																)}
															</ul>
														) : (
															<p className="mt-2 text-base text-primary">
																No photos available.
															</p>
														)}
													</div>
												)
											})}
										</div>
									)}
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>

					<div
						className={`relative pb-0 pt-0 ${
							activeChapter === 'photos' ? 'lg:block' : 'lg:hidden'
						}`}
						id="photo-gallery"
					>
						<div
							className="festival-section-layer relative -mt-5 flex justify-center"
							data-active={isPhotoGalleryOpen}
							data-any-active={hasActiveSection}
							data-stack="gallery"
						>
							<motion.div
								initial={{ rotate: -3 }}
								animate={{
									rotate: 1,
									transition: {
										duration: 0.3,
										repeat: Infinity,
										delay: 5,
										repeatType: 'reverse',
										ease: 'easeInOut',
									},
								}}
								onClick={() =>
									selectChapter(isPhotoGalleryOpen ? 'overview' : 'photos')
								}
								data-active={isPhotoGalleryOpen}
								className={`festival-section-label relative flex w-fit cursor-pointer items-center justify-center gap-1 rounded-md border-[3px] px-2 pr-4 text-center text-4xl font-bold uppercase italic tracking-[-0.06em] shadow-sm transition-all hover:border-grayDark hover:bg-grayDark hover:text-dark lg:hidden ${
									isPhotoGalleryOpen
										? 'border-grayDark bg-grayDark text-dark'
										: 'border-primary bg-dark text-primary'
								}`}
							>
								<span>
									{sectionLabel('photosTitle', tPhotoGallery('title'))}
								</span>
							</motion.div>
						</div>

						{isPhotoGalleryOpen && (
							<div className="relative">
								<div className="flex justify-center">
									<h3 className="-z-10 -mt-0 inline-block rotate-2 rounded-md border-2 border-dark bg-primary px-2 py-0 text-center text-base font-medium tracking-tighter text-dark lg:z-0 lg:text-lg">
										{tPhotoGallery('photosBy')}{' '}
										{photoGallery.map((gallery: any, index: number) => (
											<span key={index}>
												{index > 0 && ', '}
												<RichText value={gallery.photographer} inline />
											</span>
										))}
									</h3>
								</div>

								<div className="relative space-y-4 pt-4">
									{photoRows.map((row, rowIndex) => (
										<div
											key={rowIndex}
											className="relative flex flex-col items-center justify-center rounded-md bg-grayDark py-4 lg:py-[2.4rem]"
										>
											{/* Top perforation */}
											<div className="absolute left-0 top-1 flex w-full justify-between px-2 lg:top-2">
												{[...Array(28)].map((_, i) => (
													<div
														key={i}
														className="hidden h-2 w-4 rounded-sm bg-dark lg:block lg:h-[1.45rem] lg:w-[1.15rem] lg:rounded-[0.25rem] lg:bg-dark"
													/>
												))}
												{[...Array(12)].map((_, i) => (
													<div
														key={i}
														className="h-2 w-4 rounded-sm bg-dark lg:hidden lg:h-[1.45rem] lg:w-3 lg:rounded-[0.25rem] lg:bg-dark"
													/>
												))}
											</div>
											{/* Bottom perforation */}
											<div className="absolute bottom-1 left-0 flex w-full justify-between px-2 lg:bottom-2">
												{[...Array(28)].map((_, i) => (
													<div
														key={i}
														className="hidden h-2 w-4 rounded-sm bg-dark lg:block lg:h-[1.45rem] lg:w-[1.15rem] lg:rounded-[0.25rem] lg:bg-dark"
													/>
												))}
												{[...Array(12)].map((_, i) => (
													<div
														key={i}
														className="h-2 w-4 rounded-sm bg-dark lg:hidden lg:h-[1.45rem] lg:w-3 lg:rounded-[0.25rem] lg:bg-dark"
													/>
												))}
											</div>
											{/* Images */}
											<div className="z-10 grid w-full max-w-3xl grid-cols-3 lg:max-w-full lg:gap-2">
												{row.map((photo: any, index: number) => (
													<button
														key={index}
														onClick={(event) =>
															openLightbox(
																rowIndex * 3 + index,
																event.currentTarget,
															)
														}
														className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
													>
														<Img
															image={photo}
															alt={`Photo ${rowIndex * 3 + index + 1}`}
															className="aspect-square h-auto w-full rounded-none object-cover lg:aspect-video"
														/>
													</button>
												))}
											</div>
										</div>
									))}
								</div>

								{isLightboxOpen && (
									<FestivalCarousel
										photos={photoGallery.flatMap((gallery: any) =>
											(gallery.photos ?? []).map((photo: any) => ({
												photo,
												photographer: gallery.photographer,
											})),
										)}
										initialIndex={currentImageIndex}
										originRect={lightboxOriginRect}
										onClose={closeLightbox}
									/>
								)}
							</div>
						)}
					</div>

					{jurySection}

					<div
						className={`${EDITORIAL_BODY_TEXT} ${EDITORIAL_COPY_WIDTH} mx-auto py-4 pt-3 text-primary lg:pb-8 lg:pt-[0.45em] ${
							activeChapter === 'overview' ? 'lg:block' : 'lg:hidden'
						}`}
					>
						<RichText
							value={festivalDescription}
							className="festival-edition-description [&>h2]:text-[1.7em]"
						/>

						{(festival.pressLink || festival.aftermovieLink) && (
							<div className="mt-6 flex flex-wrap gap-2">
								{festival.pressLink && (
									<a
										href={festival.pressLink}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-block rounded-md border-2 border-primary bg-primary px-2 py-0 text-sm font-medium text-dark lg:text-base"
									>
										<RichText
											value={
												localizedRichText(festival.pressLinkLabel, language) ||
												{ fr: 'Presse', en: 'Press', nl: 'Pers' }[language] ||
												'Presse'
											}
											inline
											allowLinks={false}
										/>
									</a>
								)}

								{festival.aftermovieLink && (
									<a
										href={festival.aftermovieLink}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-block rounded-md border-2 border-primary bg-primary px-2 py-0 text-sm font-medium text-dark lg:text-base"
									>
										<RichText
											value={
												localizedRichText(
													festival.aftermovieLinkLabel,
													language,
												) || 'Aftermovie'
											}
											inline
											allowLinks={false}
										/>
									</a>
								)}
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	)
}

export default FestivalEditionContent
