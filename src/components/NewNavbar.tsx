import { Stack, Card, Flex, Text } from '@sanity/ui'
import StudioLogo from '@/components/StudioLogo'

const NewNavbar = (props: any) => (
	<Stack>
		{/* <Card padding={3} tone="caution">
			<Flex justify="center">
				<Text>Important Message: Please Read!</Text>
			</Flex>
		</Card> */}
		<Flex justify="center">
			<StudioLogo />
			<>{props.renderDefault(props)}</>
		</Flex>
	</Stack>
)

export default NewNavbar
