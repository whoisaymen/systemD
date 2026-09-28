'use client'

import { useEffect, useState } from 'react'

export default function Scheduler({
	start,
	end,
	children,
}: Partial<{
	start: string
	end: string
	children: React.ReactNode
}>) {
	const [now, setNow] = useState(() => Date.now())

	useEffect(() => {
		if (!start && !end) return

		setNow(Date.now())
		const interval = setInterval(() => setNow(Date.now()), 1000)
		return () => clearInterval(interval)
	}, [start, end])

	const isActive =
		(!start || new Date(start).getTime() < now) &&
		(!end || new Date(end).getTime() > now)

	if (!isActive) return null

	return children
}
