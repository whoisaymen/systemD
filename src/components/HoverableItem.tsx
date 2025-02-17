import { useState } from 'react'

interface HoverableItemProps {
	children: React.ReactNode | ((isHovered: boolean) => React.ReactNode)
	className?: string
}

export default function HoverableItem({
	children,
	className,
}: HoverableItemProps) {
	const [isHovered, setIsHovered] = useState(false)

	return (
		<div
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className={className}
		>
			{typeof children === 'function' ? children(isHovered) : children}
		</div>
	)
}
