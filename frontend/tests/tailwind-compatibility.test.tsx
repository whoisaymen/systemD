import assert from 'node:assert/strict'
import test from 'node:test'
import { twMerge } from 'tailwind-merge'

test('class merging understands Tailwind 3 opacity and default utilities', () => {
	assert.equal(twMerge('bg-opacity-50 bg-opacity-75'), 'bg-opacity-75')
	assert.equal(twMerge('shadow shadow-md'), 'shadow-md')
	assert.equal(twMerge('rounded rounded-lg'), 'rounded-lg')
	assert.equal(
		twMerge('hover:bg-opacity-50 hover:bg-opacity-75'),
		'hover:bg-opacity-75',
	)
})
