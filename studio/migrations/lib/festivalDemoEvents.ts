import { textToBlocks } from './editorialContent'

const localized = (en: string, fr: string, nl: string) =>
	[en, fr, nl].map((text, index) => ({
		_type: 'internationalizedArrayRichTextValue',
		_key: ['en', 'fr', 'nl'][index],
		language: ['en', 'fr', 'nl'][index],
		value: textToBlocks(text),
	}))

const eventType = (id: string, en: string, fr: string, nl: string) => ({
	_id: `demo-festival-event-type-${id}`,
	_type: 'eventType',
	title: [en, fr, nl].map((value, index) => ({
		_type: 'internationalizedArrayStringValue',
		_key: ['en', 'fr', 'nl'][index],
		language: ['en', 'fr', 'nl'][index],
		value,
	})),
})

export const demoEventTypes = {
	screening: eventType('screening', 'Screening', 'Projection', 'Filmvertoning'),
	talk: eventType('talk', 'Talk', 'Discussion', 'Gesprek'),
	performance: eventType(
		'performance',
		'Performance',
		'Performance',
		'Performance',
	),
	workshop: eventType('workshop', 'Workshop', 'Atelier', 'Workshop'),
	exhibition: eventType(
		'exhibition',
		'Exhibition',
		'Exposition',
		'Tentoonstelling',
	),
	meetup: eventType('meetup', 'Meetup', 'Rencontre', 'Ontmoeting'),
}

// Reuse existing festival archive photographs; the seed does not upload assets.
const archiveImages = [
	'image-011a481c248adb5deb485bd04dc9e47555a29445-1080x720-jpg',
	'image-01dd157cac518bab21b4e36ca7d0965fe8a46f55-1080x720-jpg',
	'image-046d2082a6e31fb9080568bbd463941f85bb5f0c-1080x720-jpg',
]

const portraitImages = {
	festival: 'image-2da5997ed1271f637e39e33d691b8a820a9918fa-1363x2048-jpg',
	conversation: 'image-020c688d6d92b1c9ca6f9e98fcdd37936c7c55cd-1367x2048-jpg',
}

const samples = [
	{
		id: 'neighbourhood-screening',
		eventType: demoEventTypes.screening,
		start: '03-12T18:00:00Z',
		end: '03-12T21:00:00Z',
		location: 'Cinema room · Brussels',
		title: localized(
			'Stories from the neighbourhood',
			'Histoires de quartier',
			'Verhalen uit de buurt',
		),
		description: localized(
			'A shared screen for stories usually left out of the frame. Discover four short films about everyday life in Brussels, followed by a conversation with the people who made them.\n\nDoors open 30 minutes before the screening. Films in their original languages with French and Dutch subtitles. Free entry, subject to available seats.',
			'Un écran partagé pour des récits qui restent souvent hors champ. Découvrez quatre courts métrages sur la vie quotidienne à Bruxelles, suivis d’une discussion avec leurs équipes.\n\nOuverture des portes 30 minutes avant la projection. Films en version originale, sous-titrés en français et en néerlandais. Entrée libre dans la limite des places disponibles.',
			'Een gedeeld scherm voor verhalen die vaak buiten beeld blijven. Ontdek vier kortfilms over het dagelijkse leven in Brussel en praat daarna met de makers.\n\nDe deuren openen 30 minuten voor de vertoning. Films in de oorspronkelijke taal met Franse en Nederlandse ondertitels. Gratis toegang zolang er plaatsen beschikbaar zijn.',
		),
	},
	{
		id: 'film-workshop',
		eventType: demoEventTypes.workshop,
		start: '06-09T08:00:00Z',
		end: '06-10T15:00:00Z',
		location: 'Workshop studio · Brussels',
		title: localized(
			'Film it your way',
			'Filme à ta façon',
			'Film op jouw manier',
		),
		description: localized(
			'Two days to turn an idea into a first film. Work in small groups, try out a camera, record sound and edit a short scene with support from local filmmakers. No previous experience needed.\n\nDay one: ideas, framing and filming. Day two: editing, sound and a collective screening. Bring a phone or camera if you have one; shared equipment is available.\n\nFor ages 16 and up. Sessions in French, Dutch and English. Twelve places; lunch and equipment included.',
			'Deux jours pour transformer une idée en premier film. En petits groupes, expérimentez la caméra, la prise de son et le montage d’une scène avec des cinéastes bruxellois. Aucune expérience préalable nécessaire.\n\nPremier jour : idées, cadrage et tournage. Deuxième jour : montage, son et projection collective. Apportez un téléphone ou une caméra si vous en avez ; du matériel est disponible sur place.\n\nDès 16 ans. Atelier en français, néerlandais et anglais. Douze places ; repas et matériel compris.',
			'Twee dagen om een idee in een eerste film om te zetten. Werk in kleine groepen en probeer camera, geluid en montage uit met begeleiding van Brusselse filmmakers. Ervaring is niet nodig.\n\nDag één: ideeën, kadrering en filmen. Dag twee: montage, geluid en een gezamenlijke vertoning. Breng gerust een telefoon of camera mee; gedeeld materiaal is beschikbaar.\n\nVanaf 16 jaar. Begeleiding in het Nederlands, Frans en Engels. Twaalf plaatsen; lunch en materiaal inbegrepen.',
		),
	},
	{
		id: 'city-after-dark',
		eventType: demoEventTypes.screening,
		start: '09-18T17:00:00Z',
		end: '09-18T19:00:00Z',
		location: 'Screening room · Brussels',
		title: localized(
			'City after dark',
			'La ville à la nuit tombée',
			'De stad na zonsondergang',
		),
		description: localized(
			'A programme of short films following the city after sunset: night workers, late journeys and unexpected encounters. An intimate look at the people who keep Brussels moving.\n\nThe screening lasts 75 minutes and is followed by a short audience discussion. Original versions with subtitles. Pay what you can.',
			'Un programme de courts métrages qui suit la ville après le coucher du soleil : travail de nuit, derniers trajets et rencontres inattendues. Un regard intime sur celles et ceux qui font vivre Bruxelles.\n\nLa projection dure 75 minutes et se poursuit par un échange avec le public. Versions originales sous-titrées. Prix libre.',
			'Een kortfilmprogramma over de stad na zonsondergang: nachtwerk, late ritten en onverwachte ontmoetingen. Een intieme blik op de mensen die Brussel in beweging houden.\n\nDe vertoning duurt 75 minuten, gevolgd door een kort publieksgesprek. Originele versies met ondertitels. Betaal wat je kunt.',
		),
	},
	{
		id: 'meet-filmmakers',
		imageRef: portraitImages.conversation,
		eventType: demoEventTypes.talk,
		start: '09-18T19:30:00Z',
		end: '09-18T21:00:00Z',
		location: 'Festival foyer · Brussels',
		title: localized(
			'Meet the filmmakers',
			'Rencontre avec les cinéastes',
			'Ontmoet de filmmakers',
		),
		description: localized(
			'Stay after the screening for an informal conversation about first films, shared resources and finding your own voice. Bring your questions, an idea in progress or simply your curiosity.\n\nFree entry. Conversation in French, Dutch and English, with time to meet the guests afterwards.',
			'Restez après la projection pour une conversation informelle sur les premiers films, les ressources partagées et la recherche de sa propre voix. Venez avec vos questions, une idée en cours ou simplement votre curiosité.\n\nEntrée libre. Échanges en français, néerlandais et anglais, puis rencontre avec les invité·es.',
			'Blijf na de vertoning voor een informeel gesprek over eerste films, gedeelde middelen en je eigen stem vinden. Breng vragen, een idee in ontwikkeling of gewoon je nieuwsgierigheid mee.\n\nGratis toegang. Gesprek in het Nederlands, Frans en Engels, met tijd om de gasten nadien te ontmoeten.',
		),
	},
	{
		id: 'no-budget-lab',
		eventType: demoEventTypes.workshop,
		start: '09-26T11:00:00Z',
		end: '09-26T16:00:00Z',
		location: 'Editing lab · Brussels',
		title: localized(
			'No-budget film lab',
			'Labo cinéma sans budget',
			'Filmlab zonder budget',
		),
		description: localized(
			'How much can you make with what you already have? A hands-on afternoon exploring homemade lighting, simple sound recording and creative editing.\n\nBring a short piece of footage or start from the shared material. Open to beginners and returning makers. Equipment is provided; places are limited to ten participants.',
			'Que peut-on créer avec ce que l’on a déjà ? Un après-midi pratique autour de la lumière bricolée, de la prise de son simple et du montage créatif.\n\nApportez quelques images ou utilisez les rushes proposés. Ouvert aux débutant·es et aux personnes qui pratiquent déjà. Matériel fourni ; dix participant·es maximum.',
			'Wat kun je maken met wat je al hebt? Een praktische namiddag over zelfgemaakte belichting, eenvoudige geluidsopnames en creatieve montage.\n\nBreng eigen beelden mee of werk met het gedeelde materiaal. Voor beginners en ervaren makers. Materiaal is voorzien; maximaal tien deelnemers.',
		),
	},
	{
		id: 'open-studio',
		imageRef: portraitImages.festival,
		eventType: demoEventTypes.meetup,
		start: '09-03T15:00:00Z',
		end: '09-03T18:00:00Z',
		location: 'Workshop studio · Brussels',
		title: localized('Open studio', 'Atelier ouvert', 'Open atelier'),
		description: localized(
			'Meet the festival team, explore the shared equipment and discover projects in progress. Bring an idea or simply drop by.\n\nFree entry. Demonstrations and informal conversations throughout the afternoon.',
			'Rencontrez l’équipe du festival, découvrez le matériel partagé et les projets en cours. Venez avec une idée ou passez simplement nous voir.\n\nEntrée libre. Démonstrations et échanges informels tout au long de l’après-midi.',
			'Ontmoet het festivalteam, ontdek het gedeelde materiaal en bekijk projecten in ontwikkeling. Breng een idee mee of kom gewoon langs.\n\nGratis toegang. Demonstraties en informele gesprekken de hele namiddag.',
		),
	},
	{
		id: 'sound-walk',
		eventType: demoEventTypes.workshop,
		start: '09-05T08:00:00Z',
		end: '09-05T11:00:00Z',
		location: 'Festival foyer · Brussels',
		title: localized(
			'Listen to the city',
			'Écouter la ville',
			'Luister naar de stad',
		),
		description: localized(
			'A guided sound walk through the neighbourhood. Record street rhythms, small conversations and the sounds we usually overlook.\n\nMeet at the festival foyer. Recorders are provided; comfortable shoes recommended.',
			'Une promenade sonore guidée dans le quartier. Enregistrez les rythmes de la rue, les conversations et les sons qui passent souvent inaperçus.\n\nRendez-vous dans le foyer du festival. Enregistreurs fournis ; chaussures confortables conseillées.',
			'Een begeleide geluidswandeling door de buurt. Neem straatritmes, korte gesprekken en geluiden op die we vaak missen.\n\nWe verzamelen in de festivalfoyer. Recorders zijn voorzien; comfortabele schoenen aanbevolen.',
		),
	},
	{
		id: 'archive-evening',
		imageRef: null,
		eventType: demoEventTypes.performance,
		start: '09-10T17:00:00Z',
		end: '09-10T19:00:00Z',
		location: 'Cinema room · Brussels',
		title: localized(
			'From the archives',
			'Dans les archives',
			'Uit het archief',
		),
		description: localized(
			'Archive images meet live music in a one-off performance. Two artists remix footage from earlier festival editions, creating new connections between memories, faces and places.\n\nA 60-minute live cinema performance followed by a conversation with the artists. Free entry.',
			'Des images d’archives rencontrent la musique en direct le temps d’une performance unique. Deux artistes remixent des images des éditions précédentes et tissent de nouveaux liens entre souvenirs, visages et lieux.\n\nUne performance de cinéma en direct de 60 minutes, suivie d’une discussion avec les artistes. Entrée libre.',
			'Archiefbeelden ontmoeten livemuziek in een eenmalige performance. Twee kunstenaars remixen beelden uit eerdere festivaledities en leggen nieuwe verbanden tussen herinneringen, gezichten en plekken.\n\nEen livecinemaperformance van 60 minuten, gevolgd door een gesprek met de kunstenaars. Gratis toegang.',
		),
	},
	{
		id: 'animation-workshop',
		eventType: demoEventTypes.workshop,
		start: '09-12T12:00:00Z',
		end: '09-12T15:00:00Z',
		location: 'Workshop studio · Brussels',
		title: localized(
			'Small objects, big adventures',
			'Petits objets, grandes aventures',
			'Kleine voorwerpen, grote avonturen',
		),
		description: localized(
			'Turn everyday objects into the stars of a stop-motion film. Build a tiny set, invent a character and create a short animated scene.\n\nA family workshop for ages eight and up, with an accompanying adult. Materials included.',
			'Transformez les objets du quotidien en vedettes d’un film en stop motion. Construisez un décor miniature, inventez un personnage et animez une courte scène.\n\nAtelier familial dès huit ans, avec un adulte accompagnant. Matériel compris.',
			'Maak van alledaagse voorwerpen de sterren van een stop-motionfilm. Bouw een klein decor, verzin een personage en animeer een korte scène.\n\n' +
				'Een familieworkshop vanaf acht jaar, samen met een volwassene. Materiaal inbegrepen.',
		),
	},
	{
		id: 'rough-cut-club',
		eventType: demoEventTypes.workshop,
		start: '09-19T13:00:00Z',
		end: '09-19T16:00:00Z',
		location: 'Editing lab · Brussels',
		title: localized(
			'Rough-cut club',
			'Le club des premiers montages',
			'Ruwemontageclub',
		),
		description: localized(
			'Share a work in progress in a small, supportive group. We watch unfinished scenes and exchange practical feedback on rhythm, structure and sound.\n\nBring up to ten minutes of footage. You are also welcome to watch and join the discussion.',
			'Partagez un projet en cours au sein d’un petit groupe bienveillant. Regardons des scènes inachevées et échangeons sur le rythme, la structure et le son.\n\nApportez jusqu’à dix minutes d’images. Vous pouvez aussi simplement participer à la discussion.',
			'Deel een werk in ontwikkeling in een kleine, ondersteunende groep. We bekijken onafgewerkte scènes en geven praktische feedback over ritme, structuur en geluid.\n\nBreng maximaal tien minuten beeld mee. Ook kijken en meepraten is welkom.',
		),
	},
	{
		id: 'neighbourhood-portraits',
		imageRef: portraitImages.conversation,
		eventType: demoEventTypes.exhibition,
		start: '09-24T16:00:00Z',
		end: '09-24T19:00:00Z',
		location: 'Exhibition space · Brussels',
		title: localized(
			'Portraits of a neighbourhood',
			'Portraits de quartier',
			'Portretten van een buurt',
		),
		description: localized(
			'Photographs and short filmed portraits made with local residents. Explore the exhibition and meet the people on both sides of the camera.\n\nDrop in at any time. A shared conversation begins one hour after opening. Free entry.',
			'Des photographies et de courts portraits filmés réalisés avec les habitant·es. Découvrez l’exposition et rencontrez les personnes devant et derrière la caméra.\n\nVenez à tout moment. Un échange collectif débute une heure après l’ouverture. Entrée libre.',
			'Foto’s en korte filmportretten gemaakt met buurtbewoners. Ontdek de tentoonstelling en ontmoet de mensen voor en achter de camera.\n\nKom langs wanneer het past. Een gezamenlijk gesprek begint één uur na de opening. Gratis toegang.',
		),
	},
	{
		id: 'outdoor-screening',
		eventType: demoEventTypes.screening,
		start: '09-30T17:00:00Z',
		end: '09-30T20:00:00Z',
		location: 'Festival courtyard · Brussels',
		title: localized(
			'Cinema under the stars',
			'Cinéma sous les étoiles',
			'Cinema onder de sterren',
		),
		description: localized(
			'End the month with an outdoor programme of audience favourites. A shared screen, a few blankets and stories that bring us together.\n\nDoors open 30 minutes before the first film. Bring a warm layer; the screening moves indoors if it rains. Free entry.',
			'Terminons le mois en plein air avec les coups de cœur du public. Un écran partagé, quelques couvertures et des histoires qui nous rassemblent.\n\nOuverture des portes 30 minutes avant le premier film. Prévoyez un vêtement chaud ; projection en salle en cas de pluie. Entrée libre.',
			'Sluit de maand af met een buitenvertoning van publieksfavorieten. Een gedeeld scherm, een paar dekens en verhalen die ons samenbrengen.\n\nDe deuren openen 30 minuten voor de eerste film. Breng iets warms mee; bij regen verhuizen we naar binnen. Gratis toegang.',
		),
	},
	{
		id: 'moving-images',
		eventType: demoEventTypes.exhibition,
		start: '10-30T16:00:00Z',
		end: '11-01T18:00:00Z',
		location: 'Exhibition space · Brussels',
		title: localized(
			'Moving images, moving stories',
			'Images en mouvement, récits vivants',
			'Bewegende beelden, levende verhalen',
		),
		description: localized(
			'A three-day exhibition bringing film, photography and collected voices into one shared space. Move between looping films, listening stations and images from the festival archive.\n\nOpening on Friday at 17:00. Open Saturday and Sunday from 11:00 to 19:00. Free entry; visitors can arrive at any time. A guided conversation takes place each afternoon at 15:00.',
			'Trois jours d’exposition réunissant films, photographies et voix dans un même espace. Circulez entre projections en boucle, stations d’écoute et images des archives du festival.\n\nVernissage vendredi à 17 h. Ouverture samedi et dimanche de 11 h à 19 h. Entrée libre, à tout moment. Une visite-discussion est proposée chaque après-midi à 15 h.',
			'Een driedaagse tentoonstelling waarin film, fotografie en verzamelde stemmen samenkomen. Ontdek doorlopende films, luisterplekken en beelden uit het festivalarchief.\n\nOpening op vrijdag om 17 uur. Zaterdag en zondag open van 11 tot 19 uur. Gratis toegang; kom wanneer je wilt. Elke namiddag is er om 15 uur een begeleid gesprek.',
		),
	},
	{
		id: 'new-voices',
		eventType: demoEventTypes.screening,
		start: '12-16T18:00:00Z',
		end: '12-16T21:00:00Z',
		location: 'Main screening room · Brussels',
		title: localized(
			'New voices, big screen',
			'Nouvelles voix, grand écran',
			'Nieuwe stemmen, groot scherm',
		),
		description: localized(
			'An evening dedicated to first films and fresh perspectives. Five emerging filmmakers share stories of friendship, belonging and the places that shape us.\n\nEach film is introduced by its maker. The programme ends with an open discussion and a drink in the foyer. Doors at 18:30; screening at 19:00. Subtitled films and step-free access.',
			'Une soirée consacrée aux premiers films et aux regards nouveaux. Cinq cinéastes émergent·es racontent l’amitié, l’appartenance et les lieux qui nous façonnent.\n\nChaque film est présenté par son équipe. La soirée se termine par une discussion ouverte et un verre dans le foyer. Portes à 18 h 30 ; projection à 19 h. Films sous-titrés et accès de plain-pied.',
			'Een avond voor eerste films en frisse perspectieven. Vijf opkomende filmmakers vertellen over vriendschap, verbondenheid en de plekken die ons vormen.\n\nElke film wordt door de maker ingeleid. We sluiten af met een open gesprek en een drankje in de foyer. Deuren om 18.30 uur; vertoning om 19 uur. Ondertitelde films en drempelvrije toegang.',
		),
	},
	{
		id: 'closing-night',
		eventType: demoEventTypes.meetup,
		start: '12-21T17:00:00Z',
		end: '12-21T22:00:00Z',
		location: 'Festival foyer and screening room · Brussels',
		title: localized(
			'Closing night: films, food & conversation',
			'Soirée de clôture : films, repas et rencontres',
			'Slotavond: films, eten en gesprekken',
		),
		description: localized(
			'One last gathering before the screens go dark. Revisit audience favourites, share a meal and meet the people behind this edition.\n\n18:00 — welcome and shared food. 19:30 — short-film highlights. 21:00 — music and conversation. Vegetarian food is available. Come for the whole evening or drop in when you can.',
			'Un dernier rendez-vous avant que les écrans ne s’éteignent. Retrouvez les coups de cœur du public, partagez un repas et rencontrez les personnes qui ont fait cette édition.\n\n18 h — accueil et repas partagé. 19 h 30 — sélection de courts métrages. 21 h — musique et rencontres. Option végétarienne disponible. Venez pour toute la soirée ou passez quand vous pouvez.',
			'Nog één keer samen voordat de schermen doven. Herbekijk publieksfavorieten, deel een maaltijd en ontmoet de mensen achter deze editie.\n\n18 uur — welkom en samen eten. 19.30 uur — kortfilmhoogtepunten. 21 uur — muziek en gesprekken. Vegetarisch eten is beschikbaar. Blijf de hele avond of kom langs wanneer het past.',
		),
	},
]

export function getFestivalDemoEvents(year: number) {
	return samples.map(
		({ id, start, end, imageRef, eventType, ...content }, index) => ({
			...content,
			_id: `demo-festival-${year}-${id}`,
			_type: 'event',
			eventType: { _type: 'reference', _ref: eventType._id },
			date: `${year}-${start}`,
			endDate: `${year}-${end}`,
			...(imageRef === null
				? {}
				: {
						visual: {
							_type: 'image',
							asset: {
								_type: 'reference',
								_ref: imageRef ?? archiveImages[index % archiveImages.length],
							},
						},
					}),
		}),
	)
}
