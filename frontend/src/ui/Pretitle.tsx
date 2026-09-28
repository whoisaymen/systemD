import { cn } from '@/lib/utils'
import { stegaClean } from 'next-sanity'

export default function Pretitle({
	className,
	children,
}: React.ComponentProps<'p'>) {
	if (!children) return null

	return (
		<p className={cn('technical text-accent/70', className)}>
			{typeof children === 'string' ? stegaClean(children) : children}
		</p>
	)
}
