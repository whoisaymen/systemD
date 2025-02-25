'use client'
import { motion } from 'motion/react'
import Img from '@/ui/Img'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
interface EquipeContentProps {
	persons: any[]
	language: string
}

const EquipeContent: React.FC<EquipeContentProps> = ({ persons, language }) => {
	const getLocalizedValue = (array: any[], lang: string) => {
		const item = array.find((entry) => entry._key === lang)
		return item ? item.value : ''
	}

	return (
		<div className="flex h-full w-full flex-col items-center space-y-20 rounded-md px-2 pb-32 pt-24 sm:mt-0">
			{persons.map((person) => {
				const imageUrl = person.image?.asset?._ref
					? `/${person.image.asset._ref.split('-')[1]}-${person.image.asset._ref.split('-')[2]}.${person.image.asset._ref.split('-')[3]}`
					: ''

				return (
					<div
						key={person._id}
						className="flex flex-col items-center space-y-0 px-2"
					>
						{imageUrl && (
							<div className="relative px-12">
								<Img
									image={person.image}
									src={imageUrl}
									alt={person.name}
									className="z-0 aspect-square h-full w-full rounded-full border-2 border-primary object-cover"
								/>
								<div className="absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-grayLight to-transparent dark:from-dark" />

								{person.title && (
									<p
										className={`absolute -bottom-16 left-1/2 z-50 inline-block w-auto -translate-x-1/2 -rotate-6 rounded-md border-2 border-primary bg-dark px-2 py-0 text-center font-medium tracking-tight text-primary`}
									>
										{getLocalizedValue(person.title, language)}
									</p>
								)}
							</div>
						)}
						<Accordion type="single" collapsible>
							<AccordionItem
								value="item-1"
								className="flex flex-col items-center justify-center"
							>
								<AccordionTrigger className={`-mb-4 rotate-3`}>
									<h2>{person.name}</h2>
								</AccordionTrigger>

								<AccordionContent>
									{person.biography && (
										<motion.div
											initial={{
												borderRadius: '0.375rem',
											}}
											animate={{ borderRadius: '5rem' }}
											transition={{
												duration: 2,
												ease: [0.76, 0, 0.24, 1],
												repeat: Infinity,
												repeatType: 'reverse',
											}}
											className="relative rounded-full border-2 border-dark bg-[#fff] px-4 py-10 pt-12 shadow-sm dark:bg-secondary sm:py-10"
											// style={{ backgroundColor: block.color?.hex || '#DEFE04' }}
											style={{
												backgroundColor: 'var(--color-secondary)',
											}}
										>
											<p className="mx-auto py-2 text-center text-xl font-bold leading-[1.2] tracking-tighter text-dark sm:py-4 sm:text-4xl">
												{getLocalizedValue(person.biography, language)}
											</p>
										</motion.div>
									)}
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
				)
			})}
		</div>
	)
}

export default EquipeContent
