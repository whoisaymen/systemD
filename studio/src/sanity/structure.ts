import { structureTool } from 'sanity/structure'
import { singleton } from './lib/utils'
import { VscCalendar, VscServerProcess, VscSymbolColor } from 'react-icons/vsc'
import { GiFactory, GiGooExplosion, GiBrain } from 'react-icons/gi'
import {
	FaFilm,
	FaUserFriends,
	FaTags,
	FaClipboardList,
	FaInfoCircle,
	FaHome,
	FaBook,
} from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'

export const structure = structureTool({
	name: 'content',
	title: 'Content',
	structure: (S) =>
		S.list()
			.title('CMS')
			.items([
				singleton(S, 'homepage', "Page d'accueil").icon(FaHome),
				singleton(S, 'site', 'Réglages').icon(VscServerProcess),
				S.documentTypeListItem('theme').title('Thèmes').icon(VscSymbolColor),

				S.divider(),

				singleton(S, 'lefestival', 'Le Festival').icon(VscCalendar),

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
								// S.documentTypeListItem('bigbangLongStory')
								// 	.title('All Long Stories')
								// 	.icon(FaBook),
							]),
					),
				singleton(S, 'memoire', 'La Mémoire').icon(GiBrain),
				singleton(S, 'fabrique', 'La Fabrique').icon(GiFactory),
				S.documentTypeListItem('person').title("L'Équipe"),

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
				singleton(S, 'contact', 'Contact').icon(MdEmail),
				S.documentTypeListItem('filmSubmission')
					.title('Soumissions de films')
					.icon(FaClipboardList),
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
			]),
})
