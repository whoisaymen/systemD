import type { ExpressionSpecification, StyleSpecification } from 'maplibre-gl'

// Pianofabriek, Fortstraat / rue du Fort 35. Coordinates from the venue's CMS map link.
export const PIANOFABRIEK: [number, number] = [4.3426042, 50.8288271]
export const BRUSSELS_MAP_ZOOM = 13.8
export const BRUSSELS_MIN_ZOOM = 11
export const BRUSSELS_MAX_ZOOM = 18

export type MapPalette = { ink: string; paper: string }

/** Real OpenMapTiles geometry, drawn like the original two-colour street print. */
export function createBrusselsMapStyle(
	{ ink, paper }: MapPalette,
	language: string,
): StyleSpecification {
	const name: ExpressionSpecification = [
		'coalesce',
		['get', `name:${language}`],
		['get', `name_${language}`],
		['get', 'name'],
	]
	return {
		version: 8,
		glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
		sources: {
			brussels: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' },
		},
		layers: [
			{ id: 'paper', type: 'background', paint: { 'background-color': paper } },
			{
				id: 'parks',
				type: 'fill',
				source: 'brussels',
				'source-layer': 'park',
				paint: { 'fill-color': ink, 'fill-opacity': 0.07 },
			},
			{
				id: 'water',
				type: 'fill',
				source: 'brussels',
				'source-layer': 'water',
				paint: { 'fill-color': ink, 'fill-opacity': 0.22 },
			},
			{
				id: 'waterways',
				type: 'line',
				source: 'brussels',
				'source-layer': 'waterway',
				paint: { 'line-color': ink, 'line-opacity': 0.4, 'line-width': 1.5 },
			},
			{
				id: 'buildings',
				type: 'fill',
				source: 'brussels',
				'source-layer': 'building',
				minzoom: 15,
				paint: {
					'fill-color': ink,
					'fill-opacity': [
						'interpolate',
						['linear'],
						['zoom'],
						15,
						0,
						16,
						0.13,
						18,
						0.2,
					],
				},
			},
			{
				id: 'paths',
				type: 'line',
				source: 'brussels',
				'source-layer': 'transportation',
				minzoom: 13,
				filter: [
					'match',
					['get', 'class'],
					['path', 'pedestrian', 'track', 'service'],
					true,
					false,
				],
				paint: {
					'line-color': ink,
					'line-opacity': 0.5,
					'line-dasharray': [2, 2],
					'line-width': ['interpolate', ['linear'], ['zoom'], 13, 0.7, 18, 2],
				},
			},
			{
				id: 'streets',
				type: 'line',
				source: 'brussels',
				'source-layer': 'transportation',
				filter: [
					'all',
					['==', ['geometry-type'], 'LineString'],
					[
						'match',
						['get', 'class'],
						['minor', 'tertiary', 'secondary', 'primary', 'trunk', 'motorway'],
						true,
						false,
					],
				],
				layout: { 'line-cap': 'round', 'line-join': 'round' },
				paint: {
					'line-color': ink,
					'line-width': [
						'interpolate',
						['exponential', 1.3],
						['zoom'],
						11,
						0.8,
						14,
						[
							'match',
							['get', 'class'],
							['motorway', 'trunk', 'primary'],
							4,
							['secondary', 'tertiary'],
							2.6,
							1.6,
						],
						18,
						[
							'match',
							['get', 'class'],
							['motorway', 'trunk', 'primary'],
							16,
							['secondary', 'tertiary'],
							10,
							6,
						],
					],
				},
			},
			{
				id: 'railways',
				type: 'line',
				source: 'brussels',
				'source-layer': 'transportation',
				filter: [
					'all',
					['==', ['get', 'class'], 'rail'],
					['!=', ['get', 'brunnel'], 'tunnel'],
				],
				paint: {
					'line-color': ink,
					'line-opacity': 0.55,
					'line-width': 1.5,
					'line-dasharray': [3, 2],
				},
			},
			{
				id: 'street-names',
				type: 'symbol',
				source: 'brussels',
				'source-layer': 'transportation_name',
				minzoom: 14.5,
				layout: {
					'symbol-placement': 'line',
					'text-field': name,
					'text-font': ['Noto Sans Regular'],
					'text-size': 11,
					'text-max-angle': 30,
					'symbol-spacing': 300,
					'text-padding': 8,
				},
				paint: {
					'text-color': ink,
					'text-halo-color': paper,
					'text-halo-width': 2,
				},
			},
			{
				id: 'neighbourhoods',
				type: 'symbol',
				source: 'brussels',
				'source-layer': 'place',
				maxzoom: 15.5,
				filter: [
					'match',
					['get', 'class'],
					['city', 'town', 'suburb', 'quarter', 'neighbourhood'],
					true,
					false,
				],
				layout: {
					'text-field': name,
					'text-font': ['Noto Sans Bold'],
					'text-size': 12,
					'text-transform': 'uppercase',
					'text-letter-spacing': 0.12,
					'text-padding': 25,
				},
				paint: {
					'text-color': ink,
					'text-halo-color': paper,
					'text-halo-width': 3,
				},
			},
		],
	}
}
