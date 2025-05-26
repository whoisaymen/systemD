'use client'
import { motion } from 'motion/react'
import Img from '@/ui/Img'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { useState, useRef } from 'react'
interface EquipeContentProps {
	persons: any[]
	language: string
}

const EquipeContent: React.FC<EquipeContentProps> = ({ persons, language }) => {
	const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null)
	const refs = useRef<{ [key: string]: HTMLDivElement | null }>({})

	const getLocalizedValue = (array: any[], lang: string) => {
		const item = array.find((entry) => entry._key === lang)
		return item ? item.value : ''
	}

	// Scroll to the selected person's section
	const scrollToPerson = (personId: string) => {
		if (refs.current[personId]) {
			const element = refs.current[personId]
			const offset = -120 // Adjust this value to account for padding or space above the image
			const top = element?.getBoundingClientRect().top + window.scrollY + offset

			window.scrollTo({
				top,
				behavior: 'smooth',
			})
		}
	}

	return (
		<div className="flex h-full w-full flex-col items-center justify-center space-y-0 rounded-md px-4 pb-24 sm:mt-0 sm:space-y-0">
			{/* Menu of Team Member Names */}
			<ul className="sticky top-0 z-10 flex w-full flex-wrap items-center justify-center gap-2 py-4 lg:hidden">
				{persons.map((person) => (
					<li key={person._id} className="">
						{/* Team Member Name */}
						<p
							onClick={() => {
								setSelectedPersonId(person._id)
								scrollToPerson(person._id)
							}}
							className={`z-10 inline-block w-auto cursor-pointer rounded-md border-2 border-dark bg-grayDark px-2 py-0 text-center text-xl font-medium uppercase tracking-tighter text-dark hover:bg-primary hover:text-dark ${
								selectedPersonId === person._id ? 'bg-primary text-dark' : ''
							}`}
						>
							{person.name}
						</p>
					</li>
				))}
			</ul>

			{/* Team Member Details */}
			<div className="w-full space-y-8">
				{persons.map((person) => (
					<div
						key={person._id}
						ref={(el) => (refs.current[person._id] = el)}
						className="flex w-full flex-col items-center justify-center px-0"
					>
						{/* Photo */}
						{person.image && (
							<div
								// style={{ display: 'inline-block', originX: 0.5, originY: 0.5 }}
								// animate={{

								// 	scale: [1, 1.1, 0.9, 1],

								// 	x: [0, -3, 3, 0],
								// }}
								// transition={{
								// 	duration: 4,
								// 	ease: [0.76, 0, 0.24, 1],
								// 	repeat: Infinity,
								// }}
								className="relative w-1/2 sm:px-0"
							>
								<Img
									image={person.image}
									src={
										person.image?.asset?._ref
											? `/${person.image.asset._ref.split('-')[1]}-${person.image.asset._ref.split('-')[2]}.${person.image.asset._ref.split('-')[3]}`
											: ''
									}
									alt={person.name}
									className="z-0 h-full w-full rounded-3xl border-0 border-dark object-cover dark:border-primary sm:border-0"
								/>
								<div className="absolute -left-28 top-0 h-full w-20 rounded-xl bg-primary"></div>
							</div>
						)}

						{/* Biography */}
						{person.biography && (
							<div className="relative mt-8 flex lg:max-w-[50%]">
								{/* Person Title */}
								{person.title && (
									<p
										className="absolute bottom-0 left-6 z-30 inline-block -rotate-90 text-4xl font-bold uppercase leading-[0] tracking-tighter text-primary"
										style={{
											transformOrigin: 'left bottom',
										}}
									>
										{getLocalizedValue(person.title, language)}
									</p>
								)}

								{/* Biography Text */}
								<p className="ml-16 py-2 text-lg leading-[1.2] tracking-tighter text-dark dark:text-primary sm:py-4">
									{getLocalizedValue(person.biography, language)}
								</p>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	)
}

export default EquipeContent
