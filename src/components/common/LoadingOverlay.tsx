'use client'

import { motion, AnimatePresence } from 'motion/react'

export default function LoadingOverlay({ isVisible }: { isVisible: boolean }) {
	return (
		<AnimatePresence>
			{isVisible && (
				<div className="flex min-h-screen items-start justify-center p-6">
					<div className="w-full max-w-5xl">
						<div className="animate-pulse">
							{/* poster skeleton */}
							<div className="h-[28rem] w-full rounded-lg bg-gray-700" />
							{/* meta skeleton */}
							<div className="mt-6 space-y-3">
								<div className="h-8 w-1/3 rounded bg-gray-600" />
								<div className="h-4 w-2/3 rounded bg-gray-600" />
								<div className="h-4 w-1/2 rounded bg-gray-600" />
							</div>
						</div>
					</div>
				</div>
			)}
		</AnimatePresence>
	)
}
