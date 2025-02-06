const VideoBackground = () => {
	return (
		<video
			className="absolute left-0 top-0 h-full w-full scale-150 transform object-cover"
			autoPlay
			loop
			muted
		>
			<source src="/assets/videos/teaser2.mp4" type="video/mp4" />
			{/* <track
				src="/assets/videos/teaser.mp4"
				kind="subtitles"
				srcLang="en"
				label="English"
			/> */}
			Your browser does not support the video tag.
		</video>
	)
}

export default VideoBackground
