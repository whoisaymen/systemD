'use client'

import Image from 'next/image'
import RichText from '@/components/common/RichText'
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
		asset?: {
			url?: string
			metadata?: {
				dimensions?: {
					width?: number
					height?: number
				}
				lqip?: string
			}
		}
	}
}

type Contact = {
	_id?: string
	formEmail?: string
	address?: LocalizedValue[]
	contactTitle?: LocalizedValue[]
	partnersTitle?: LocalizedValue[]
	mapLinkLabel?: LocalizedValue[]
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

	if (!contact) {
		return <div>{t('noContent')}</div>
	}

	const address = localizedRichText(contact.address, language)
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
			<section className="theme-main-content-surface lg:shadowtest relative z-10 rounded-xl lg:min-h-0 lg:overflow-y-auto lg:bg-dark">
				<Accordion
					type="multiple"
					defaultValue={['contact', 'partners']}
					className="grid grid-cols-1 gap-8 px-4 pb-8 pt-24 sm:grid-cols-2 lg:gap-4 lg:px-8 lg:pb-12 lg:pt-24"
					onValueChange={() => {
						const navbar = document.getElementById('navbar-mobile')
						if (navbar) {
							navbar.scrollIntoView({ behavior: 'smooth', block: 'start' })
						}
					}}
				>
					<AccordionItem
						value={`contact`}
						key={`contact`}
						className="flex min-w-0 flex-col items-center justify-start"
					>
						<AccordionTrigger className={`-rotate-6 lg:text-5xl`}>
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
							<div className="mx-auto flex max-w-lg flex-col items-center gap-2 px-4 py-8 text-center text-base font-medium leading-tight lg:text-xl">
								{contact.formEmail && emailHref && (
									<a href={emailHref} className="hover:underline">
										{contact.formEmail}
									</a>
								)}
								{contact.phone && phoneHref && (
									<a href={phoneHref} className="hover:underline">
										{contact.phone}
									</a>
								)}
								{address && <RichText value={address} />}
								{contact.mapLocation && (
									<p>
										<a
											href={contact.mapLocation}
											target="_blank"
											rel="noopener noreferrer"
											className="hover:underline"
										>
											<RichText
												value={
													localizedRichText(contact.mapLinkLabel, language) ??
													t('viewOnMap')
												}
												inline
												allowLinks={false}
											/>
										</a>
									</p>
								)}
							</div>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem
						value={`partners`}
						key={`partners`}
						className="flex min-w-0 flex-col items-center justify-start"
					>
						<AccordionTrigger className={`-rotate-0 lg:text-5xl`}>
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
											<Image
												width={image.metadata?.dimensions?.width ?? 180}
												height={image.metadata?.dimensions?.height ?? 90}
												loading="lazy"
												src={image.url}
												alt={partner.name || ''}
												className="mx-auto h-10 w-auto max-w-full object-contain lg:h-12"
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
				</Accordion>
			</section>

			<section className="theme-contact-map-card relative z-10 min-h-[18rem] overflow-hidden rounded-[2rem] bg-grayDark text-dark shadow-inner lg:min-h-0 lg:rounded-xl">
				<BrusselsMap
					className="block h-full min-h-[18rem] w-full text-dark lg:min-h-0"
					pinLink={contact.mapLocation}
					pinLeft="38%"
					pinTop="48%"
				/>
			</section>
		</div>
	)
}

export default ContactContent
