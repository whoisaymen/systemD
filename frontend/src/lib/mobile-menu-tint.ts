import { syncBrowserThemeColor } from './theme'

export function mountMobileMenuTint(root: HTMLElement) {
	const document = root.ownerDocument
	// These must be real fixed elements outside the animated menu. Safari skips
	// absolute children and can cache the tint of the menu's composited layer.
	const edges = (['top', 'bottom'] as const).map((edge) => {
		const element = document.createElement('div')
		element.dataset.mobileBrowserTint = edge
		element.setAttribute('aria-hidden', 'true')
		element.className = 'lg:hidden'
		Object.assign(element.style, {
			position: 'fixed',
			left: '0',
			right: '0',
			[edge]: '0',
			height: `max(12px, env(safe-area-inset-${edge}, 0px))`,
			zIndex: '60',
			pointerEvents: 'none',
		})
		document.body.appendChild(element)
		return element
	})
	const refresh = () => {
		const color =
			root.style.getPropertyValue('--color-dark').trim() ||
			document.defaultView
				?.getComputedStyle(root)
				.getPropertyValue('--color-dark')
				.trim()
		if (color) syncBrowserThemeColor(color, root)
	}
	refresh()

	return () => {
		for (const edge of edges) edge.remove()
		// Restore sampling of the page after the menu's exit animation finishes.
		refresh()
	}
}
