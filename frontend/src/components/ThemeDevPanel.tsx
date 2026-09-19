'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { THEME_CHANGE_EVENT, type ThemeCombo } from '@/lib/theme'

type ThemeDraft = {
	primary: string
	text: string
	dark: string
	content: string
	grayDark: string
	boxEdge: string
}

type ThemeDraftKey = keyof ThemeDraft

const HEX_COLOR = /^#[0-9a-f]{6}$/i

export default function ThemeDevPanel({ theme }: { theme: ThemeCombo }) {
	const { dark, grayDark, primary } = theme
	const defaults = useMemo(
		() => createDefaultDraft({ dark, grayDark, primary }),
		[dark, grayDark, primary],
	)
	const storageKey = `system-d-theme-lab:${theme.key}`
	const [draft, setDraft] = useState<ThemeDraft>(defaults)
	const draftRef = useRef(draft)
	const [isReady, setIsReady] = useState(false)
	const [isActive, setIsActive] = useState(false)
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>(
		'idle',
	)

	useEffect(() => {
		const savedDraft = loadDraft(storageKey, defaults)
		draftRef.current = savedDraft
		setDraft(savedDraft)

		const syncActiveTheme = () => {
			const active = document.documentElement.dataset.theme === theme.key
			setIsActive(active)
			if (active) applyDraft(draftRef.current)
		}

		syncActiveTheme()
		window.addEventListener(THEME_CHANGE_EVENT, syncActiveTheme)
		setIsReady(true)

		return () => {
			window.removeEventListener(THEME_CHANGE_EVENT, syncActiveTheme)
		}
	}, [defaults, storageKey, theme.key])

	useEffect(() => {
		if (!isReady) return

		draftRef.current = draft
		try {
			window.sessionStorage.setItem(storageKey, JSON.stringify(draft))
		} catch {
			// The live editor still works when storage is unavailable.
		}

		if (document.documentElement.dataset.theme === theme.key) applyDraft(draft)
	}, [draft, isActive, isReady, storageKey, theme.key])

	if (!isReady || !isActive) return null

	const updateColor = (key: ThemeDraftKey, value: string) => {
		if (!HEX_COLOR.test(value)) return
		setDraft((current) => ({ ...current, [key]: value.toUpperCase() }))
	}

	const copyValues = async () => {
		try {
			await navigator.clipboard.writeText(
				JSON.stringify({ key: theme.key, ...draft }, null, 2),
			)
			setCopyStatus('copied')
			window.setTimeout(() => setCopyStatus('idle'), 1600)
		} catch {
			setCopyStatus('error')
		}
	}

	if (isCollapsed) {
		return (
			<button
				type="button"
				onClick={() => setIsCollapsed(false)}
				className="fixed bottom-4 right-4 z-[200] rounded-full border border-[#4A4A50] bg-[#171719] px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[#F5F5F5] shadow-2xl"
			>
				Open Noir Lab
			</button>
		)
	}

	return (
		<aside className="fixed bottom-4 right-4 z-[200] flex max-h-[calc(100svh-2rem)] w-[min(23rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[#3F3F46] bg-[#171719] text-[#F5F5F5] shadow-2xl">
			<header className="flex shrink-0 items-start justify-between gap-4 border-b border-[#333338] px-4 py-4">
				<div>
					<p className="mb-1 font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#FF5A94]">
						Development only
					</p>
					<h2 className="text-lg font-bold leading-none">Noir / Néon Lab</h2>
				</div>
				<button
					type="button"
					onClick={() => setIsCollapsed(true)}
					aria-label="Collapse Noir theme lab"
					className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#3F3F46] text-lg leading-none text-[#A1A1AA] transition-colors hover:border-[#71717A] hover:text-white"
				>
					−
				</button>
			</header>

			<div className="space-y-2 overflow-y-auto px-4 py-4">
				<ColorControl
					label="Primary"
					value={draft.primary}
					onChange={(value) => updateColor('primary', value)}
				/>
				<ColorControl
					label="Text"
					value={draft.text}
					onChange={(value) => updateColor('text', value)}
				/>
				<ColorControl
					label="Background"
					value={draft.dark}
					onChange={(value) => updateColor('dark', value)}
				/>
				<ColorControl
					label="Main content"
					value={draft.content}
					onChange={(value) => updateColor('content', value)}
				/>
				<ColorControl
					label="Accent"
					value={draft.grayDark}
					onChange={(value) => updateColor('grayDark', value)}
				/>
				<ColorControl
					label="Box edge"
					value={draft.boxEdge}
					onChange={(value) => updateColor('boxEdge', value)}
				/>
			</div>

			<footer className="grid shrink-0 grid-cols-2 gap-2 border-t border-[#333338] bg-[#171719] p-4">
				<button
					type="button"
					onClick={() => setDraft(defaults)}
					className="rounded-lg border border-[#3F3F46] px-3 py-2.5 text-xs font-bold uppercase tracking-[0.06em] transition-colors hover:border-[#71717A]"
				>
					Reset
				</button>
				<button
					type="button"
					onClick={copyValues}
					className="rounded-lg bg-[#FF4F8B] px-3 py-2.5 text-xs font-bold uppercase tracking-[0.06em] text-[#171719] transition-colors hover:bg-[#FF78A7]"
				>
					{copyStatus === 'copied'
						? 'Copied'
						: copyStatus === 'error'
							? 'Copy failed'
							: 'Copy values'}
				</button>
			</footer>
		</aside>
	)
}

function ColorControl({
	label,
	value,
	onChange,
}: {
	label: string
	value: string
	onChange: (value: string) => void
}) {
	return (
		<label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-[#242426] px-3 py-3 transition-colors hover:bg-[#29292C]">
			<span className="text-sm font-semibold">{label}</span>
			<span className="flex items-center gap-2">
				<code className="text-xs text-[#A1A1AA]">{value}</code>
				<span
					className="h-7 w-9 rounded border border-[#71717A]"
					style={{ backgroundColor: value }}
				/>
				<input
					type="color"
					value={value}
					onChange={(event) => onChange(event.target.value)}
					aria-label={label}
					className="absolute h-px w-px overflow-hidden opacity-0"
				/>
			</span>
		</label>
	)
}

function createDefaultDraft(
	theme: Pick<ThemeCombo, 'dark' | 'grayDark' | 'primary'>,
): ThemeDraft {
	return {
		primary: normalizeColor(theme.primary, '#FF9D4D'),
		text: normalizeColor(theme.primary, '#FF9D4D'),
		dark: normalizeColor(theme.dark, '#253237'),
		content: normalizeColor(theme.dark, '#253237'),
		grayDark: normalizeColor(theme.grayDark, '#7C6E6E'),
		boxEdge: '#1D1D1F',
	}
}

function loadDraft(storageKey: string, fallback: ThemeDraft): ThemeDraft {
	try {
		const saved = window.sessionStorage.getItem(storageKey)
		if (!saved) return fallback
		return migrateDraft(JSON.parse(saved), fallback)
	} catch {
		return fallback
	}
}

function migrateDraft(value: unknown, fallback: ThemeDraft): ThemeDraft {
	if (!isRecord(value)) return fallback

	return {
		primary: firstColor(value.primary, value.highlight, fallback.primary),
		text: firstColor(value.text, value.canvasText, fallback.text),
		dark: firstColor(value.dark, value.canvas, fallback.dark),
		content: firstColor(
			value.content,
			value.contentArea,
			value.dark,
			value.canvas,
			fallback.content,
		),
		grayDark: firstColor(value.grayDark, value.panel, fallback.grayDark),
		boxEdge: firstColor(value.boxEdge, value.frame, fallback.boxEdge),
	}
}

function applyDraft(draft: ThemeDraft) {
	const root = document.documentElement
	setColorVariable(root, 'primary', draft.primary)
	setColorVariable(root, 'dark', draft.dark)
	setColorVariable(root, 'theme-content', draft.content)
	setColorVariable(root, 'grayDark', draft.grayDark)
	root.style.setProperty('--color-theme-text', draft.text)
	root.style.setProperty('--color-theme-box-edge', draft.boxEdge)
}

function setColorVariable(root: HTMLElement, name: string, value: string) {
	root.style.setProperty(`--color-${name}`, value)
	root.style.setProperty(`--color-${name}-rgb`, hexToRgb(value))
}

function hexToRgb(hex: string) {
	const normalized = normalizeColor(hex, '#000000').slice(1)
	return [
		Number.parseInt(normalized.slice(0, 2), 16),
		Number.parseInt(normalized.slice(2, 4), 16),
		Number.parseInt(normalized.slice(4, 6), 16),
	].join(' ')
}

function firstColor(...values: unknown[]) {
	const color = values.find(
		(value): value is string =>
			typeof value === 'string' && HEX_COLOR.test(value),
	)
	return normalizeColor(color, '#000000')
}

function normalizeColor(value: unknown, fallback: string) {
	return typeof value === 'string' && HEX_COLOR.test(value)
		? value.toUpperCase()
		: fallback.toUpperCase()
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null
}
