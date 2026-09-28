import LogoShort from '@/components/svgs/LogoShort'

export default function SystemDLogoPill() {
	return (
		<span
			role="img"
			aria-label="System D"
			data-system-d-logo
			className="relative mx-[0.06em] inline-block -rotate-3 align-[-0.08em] leading-none"
		>
			<LogoShort className="box-content inline-block h-[0.72em] w-auto rounded-[0.12em] bg-primary px-[0.16em] py-[0.07em] text-dark" />
		</span>
	)
}
