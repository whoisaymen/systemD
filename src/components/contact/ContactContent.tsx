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
		<div
			className="h-full w-full space-y-20 rounded-md bg-white pt-6"
			style={{
				backgroundColor: contact.backgroundColor?.hex,
				color: contact.textColor?.hex,
			}}
		>
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
			{contact.partners && contact.partners.length > 0 && (
				<div>
					<h2 className="text-2xl font-semibold">Partners</h2>
					{contact.partners.map((partner: any, index: number) => (
						<div key={index} className="my-4">
							{partner.logo && (
								<img
									src={partner.logo.asset.url}
									alt={partner.name}
									className="my-4 h-48 w-48 object-cover"
								/>
							)}
							<p>{partner.name}</p>
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
							)}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default ContactContent
