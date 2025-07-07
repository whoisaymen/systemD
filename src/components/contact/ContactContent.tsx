'use client'
import Image from 'next/image'
import LogoShortTsx from '../svgs/LogoShort'
import LogoShortAnimated from '../svgs/LogoShortAnimated'
import BrusselsMap from '../fabrique/BrusselsMap'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'

interface ContactContentProps {
	contact: any
	language: string
}

const ContactContent: React.FC<ContactContentProps> = ({
	contact,
	language,
}) => {
	const getLocalizedValue = (array: any[], lang: string) => {
		if (!Array.isArray(array)) {
			return ''
		}
		const item = array.find((entry) => entry._key === lang)
		return item ? item.value : ''
	}

	if (!contact) {
		return <div>No content available</div>
	}

	return (
		<div className="h-full w-full px-4 pb-24 pt-6 text-primary">
			<BrusselsMap
				className="w-full rounded-[3rem] border-[3px] border-primary bg-grayDark fill-current text-dark lg:w-1/2"
				pinLink={contact.mapLocation}
				pinLeft="38%"
				pinTop="48%"
			/>
			<Accordion
				type="single"
				collapsible
				className="mt-8"
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
					<AccordionTrigger className={`-rotate-6 sm:text-7xl`}>
						Contact
					</AccordionTrigger>
					<AccordionContent>
						<div className="py-8 text-center">
							<p>{contact.formEmail}</p>
							<p>{contact.phone}</p>
							<p>{getLocalizedValue(contact.address, language)}</p>
							{contact.mapLocation && (
								<p>
									<a
										href={contact.mapLocation}
										target="_blank"
										rel="noopener noreferrer"
									>
										View on Google Maps
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
					<AccordionTrigger className={`-rotate-0 sm:text-7xl`}>
						Partners
					</AccordionTrigger>
					<AccordionContent>
						{contact.partners && contact.partners.length > 0 && (
							<div className="flex justify-between gap-4 px-4 pb-16">
								{contact.partners.map((partner: any, index: number) => (
									<div key={index} className="my-4">
										{partner.logo && (
											<Image
												width={150}
												height={150}
												loading="lazy"
												src={partner.logo.asset.url}
												alt={partner.name}
												className="h-8 w-auto object-contain"
											/>
										)}
									</div>
								))}
							</div>
						)}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	)
}

export default ContactContent
