import Link from 'next/link'
import processUrl from '@/lib/processUrl'
import { cn } from '@/lib/utils'
import {
	FaBluesky,
	FaFacebookF,
	FaGithub,
	FaInstagram,
	FaLinkedinIn,
	FaTiktok,
	FaVimeoV,
	FaXTwitter,
	FaYoutube,
} from 'react-icons/fa6'
import { IoIosLink } from 'react-icons/io'

export default function SocialLinks({
	social,
	className,
	linkClassName,
	iconClassName,
}: {
	social?: Sanity.Navigation
	className?: string
	linkClassName?: string
	iconClassName?: string
}) {
	const links = social?.items?.filter(isLinkWithHref) ?? []

	if (!links.length) return null

	return (
		<nav className={cn('flex flex-wrap items-center', className)}>
			{links.map((link, key) => {
				const href = getHref(link)
				const external = link.type === 'external'

				if (!href) return null

				const content = (
					<>
						<Icon
							url={link.external}
							className={iconClassName}
							aria-hidden="true"
						/>
						<span className="sr-only">{link.label}</span>
					</>
				)

				const classNames = cn(linkClassName)

				return external ? (
					<a
						className={classNames}
						href={href}
						key={link._key || key}
						rel="noreferrer"
						target="_blank"
					>
						{content}
					</a>
				) : (
					<Link className={classNames} href={href} key={link._key || key}>
						{content}
					</Link>
				)
			})}
		</nav>
	)
}

function isLinkWithHref(
	item: Sanity.Link | Sanity.LinkList,
): item is Sanity.Link {
	return item._type === 'link' && Boolean(getHref(item))
}

function getHref(link: Sanity.Link) {
	if (link.type === 'external') return link.external

	if (link.type === 'internal' && link.internal) {
		return processUrl(link.internal, {
			base: false,
			params: link.params,
		})
	}
}

function Icon({
	url,
	...props
}: { url?: string } & React.ComponentProps<'svg'>) {
	if (!url) return <IoIosLink {...props} />

	return url.includes('bsky.app') ? (
		<FaBluesky {...props} />
	) : url.includes('facebook.com') ? (
		<FaFacebookF {...props} />
	) : url.includes('github.com') ? (
		<FaGithub {...props} />
	) : url.includes('instagram.com') ? (
		<FaInstagram {...props} />
	) : url.includes('linkedin.com') ? (
		<FaLinkedinIn {...props} />
	) : url.includes('tiktok.com') ? (
		<FaTiktok {...props} />
	) : url.includes('twitter.com') || url.includes('x.com') ? (
		<FaXTwitter {...props} />
	) : url.includes('vimeo.com') ? (
		<FaVimeoV {...props} />
	) : url.includes('youtube.com') || url.includes('youtu.be') ? (
		<FaYoutube {...props} />
	) : (
		<IoIosLink {...props} />
	)
}
