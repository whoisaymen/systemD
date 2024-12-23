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
	FaMapMarkerAlt,
	FaNewspaper,
	FaCalendarAlt,
} from 'react-icons/fa'
import { VscCalendar } from 'react-icons/vsc'

export const structure = structureTool({
	name: 'content',
	title: 'Content',
	structure: (S) =>
		S.list()
			.title('Contenu')
			.items([
				singleton(S, 'site', 'Réglages').icon(VscServerProcess),
				S.documentTypeListItem('navigation'),

				S.divider(),

				// singleton(S, 'bigbang', 'Big Bang').icon(GiGooExplosion),
				S.listItem()
					.title('Big Bang')
					.icon(GiGooExplosion)
					.child(
						S.list()
							.title('Big Bang')
							.items([
								singleton(S, 'bigbang', 'Short story').icon(FaInfoCircle),
							]),
					),
				S.listItem()
					.title('Le Festival')
					.icon(GiPartyPopper)
					.child(
						S.list()
							.title('Le Festival')
							.items([
								singleton(S, 'festival', 'Info').icon(FaInfoCircle),
								singleton(
									S,
									'callForParticipation',
									'Appel à participation',
								).icon(FaClipboardList),
								singleton(S, 'programming', 'Programmation').icon(
									FaCalendarAlt,
								),
								singleton(S, 'award', 'Prix').icon(FaAward),
								singleton(S, 'practicalInfo', 'Infos pratiques').icon(
									FaMapMarkerAlt,
								),
								singleton(S, 'press', 'Presse').icon(FaNewspaper),
							]),
					),
				singleton(S, 'fabrique', 'La Fabrique').icon(GiFactory),
				singleton(S, 'memoire', 'La Mémoire').icon(GiBrain),
				S.documentTypeListItem('person').title("L'Équipe"),
				S.divider(),

				S.listItem()
					.title('Médiathèque')
					.icon(FaPhotoVideo)
					.child(
						S.list()
							.title('Médiathèque')
							.items([
								S.documentTypeListItem('film').title('Films').icon(FaFilm),
								S.documentTypeListItem('photo').title('Photos').icon(FaCamera),
								S.documentTypeListItem('video').title('Vidéos').icon(FaVideo),
							]),
					),

				// S.documentTypeListItem('page').title('Pages').icon(VscMultipleWindows),
				S.documentTypeListItem('blog.category').title('Tags'),
				S.divider(),

				S.documentTypeListItem('festival').title('Festivals').icon(VscCalendar),
				S.documentTypeListItem('film').title('Films').icon(FaFilm),
				S.documentTypeListItem('jury').title('Jurys').icon(FaUserFriends),
				S.documentTypeListItem('genre').title('Genres').icon(FaTags),
				S.divider(),

				S.documentTypeListItem('event').title('Événements'),
				S.divider(),

				group(S, 'Autres', [
					S.documentTypeListItem('announcement').title('Announcements'),
					// S.documentTypeListItem('logo').title('Logos'),
					// S.documentTypeListItem('person').title('People'),
					// S.documentTypeListItem('pricing').title('Pricing tiers'),
					// S.documentTypeListItem('reputation'),
					// S.documentTypeListItem('testimonial').title('Testimonials'),
				]).icon(BsDatabaseAdd),
			]),
})
