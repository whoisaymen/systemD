import {z} from 'zod'
import defaults from '@/content/filmSubmissionCopy.json'
type CopyKey = keyof typeof defaults
export const createFilmSubmissionSchema = (plain: (key: CopyKey) => string) =>
	z.object({
		// Level 1: Contact Info
		contactName: z.string({ error: plain('validation1') }).min(2, plain('validation1')),
		phoneNumber: z.string({ error: plain('validation2') }).min(10, plain('validation2')),
		email: z.string({ error: plain('validation3') }).email(plain('validation3')),
		instagram: z.string({ error: plain('validation4') }).min(1, plain('validation4')),

		// Level 2: Film Details
		filmTitle: z.string({ error: plain('validation5') }).min(1, plain('validation5')),
		directorProducer: z.string({ error: plain('validation6') }).min(1, plain('validation6')),
		projectHolder: z.string({ error: plain('validation7') }).min(1, plain('validation7')),
		filmGenre: z.string({ error: plain('validation8') }).min(1, plain('validation8')),
		yearOfCreation: z
			.number({ error: plain('validation9') })
			.min(1900, plain('validation9'))
			.max(new Date().getFullYear(), plain('validation10')),
		languages: z.array(z.string(), { error: plain('validation11') }).min(1, plain('validation11')),
		filmFormat: z.enum(['dv', 'hd', '4k'], { error: plain('validation15') }),
		duration: z.number({ error: plain('validation12') }).min(1, plain('validation12')),
		subtitles: z.array(z.string()).optional(),
		downloadLink: z.string({ error: plain('validation13') }).url(plain('validation13')),

		// Level 3: Professional Background

		professionalSupervision: z.boolean({ error: plain('validation16') }),
		filmSchoolGraduates: z.boolean({ error: plain('validation16') }),
		previousAwards: z.string().optional(),

		// Level 4: Consent
		dataConsent: z.boolean({ error: plain('validation14') }).refine((val) => val === true, {
			message: plain('validation14'),
		}),
	})

