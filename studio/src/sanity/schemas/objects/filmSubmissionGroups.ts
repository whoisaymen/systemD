export const formGroups = [
 {name: 'intro', title: 'Introduction', default: true},
 {name: 'step1', title: '1. Coordonnées'},
 {name: 'step2', title: '2. Film'},
 {name: 'step3', title: '3. Parcours'},
 {name: 'step4', title: '4. Consentement'},
 {name: 'navigation', title: 'Boutons'},
 {name: 'success', title: 'Confirmation'},
 {name: 'errors', title: 'Validation'},
]
export const formGroupFor = (name: string, group: string) => {
 if (['intro', 'navigation', 'success', 'errors'].includes(group)) return group
 if (/^step[1-4]/.test(name)) return name.slice(0, 5)
 if (/^(contactName|phoneNumber|email|instagram)/.test(name)) return 'step1'
 if (/^(professionalSupervision|filmSchoolGraduates|previousAwards|yes$|no$)/.test(name)) return 'step3'
 if (group === 'consent') return 'step4'
 return 'step2'
}
export const formTitles: Record<string, string> = {
 title: 'Titre', intro: 'Présentation', introSignoff: 'Texte de conclusion',
 successTitle: 'Titre de confirmation', successDescription: 'Message de confirmation', successSignoff: 'Texte de conclusion',
 privacyNotice: 'Confidentialité', dataConsent: 'Accord pour le traitement des données',
}
