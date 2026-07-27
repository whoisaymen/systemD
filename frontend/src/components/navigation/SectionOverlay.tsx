'use client'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'

interface SectionOverlayProps {
	locale: string
}

const SectionOverlay: React.FC<SectionOverlayProps> = ({ locale }) => {
	const pathname = usePathname()

	// Check if we're on a section page
	const isSection =
		/^\/(en|fr)\/(festival|bigbang|memoire|fabrique|equipe)/.test(pathname)

	// Extract the active section from the path
	const activeSection = isSection ? pathname.split('/')[2] : null

	return (
		<AnimatePresence>
			{isSection && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					className="pointer-events-none fixed inset-0 z-20 bg-black/40 backdrop-blur-sm"
					aria-hidden="true"
				/>
			)}
		</AnimatePresence>
	)
}

export default SectionOverlay
