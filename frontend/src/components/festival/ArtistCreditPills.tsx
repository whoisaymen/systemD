import RichText from '@/components/common/RichText'
import { richTextLines } from '@/lib/richTextLines'
import { FILM_LABEL_TEXT } from '../film/filmLabelStyles'
import { photoCreditNameParts, photoCreditRotation } from './photoCreditStyles'

export default function ArtistCreditPills({
	value,
	compact = false,
}: {
	value: unknown
	compact?: boolean
}) {
	return [
		{
			key: 'mobile',
			parts: photoCreditNameParts(value),
			className: 'flex lg:hidden',
		},
		{
			key: 'desktop',
			parts: richTextLines(value, 26),
			className: 'hidden lg:flex',
		},
	].map(({ key, parts, className }) => (
		<span key={key} className={`${className} items-start lg:flex-col`}>
			{parts.map((part, index) => (
				<span
					key={index}
					style={{ rotate: photoCreditRotation(value, index) }}
					className={`relative whitespace-nowrap rounded-md border-2 border-dark bg-grayDark px-1.5 py-0 text-center text-dark ${FILM_LABEL_TEXT} ${compact ? 'max-lg:text-[min(1rem,9cqw)]' : ''} ${index === 0 ? 'z-10' : 'z-0 -ml-0.5 lg:-mt-[0.15rem] lg:ml-0'}`}
				>
					<RichText value={part} inline allowLinks={false} />
				</span>
			))}
		</span>
	))
}
