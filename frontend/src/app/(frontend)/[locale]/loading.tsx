'use client'

import { usePathname } from 'next/navigation'
import PageSkeleton, { skeletonPageForPath } from '@/components/loading/PageSkeleton'

export default function Loading() {
	const pathname = usePathname()
	return <PageSkeleton page={skeletonPageForPath(pathname)} />
}
