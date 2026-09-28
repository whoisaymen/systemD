'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { LocateFixed, Minus, Plus } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import type { Map as MapLibreMap } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import {
	BRUSSELS_MAP_ZOOM,
	BRUSSELS_MAX_ZOOM,
	BRUSSELS_MIN_ZOOM,
	createBrusselsMapStyle,
	PIANOFABRIEK,
} from './brusselsMapStyle'
import styles from './BrusselsMap.module.css'

interface BrusselsMapProps {
	className?: string
	pinLink?: string
}

export default function BrusselsMap({ className, pinLink }: BrusselsMapProps) {
	const t = useTranslations('contactPage.map')
	const language = useLocale()
	const instructionsId = useId()
	const rootRef = useRef<HTMLDivElement>(null)
	const canvasRef = useRef<HTMLDivElement>(null)
	const mapRef = useRef<MapLibreMap | null>(null)
	const [markerHost, setMarkerHost] = useState<HTMLDivElement | null>(null)
	const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
	const [zoom, setZoom] = useState(BRUSSELS_MAP_ZOOM)
	const [attempt, setAttempt] = useState(0)
	const directions =
		pinLink ||
		`https://www.google.com/maps/dir/?api=1&destination=${PIANOFABRIEK[1]},${PIANOFABRIEK[0]}`

	useEffect(() => {
		const container = canvasRef.current
		const root = rootRef.current
		if (!container || !root) return
		let disposed = false
		let map: MapLibreMap | undefined
		let resizeObserver: ResizeObserver | undefined
		let themeObserver: MutationObserver | undefined
		let hasTiles = false
		setStatus('loading')
		setZoom(BRUSSELS_MAP_ZOOM)
		setMarkerHost(null)
		const timeout = window.setTimeout(() => {
			if (!hasTiles && !disposed) setStatus('error')
		}, 15000)

		const readPalette = () => {
			const computed = getComputedStyle(root)
			return { ink: computed.color, paper: computed.backgroundColor }
		}

		async function initialize() {
			try {
				const { Map, Marker, ScaleControl, setWorkerUrl } =
					await import('maplibre-gl')
				if (disposed || !container) return
				setWorkerUrl('/vendor/maplibre/maplibre-gl-worker.mjs')
				map = new Map({
					container,
					style: createBrusselsMapStyle(readPalette(), language),
					center: PIANOFABRIEK,
					zoom: BRUSSELS_MAP_ZOOM,
					minZoom: BRUSSELS_MIN_ZOOM,
					maxZoom: BRUSSELS_MAX_ZOOM,
					maxBounds: [
						[4.2, 50.73],
						[4.52, 50.93],
					],
					attributionControl: false,
					renderWorldCopies: false,
					dragRotate: false,
					pitchWithRotate: false,
					touchPitch: false,
					cooperativeGestures: true,
					locale: {
						'Map.Title': t('label'),
						'CooperativeGesturesHandler.WindowsHelpText': t('scrollHint'),
						'CooperativeGesturesHandler.MacHelpText': t('scrollHintMac'),
						'CooperativeGesturesHandler.MobileHelpText': t('touchHint'),
					},
				})
				mapRef.current = map
				map.touchZoomRotate.disableRotation()
				map.keyboard.disableRotation()
				map.getCanvas().setAttribute('aria-describedby', instructionsId)
				map.addControl(
					new ScaleControl({ maxWidth: 90, unit: 'metric' }),
					'bottom-left',
				)
				map.on('zoomend', () => {
					if (map) setZoom(map.getZoom())
				})
				// Source errors may be temporary. Reveal the map only after real vector tiles arrive.
				map.on('error', () => {
					if (!hasTiles && !disposed) setStatus('error')
				})
				map.on('sourcedata', (event) => {
					if (
						!hasTiles &&
						event.sourceId === 'brussels' &&
						event.isSourceLoaded &&
						map?.querySourceFeatures('brussels', {
							sourceLayer: 'transportation',
						}).length
					) {
						hasTiles = true
						window.clearTimeout(timeout)
						if (!disposed) setStatus('ready')
					}
				})
				map.on('webglcontextlost', () => {
					if (!disposed) setStatus('error')
				})
				map.on('webglcontextrestored', () => {
					if (!disposed && hasTiles) setStatus('ready')
				})
				const marker = document.createElement('div')
				new Marker({ element: marker, anchor: 'center' })
					.setLngLat(PIANOFABRIEK)
					.addTo(map)
				setMarkerHost(marker)

				resizeObserver = new ResizeObserver(() => map?.resize())
				resizeObserver.observe(container)
				// The theme switcher and colour editor both update the root attributes.
				const updatePalette = () => {
					if (!map?.getLayer('paper')) return
					const style = createBrusselsMapStyle(readPalette(), language)
					for (const layer of style.layers) {
						for (const [property, value] of Object.entries(layer.paint ?? {})) {
							map.setPaintProperty(
								layer.id,
								property as Parameters<MapLibreMap['setPaintProperty']>[1],
								value,
							)
						}
					}
				}
				map.on('style.load', updatePalette)
				themeObserver = new MutationObserver(updatePalette)
				themeObserver.observe(document.documentElement, {
					attributes: true,
					attributeFilter: ['style', 'data-theme', 'class'],
				})
			} catch {
				if (!disposed) setStatus('error')
			}
		}
		void initialize()
		return () => {
			disposed = true
			window.clearTimeout(timeout)
			resizeObserver?.disconnect()
			themeObserver?.disconnect()
			map?.remove()
			mapRef.current = null
		}
	}, [attempt, instructionsId, language, t])

	return (
		<div
			ref={rootRef}
			className={`${styles.map} ${className ?? ''}`}
			data-map-status={status}
		>
			<div className={styles.fallback} aria-hidden="true" />
			<div
				ref={canvasRef}
				className={styles.canvas}
				aria-hidden={status !== 'ready'}
				inert={status !== 'ready'}
			/>
			<div className={styles.controls} role="group" aria-label={t('controls')}>
				<button
					type="button"
					aria-label={t('zoomIn')}
					title={t('zoomIn')}
					disabled={status !== 'ready' || zoom >= BRUSSELS_MAX_ZOOM}
					onClick={() => mapRef.current?.zoomIn()}
				>
					<Plus aria-hidden="true" />
				</button>
				<button
					type="button"
					aria-label={t('zoomOut')}
					title={t('zoomOut')}
					disabled={status !== 'ready' || zoom <= BRUSSELS_MIN_ZOOM}
					onClick={() => mapRef.current?.zoomOut()}
				>
					<Minus aria-hidden="true" />
				</button>
				<button
					type="button"
					aria-label={t('reset')}
					title={t('reset')}
					disabled={status !== 'ready'}
					onClick={() =>
						mapRef.current?.easeTo({
							center: PIANOFABRIEK,
							zoom: BRUSSELS_MAP_ZOOM,
							bearing: 0,
							pitch: 0,
							duration: 700,
						})
					}
				>
					<LocateFixed aria-hidden="true" />
				</button>
			</div>
			{markerHost &&
				createPortal(
					<a
						className={styles.marker}
						href={directions}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={t('venueLink')}
					>
						<span className={styles.markerDot} aria-hidden="true" />
					</a>,
					markerHost,
				)}
			<p id={instructionsId} className={styles.instructions}>
				{t('instructions')}
			</p>
			{status !== 'ready' && (
				<div className={styles.status} role="status">
					<p>{t(status === 'error' ? 'unavailable' : 'loading')}</p>
					{status === 'error' && (
						<div className={styles.statusActions}>
							<a href={directions} target="_blank" rel="noopener noreferrer">
								{t('openDirections')}
							</a>
							<button
								type="button"
								onClick={() => setAttempt((value) => value + 1)}
							>
								{t('retry')}
							</button>
						</div>
					)}
				</div>
			)}
			<div className={styles.attribution}>
				<a
					href="https://openfreemap.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					OpenFreeMap
				</a>
				{' · '}
				<a
					href="https://openmaptiles.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					© OpenMapTiles
				</a>
				{' · '}
				<a
					href="https://www.openstreetmap.org/copyright"
					target="_blank"
					rel="noopener noreferrer"
				>
					© OpenStreetMap
				</a>
			</div>
		</div>
	)
}
