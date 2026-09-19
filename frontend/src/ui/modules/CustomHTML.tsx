'use client'

import moduleProps from '@/lib/moduleProps'
import { stegaClean } from 'next-sanity'
import { useEffect, useRef } from 'react'

export default function CustomHTML({
	className,
	html,
	...props
}: Partial<
	{
		className: string
		html: {
			code: string
		}
	} & Sanity.Module
>) {
	const ref = useRef<HTMLElement>(null)
	const renderedCode = useRef<string | null>(null)
	const code = stegaClean(html?.code ?? '')
	const containsScripts = /<script[\s>]/i.test(code)

	useEffect(() => {
		const element = ref.current
		if (!containsScripts || !element) {
			renderedCode.current = null
			return
		}

		// Execute each version once, including when Strict Mode replays effects.
		if (renderedCode.current === code) return
		const range = document.createRange()
		range.selectNodeContents(element)
		element.replaceChildren(range.createContextualFragment(code))
		renderedCode.current = code
	}, [code, containsScripts])

	if (!code) return null

	return (
		<section
			ref={ref}
			className={stegaClean(className)}
			dangerouslySetInnerHTML={containsScripts ? undefined : { __html: code }}
			{...moduleProps(props)}
		/>
	)
}
