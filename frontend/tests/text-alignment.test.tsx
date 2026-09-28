import assert from 'node:assert/strict'
import test from 'node:test'
import React, { act, createRef } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { JSDOM } from 'jsdom'
import { EditorProvider, PortableTextEditable, type Editor } from '@portabletext/editor'
import { BehaviorPlugin, EditorRefPlugin } from '@portabletext/editor/plugins'
import RichText from '../src/components/common/RichText'
import { CENTER_TEXT_MARK, textAlignmentBehavior } from '../../studio/src/sanity/lib/textAlignmentBehavior'

const value = [
	{
		_type: 'block', _key: 'heading', style: 'h2',
		markDefs: [{ _type: 'link', _key: 'link', href: 'https://example.com' }],
		children: [
			{ _type: 'span', _key: 'a', text: 'Bold ', marks: ['strong'] },
			{ _type: 'span', _key: 'b', text: 'linked heading', marks: ['link'] },
		],
	},
	{
		_type: 'block', _key: 'body', style: 'normal', listItem: 'bullet', level: 1,
		markDefs: [],
		children: [{ _type: 'span', _key: 'c', text: 'List item', marks: ['em'] }],
	},
	{
		_type: 'block', _key: 'empty', style: 'h3', markDefs: [],
		children: [{ _type: 'span', _key: 'd', text: '', marks: [] }],
	},
]

const point = (block: string, span: string, offset = 0) => ({
	path: [{ _key: block }, 'children', { _key: span }], offset,
})

test('Center toggles whole blocks from a caret or mixed selection and preserves formatting and undo', { timeout: 5000 }, async () => {
	const dom = new JSDOM('<div id="root"></div>', { pretendToBeVisual: true })
	const globals = {
		window: dom.window,
		document: dom.window.document,
		HTMLElement: dom.window.HTMLElement,
		Element: dom.window.Element,
		Document: dom.window.Document,
		ShadowRoot: dom.window.ShadowRoot,
		Node: dom.window.Node,
		MutationObserver: dom.window.MutationObserver,
		requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window),
		cancelAnimationFrame: dom.window.cancelAnimationFrame.bind(dom.window),
		IS_REACT_ACT_ENVIRONMENT: true,
	}
	const descriptors = Object.keys(globals).map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const)
	for (const [key, item] of Object.entries(globals)) {
		Object.defineProperty(globalThis, key, { configurable: true, value: item })
	}
	const root = createRoot(dom.window.document.getElementById('root')!)
	const ref = createRef<Editor>()
	try {
		await act(async () => root.render(
			<EditorProvider initialConfig={{
				initialValue: structuredClone(value),
				schemaDefinition: {
					styles: [{ name: 'normal' }, { name: 'h2' }, { name: 'h3' }],
					decorators: [{ name: 'strong' }, { name: 'em' }, { name: CENTER_TEXT_MARK }],
					lists: [{ name: 'bullet' }],
					annotations: [{ name: 'link', fields: [{ name: 'href', type: 'string' }] }],
				},
			}}>
				<EditorRefPlugin ref={ref} />
				<BehaviorPlugin behaviors={[textAlignmentBehavior]} />
				<PortableTextEditable />
			</EditorProvider>,
		))
		const editor = ref.current!
		const send = async (event: Parameters<Editor['send']>[0]) => {
			await act(async () => editor.send(event))
		}
		const content = () => editor.getSnapshot().context.value as typeof value
		if (content()[0]?._key !== 'heading') {
			await act(async () => new Promise<void>((resolve) => {
				editor.on('ready', () => resolve())
			}))
		}
		const caret = { anchor: point('heading', 'a', 2), focus: point('heading', 'a', 2) }
		await send({ type: 'select', at: caret })
		await send({ type: 'decorator.toggle', decorator: CENTER_TEXT_MARK })
		assert.deepEqual(editor.getSnapshot().context.selection, { ...caret, backward: false })
		assert.equal(content()[0].style, 'h2')
		assert.ok(content()[0].children.every((child) => child.marks.includes(CENTER_TEXT_MARK)))
		assert.deepEqual(content()[1], value[1])
		const html = renderToStaticMarkup(<RichText value={content()} />)
		assert.match(html, /<h2[^>]*style="text-align:center"/)
		assert.match(html, /<strong[^>]*>Bold /)
		assert.match(html, /href="https:\/\/example.com"/)
		assert.equal((html.match(/text-align:center/g) ?? []).length, 1)
		await send({ type: 'history.undo' })
		assert.deepEqual(content(), value)

		await send({ type: 'select', at: { anchor: point('heading', 'b', 3), focus: point('body', 'c', 2) } })
		await send({ type: 'decorator.toggle', decorator: CENTER_TEXT_MARK })
		assert.ok(content().slice(0, 2).every((block) => block.children.every((child) => child.marks.includes(CENTER_TEXT_MARK))))
		assert.equal(content()[1].listItem, 'bullet')
		assert.match(renderToStaticMarkup(<RichText value={content()} />), /<li style="text-align:center"/)
		await send({ type: 'decorator.toggle', decorator: CENTER_TEXT_MARK })
		assert.deepEqual(content(), value)

		await send({ type: 'select', at: { anchor: point('empty', 'd'), focus: point('empty', 'd') } })
		await send({ type: 'decorator.toggle', decorator: CENTER_TEXT_MARK })
		assert.deepEqual(content()[2].children[0].marks, [CENTER_TEXT_MARK])
		await send({ type: 'insert.text', text: 'New heading' })
		assert.match(renderToStaticMarkup(<RichText value={content()} />), /<h3[^>]*style="text-align:center"[^>]*>New heading<\/h3>/)
	} finally {
		await act(async () => root.unmount())
		dom.window.close()
		for (const [key, descriptor] of descriptors) {
			if (descriptor) Object.defineProperty(globalThis, key, descriptor)
			else Reflect.deleteProperty(globalThis, key)
		}
	}
})
