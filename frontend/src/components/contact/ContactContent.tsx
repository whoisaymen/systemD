'use client'

import { useEffect, useState } from 'react'
import PartnerLogo, { type PartnerLogoAsset } from './PartnerLogo'
import RichText from '@/components/common/RichText'
import {
	EDITORIAL_BODY_TEXT,
	EDITORIAL_DESKTOP_TAB_STYLE,
} from '@/components/common/editorialStyles'
import { localizedRichText } from '@/lib/richText'
import { useTranslations } from 'next-intl'
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
	formEmail?: string
	address?: LocalizedValue[]
	contactTitle?: LocalizedValue[]
	partnersTitle?: LocalizedValue[]
	credits?: LocalizedValue[]
	mapLocation?: string
	phone?: string
	partners?: ContactPartner[]
}

interface ContactContentProps {
	contact: Contact | null
	language: string
}

const ContactContent: React.FC<ContactContentProps> = ({
	contact,
	language,
}) => {
	const t = useTranslations('contactPage')
	const [isDesktop, setIsDesktop] = useState(false)

	useEffect(() => {
		const desktop = window.matchMedia('(min-width: 1024px)')
		const updateLayout = () => setIsDesktop(desktop.matches)
		updateLayout()
		desktop.addEventListener('change', updateLayout)
		return () => desktop.removeEventListener('change', updateLayout)
	}, [])

	if (!contact) {
		return <div>{t('noContent')}</div>
	}

	const address = localizedRichText(contact.address, language)
		?? localizedRichText(contact.address, 'fr')
	const emailHref = contact.formEmail
		? `mailto:${contact.formEmail}`
		: undefined
	const phoneHref = contact.phone
		? `tel:${contact.phone.replace(/[^\d+]/g, '')}`
		: undefined
	const partners = contact.partners?.filter(
		(partner) => partner.logo?.asset?.url,
	)

	return (
		<div
			key={contact._id}
			className="no-scrollbar relative flex h-full w-full flex-col gap-2 px-4 pb-24 pt-6 text-primary lg:my-1 lg:grid lg:h-[calc(100svh-10px)] lg:grid-rows-[auto_minmax(16rem,1fr)] lg:gap-1 lg:overflow-hidden lg:p-0"
		>
			<section className="theme-main-content-surface lg:shadowtest relative z-10 rounded-xl [container-type:inline-size] lg:min-h-0 lg:overflow-y-auto lg:bg-dark">
				<Accordion
					type="single"
					collapsible
					defaultValue="contact"
					orientation={isDesktop ? 'horizontal' : 'vertical'}
					className="flex flex-col gap-8 px-4 pb-4 pt-8 lg:flex-row lg:flex-wrap lg:items-start lg:justify-center lg:gap-x-0 lg:gap-y-[min(1.5rem,1.67cqw)] lg:px-8 lg:pt-[clamp(2.25rem,4.78cqw,5rem)] lg:[&:not(:has([data-state=open]))]:pb-[clamp(2.25rem,4.78cqw,5rem)] lg:[&>div>[role=region]]:order-1 lg:[&>div>[role=region]]:basis-full"
					onValueChange={() => {
						if (isDesktop) return
						const navbar = document.getElementById('navbar-mobile')
						if (navbar) {
							navbar.scrollIntoView({ behavior: 'smooth', block: 'start' })
						}
					}}
				>
					<AccordionItem
						value={`contact`}
						key={`contact`}
						className="flex min-w-0 flex-col items-center justify-start lg:contents"
					>
						<AccordionTrigger
							className={`-rotate-3 text-3xl ${EDITORIAL_DESKTOP_TAB_STYLE}`}
						>
							<RichText
								value={
									localizedRichText(contact.contactTitle, language) ??
									t('contact')
								}
								inline
								allowLinks={false}
							/>
						</AccordionTrigger>
						<AccordionContent className="w-full">
							<div
								className={`mx-auto flex max-w-lg flex-col items-center px-4 py-8 text-center ${EDITORIAL_BODY_TEXT}`}
							>
								{address && <RichText value={address} />}
								{contact.phone && phoneHref && (
									<a href={phoneHref} className="hover:underline">
										{contact.phone}
									</a>
								)}
								{contact.formEmail && emailHref && (
									<a href={emailHref} className="hover:underline">
										{contact.formEmail}
									</a>
								)}
							</div>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem
						value={`partners`}
						key={`partners`}
						className="flex min-w-0 flex-col items-center justify-start lg:contents"
					>
						<AccordionTrigger
							className={`rotate-3 text-3xl ${EDITORIAL_DESKTOP_TAB_STYLE}`}
						>
							<RichText
								value={
									localizedRichText(contact.partnersTitle, language) ??
									t('partners')
								}
								inline
								allowLinks={false}
							/>
						</AccordionTrigger>
						<AccordionContent className="w-full">
							{partners && partners.length > 0 && (
								<ul className="mx-auto grid w-full max-w-2xl auto-cols-fr grid-flow-col items-center gap-3 px-4 py-8">
									{partners.map((partner, index) => {
										const image = partner.logo?.asset
										if (!image?.url) return null

										const logo = (
											<PartnerLogo
												asset={image}
												name={partner.name || ''}
											/>
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
							className={`-rotate-2 text-3xl ${EDITORIAL_DESKTOP_TAB_STYLE}`}
						>
							{t('credits')}
						</AccordionTrigger>
						<AccordionContent className="w-full">
							<div className={`mx-auto max-w-2xl px-4 py-8 text-center ${EDITORIAL_BODY_TEXT}`}>
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
