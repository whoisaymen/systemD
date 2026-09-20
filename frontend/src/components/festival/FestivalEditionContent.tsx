'use client'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import Img from '@/ui/Img'
import Link from 'next/link'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { IoGrid, IoList } from 'react-icons/io5'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import FestivalCarousel, { type GalleryRect } from './FestivalCarousel'
import AftermoviePlayer from './AftermoviePlayer'
import ExhibitionCollage from './ExhibitionCollage'
import { photoCreditRotation } from './photoCreditStyles'
import BackToTopButton from '../common/BackToTop'
import RichText from '@/components/common/RichText'
import OverflowText from '@/components/common/OverflowText'
import {
	EDITORIAL_BODY_TEXT,
	EDITORIAL_COPY_WIDTH,
	EDITORIAL_DESKTOP_TAB_STYLE,
	EDITORIAL_RICH_TEXT_HEADINGS,
} from '@/components/common/editorialStyles'
import { localizedRichText, richTextToPlainText } from '@/lib/richText'
import {
	DEFAULT_FILM_SORT,
	DEFAULT_FILM_ORDER,
	sortFilmSelection,
	type FilmSortField,
	type FilmSortOrder,
} from '@/lib/filmSelection'
import { richTextLines } from '@/lib/richTextLines'
import { useRouter, useSearchParams } from 'next/navigation'
import NewArrowRightFull from '../common/NewArrowRightFull'
import FilterIcon from '../svgs/FilterIcon'
import FilmHoverPreview from './FilmHoverPreview'
import { FILM_LABEL_TEXT, FILM_TITLE_TEXT } from '../film/filmLabelStyles'
import contactSheet from './FestivalContactSheet.module.css'

interface FestivalEditionContentProps {
	festival: any
	language: string
}

type EditionChapter = 'overview' | 'films' | 'exhibition' | 'photos' | 'jury'

const FILM_FILTER_BUTTON_STYLE =
	'relative flex items-center justify-center gap-1 rounded-md border-2 border-transparent px-1 py-0 transition-colors hover:bg-primary hover:text-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

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
	const [photosPerRow, setPhotosPerRow] = useState(3)
	const [photoExhibitionValue, setPhotoExhibitionValue] = useState('')
	const [sortField, setSortField] = useState<FilmSortField>(DEFAULT_FILM_SORT)
	const [sortOrder, setSortOrder] = useState<FilmSortOrder>(DEFAULT_FILM_ORDER)

	const [isLightboxOpen, setIsLightboxOpen] = useState(false)
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [lightboxOriginRect, setLightboxOriginRect] =
		useState<GalleryRect | null>(null)
	const [showWinnersOnly, setShowWinnersOnly] = useState(false)
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
		setHoveredFilm(null)
		setActiveChapter(chapter)
		setIsFilmSectionOpen(chapter === 'films')
		setPhotoExhibitionValue(chapter === 'exhibition' ? 'item-3' : '')
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

	useEffect(() => {
		const desktop = window.matchMedia('(min-width: 1024px)')
		const updatePhotosPerRow = () => setPhotosPerRow(desktop.matches ? 5 : 3)
		updatePhotosPerRow()
		desktop.addEventListener('change', updatePhotosPerRow)
		return () => desktop.removeEventListener('change', updatePhotosPerRow)
	}, [])

	function chunkArray(array: any[], size: number) {
		return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
			array.slice(i * size, i * size + size),
		)
	}
	const photoRows = useMemo(
		() =>
			chunkArray(
				photoGallery.flatMap((gallery: any) => gallery.photos ?? []),
				photosPerRow,
			),
		[photoGallery, photosPerRow],
	)

	const getLocalizedValue = (value: any, language: string) =>
		richTextToPlainText(localizedRichText(value, language))

	const hasActiveSection =
		isFilmSectionOpen ||
		isJuryOpen ||
		photoExhibitionValue === 'item-3' ||
		isPhotoGalleryOpen

	const sortedFilms = useMemo(
		() =>
			sortFilmSelection(filmSelection, {
				language,
				sort: sortField,
				order: sortOrder,
				winnersOnly: showWinnersOnly,
			}),
		[filmSelection, language, sortField, sortOrder, showWinnersOnly],
	)

	const router = useRouter()
	const searchParams = useSearchParams()
	const filmQuery: Record<string, string> = {
		...Object.fromEntries(searchParams.entries()),
		sort: sortField,
		order: sortOrder,
		view,
	}
	if (showWinnersOnly) filmQuery.winners = '1'
	else delete filmQuery.winners

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

		if (sort === 'year' || sort === 'title' || sort === 'director')
			setSortField(sort)
		if (order) setSortOrder(order)
		setShowWinnersOnly(winners)
		if (view) setView(view)

		// Check if we're returning from a film
		const currentFilmSlug = sessionStorage.getItem('currentFilmSlug')
		const scroll = sessionStorage.getItem('festivalScroll')

		if (currentFilmSlug) {
			// We're returning from a film, open the film selection and scroll to that film
			sessionStorage.removeItem('currentFilmSlug')
			sessionStorage.removeItem('festivalScroll')
			setIsFilmSectionOpen(true)
			setActiveChapter('films')

			// Use a timeout to ensure the DOM is rendered
			setTimeout(() => {
				scrollToFilm(currentFilmSlug)
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
	const overviewTrigger = (
		<button
			type="button"
			onClick={() => selectChapter('overview')}
			aria-expanded={activeChapter === 'overview'}
			aria-controls="edition-description"
			className="interactive-title-motion group relative flex flex-col items-start"
		>
			<span
				className={`relative rotate-2 rounded-md border-[3px] px-2 pr-4 text-center text-4xl font-bold uppercase italic tracking-tighter shadow-sm transition-colors group-hover:border-grayDark group-hover:bg-grayDark group-hover:text-dark ${EDITORIAL_DESKTOP_TAB_STYLE} ${activeChapter === 'overview' ? 'border-grayDark bg-grayDark text-dark' : 'border-primary bg-dark text-primary'}`}
			>
				<RichText value={festival.venue} inline allowLinks={false} />
			</span>
			<span className="relative -mt-0.5 rotate-6 rounded-md bg-primary px-1 text-xl font-black leading-none text-dark lg:text-[clamp(1rem,2.17cqw,1.5rem)]">
				{festival.year}
			</span>
		</button>
	)
	const sectionLabel = (field: string, fallback: string) => (
		<RichText
			value={localizedRichText(festival[field], language) || fallback}
			inline
			allowLinks={false}
		/>
	)
	const curators = expoPhoto.filter((expo: any) => richTextToPlainText(expo.curatorName))
	const photographers = photoGallery.filter((gallery: any) => richTextToPlainText(gallery.photographer))
	const exhibitionCredit = curators.length > 0 ? (
		<>{tExpo('curatedBy')}{' '}{curators.map((expo: any, index: number) => (
			<span key={expo._key ?? index}>{index > 0 && ', '}<RichText value={expo.curatorName} inline /></span>
		))}</>
	) : null
	const galleryCredit = photographers.length > 0 ? (
		<>{tPhotoGallery('photosBy')}{' '}{photographers.map((gallery: any, index: number) => (
			<span key={index}>{index > 0 && ', '}<RichText value={gallery.photographer} inline /></span>
		))}</>
	) : null
	const creditPill = (credit: React.ReactNode, rotation: string) => (
		<span style={{ rotate: rotation }} className={`block rounded-md border-2 border-dark bg-primary px-1.5 py-0 text-center text-dark ${FILM_LABEL_TEXT}`}>
			{credit}
		</span>
	)
	const chapters: Array<{
		key: EditionChapter
		label: React.ReactNode
		titleClassName: string
		credit?: React.ReactNode
		creditRotation?: string
	}> = [
		{
			key: 'films',
			label: sectionLabel('filmsTitle', tFilmSelection('title')),
			titleClassName: '-rotate-3 translate-y-0.5',
		},
		{
			key: 'exhibition',
			credit: exhibitionCredit,
			creditRotation: photoCreditRotation(curators.map((expo: any) => richTextToPlainText(expo.curatorName)).join(', ')),
			label: sectionLabel('exhibitionTitle', tExpo('title')),
			titleClassName: 'rotate-6 translate-y-1',
		},
		{
			key: 'photos',
			credit: galleryCredit,
			creditRotation: '3deg',
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
					onValueChange={(value) =>
						selectChapter(value === 'jury' ? 'jury' : 'overview')
					}
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
			<div className="absolute -top-3 z-50 rounded-md text-3xl font-semibold text-dark lg:hidden">
				<button
					type="button"
					onClick={() => router.push(`/${language}/memoire`)}
					aria-label="Go back"
				>
					<NewArrowRightFull
						theme={{ stroke: 'var(--color-primary)' }}
						strokeWidth={8}
						className="h-auto w-10 translate-y-1 rotate-180 scale-[0.55]"
					/>
				</button>
			</div>

			<div className="absolute left-6 top-0 z-50 hidden flex-col items-start gap-1 lg:flex">
				<button
					type="button"
					onClick={() => router.push(`/${language}/memoire`)}
					aria-label="Go back"
					className="relative aspect-[76/61] w-14 rounded-md transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
				>
					<NewArrowRightFull
						theme={{ stroke: 'var(--color-primary)' }}
						strokeWidth={8}
						className="absolute inset-0 h-full w-full -translate-x-1/4 translate-y-1 rotate-180 scale-[0.55]"
					/>
				</button>
				{overviewTrigger}
			</div>

			<div>
				<nav
					className="relative hidden lg:mt-[clamp(0.75rem,1.45cqw,1rem)] lg:block lg:px-24 lg:py-[clamp(1.5rem,3.33cqw,4rem)]"
					aria-label={tEdition('indexLabel')}
				>
					<ul className="flex flex-wrap items-start justify-center gap-y-[min(1.5rem,1.67cqw)]">
						{visibleChapters.map((chapter) => {
							const isActive = activeChapter === chapter.key

							return (
								<li key={chapter.key} className="relative">
									<button
										type="button"
										onClick={() => selectChapter(chapter.key)}
										aria-expanded={isActive}
										className={`interactive-title-motion relative z-20 text-center transition-colors hover:border-grayDark hover:bg-grayDark hover:text-dark ${EDITORIAL_DESKTOP_TAB_STYLE} ${chapter.titleClassName} ${
											isActive
												? 'border-grayDark bg-grayDark text-dark'
												: 'border-primary bg-dark text-primary'
										}`}
									>
										{chapter.label}
									</button>
									{isActive && chapter.credit && (
										<div className={`absolute left-1/2 top-full z-30 w-max max-w-[min(22rem,40cqw)] -translate-x-1/2 ${chapter.key === 'exhibition' ? 'mt-2' : 'mt-0.5'}`}>
											{creditPill(chapter.credit, chapter.creditRotation ?? '0deg')}
										</div>
									)}
								</li>
							)
						})}
					</ul>
				</nav>

				<main
					className={`min-w-0 lg:pt-6 ${activeChapter === 'overview' ? '' : 'lg:px-6'}`}
				>
					<div className="flex justify-center pt-8 lg:hidden">
						{overviewTrigger}
					</div>

					<div
						id="edition-description"
						className={`${EDITORIAL_BODY_TEXT} ${EDITORIAL_COPY_WIDTH} mx-auto py-4 pt-3 text-primary lg:pb-8 lg:pt-[0.45em] ${
							activeChapter === 'overview' ? 'block' : 'hidden'
						}`}
					>
						<RichText
							value={festivalDescription}
							className={`festival-edition-description ${EDITORIAL_RICH_TEXT_HEADINGS}`}
						/>

						{festival.pressLink && (
							<div className="mt-6">
								<a
									href={festival.pressLink}
									target="_blank"
									rel="noopener noreferrer"
									className="underline underline-offset-4 hover:opacity-75"
								>
									{{ fr: 'Presse', en: 'Press', nl: 'Pers' }[language] || 'Presse'}
								</a>
							</div>
						)}

						{festival.aftermovieLink && activeChapter === 'overview' && (
							<figure className="mt-8" aria-label={`Aftermovie ${festival.year}`}>
								<div className="overflow-hidden bg-dark">
									<div className="aspect-video">
										<AftermoviePlayer
											source={festival.aftermovieLink}
											title={`Aftermovie ${festival.year}`}
											language={language}
										/>
									</div>
								</div>
							</figure>
						)}
					</div>

					<div
						className={`mb-8 pt-8 lg:pt-0 ${
							activeChapter === 'films' ? 'lg:block' : 'lg:hidden'
						}`}
						id="film-selection"
					>
						<div
							className="festival-section-layer sticky top-[0px] flex flex-col items-center justify-center bg-dark pt-2 lg:sticky lg:mx-0 lg:items-stretch lg:pt-0"
							data-active={isFilmSectionOpen}
							data-any-active={hasActiveSection}
							data-stack="film"
						>
							<div className="flex items-center justify-center lg:hidden">
								<button
									type="button"
									aria-expanded={isFilmSectionOpen}
									onClick={() =>
										selectChapter(isFilmSectionOpen ? 'overview' : 'films')
									}
									data-active={isFilmSectionOpen}
									className={`interactive-title-motion festival-section-label relative flex w-fit -rotate-1 cursor-pointer items-center justify-center gap-1 rounded-md border-[3px] px-2 pr-4 text-center text-4xl font-bold uppercase italic tracking-tighter shadow-sm transition-colors hover:border-grayDark hover:bg-grayDark hover:text-dark lg:text-5xl ${
										isFilmSectionOpen
											? 'border-grayDark bg-grayDark text-dark'
											: 'border-primary bg-dark text-primary'
									}`}
								>
									<span>
										{sectionLabel('filmsTitle', tFilmSelection('title'))}
									</span>
								</button>
							</div>

							{isFilmSectionOpen && (
								<>
									{filmSelection.length > 0 ? (
										<div
											className={`festival-film-filters mt-0 flex w-full flex-wrap items-center justify-between gap-2 bg-dark text-primary lg:mt-2 ${FILM_LABEL_TEXT}`}
										>
											{[
												{
													field: 'title' as const,
													label: tFilmSelection('titleCol'),
												},
												{
													field: 'director' as const,
													label: tFilmSelection('director'),
												},
												{
													field: 'year' as const,
													label: tFilmSelection('year'),
												},
											].map(({ field, label }) => {
												const isActive = !showWinnersOnly && sortField === field
												return (
													<button
														key={field}
														type="button"
														onClick={() => {
															const nextOrder =
																isActive && sortOrder === 'asc' ? 'desc' : 'asc'
															setSortField(field)
															setSortOrder(nextOrder)
															setShowWinnersOnly(false)
															updateQuery({
																sort: field,
																order: nextOrder,
																winners: undefined,
															})
														}}
														aria-pressed={isActive}
														className={`${FILM_FILTER_BUTTON_STYLE} ${isActive ? 'bg-primary text-dark' : 'text-primary'}`}
													>
														<span className="flex items-center gap-1">
															<FilterIcon
																theme={{
																	upArrow:
																		isActive && sortOrder === 'asc'
																			? 'var(--color-dark)'
																			: 'var(--color-grayDark)',
																	downArrow:
																		isActive && sortOrder === 'desc'
																			? 'var(--color-dark)'
																			: 'var(--color-grayDark)',
																}}
																className="h-[1em] w-auto shrink-0"
															/>
															<span>{label}</span>
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
												className={`${FILM_FILTER_BUTTON_STYLE} ${showWinnersOnly ? 'bg-primary text-dark' : 'text-primary'}`}
											>
												{showWinnersOnly && <span aria-hidden="true">★</span>}
												<span>{tFilmSelection('winners')}</span>
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
															imageWidth={1200}
															sizes="(min-width: 1024px) 22vw, (min-width: 640px) 46vw, calc(100vw - 64px)"
															loading={index < 3 ? 'eager' : 'lazy'}
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
																		className={`relative rounded-md border-2 border-primary bg-dark px-2 text-center text-primary ${FILM_TITLE_TEXT} ${lineIndex === 0 ? 'z-10' : 'z-0 -mt-1'} ${lineIndex % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
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
																	className={`relative inline-block w-auto rounded-md border-2 border-dark bg-grayDark px-1.5 py-0 text-center text-dark ${FILM_LABEL_TEXT} ${lineIndex === 0 ? 'z-10' : 'z-0 -mt-[0.15rem]'} ${lineIndex % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
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
																query: filmQuery,
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
									<table className="festival-film-list relative mt-4 w-full table-fixed border-separate border-spacing-0 text-sm lg:text-lg">
										<colgroup>
											<col className="w-1/3" />
											<col />
											<col className="w-20 lg:w-24" />
										</colgroup>
										<thead className="sr-only">
											<tr>
												<th scope="col">{tFilmSelection('titleCol')}</th>
												<th scope="col">{tFilmSelection('director')}</th>
												<th scope="col">{tFilmSelection('year')}</th>
											</tr>
										</thead>
										<tbody>
											{sortedFilms.map((film: any, index: number) => {
												const filmKey = film._id ?? String(index)
												const filmHref = film.slug?.current
													? {
															pathname: `/${language}/film/${film.slug.current}`,
															query: filmQuery,
														}
													: null
												const title = getLocalizedValue(film.title, language)
												const saveScroll = () =>
													sessionStorage.setItem(
														'festivalScroll',
														window.scrollY.toString(),
													)
												const director = <OverflowText value={film.director} />
												const filmTitle = (
													<>
														{film.isWinner && (
															<span
																className="shrink-0"
																aria-label={tFilmSelection('winner')}
															>
																★
															</span>
														)}
														<OverflowText
															value={localizedRichText(film.title, language)}
															className="flex-1"
														/>
													</>
												)
												return (
													<tr
														key={filmKey}
														className={`relative ${film.isWinner ? 'text-dark [&>td:first-child]:pl-2 [&>td]:bg-grayDark' : 'text-primary hover:bg-primary/15'}`}
														data-film-slug={film.slug?.current}
													>
														<td
															className="group border-b border-primary py-2"
															onMouseEnter={(event) => {
																const row = event.currentTarget.closest('tr')
																if (row) setHoveredFilm({ key: filmKey, row })
															}}
															onMouseLeave={() => setHoveredFilm(null)}
														>
															<div className="w-fit max-w-full">
																{filmHref ? (
																	<Link
																		href={filmHref}
																		onClick={saveScroll}
																		className="group flex gap-x-1"
																	>
																		{filmTitle}
																	</Link>
																) : (
																	<span
																		className={`flex gap-x-1 ${film.isWinner ? '' : 'text-grayDark'}`}
																	>
																		{filmTitle}
																	</span>
																)}
															</div>
															{hoveredFilm &&
																hoveredFilm.key === filmKey &&
																film.affiche && (
																	<FilmHoverPreview
																		anchor={hoveredFilm.row}
																		onClose={() => setHoveredFilm(null)}
																	>
																		<Img
																			image={film.affiche}
																			alt={title}
																			imageWidth={960}
																			sizes="480px"
																			loading="eager"
																			placeholderFit="contain"
																			className="max-h-[var(--preview-max-height)] max-w-full object-contain"
																		/>
																	</FilmHoverPreview>
																)}
														</td>
														<td className="border-b border-primary px-4 py-2">
															{filmHref ? (
																<Link
																	href={filmHref}
																	onClick={saveScroll}
																	className="group block"
																>
																	{director}
																</Link>
															) : (
																<span className="group block">{director}</span>
															)}
														</td>
														<td className="border-b border-primary px-4 py-2 pr-8">
															{filmHref ? (
																<Link href={filmHref} onClick={saveScroll}>
																	{film.year}
																</Link>
															) : (
																<span
																	className={
																		film.isWinner ? '' : 'text-grayDark'
																	}
																>
																	{film.year}
																</span>
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
							onValueChange={(value) =>
								selectChapter(value === 'item-3' ? 'exhibition' : 'overview')
							}
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
								{photoExhibitionValue === 'item-3' && exhibitionCredit && (
									<div className="relative z-30 -mt-1 flex justify-center px-4 lg:hidden">
										{creditPill(exhibitionCredit, photoCreditRotation(curators.map((expo: any) => richTextToPlainText(expo.curatorName)).join(', ')))}
									</div>
								)}
								<AccordionContent>
									<ExhibitionCollage exhibitions={expoPhoto} />
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
							<button
								type="button"
								aria-expanded={isPhotoGalleryOpen}
								onClick={() =>
									selectChapter(isPhotoGalleryOpen ? 'overview' : 'photos')
								}
								data-active={isPhotoGalleryOpen}
								className={`interactive-title-motion festival-section-label relative flex w-fit -rotate-3 cursor-pointer items-center justify-center gap-1 rounded-md border-[3px] px-2 pr-4 text-center text-4xl font-bold uppercase italic tracking-[-0.06em] shadow-sm transition-colors hover:border-grayDark hover:bg-grayDark hover:text-dark lg:hidden ${
									isPhotoGalleryOpen
										? 'border-grayDark bg-grayDark text-dark'
										: 'border-primary bg-dark text-primary'
								}`}
							>
								<span>
									{sectionLabel('photosTitle', tPhotoGallery('title'))}
								</span>
							</button>
						</div>

						{isPhotoGalleryOpen && (
							<div className="relative">
								{galleryCredit && (
									<div className="relative z-30 -mt-1 flex justify-center px-4 lg:hidden">
										{creditPill(galleryCredit, '3deg')}
									</div>
								)}

								<div
									className={contactSheet.sheet}
									style={{ '--frames-per-row': photosPerRow } as CSSProperties}
								>
									{photoRows.map((row, rowIndex) => (
										<div
											key={rowIndex}
											className={contactSheet.strip}
											style={{ '--frames-in-row': row.length } as CSSProperties}
										>
											{['top', 'bottom'].map((edge) => (
												<div
													key={edge}
													aria-hidden="true"
													className={contactSheet.perforations}
													data-edge={edge}
												>
													{Array.from({ length: row.length * 8 }, (_, index) => (
														<span key={index} />
													))}
												</div>
											))}
											<div className={contactSheet.frames}>
												{row.map((photo: any, index: number) => (
													<button
														key={index}
														type="button"
														onClick={(event) =>
															openLightbox(
																rowIndex * photosPerRow + index,
																event.currentTarget,
															)
														}
														className={contactSheet.frame}
													>
														<Img
															image={photo}
															alt={`Photo ${rowIndex * photosPerRow + index + 1}`}
															imageWidth={1000}
															sizes="(min-width: 1024px) 14vw, 32vw"
															loading={rowIndex === 0 ? 'eager' : 'lazy'}
															className={contactSheet.photo}
														/>
														{['top', 'bottom'].map((edge) => (
															<span
																key={edge}
																className={contactSheet.frameNumber}
																data-edge={edge}
																aria-hidden="true"
															>
																{String(rowIndex * photosPerRow + index + 1).padStart(2, '0')}
															</span>
														))}
													</button>
												))}
											</div>
										</div>
									))}
								</div>

								{isLightboxOpen && createPortal(
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
									/>,
									document.body,
								)}
							</div>
						)}
					</div>

					{jurySection}
				</main>
			</div>
		</div>
	)
}

export default FestivalEditionContent
