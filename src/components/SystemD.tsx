'use client'
import { motion, AnimatePresence } from 'motion/react'
import { LogoShort } from './svgs'
import { Link } from 'next-view-transitions'
import BigBangContent from './bigbang/BigBangContent'
import EquipeContent from './equipe/EquipeContent'
import FabriqueContent from './fabrique/FabriqueContent'

export default function SystemD({
	tab,
	content,
	locale,
}: {
	tab: string
	content: any
	locale: string
}) {
	console.log('SystemD', locale)
	return (
		<div className="min-h-screen w-full bg-[#DADADA] py-1">
			<AnimatePresence>
				<motion.div
					className="relative z-10 h-full max-w-[calc(100vw-33.5rem)] rounded-md bg-[#F1F1F1]"
					initial={{ x: '-100%' }}
					animate={{ x: '16.25rem' }}
					exit={{ x: '-100%' }}
					transition={{ duration: 0.6, ease: 'easeInOut', type: 'spring' }}
				>
					<div className="h-full w-full rounded-md p-4">
						<div>
							{tab === 'bigbang' ? (
								<BigBangContent
									locale={locale}
									shortStory={content.shortStory}
									longStory={content.longStory}
								/>
							) : tab === 'equipe' ? (
								<EquipeContent person={content.person} language="en" />
							) : tab === 'fabrique' ? (
								<FabriqueContent fabrique={content.fabrique} language="en" />
							) : (
								<pre>{JSON.stringify(content, null, 2)}</pre>
							)}
						</div>
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	)
}
