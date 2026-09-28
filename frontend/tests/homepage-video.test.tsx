import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import HomepageVideoIntro from '../src/components/homepage/HomepageVideoIntro'

test('homepage uses the selected CMS video in both layouts despite retired background settings', () => {
	const html = renderToStaticMarkup(
		<HomepageVideoIntro homepage={{
			backgroundType: 'color',
			backgroundVideoUrlResolved: 'https://example.com/homepage.mp4',
		}} />,
	)
	assert.equal((html.match(/<video/g) ?? []).length, 2)
	assert.equal((html.match(/src="https:\/\/example.com\/homepage.mp4"/g) ?? []).length, 2)
	assert.equal((html.match(/autoPlay=""/g) ?? []).length, 2)
	assert.equal((html.match(/muted=""/g) ?? []).length, 2)
})

test('homepage direct video URL is controlled by the CMS', () => {
	const html = renderToStaticMarkup(
		<HomepageVideoIntro homepage={{ backgroundVideoUrl: 'https://example.com/selected.mp4' }} />,
	)
	assert.equal((html.match(/src="https:\/\/example.com\/selected.mp4"/g) ?? []).length, 2)
	assert.doesNotMatch(html, /teaser2\.mp4/)
})

test('homepage does not silently choose another video when the CMS source is empty', () => {
	const html = renderToStaticMarkup(<HomepageVideoIntro homepage={{ backgroundType: 'image' }} />)
	assert.doesNotMatch(html, /<video/)
	assert.doesNotMatch(html, /teaser2\.mp4/)
})
