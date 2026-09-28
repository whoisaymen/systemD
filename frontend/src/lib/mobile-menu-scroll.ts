// Keep background gestures inside the menu without freezing the document that
// Safari uses to composite its browser bars.
export function containMobileMenuScroll(menu: HTMLElement) {
	const document = menu.ownerDocument
	let previousTouchY: number | null = null

	const shouldBlock = (target: EventTarget | null, deltaY: number) => {
		if (menu.clientHeight === 0) return false
		if (!target || !menu.contains(target as Node)) return true
		if (deltaY < 0) return menu.scrollTop <= 0
		if (deltaY > 0) {
			return menu.scrollTop + menu.clientHeight >= menu.scrollHeight - 1
		}
		return false
	}

	const onTouchStart = (event: TouchEvent) => {
		previousTouchY =
			event.touches.length === 1 ? event.touches[0].clientY : null
	}
	const onTouchMove = (event: TouchEvent) => {
		// Preserve pinch-to-zoom.
		if (event.touches.length !== 1 || previousTouchY === null) return
		const currentY = event.touches[0].clientY
		const deltaY = previousTouchY - currentY
		previousTouchY = currentY
		if (event.cancelable && shouldBlock(event.target, deltaY))
			event.preventDefault()
	}
	const onWheel = (event: WheelEvent) => {
		if (
			event.cancelable &&
			!event.ctrlKey &&
			shouldBlock(event.target, event.deltaY)
		) {
			event.preventDefault()
		}
	}

	document.addEventListener('touchstart', onTouchStart, { passive: true })
	document.addEventListener('touchmove', onTouchMove, { passive: false })
	document.addEventListener('wheel', onWheel, { passive: false })
	return () => {
		document.removeEventListener('touchstart', onTouchStart)
		document.removeEventListener('touchmove', onTouchMove)
		document.removeEventListener('wheel', onWheel)
	}
}
