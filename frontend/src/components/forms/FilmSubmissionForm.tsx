'use client'

import { useEffect, useRef, useState } from 'react'
import RichText from '@/components/common/RichText'
import { localizedRichText, richTextToPlainText } from '@/lib/richText'
import errorCopy from '@/content/filmSubmissionErrors.json'
import copyDefaults from '@/content/filmSubmissionCopy.json'

type CopyKey = keyof typeof copyDefaults
type FormCopyEntry = { name: CopyKey; richContent?: any; nativeText?: any }
type FormCopyContent = FormCopyEntry[] | Partial<Record<CopyKey, any>>
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createFilmSubmissionSchema } from '@/lib/filmSubmissionSchema'
import { motion, AnimatePresence } from 'motion/react'
import { IoArrowBack, IoArrowForward, IoRocket } from 'react-icons/io5'


type FormData = z.infer<ReturnType<typeof createFilmSubmissionSchema>>

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

const FilmSubmissionForm = ({
	content,
	language = 'fr',
}: {
	content?: FormCopyContent
	language?: string
}) => {
	const value = (key: CopyKey) => {
		const entry = Array.isArray(content)
			? content.find((item) => item.name === key)
			: undefined
		const stored = Array.isArray(content)
			? copyDefaults[key].native
				? entry?.nativeText
				: entry?.richContent
			: content?.[key]
		if (key in errorCopy) {
			const defaults = errorCopy[key as keyof typeof errorCopy]
			const exact = Array.isArray(stored) ? stored.find(item => (item.language || item._key) === language)?.value : stored?.[language]
			return (language !== 'en' && exact === defaults.en ? undefined : exact) || defaults[language as keyof typeof defaults] || defaults.fr
		}
		return localizedRichText(stored, language) ?? copyDefaults[key].value
	}
	const plain = (key: CopyKey) => richTextToPlainText(value(key))
	const copy = (key: CopyKey, allowLinks = true) => (
		<RichText value={value(key)} inline allowLinks={allowLinks} />
	)
	const copyBlock = (key: CopyKey) => <RichText value={value(key)} />
	const filmSubmissionSchema = createFilmSubmissionSchema(plain)
	const [ready, setReady] = useState(false)
	useEffect(() => setReady(true), [])
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
			title: copy('step1Title'),
			subtitle: copy('step1Subtitle'),
			fields: ['contactName', 'phoneNumber', 'email', 'instagram'],
		},
		{
			title: copy('step2Title'),
			subtitle: copy('step2Subtitle'),
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
			title: copy('step3Title'),
			subtitle: copy('step3Subtitle'),
			fields: [
				'professionalSupervision',
				'filmSchoolGraduates',
				'previousAwards',
			],
		},
		{
			title: copy('step4Title'),
			subtitle: copy('step4Subtitle'),
			fields: ['dataConsent'],
		},
	]

	const formRef = useRef<HTMLFormElement>(null)
	const [validationAttempt, setValidationAttempt] = useState(0)
	const errorFields = Object.keys(errors).sort().join(',')
	useEffect(() => {
		const fields = formRef.current?.querySelectorAll<HTMLElement>('[aria-invalid="true"]')
		fields?.forEach(field => {
			field.classList.remove('is-shaking')
			void field.offsetWidth
			field.classList.add('is-shaking')
		})
	}, [errorFields, validationAttempt])
	const registerField = (name: keyof FormData, options?: any) => ({
		...register(name, options),
		id: `film-${name}`,
		'aria-invalid': Boolean(errors[name]),
		'aria-describedby': errors[name] ? `error-${name}` : undefined,
	})

	const stepHeading = useRef<HTMLHeadingElement>(null)
	const changedStep = useRef(false)

	const nextStep = async () => {
		const fieldsToValidate = steps[currentStep - 1].fields
		const isStepValid = await trigger(fieldsToValidate as any, { shouldFocus: true })
		setValidationAttempt(attempt => attempt + 1)

		if (isStepValid) {
			changedStep.current = true
			setCurrentStep((prev) => Math.min(prev + 1, steps.length))
		}
	}

	const prevStep = () => {
		changedStep.current = true
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
			alert(plain('submissionError'))
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
		setValue(fieldName, newArray, { shouldValidate: true })
	}

	// Updated input styles to ensure they're interactive
	const inputClassName = `
    t-input w-full px-4 py-3
    form-field
    border form-border
    rounded-lg
    form-text

    form-input-focus
    focus:outline-none
    transition-colors duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `
		.replace(/\s+/g, ' ')
		.trim()

	const selectClassName = `
    t-input w-full px-4 py-3
    form-field
    border form-border
    rounded-lg
    form-text
    form-input-focus
    focus:outline-none
    transition-colors duration-200
    cursor-pointer
  `
		.replace(/\s+/g, ' ')
		.trim()

	const textareaClassName = `
    t-input w-full px-4 py-3
    form-field
    border form-border
    rounded-lg
    form-text

    form-input-focus
    focus:outline-none
    transition-colors duration-200
    resize-y
  `
		.replace(/\s+/g, ' ')
		.trim()

	if (isSubmitted) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="form-surface no-scrollbar shadowtest rounded-xl mx-auto my-1 overflow-x-clip min-h-[calc(100svh-12px)] w-full form-background px-6 py-16 text-center form-text lg:h-[calc(100svh-12px)] lg:overflow-y-auto lg:rounded-xl"
			>
				<div className="mb-8">
					<IoRocket className="mx-auto mb-4 text-6xl form-text" />
					<h2 className="mb-4 text-4xl font-bold form-text">
						{copy('successTitle')}
					</h2>
					<div className="text-lg form-text">
						{copyBlock('successDescription')}
					</div>
				</div>
				<div className="text-sm form-muted">
					{copy('successSignoff')}
				</div>
			</motion.div>
		)
	}

	return (
		<div className="form-surface no-scrollbar shadowtest rounded-xl mx-auto my-1 min-h-[calc(100svh-12px)] w-full overflow-hidden lg:h-[calc(100svh-12px)] lg:min-h-0 lg:rounded-xl">
			<div className="form-scroll no-scrollbar overflow-x-hidden px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-8 sm:px-8 lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:pb-0 lg:pt-10">
				<div className="mx-auto max-w-2xl">
					<header className="mb-8 text-left">
						<h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight form-text sm:text-4xl">
							{copy('title')}
						</h1>
						<div className="space-y-3 text-base font-normal leading-relaxed form-muted">
							{' '}
							<div>{copyBlock('intro')}</div>
							<div>{copyBlock('introSignoff')}</div>
						</div>
					</header>

					{/* Progress Bar */}
					<div className="mb-8">
						<div className="mb-2 flex items-center justify-between">
							{steps.map((step, index) => (
								<div
									key={index}
									className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
										index + 1 <= currentStep
											? 'form-accent'
											: 'form-muted-surface form-muted'
									}`}
								>
									{index + 1}
								</div>
							))}
						</div>
						<div className="h-2 w-full rounded-full form-muted-surface">
							<div
								className="h-2 rounded-full form-accent transition-all duration-300"
								style={{ width: `${(currentStep / steps.length) * 100}%` }}
							/>
						</div>
					</div>

					<form data-form-ready={ready} ref={formRef} noValidate onSubmit={handleSubmit(onSubmit, () => setValidationAttempt(attempt => attempt + 1))} className="z-50 space-y-6">
						<AnimatePresence mode="wait">
							<motion.div
								key={currentStep}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.3 }}
								className="form-card rounded-xl border form-border p-5 sm:p-8"
								onAnimationComplete={(definition) => {
									if (changedStep.current && typeof definition === 'object' && 'opacity' in definition && definition.opacity === 1) {
										stepHeading.current?.focus({ preventScroll: true })
										stepHeading.current?.scrollIntoView({ block: 'start' })
										changedStep.current = false
									}
								}}
							>
								<div className="mb-6">
									<h2 ref={stepHeading} tabIndex={-1} className="mb-2 scroll-mt-6 text-2xl font-bold form-text outline-none">
										{steps[currentStep - 1].title}
									</h2>
									<p className="form-muted">
										{steps[currentStep - 1].subtitle}
									</p>
								</div>

								{/* Step Content */}
								{currentStep === 1 && (
									<div className="space-y-6">
										<div>
											<label className="mb-2 block text-sm font-medium form-text">
												{copy('contactName')}
											</label>
											<input
												{...registerField('contactName')}
												className={inputClassName}
												placeholder={plain('contactNamePlaceholder')}
												type="text"
											/>
											{errors.contactName && (
												<p id="error-contactName" role="alert" className="t-error-msg mt-2 text-sm form-error">
{errors.contactName.message}
												</p>
											)}
										</div>

										<div>
											<label className="mb-2 block text-sm font-medium form-text">
												{copy('phoneNumber')}
											</label>
											<input
												{...registerField('phoneNumber')}
												className={inputClassName}
												placeholder={plain('phoneNumberPlaceholder')}
												type="tel"
											/>
											{errors.phoneNumber && (
												<p id="error-phoneNumber" role="alert" className="t-error-msg mt-2 text-sm form-error">
{errors.phoneNumber.message}
												</p>
											)}
										</div>

										<div>
											<label className="mb-2 block text-sm font-medium form-text">
												{copy('email')}
											</label>
											<input
												{...registerField('email')}
												type="email"
												className={inputClassName}
												placeholder={plain('emailPlaceholder')}
											/>
											{errors.email && (
												<p id="error-email" role="alert" className="t-error-msg mt-2 text-sm form-error">
{errors.email.message}
												</p>
											)}
										</div>

										<div>
											<label className="mb-2 block text-sm font-medium form-text">
												{copy('instagram')}
											</label>
											<input
												{...registerField('instagram')}
												className={inputClassName}
												placeholder={plain('instagramPlaceholder')}
												type="text"
											/>
											{errors.instagram && (
												<p id="error-instagram" role="alert" className="t-error-msg mt-2 text-sm form-error">
{errors.instagram.message}
												</p>
											)}
										</div>
									</div>
								)}

								{currentStep === 2 && (
									<div className="space-y-6">
										<div>
											<label className="mb-2 block text-sm font-medium form-text">
												{copy('filmTitle')}
											</label>
											<input
												{...registerField('filmTitle')}
												className={inputClassName}
												placeholder={plain('filmTitlePlaceholder')}
												type="text"
											/>
											{errors.filmTitle && (
												<p id="error-filmTitle" role="alert" className="t-error-msg mt-2 text-sm form-error">
{errors.filmTitle.message}
												</p>
											)}
										</div>

										<div>
											<label className="mb-2 block text-sm font-medium form-text">
												{copy('directorProducer')}
											</label>
											<input
												{...registerField('directorProducer')}
												className={inputClassName}
												placeholder={plain('directorProducerPlaceholder')}
												type="text"
											/>
											{errors.directorProducer && (
												<p id="error-directorProducer" role="alert" className="t-error-msg mt-2 text-sm form-error">
{errors.directorProducer.message}
												</p>
											)}
										</div>

										<div>
											<label className="mb-2 block text-sm font-medium form-text">
												{copy('projectHolder')}
											</label>
											<input
												{...registerField('projectHolder')}
												className={inputClassName}
												placeholder={plain('projectHolderPlaceholder')}
												type="text"
											/>
											{errors.projectHolder && (
												<p id="error-projectHolder" role="alert" className="t-error-msg mt-2 text-sm form-error">
{errors.projectHolder.message}
												</p>
											)}
										</div>

										<div>
											<label className="mb-2 block text-sm font-medium form-text">
												{copy('filmGenre')}
											</label>
											<select
												{...registerField('filmGenre')}
												className={selectClassName}
											>
												<option value="">{plain('genrePlaceholder')}</option>
												<option value="documentary">
													{plain('genreDocumentary')}
												</option>
												<option value="fiction">{plain('genreFiction')}</option>
												<option value="animation">{plain('genreAnimation')}</option>
												<option value="experimental">
													{plain('genreExperimental')}
												</option>
												<option value="musicVideo">
													{plain('genreMusicVideo')}
												</option>
												<option value="other">{plain('genreOther')}</option>
											</select>
											{errors.filmGenre && (
												<p id="error-filmGenre" role="alert" className="t-error-msg mt-2 text-sm form-error">
{errors.filmGenre.message}
												</p>
											)}
										</div>

										<div>
											<label className="mb-2 block text-sm font-medium form-text">
												{copy('yearOfCreation')}
											</label>
											<input
												{...registerField('yearOfCreation', { valueAsNumber: true })}
												type="number"
												className={inputClassName}
												placeholder={plain('yearOfCreationPlaceholder')}
												min="1900"
												max={new Date().getFullYear()}
											/>
											{errors.yearOfCreation && (
												<p id="error-yearOfCreation" role="alert" className="t-error-msg mt-2 text-sm form-error">
{errors.yearOfCreation.message}
												</p>
											)}
										</div>

										<div>
											<label className="mb-2 block text-sm font-medium form-text">
												{copy('languages')}
											</label>
											<div className="grid grid-cols-2 gap-2">
												{LANGUAGES.map((lang) => (
													<label
														key={lang}
														className="flex cursor-pointer items-center space-x-2"
													>
														<input
															type="checkbox"
															aria-invalid={Boolean(errors.languages)}
aria-describedby={errors.languages ? "error-languages" : undefined}
checked={watchedLanguages.includes(lang)}
															onChange={() =>
																toggleArrayValue(
																	watchedLanguages,
																	lang,
																	setValue,
																	'languages',
																)
															}
															className="h-4 w-4 rounded form-border form-field form-input-focus"
														/>
														<span className="text-sm form-text">
															{copy(('language' + lang) as CopyKey)}
														</span>
													</label>
												))}
											</div>
											{errors.languages && (
												<p id="error-languages" role="alert" className="t-error-msg mt-2 text-sm form-error">
{errors.languages.message}
												</p>
											)}
										</div>

										<div>
											<label className="mb-2 block text-sm font-medium form-text">
												{copy('filmFormat')}
											</label>
											<div className="space-y-2">
												{[
													{ value: 'dv', label: copy('formatDV') },
													{ value: 'hd', label: copy('formatHD') },
													{ value: '4k', label: copy('format4K') },
												].map((format) => (
													<label
														key={format.value}
														className="flex cursor-pointer items-center space-x-2"
													>
														<input
															{...registerField('filmFormat')}
															type="radio"
															value={format.value}
															className="h-4 w-4 form-border form-field form-input-focus"
														/>
														<span className="text-sm form-text">
															{format.label}
														</span>
													</label>
												))}
											</div>
											{errors.filmFormat && (
												<p id="error-filmFormat" role="alert" className="t-error-msg mt-2 text-sm form-error">
{errors.filmFormat.message}
												</p>
											)}
										</div>

										<div>
											<label className="mb-2 block text-sm font-medium form-text">
												{copy('duration')}
											</label>
											<input
												{...registerField('duration', { valueAsNumber: true })}
												type="number"
												className={inputClassName}
												placeholder={plain('durationPlaceholder')}
												min="1"
											/>
											{errors.duration && (
												<p id="error-duration" role="alert" className="t-error-msg mt-2 text-sm form-error">
{errors.duration.message}
												</p>
											)}
										</div>

										<div>
											<label className="mb-2 block text-sm font-medium form-text">
												{copy('subtitles')}
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
															className="h-4 w-4 rounded form-border form-field form-input-focus"
														/>
														<span className="text-sm form-text">
															{copy(('language' + lang) as CopyKey)}
														</span>
													</label>
												))}
											</div>
											<p className="mt-1 text-xs form-muted">
												{copy('subtitlesHint')}
											</p>
										</div>

										<div>
											<label className="mb-2 block text-sm font-medium form-text">
												{copy('downloadLink')}
											</label>
											<input
												{...registerField('downloadLink')}
												type="url"
												className={inputClassName}
												placeholder={plain('downloadLinkPlaceholder')}
											/>
											{errors.downloadLink && (
												<p id="error-downloadLink" role="alert" className="t-error-msg mt-2 text-sm form-error">
{errors.downloadLink.message}
												</p>
											)}
										</div>
									</div>
								)}

								{currentStep === 3 && (
									<div className="space-y-6">
										<div>
											<label className="mb-4 block text-sm font-medium form-text">
												{copy('professionalSupervision')}
											</label>
											<div className="space-y-2">
												<label className="flex cursor-pointer items-center space-x-2">
													<input
														{...registerField('professionalSupervision')}
														type="radio"
														value="true"
														checked={watch('professionalSupervision') === true}
														className="h-4 w-4 form-border form-field form-input-focus"
													/>
													<span className="text-sm form-text">
														{copy('yes')}
													</span>
												</label>
												<label className="flex cursor-pointer items-center space-x-2">
													<input
														{...registerField('professionalSupervision', {
															setValueAs: (v: string) => v === 'true',
														})}
														type="radio"
														value="false"
														checked={watch('professionalSupervision') === false}
														className="h-4 w-4 form-border form-field form-input-focus"
													/>
													<span className="text-sm form-text">
														{copy('no')}
													</span>
												</label>
											</div>
											{errors.professionalSupervision && (
												<p id="error-professionalSupervision" role="alert" className="t-error-msg mt-2 text-sm form-error">
{errors.professionalSupervision.message}
												</p>
											)}
										</div>

										<div>
											<label className="mb-4 block text-sm font-medium form-text">
												{copy('filmSchoolGraduates')}
											</label>
											<div className="space-y-2">
												<label className="flex cursor-pointer items-center space-x-2">
													<input
														{...registerField('filmSchoolGraduates', {
															setValueAs: (v: string) => v === 'true',
														})}
														type="radio"
														value="true"
														checked={watch('filmSchoolGraduates') === true}
														className="h-4 w-4 form-border form-field form-input-focus"
													/>
													<span className="text-sm form-text">
														{copy('yes')}
													</span>
												</label>
												<label className="flex cursor-pointer items-center space-x-2">
													<input
														{...registerField('filmSchoolGraduates', {
															setValueAs: (v: string) => v === 'true',
														})}
														type="radio"
														value="false"
														checked={watch('filmSchoolGraduates') === false}
														className="h-4 w-4 form-border form-field form-input-focus"
													/>
													<span className="text-sm form-text">
														{copy('no')}
													</span>
												</label>
											</div>
											{errors.filmSchoolGraduates && (
												<p id="error-filmSchoolGraduates" role="alert" className="t-error-msg mt-2 text-sm form-error">
{errors.filmSchoolGraduates.message}
												</p>
											)}
										</div>

										<div>
											<label className="mb-2 block text-sm font-medium form-text">
												{copy('previousAwards')}
											</label>
											<textarea
												{...registerField('previousAwards')}
												rows={4}
												className={textareaClassName}
												placeholder={plain('previousAwardsPlaceholder')}
											/>
										</div>
									</div>
								)}

								{currentStep === 4 && (
									<div className="space-y-6">
										<div>
											<label className="flex cursor-pointer items-start space-x-3">
												<input
													{...registerField('dataConsent')}
													type="checkbox"
													className="mt-1 h-5 w-5 rounded form-border form-field form-input-focus"
												/>
												<span className="text-sm form-text">
													{copy('dataConsent')}
												</span>
											</label>
											{errors.dataConsent && (
												<p id="error-dataConsent" role="alert" className="t-error-msg mt-2 text-sm form-error">
{errors.dataConsent.message}
												</p>
											)}
										</div>

										<div className="rounded-lg bg-blue-50 p-4">
											<div className="text-sm form-text">
												{copyBlock('privacyNotice')}
											</div>
										</div>
									</div>
								)}
							</motion.div>
						</AnimatePresence>

						{/* Navigation */}
						<div className="flex items-center justify-between gap-3 border-t form-border form-background py-4 lg:sticky lg:bottom-0 lg:z-10">
							<button
								type="button"
								onClick={prevStep}
								disabled={!ready || currentStep === 1}
								className="flex items-center space-x-2 rounded-lg form-muted-surface px-5 py-3 form-text transition-colors hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
							>
								<IoArrowBack />
								<span>{copy('previous', false)}</span>
							</button>

							{currentStep < steps.length ? (
								<button
									type="button"
									onClick={nextStep}
 disabled={!ready}
									className="flex items-center space-x-2 rounded-lg form-accent px-5 py-3 transition-colors hover:opacity-80"
								>
									<span>{copy('next', false)}</span>
									<IoArrowForward />
								</button>
							) : (
								<button
									type="submit"
									disabled={!ready || isSubmitting}
									className="flex items-center space-x-2 rounded-lg form-accent px-5 py-3 transition-colors hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
								>
									<IoRocket />
									<span>
										{isSubmitting ? copy('sending', false) : copy('submit', false)}
									</span>
								</button>
							)}
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default FilmSubmissionForm
