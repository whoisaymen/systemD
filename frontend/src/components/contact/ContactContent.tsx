'use client'

import Image from 'next/image'
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
	value?: string
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

	const getLocalizedValue = (
		array: LocalizedValue[] | undefined,
		lang: string,
	) => {
		if (!Array.isArray(array)) return ''

		const languages = [lang, 'fr', 'en', 'nl'].filter(
			(item, index, self) => item && self.indexOf(item) === index,
		)
		const item = languages
			.map((currentLanguage) =>
				array.find(
					(entry) =>
						entry.language === currentLanguage ||
						entry._key === currentLanguage,
				),
			)
			.find(Boolean)

		return item?.value ?? ''
	}

	if (!contact) {
		return <div>{t('noContent')}</div>
	}

	const address = getLocalizedValue(contact.address, language)
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
			<section className="lg:shadowtest relative z-10 rounded-xl lg:min-h-0 lg:overflow-y-auto lg:bg-dark">
				<Accordion
					type="single"
					collapsible
					className="py-8 lg:py-12"
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
						className="flex flex-col items-center justify-center"
					>
						<AccordionTrigger className={`-rotate-6 lg:text-5xl`}>
							{t('contact')}
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
								{address && <p>{address}</p>}
								{contact.mapLocation && (
									<p>
										<a
											href={contact.mapLocation}
											target="_blank"
											rel="noopener noreferrer"
											className="hover:underline"
										>
											{t('viewOnMap')}
										</a>
									</p>
								)}
							</div>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem
						value={`partners`}
						key={`partners`}
						className="flex flex-col items-center justify-center"
					>
						<AccordionTrigger className={`-rotate-0 lg:text-5xl`}>
							{t('partners')}
						</AccordionTrigger>
						<AccordionContent className="w-full">
							{partners && partners.length > 0 && (
								<ul className="mx-auto grid w-full max-w-2xl grid-cols-2 items-center gap-6 px-6 py-8 sm:grid-cols-3 lg:grid-cols-4">
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
												className="theme-graded-image mx-auto h-10 w-auto max-w-full object-contain lg:h-12"
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

			<section className="relative z-10 min-h-[18rem] overflow-hidden rounded-[2rem] bg-grayDark text-dark shadow-inner lg:min-h-0 lg:rounded-xl">
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
