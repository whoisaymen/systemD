import { structureTool } from 'sanity/structure'
import { group, singleton } from './lib/utils'
import { VscMultipleWindows, VscServerProcess } from 'react-icons/vsc'
import { BsDatabaseAdd } from 'react-icons/bs'
import {
	GiFactory,
	GiGooExplosion,
	GiPartyPopper,
	GiBrain,
} from 'react-icons/gi'
import {
	FaPhotoVideo,
	FaFilm,
	FaCamera,
	FaVideo,
	FaUserFriends,
	FaTags,
	FaFileAlt,
	FaClipboardList,
	FaInfoCircle,
	FaAward,
	FaHome,
	FaMapMarkerAlt,
	FaNewspaper,
	FaCalendarAlt,
	FaBook,
} from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'

import { VscCalendar } from 'react-icons/vsc'

export const structure = structureTool({
	name: 'content',
	title: 'Content',
	structure: (S) =>
		S.list()
			.title('CMS')
			.items([
				singleton(S, 'site', 'Réglages').icon(VscServerProcess),
				singleton(S, 'homepage', "Page d'accueil").icon(FaHome),
				// S.documentTypeListItem('homepage'),

				S.divider(),

				// singleton(S, 'bigbang', 'Big Bang').icon(GiGooExplosion),
				S.listItem()
					.title('Big Bang')
					.icon(GiGooExplosion)
					.child(
						S.list()
							.title('Big Bang')
							.items([
								singleton(S, 'bigbangShortStory', 'Short story').icon(
									FaInfoCircle,
								),
								singleton(S, 'bigbangLongStory', 'Long story').icon(FaBook),
							]),
					),
				singleton(S, 'fabrique', 'La Fabrique').icon(GiFactory),
				S.documentTypeListItem('person').title("L'Équipe"),
				singleton(S, 'memoire', 'La Mémoire').icon(GiBrain),
				singleton(S, 'lefestival', 'Le Festival').icon(VscCalendar),

				// S.listItem()
				// 	.title('Le Festival')
				// 	.icon(GiPartyPopper)
				// 	.child(
				// 		S.list()
				// 			.title('Le Festival')
				// 			.items([
				// 				singleton(S, 'lefestival', 'Info').icon(FaInfoCircle),
				// 				singleton(
				// 					S,
				// 					'callForParticipation',
				// 					'Appel à participation',
				// 				).icon(FaClipboardList),
				// 				singleton(S, 'programming', 'Programmation').icon(
				// 					FaCalendarAlt,
				// 				),
				// 				singleton(S, 'award', 'Prix').icon(FaAward),
				// 				singleton(S, 'practicalInfo', 'Infos pratiques').icon(
				// 					FaMapMarkerAlt,
				// 				),
				// 				singleton(S, 'press', 'Presse').icon(FaNewspaper),
				// 			]),
				// 	),
				S.divider(),

				S.documentTypeListItem('festival').title('Festivals').icon(VscCalendar),
				S.listItem()
					.title('Films')
					.icon(FaFilm)
					.child(
						S.list()
							.title('Filtres des Films')
							.items([
								S.listItem()
									.title('Tous les Films')
									.child(
										S.documentList()
											.title('Tous les Films')
											.filter('_type == "film"'),
									),
								S.listItem()
									.title('Films par Édition du Festival')
									.child(
										S.documentTypeList('festival')
											.title('Éditions du Festival')
											.child((festivalId) =>
												S.documentList()
													.title("Films de l'Édition")
													.filter(
														'_type == "film" && festival._ref == $festivalId',
													)
													.params({ festivalId }),
											),
									),
								S.listItem()
									.title('Films par Genre')
									.child(
										S.documentTypeList('genre')
											.title('Genres')
											.child((genreId) =>
												S.documentList()
													.title('Films')
													.filter('_type == "film" && genre._ref == $genreId')
													.params({ genreId }),
											),
									),
							]),
					),
				// S.documentTypeListItem('film').title('Films').icon(FaFilm),
				// S.documentTypeListItem('jury').title('Jurys').icon(FaUserFriends),
				S.listItem()
					.title('Jurys')
					.icon(FaUserFriends)
					.child(
						S.list()
							.title('Filtres des Jurys')
							.items([
								S.listItem()
									.title('Tous les Jurys')
									.child(
										S.documentList()
											.title('Tous les Jurys')
											.filter('_type == "jury"'),
									),
								S.listItem()
									.title('Jurys par Édition du Festival')
									.child(
										S.documentTypeList('festival')
											.title('Éditions du Festival')
											.child((festivalId) =>
												S.documentList()
													.title("Jurys de l'Édition")
													.filter(
														'_type == "jury" && edition._ref == $festivalId',
													)
													.params({ festivalId }),
											),
									),
							]),
					),
				S.documentTypeListItem('genre').title('Genres').icon(FaTags),
				S.divider(),

				S.documentTypeListItem('event').title('Événements'),
				S.divider(),

				// S.listItem()
				// 	.title('Médiathèque')
				// 	.icon(FaPhotoVideo)
				// 	.child(
				// 		S.list()
				// 			.title('Médiathèque')
				// 			.items([
				// 				S.documentTypeListItem('film').title('Films').icon(FaFilm),
				// 				S.documentTypeListItem('photo').title('Photos').icon(FaCamera),
				// 				S.documentTypeListItem('video').title('Vidéos').icon(FaVideo),
				// 			]),
				// 	),

				// // S.documentTypeListItem('page').title('Pages').icon(VscMultipleWindows),
				// S.documentTypeListItem('blog.category').title('Tags'),
				// S.divider(),

				// group(S, 'Autres', [
				// 	S.documentTypeListItem('announcement').title('Announcements'),
				// ]).icon(BsDatabaseAdd),

				singleton(S, 'contact', 'Contact').icon(MdEmail),
			]),
})
