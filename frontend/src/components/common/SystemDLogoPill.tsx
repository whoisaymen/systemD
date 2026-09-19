'use client'

import { motion } from 'motion/react'
import LogoShort from '@/components/svgs/LogoShort'

export default function SystemDLogoPill() {
	return (
		<motion.span
			role="img"
			aria-label="System D"
			data-system-d-logo
			className="relative mx-[0.06em] inline-block align-[-0.08em] leading-none"
			initial={{ rotate: -3 }}
			animate={{ rotate: 3 }}
			transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: [0.76, 0, 0.24, 1] }}
		>
			<LogoShort className="box-content inline-block h-[0.72em] w-auto rounded-[0.12em] bg-primary px-[0.16em] py-[0.07em] text-dark" />
		</motion.span>
	)
}
