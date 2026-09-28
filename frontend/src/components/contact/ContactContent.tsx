'use client'

import { useEffect, useState } from 'react'
import PartnerLogo, { type PartnerLogoAsset } from './PartnerLogo'
import RichText from '@/components/common/RichText'
import MobileSectionMenu from '@/components/common/MobileSectionMenu'
import {
	EDITORIAL_BODY_TEXT,
	EDITORIAL_DESKTOP_TAB_STYLE,
} from '@/components/common/editorialStyles'
import { localizedRichText } from '@/lib/richText'
import { useTranslations } from 'next-intl'
import SocialLinks from '@/ui/SocialLinks'
import BrusselsMap from '../fabrique/BrusselsMap'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'

type LocalizedValue = {
	_key?: string
	language?: string
	value?: any
}

type ContactPartner = {
	_key?: string
	name?: string
	url?: string
	logo?: {
		asset?: PartnerLogoAsset
	}
}

type Contact = {
	_id?: string
	address?: LocalizedValue[]
	contactTitle?: LocalizedValue[]
	partnersTitle?: LocalizedValue[]
	credits?: LocalizedValue[]
	mapLocation?: string
	partners?: ContactPartner[]
}

interface ContactContentProps {
	contact: Contact | null
	language: string
	social?: Sanity.Navigation
	copyrightYear: number
}

const ContactContent: React.FC<ContactContentProps> = ({
	contact,
	language,
	social,
	copyrightYear,
}) => {
	const t = useTranslations('contactPage')
	const [isDesktop, setIsDesktop] = useState(false)
	const [activeSection, setActiveSection] = useState('contact')

	useEffect(() => {
		const desktop = window.matchMedia('(min-width: 1024px)')
		const updateLayout = () => {
			setIsDesktop(desktop.matches)
			if (!desktop.matches) setActiveSection((value) => value || 'contact')
		}
		updateLayout()
		desktop.addEventListener('change', updateLayout)
		return () => desktop.removeEventListener('change', updateLayout)
	}, [])

	const selectSection = (value: string) => {
		if (value === activeSection) return
		setActiveSection(value)
		if (!isDesktop)
			document
				.getElementById('navbar-mobile')
				?.scrollIntoView({ behavior: 'smooth', block: 'start' })
	}

	if (!contact) {
		return <div>{t('noContent')}</div>
	}

	const address =
		localizedRichText(contact.address, language) ??
		localizedRichText(contact.address, 'fr')
	const partners = contact.partners?.filter(
		(partner) => partner.logo?.asset?.url,
	)
	const contactTitle =
		localizedRichText(contact.contactTitle, language) ?? t('contact')
	const partnersTitle =
		localizedRichText(contact.partnersTitle, language) ?? t('partners')
	const mobileSections = [
		{ value: 'contact', title: contactTitle, rotation: -3, delay: 0.15 },
		{ value: 'partners', title: partnersTitle, rotation: 3, delay: 0.24 },
		{ value: 'credits', title: t('credits'), rotation: -2, delay: 0.31 },
	]

	return (
		<div
			key={contact._id}
			className="no-scrollbar relative flex h-full w-full flex-col gap-2 px-4 pb-24 pt-2 text-primary lg:my-1 lg:grid lg:h-[calc(100svh-10px)] lg:grid-rows-[auto_auto_minmax(16rem,1fr)] lg:gap-1 lg:overflow-hidden lg:p-0"
		>
			<section className="theme-main-content-surface lg:shadowtest relative z-10 rounded-xl [container-type:inline-size] lg:min-h-0 lg:overflow-y-auto lg:bg-dark">
				<Accordion
					type="single"
					collapsible={isDesktop}
					value={activeSection}
					orientation={isDesktop ? 'horizontal' : 'vertical'}
					className="flex flex-col px-4 pb-4 pt-0 lg:flex-row lg:flex-wrap lg:items-start lg:justify-center lg:gap-x-0 lg:gap-y-[min(1.5rem,1.67cqw)] lg:px-8 lg:pt-[clamp(2.25rem,4.78cqw,5rem)] lg:[&:not(:has([data-state=open]))]:pb-[clamp(2.25rem,4.78cqw,5rem)] lg:[&>div>[role=region]]:order-1 lg:[&>div>[role=region]]:basis-full"
					onValueChange={selectSection}
				>
					<MobileSectionMenu
						id="about-mobile-menu"
						sections={mobileSections}
						value={activeSection}
						onValueChange={selectSection}
						panelIdPrefix="about-panel"
					/>
					<AccordionItem
						value={`contact`}
						key={`contact`}
						className="flex min-w-0 flex-col items-center justify-start lg:contents"
					>
						<AccordionTrigger
							wrapperClassName="hidden lg:block"
							aria-controls="about-panel-contact"
							className={`-rotate-3 ${EDITORIAL_DESKTOP_TAB_STYLE}`}
						>
							<RichText value={contactTitle} inline allowLinks={false} />
						</AccordionTrigger>
						<AccordionContent id="about-panel-contact" className="w-full">
							<div
								className={`mx-auto flex max-w-lg flex-col items-center px-4 pt-4 text-center lg:py-8 ${EDITORIAL_BODY_TEXT}`}
							>
								{address && (
									<RichText
										value={address}
										className="max-lg:[&>:last-child]:mb-0"
									/>
								)}
							</div>
							<SocialLinks
								social={social}
								className="mb-2 mt-2 w-full flex-nowrap justify-between lg:hidden"
								linkClassName="flex aspect-square h-9 items-center justify-center text-primary"
								iconClassName="h-5 w-5"
							/>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem
						value={`partners`}
						key={`partners`}
						className="flex min-w-0 flex-col items-center justify-start lg:contents"
					>
						<AccordionTrigger
							wrapperClassName="hidden lg:block"
							aria-controls="about-panel-partners"
							className={`rotate-3 ${EDITORIAL_DESKTOP_TAB_STYLE}`}
						>
							<RichText value={partnersTitle} inline allowLinks={false} />
						</AccordionTrigger>
						<AccordionContent id="about-panel-partners" className="w-full">
							{partners && partners.length > 0 && (
								<ul className="mx-auto grid w-full max-w-2xl grid-cols-2 items-center gap-3 px-4 pt-4 lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none lg:py-8">
									{partners.map((partner, index) => {
										const image = partner.logo?.asset
										if (!image?.url) return null

										const logo = (
											<PartnerLogo asset={image} name={partner.name || ''} />
										)

										return (
											<li key={partner._key ?? partner.name ?? index}>
												{partner.url ? (
													<a
														href={partner.url}
														target="_blank"
														rel="noopener noreferrer"
														aria-label={partner.name || t('partners')}
														className="block rounded-md p-2 transition-transform hover:scale-105"
													>
														{logo}
													</a>
												) : (
													<div className="rounded-md p-2">{logo}</div>
												)}
											</li>
										)
									})}
								</ul>
							)}
						</AccordionContent>
					</AccordionItem>
					<AccordionItem
						value="credits"
						className="flex min-w-0 flex-col items-center justify-start lg:contents"
					>
						<AccordionTrigger
							wrapperClassName="hidden lg:block"
							aria-controls="about-panel-credits"
							className={`-rotate-2 ${EDITORIAL_DESKTOP_TAB_STYLE}`}
						>
							{t('credits')}
						</AccordionTrigger>
						<AccordionContent id="about-panel-credits" className="w-full">
							<div
								className={`mx-auto max-w-2xl px-4 pt-4 text-center lg:py-8 ${EDITORIAL_BODY_TEXT}`}
							>
								<RichText
									value={localizedRichText(contact.credits, language)}
									components={{
										marks: {
											systemDLogo: ({ children }) => <>{children}</>,
										},
									}}
								/>
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</section>

			<footer className="theme-main-content-surface rounded-xl bg-dark px-4 py-2 text-center text-xs leading-relaxed tracking-tight lg:text-sm">
				<p>{t('copyright', { year: copyrightYear })}</p>
			</footer>

			<section className="theme-contact-map-card relative z-10 min-h-[18rem] overflow-hidden rounded-[2rem] bg-grayDark text-dark shadow-inner lg:min-h-0 lg:rounded-xl">
				<BrusselsMap
					className="block h-full min-h-[18rem] w-full text-dark lg:min-h-0"
					pinLink={contact.mapLocation}
				/>
			</section>
		</div>
	)
}

export default ContactContent
