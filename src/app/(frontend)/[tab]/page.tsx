import { useRouter } from 'next/navigation'
import SystemD from '../SystemD'

export default async function Page({
	params,
}: {
	params: Promise<{ tab: string }>
}) {
	const tab = (await params).tab

	return <SystemD initialTab={tab} />
}
