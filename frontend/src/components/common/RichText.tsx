import { Fragment } from 'react'
import SystemDLogoPill from './SystemDLogoPill'
import { markSystemDLogos } from '@/lib/systemDLogo'
import { richTextTileSeed, richTextWordTiles } from '@/lib/richTextLines'
import {
	PortableText,
	type PortableTextComponents,
	type PortableTextBlock,
	type PortableTextComponentProps,
} from 'next-sanity'
import { richTextBlockAlignment, safeRichTextHref, textToRichText } from '@/lib/richText'

type Props = {
	value: any
	className?: string
	inline?: boolean
	allowLinks?: boolean
	components?: Partial<PortableTextComponents>
}

const labelTilts = [
	'-rotate-3 translate-y-px',
	'rotate-6 translate-y-0.5',
	'-rotate-6 -translate-y-px',
	'rotate-2',
	'-rotate-2 translate-y-0.5',
	'rotate-3 -translate-y-px',
]

type TextBlockProps = PortableTextComponentProps<PortableTextBlock>

const ParagraphBlock = ({ children, value }: TextBlockProps) => (
	<p
		className="mb-4 whitespace-pre-line last:mb-0"
		style={{ textAlign: richTextBlockAlignment(value) }}
	>
		{children}
	</p>
)

const Heading2Block = ({ children, value }: TextBlockProps) => (
	<h2
		className="mb-3 mt-6 text-[1.4em] font-bold leading-tight first:mt-0"
		style={{ textAlign: richTextBlockAlignment(value) }}
	>
		{children}
	</h2>
)

const Heading3Block = ({ children, value }: TextBlockProps) => (
	<h3
		className="mb-3 mt-5 text-[1.2em] font-bold leading-tight first:mt-0"
		style={{ textAlign: richTextBlockAlignment(value) }}
	>
		{children}
	</h3>
)

const QuoteBlock = ({ children, value }: TextBlockProps) => (
	<blockquote
		className="my-4 border-l-2 border-current pl-4 italic"
		style={{ textAlign: richTextBlockAlignment(value) }}
	>
		{children}
	</blockquote>
)

/** One rendering contract for localized editorial copy, including legacy strings. */
export default function RichText({
	value,
	className,
	inline = false,
	allowLinks = true,
	components,
}: Props) {
	const blocks = markSystemDLogos(textToRichText(value?.value ?? value))
	if (!blocks.length) return null
	const shared: Partial<PortableTextComponents> = {
		block: inline
			? ({
					children,
					index,
				}: PortableTextComponentProps<PortableTextBlock>) => (
					<>
						{index > 0 && <br />}
						{children}
					</>
				)
			: {
					titleLabel: ({ value }) => {
						const tiltOffset = (richTextTileSeed([value]) >>> 16) % labelTilts.length
						return (
							<h3 className="mb-2 flex w-full justify-center pt-2 text-[min(1rem,4cqw)] font-medium lg:mb-[0.89em] lg:pt-[0.45em] lg:text-lg">
								{richTextWordTiles([value]).map((tile, index) => (
									<Fragment key={index}>
										{index > 0 && ' '}
										<span
											className={`relative -ml-[0.25em] inline-block shrink-0 whitespace-nowrap rounded-md border-2 border-dark bg-primary px-[0.3em] py-0 text-center text-[length:inherit] font-medium leading-[1.2] tracking-tight text-dark first:ml-0 ${labelTilts[(index + tiltOffset) % labelTilts.length]}`}
										>
											<RichText
												value={tile}
												inline
												allowLinks={allowLinks}
												components={{ marks: components?.marks }}
											/>
										</span>
									</Fragment>
								))}
							</h3>
						)
					},
					normal: ParagraphBlock,
					normalCenter: ParagraphBlock,
					h1: ({ children, value }) => (
						<h1
							className="mb-4 text-[1.6em] font-bold leading-tight"
							style={{ textAlign: richTextBlockAlignment(value) }}
						>
							{children}
						</h1>
					),
					h2: Heading2Block,
					h2Center: Heading2Block,
					h3: Heading3Block,
					h3Center: Heading3Block,
					h4: ({ children, value }) => (
						<h4 className="mb-3 font-bold" style={{ textAlign: richTextBlockAlignment(value) }}>
							{children}
						</h4>
					),
					blockquote: QuoteBlock,
					blockquoteCenter: QuoteBlock,
				},
		list: inline
			? ({ children }) => <>{children}</>
			: {
					bullet: ({ children }) => (
						<ul className="mb-4 list-disc space-y-1 pl-6">{children}</ul>
					),
					number: ({ children }) => (
						<ol className="mb-4 list-decimal space-y-1 pl-6">{children}</ol>
					),
				},
		listItem: inline
			? ({ children, index }) => (
					<>
						{index > 0 && <br />}
						{children}
					</>
				)
			: ({ children, value }) => (
					<li style={{ textAlign: richTextBlockAlignment(value) }}>{children}</li>
				),
		marks: {
			alignCenter: ({ children }) => <>{children}</>,
			systemDLogo: () => <SystemDLogoPill />,
			strong: ({ children }) => (
				<strong className="font-bold">{children}</strong>
			),
			em: ({ children }) => <em className="italic">{children}</em>,
			underline: ({ children }) => (
				<span className="underline">{children}</span>
			),
			'strike-through': ({ children }) => <s>{children}</s>,
			link: ({ children, value }) => {
				const href = safeRichTextHref(value?.href)
				if (!allowLinks || !href) return <>{children}</>
				return (
					<a
						href={href}
						className="underline underline-offset-4 hover:opacity-75"
						target={value?.blank ? '_blank' : undefined}
						rel={value?.blank ? 'noopener noreferrer' : undefined}
					>
						{children}
					</a>
				)
			},
			...components?.marks,
		},
	}
	const content = (
		<PortableText
			value={blocks}
			components={{ ...shared, ...components, marks: shared.marks }}
		/>
	)
	return inline ? (
		<span className={className}>{content}</span>
	) : (
		<div className={className}>{content}</div>
	)
}

export { RichText }
