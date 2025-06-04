import Image from 'next/image'
import LogoShortTsx from '../svgs/LogoShort'
import LogoShortAnimated from '../svgs/LogoShortAnimated'

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
		<div className="h-full w-full pt-6 text-primary">
			<div className="flex items-center justify-center">
				<LogoShortTsx
					className={`mr-[0.10rem] inline-block h-auto w-[90vw] -rotate-6 rounded-md bg-primary px-2 py-1 text-dark sm:w-[15rem]`}
				/>
			</div>

			<div className="mt-16 px-4">
				<h1 className="text-3xl font-bold">Contact</h1>
				<p>Email: {contact.formEmail}</p>
				<p>Phone: {contact.phone}</p>
				<p>Address: {getLocalizedValue(contact.address, language)}</p>
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

			{contact.partners && contact.partners.length > 0 && (
				<div className="mt-16 px-4">
					<h2 className="text-2xl font-semibold">Partners</h2>
					<div className="grid grid-cols-4 gap-8">
						{contact.partners.map((partner: any, index: number) => (
							<div key={index} className="my-4">
								{partner.logo && (
									<Image
										width={150}
										height={150}
										loading="lazy"
										src={partner.logo.asset.url}
										alt={partner.name}
										className="my-4 h-32 w-auto object-contain"
									/>
								)}
								{/* <p>{partner.name}</p>
								{partner.url && (
									<p>
										<a
											href={partner.url}
											target="_blank"
											rel="noopener noreferrer"
										>
											{partner.url}
										</a>
									</p>
								)} */}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export default ContactContent
