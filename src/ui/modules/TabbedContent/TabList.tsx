'use client'

import { tabbedContentStore } from './store'
import TabbedContent from '.'
import { cn } from '@/lib/utils'

export default function TabList({
	tabs,
}: React.ComponentProps<typeof TabbedContent>) {
	const { active, setActive } = tabbedContentStore()

	return (
		<nav className="max-md:full-bleed no-scrollbar flex overflow-x-auto">
			{tabs?.map((tab, key) => (
				<button
					className={cn(
						'shrink-0 grow basis-[min(150px,80vw)] rounded-t border-b p-2 transition-all',
						key === active
							? 'border-b-2 border-accent'
							: 'text-ink/50 hover:text-ink',
					)}
					key={key}
					onClick={() => setActive(key)}
				>
					{tab.label}
				</button>
			))}
		</nav>
	)
}
