import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'
import { createClient, groq } from 'next-sanity'
import { projectId, dataset, apiVersion } from '@/sanity/lib/env'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function nl2br(str?: string) {
	if (!str) return ''
	return str.split('\n').join('<br>')
}

export function slug(str: string) {
	return str
		.toLowerCase()
		.replace(/[\s\W]+/g, '-')
		.replace(/^-+/, '')
		.replace(/-+$/, '')
}

const client = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: true,
})

export async function fetchTranslations(locale: string) {
	const query = groq`*[_type == "translation" && locale == $locale][0]`
	const params = { locale }
	const data = await client.fetch(query, params)
	return data?.messages || {}
}
