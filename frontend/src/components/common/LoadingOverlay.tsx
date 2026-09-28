'use client'

import { AnimatePresence } from 'motion/react'
import PageSkeleton from '@/components/loading/PageSkeleton'

export default function LoadingOverlay({ isVisible }: { isVisible: boolean }) {
	return (
		<AnimatePresence>
			{isVisible && (
				<div className="absolute inset-0 z-[45] flex lg:rounded-xl lg:bg-[var(--section-folder-background,var(--color-dark))]">
					{/* Cover the old film while keeping the mobile filmstrip gutters visible. */}
					<div
						aria-hidden="true"
						className="absolute inset-x-5 inset-y-0 bg-dark lg:hidden"
					/>
					<div className="relative w-full">
						<PageSkeleton page="film" />
					</div>
				</div>
			)}
		</AnimatePresence>
	)
}
