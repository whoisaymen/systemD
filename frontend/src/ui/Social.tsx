import { getSite } from '@/sanity/lib/queries'
import { cn } from '@/lib/utils'
import SocialLinks from './SocialLinks'

export default async function Social({
	className,
}: React.ComponentProps<'div'>) {
	const { social } = await getSite()

	if (!social?.items?.length) return null

	return (
		<SocialLinks
			social={social}
			className={cn(className)}
			linkClassName="px-2 py-1 transition-opacity hover:opacity-70"
		/>
	)
}
