'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

const StoryBlock = ({
	block,
	lang,
	containerEl,
}: {
	block: any
	lang: string
	containerEl: React.RefObject<HTMLElement | null>
}) => {
	const ref = useRef<HTMLDivElement>(null)

	const { scrollYProgress } = useScroll({
		target: ref,
		container: containerEl ?? undefined,
		offset: ['start 80%', 'end 20%'], // adjust threshold as needed
	})

	const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1])
	const rotate = useTransform(scrollYProgress, [0, 1], [-5, 5])

	return (
		<motion.div
			ref={ref}
			style={{ scale, rotate }}
			className="rounded-lg bg-gray-100 p-6 shadow-md"
		>
			{/* Replace with your PortableText or whatever */}
			<p className="text-dark">{block.content ?? 'Story block...'}</p>
		</motion.div>
	)
}

export default StoryBlock
