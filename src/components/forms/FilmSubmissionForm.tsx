'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'motion/react'
import { IoArrowBack, IoArrowForward, IoRocket } from 'react-icons/io5'

// Zod Schema (same as before)
const filmSubmissionSchema = z.object({
	// Level 1: Contact Info
	contactName: z.string().min(2, 'Name must be at least 2 characters'),
	phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
	email: z.string().email('Please enter a valid email address'),
	instagram: z.string().min(1, 'Instagram handle is required'),

	// Level 2: Film Details
	filmTitle: z.string().min(1, 'Film title is required'),
	directorProducer: z.string().min(1, 'Director/Producer is required'),
	projectHolder: z.string().min(1, 'Project holder is required'),
	filmGenre: z.string().min(1, 'Please select a genre'),
	yearOfCreation: z
		.number()
		.min(1900, 'Year must be after 1900')
		.max(new Date().getFullYear(), 'Year cannot be in the future'),
	languages: z.array(z.string()).min(1, 'At least one language is required'),
	filmFormat: z.enum(['dv', 'hd', '4k']),
	duration: z.number().min(1, 'Duration must be at least 1 minute'),
	subtitles: z.array(z.string()).optional(),
	downloadLink: z.string().url('Please enter a valid URL'),

	// Level 3: Professional Background

	professionalSupervision: z.boolean(),
	filmSchoolGraduates: z.boolean(),
	previousAwards: z.string().optional(),

	// Level 4: Consent
	dataConsent: z.boolean().refine((val) => val === true, {
		message: 'You must agree to data storage to submit',
	}),
})

type FormData = z.infer<typeof filmSubmissionSchema>

const LANGUAGES = [
	'French',
	'English',
	'Dutch',
	'German',
	'Spanish',
	'Arabic',
	'Portuguese',
	'Other',
]

const FilmSubmissionForm = () => {
	const [currentStep, setCurrentStep] = useState(1)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
		trigger,
		watch,
		setValue,
		getValues,
	} = useForm<FormData>({
		resolver: zodResolver(filmSubmissionSchema),
		mode: 'onChange',
		defaultValues: {
			languages: [],
			subtitles: [],
			professionalSupervision: false,
			filmSchoolGraduates: false,
			dataConsent: false,
		},
	})

	const watchedLanguages = watch('languages') || []
	const watchedSubtitles = watch('subtitles') || []

	const steps = [
		{
			title: 'Level 1: Latitude & Longitude',
			subtitle: 'aka coordonnées GPS',
			fields: ['contactName', 'phoneNumber', 'email', 'instagram'],
		},
		{
			title: 'Level 2: Le vaisseau',
			subtitle: 'Ton film et ses détails',
			fields: [
				'filmTitle',
				'directorProducer',
				'projectHolder',
				'filmGenre',
				'yearOfCreation',
				'languages',
				'filmFormat',
				'duration',
				'subtitles',
				'downloadLink',
			],
		},
		{
			title: 'Level 3: Control passport',
			subtitle: 'Ton background professionnel',
			fields: [
				'professionalSupervision',
				'filmSchoolGraduates',
				'previousAwards',
			],
		},
		{
			title: 'Level 4: Check de sûreté',
			subtitle: 'Avant décollage',
			fields: ['dataConsent'],
		},
	]

	const nextStep = async () => {
		const fieldsToValidate = steps[currentStep - 1].fields
		const isStepValid = await trigger(fieldsToValidate as any)

		if (isStepValid) {
			setCurrentStep((prev) => Math.min(prev + 1, steps.length))
		}
	}

	const prevStep = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 1))
	}

	const onSubmit = async (data: FormData) => {
		setIsSubmitting(true)

		try {
			const response = await fetch('/api/submit-film', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})

			if (response.ok) {
				setIsSubmitted(true)
			} else {
				throw new Error('Submission failed')
			}
		} catch (error) {
			console.error('Error submitting form:', error)
			alert('Something went wrong. Please try again.')
		} finally {
			setIsSubmitting(false)
		}
	}

	const toggleArrayValue = (
		array: string[],
		value: string,
		setValue: any,
		fieldName: string,
	) => {
		const newArray = array.includes(value)
			? array.filter((item) => item !== value)
			: [...array, value]
		setValue(fieldName, newArray)
	}

	// Updated input styles to ensure they're interactive
	const inputClassName = `
    w-full px-4 py-3 
    bg-white dark:bg-gray-800 
    border-2 border-gray-300 dark:border-gray-600 
    rounded-lg 
    text-gray-900 dark:text-gray-100
    placeholder-gray-500 dark:placeholder-gray-400
    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800
    focus:outline-none
    transition-colors duration-200
    disabled:bg-gray-100 disabled:cursor-not-allowed
  `
		.replace(/\s+/g, ' ')
		.trim()

	const selectClassName = `
    w-full px-4 py-3 
    bg-white dark:bg-gray-800 
    border-2 border-gray-300 dark:border-gray-600 
    rounded-lg 
    text-gray-900 dark:text-gray-100
    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800
    focus:outline-none
    transition-colors duration-200
    cursor-pointer
  `
		.replace(/\s+/g, ' ')
		.trim()

	const textareaClassName = `
    w-full px-4 py-3 
    bg-white dark:bg-gray-800 
    border-2 border-gray-300 dark:border-gray-600 
    rounded-lg 
    text-gray-900 dark:text-gray-100
    placeholder-gray-500 dark:placeholder-gray-400
    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800
    focus:outline-none
    transition-colors duration-200
    resize-vertical
  `
		.replace(/\s+/g, ' ')
		.trim()

	if (isSubmitted) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="mx-auto max-w-2xl p-8 text-center"
			>
				<div className="mb-8">
					<IoRocket className="mx-auto mb-4 text-6xl text-primary" />
					<h2 className="mb-4 text-4xl font-bold text-primary">
						Mission Accomplie! 🚀
					</h2>
					<p className="text-lg text-dark dark:text-primary">
						Ton film a été envoyé avec succès vers le TURFU. Nous reviendrons
						vers toi avant 17h avec une réponse.
					</p>
				</div>
				<div className="text-dark/70 dark:text-primary/70 text-sm">
					Bon vent, courageux aventurier!
				</div>
			</motion.div>
		)
	}

	return (
		<div className="lg:shadowtest lg: mx-auto my-1 h-[calc(100svh-12px)] w-full p-4 lg:rounded-xl">
			<div className="mb-8 text-center">
				<h1 className="mb-4 text-5xl font-bold text-primary lg:my-16">
					System D Formulaire
				</h1>
				<div className="mt-4 px-16 text-base font-normal leading-[1.2] tracking-tighter text-primary first:mt-0 lg:mt-0 lg:pb-8 lg:pt-0 lg:text-xl">
					{' '}
					<p>
						Il y a 4 niveaux d'interrogation avant de rejoindre notre voyage
						vers le TURFU.
					</p>
					<p>Bon vent aux courageux aventuriers!</p>
				</div>
			</div>

			{/* Progress Bar */}
			<div className="mb-8">
				<div className="mb-2 flex items-center justify-between">
					{steps.map((step, index) => (
						<div
							key={index}
							className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
								index + 1 <= currentStep
									? 'bg-primary text-dark'
									: 'bg-gray-200 text-gray-500'
							}`}
						>
							{index + 1}
						</div>
					))}
				</div>
				<div className="h-2 w-full rounded-full bg-gray-200">
					<div
						className="h-2 rounded-full bg-primary transition-all duration-300"
						style={{ width: `${(currentStep / steps.length) * 100}%` }}
					/>
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="z-50 space-y-6">
				<AnimatePresence mode="wait">
					<motion.div
						key={currentStep}
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.3 }}
						className="rounded-xl border-2 border-gray-200 bg-primary p-8 shadow-lg"
					>
						<div className="mb-6">
							<h2 className="mb-2 text-2xl font-bold text-dark">
								{steps[currentStep - 1].title}
							</h2>
							<p className="text-gray-600 dark:text-gray-300">
								{steps[currentStep - 1].subtitle}
							</p>
						</div>

						{/* Step Content */}
						{currentStep === 1 && (
							<div className="space-y-6">
								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
										Nom et prénom de la personne de contact *
									</label>
									<input
										{...register('contactName')}
										className={inputClassName}
										placeholder="Qui répondra avant 17h"
										type="text"
									/>
									{errors.contactName && (
										<p className="mt-1 text-sm text-red-500">
											{errors.contactName.message}
										</p>
									)}
								</div>

								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
										Numéro de téléphone *
									</label>
									<input
										{...register('phoneNumber')}
										className={inputClassName}
										placeholder="+32 4XX XX XX XX"
										type="tel"
									/>
									{errors.phoneNumber && (
										<p className="mt-1 text-sm text-red-500">
											{errors.phoneNumber.message}
										</p>
									)}
								</div>

								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
										E-mail *
									</label>
									<input
										{...register('email')}
										type="email"
										className={inputClassName}
										placeholder="ton@email.com"
									/>
									{errors.email && (
										<p className="mt-1 text-sm text-red-500">
											{errors.email.message}
										</p>
									)}
								</div>

								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
										Instagram *
									</label>
									<input
										{...register('instagram')}
										className={inputClassName}
										placeholder="@tonhandle"
										type="text"
									/>
									{errors.instagram && (
										<p className="mt-1 text-sm text-red-500">
											{errors.instagram.message}
										</p>
									)}
								</div>
							</div>
						)}

						{currentStep === 2 && (
							<div className="space-y-6">
								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
										Titre du film *
									</label>
									<input
										{...register('filmTitle')}
										className={inputClassName}
										placeholder="Le nom de votre mission"
										type="text"
									/>
									{errors.filmTitle && (
										<p className="mt-1 text-sm text-red-500">
											{errors.filmTitle.message}
										</p>
									)}
								</div>

								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
										Réalisateur et/ou producteur *
									</label>
									<input
										{...register('directorProducer')}
										className={inputClassName}
										placeholder="Personne(s) au volant"
										type="text"
									/>
									{errors.directorProducer && (
										<p className="mt-1 text-sm text-red-500">
											{errors.directorProducer.message}
										</p>
									)}
								</div>

								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
										Porteur du projet *
									</label>
									<input
										{...register('projectHolder')}
										className={inputClassName}
										placeholder="De qui/où vient l'idée de faire ce film?"
										type="text"
									/>
									{errors.projectHolder && (
										<p className="mt-1 text-sm text-red-500">
											{errors.projectHolder.message}
										</p>
									)}
								</div>

								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
										Genre du film
									</label>
									<select
										{...register('filmGenre')}
										className={selectClassName}
									>
										<option value="">
											Galaxie dans laquelle le film se trouve
										</option>
										<option value="documentary">Documentaire</option>
										<option value="fiction">Fiction</option>
										<option value="animation">Animation</option>
										<option value="experimental">Expérimental</option>
										<option value="musicVideo">Clip musical</option>
										<option value="other">Autre</option>
									</select>
									{errors.filmGenre && (
										<p className="mt-1 text-sm text-red-500">
											{errors.filmGenre.message}
										</p>
									)}
								</div>

								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
										Année de réalisation *
									</label>
									<input
										{...register('yearOfCreation', { valueAsNumber: true })}
										type="number"
										className={inputClassName}
										placeholder="Moment de l'atterrissage"
										min="1900"
										max={new Date().getFullYear()}
									/>
									{errors.yearOfCreation && (
										<p className="mt-1 text-sm text-red-500">
											{errors.yearOfCreation.message}
										</p>
									)}
								</div>

								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
										Langue(s) *
									</label>
									<div className="grid grid-cols-2 gap-2">
										{LANGUAGES.map((lang) => (
											<label
												key={lang}
												className="flex cursor-pointer items-center space-x-2"
											>
												<input
													type="checkbox"
													checked={watchedLanguages.includes(lang)}
													onChange={() =>
														toggleArrayValue(
															watchedLanguages,
															lang,
															setValue,
															'languages',
														)
													}
													className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
												/>
												<span className="text-sm text-gray-700 dark:text-gray-300">
													{lang}
												</span>
											</label>
										))}
									</div>
									{errors.languages && (
										<p className="mt-1 text-sm text-red-500">
											{errors.languages.message}
										</p>
									)}
								</div>

								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
										Format du film *
									</label>
									<div className="space-y-2">
										{[
											{ value: 'dv', label: 'Petit (DV)' },
											{ value: 'hd', label: 'Moyen (HD)' },
											{ value: '4k', label: 'Grand (4K)' },
										].map((format) => (
											<label
												key={format.value}
												className="flex cursor-pointer items-center space-x-2"
											>
												<input
													{...register('filmFormat')}
													type="radio"
													value={format.value}
													className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
												/>
												<span className="text-sm text-gray-700 dark:text-gray-300">
													{format.label}
												</span>
											</label>
										))}
									</div>
									{errors.filmFormat && (
										<p className="mt-1 text-sm text-red-500">
											{errors.filmFormat.message}
										</p>
									)}
								</div>

								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
										Durée du film (en minutes) *
									</label>
									<input
										{...register('duration', { valueAsNumber: true })}
										type="number"
										className={inputClassName}
										placeholder="Secondes, minutes, heures… éternité"
										min="1"
									/>
									{errors.duration && (
										<p className="mt-1 text-sm text-red-500">
											{errors.duration.message}
										</p>
									)}
								</div>

								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
										Sous-titres
									</label>
									<div className="grid grid-cols-2 gap-2">
										{LANGUAGES.map((lang) => (
											<label
												key={lang}
												className="flex cursor-pointer items-center space-x-2"
											>
												<input
													type="checkbox"
													checked={watchedSubtitles.includes(lang)}
													onChange={() =>
														toggleArrayValue(
															watchedSubtitles,
															lang,
															setValue,
															'subtitles',
														)
													}
													className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
												/>
												<span className="text-sm text-gray-700 dark:text-gray-300">
													{lang}
												</span>
											</label>
										))}
									</div>
									<p className="mt-1 text-xs text-gray-500">
										Si tu peux les fournir, dans quelle langue(s)?
									</p>
								</div>

								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
										Lien de téléchargement *
									</label>
									<input
										{...register('downloadLink')}
										type="url"
										className={inputClassName}
										placeholder="À la vitesse de lumière stp"
									/>
									{errors.downloadLink && (
										<p className="mt-1 text-sm text-red-500">
											{errors.downloadLink.message}
										</p>
									)}
								</div>
							</div>
						)}

						{currentStep === 3 && (
							<div className="space-y-6">
								<div>
									<label className="mb-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
										Encadrement professionnel *
									</label>
									<div className="space-y-2">
										<label className="flex cursor-pointer items-center space-x-2">
											<input
												{...register('professionalSupervision')}
												type="radio"
												value="true"
												checked={watch('professionalSupervision') === true}
												className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
											/>
											<span className="text-sm text-gray-700 dark:text-gray-300">
												Oui
											</span>
										</label>
										<label className="flex cursor-pointer items-center space-x-2">
											<input
												{...register('professionalSupervision', {
													setValueAs: (v) => v === 'true',
												})}
												type="radio"
												value="false"
												checked={watch('professionalSupervision') === false}
												className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
											/>
											<span className="text-sm text-gray-700 dark:text-gray-300">
												Non
											</span>
										</label>
									</div>
									{errors.professionalSupervision && (
										<p className="mt-1 text-sm text-red-500">
											{errors.professionalSupervision.message}
										</p>
									)}
								</div>

								<div>
									<label className="mb-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
										T'as des diplômés d'école de cinéma dans ton crew? *
									</label>
									<div className="space-y-2">
										<label className="flex cursor-pointer items-center space-x-2">
											<input
												{...register('filmSchoolGraduates', {
													setValueAs: (v) => v === 'true',
												})}
												type="radio"
												value="true"
												checked={watch('filmSchoolGraduates') === true}
												className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
											/>
											<span className="text-sm text-gray-700 dark:text-gray-300">
												Oui
											</span>
										</label>
										<label className="flex cursor-pointer items-center space-x-2">
											<input
												{...register('filmSchoolGraduates', {
													setValueAs: (v) => v === 'true',
												})}
												type="radio"
												value="false"
												checked={watch('filmSchoolGraduates') === false}
												className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
											/>
											<span className="text-sm text-gray-700 dark:text-gray-300">
												Non
											</span>
										</label>
									</div>
									{errors.filmSchoolGraduates && (
										<p className="mt-1 text-sm text-red-500">
											{errors.filmSchoolGraduates.message}
										</p>
									)}
								</div>

								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
										Récompenses Antérieures
									</label>
									<textarea
										{...register('previousAwards')}
										rows={4}
										className={textareaClassName}
										placeholder="Est-ce que le film a déjà gagné des prix?"
									/>
								</div>
							</div>
						)}

						{currentStep === 4 && (
							<div className="space-y-6">
								<div>
									<label className="flex cursor-pointer items-start space-x-3">
										<input
											{...register('dataConsent')}
											type="checkbox"
											className="mt-1 h-5 w-5 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
										/>
										<span className="text-sm text-gray-700 dark:text-gray-300">
											System-D gardera tes infos en tout sécurité pendant et
											après ton voyage *
										</span>
									</label>
									{errors.dataConsent && (
										<p className="mt-1 text-sm text-red-500">
											{errors.dataConsent.message}
										</p>
									)}
								</div>

								<div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
									<p className="text-sm text-gray-700 dark:text-gray-300">
										En soumettant ce formulaire, tu acceptes que tes données
										soient stockées et utilisées uniquement dans le cadre de ta
										participation au festival System D. Nous respectons ta vie
										privée et ne partagerons jamais tes informations avec des
										tiers.
									</p>
								</div>
							</div>
						)}
					</motion.div>
				</AnimatePresence>

				{/* Navigation */}
				<div className="flex items-center justify-between">
					<button
						type="button"
						onClick={prevStep}
						disabled={currentStep === 1}
						className="flex items-center space-x-2 rounded-lg bg-gray-200 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<IoArrowBack />
						<span>Précédent</span>
					</button>

					{currentStep < steps.length ? (
						<button
							type="button"
							onClick={nextStep}
							className="flex items-center space-x-2 rounded-lg bg-primary px-6 py-3 text-dark transition-colors hover:bg-blue-700"
						>
							<span>Suivant</span>
							<IoArrowForward />
						</button>
					) : (
						<button
							type="submit"
							disabled={isSubmitting}
							className="flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<IoRocket />
							<span>{isSubmitting ? 'Envoi...' : 'Envoyer vers le TURFU'}</span>
						</button>
					)}
				</div>
			</form>
		</div>
	)
}

export default FilmSubmissionForm
