import { useState } from 'react'

interface HoverableItemProps {
	children: React.ReactNode | ((isHovered: boolean) => React.ReactNode)
}

export default function HoverableItem({ children }: HoverableItemProps) {
	const [isHovered, setIsHovered] = useState(false)

	return (
		<div
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className="group"
		>
			{typeof children === 'function' ? children(isHovered) : children}
		</div>
	)
}
