import { NextRequest, NextResponse } from 'next/server'
import client from '@/sanity/client'
import { writeToken } from '@/sanity/lib/token'

export async function POST(request: NextRequest) {
	try {
		const data = await request.json()

		// Create document in Sanity
		const result = await client.withConfig({ token: writeToken }).create({
			_type: 'filmSubmission',
			...data,
			submissionDate: new Date().toISOString(),
			status: 'pending',
		})

		return NextResponse.json({ success: true, id: result._id })
	} catch (error) {
		console.error('Error submitting film:', error)
		return NextResponse.json(
			{ error: 'Failed to submit film' },
			{ status: 500 },
		)
	}
}
