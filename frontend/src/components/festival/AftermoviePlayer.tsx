'use client'

import { useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { FaPlay, FaYoutube } from 'react-icons/fa6'

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

function youtubeVideoId(source: string) {
	try {
		const url = new URL(source)
		const host = url.hostname.replace(/^(www\.|m\.)/, '')
		const segments = url.pathname.split('/').filter(Boolean)
		const id =
			host === 'youtu.be'
				? segments[0]
				: ['youtube.com', 'youtube-nocookie.com'].includes(host)
					? url.searchParams.get('v') ||
						(['embed', 'shorts', 'live'].includes(segments[0])
							? segments[1]
							: null)
					: null
		return id && /^[\w-]{11}$/.test(id) ? id : null
	} catch {
		return null
	}
}

type Props = { source: string; title: string; language: string }

function YouTubePlayer({
	videoId,
	title,
	language,
}: Omit<Props, 'source'> & { videoId: string }) {
	const [started, setStarted] = useState(false)
	const playLabel =
		{ fr: 'Lire la vidéo', en: 'Play video', nl: 'Video afspelen' }[language] ||
		'Play video'

	if (started) {
		return (
			<iframe
				src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1&iv_load_policy=3`}
				title={title}
				className="h-full w-full border-0"
				allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
				allowFullScreen
				referrerPolicy="strict-origin-when-cross-origin"
			/>
		)
	}

	return (
		<div className="relative h-full w-full">
			<button
				type="button"
				onClick={() => setStarted(true)}
				aria-label={`${playLabel} — ${title}`}
				className="group relative flex h-full w-full items-center justify-center focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-primary"
			>
				<Image
					src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
					alt=""
					fill
					unoptimized
					className="object-cover"
				/>
				<span className="relative flex h-12 w-16 items-center justify-center rounded-xl bg-[#ff0033] text-white shadow-lg transition-transform group-hover:scale-110 group-focus-visible:scale-110 lg:h-14 lg:w-20">
					<FaPlay aria-hidden="true" className="ml-1 h-5 w-5 lg:h-6 lg:w-6" />
				</span>
			</button>
			<a
				href={`https://www.youtube.com/watch?v=${videoId}`}
				target="_blank"
				rel="noopener noreferrer"
				className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:bottom-4 lg:right-4"
			>
				<FaYoutube aria-hidden="true" className="h-5 w-5" />
				YouTube
			</a>
		</div>
	)
}

export default function AftermoviePlayer({ source, title, language }: Props) {
	const videoId = youtubeVideoId(source)
	return videoId ? (
		<YouTubePlayer key={videoId} videoId={videoId} title={title} language={language} />
	) : (
		<ReactPlayer
			src={source}
			controls
			playsInline
			width="100%"
			height="100%"
			style={{ minWidth: 0, minHeight: 0 }}
		/>
	)
}
