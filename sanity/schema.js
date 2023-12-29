import { blockContent } from "./schemas/blockContent";
import { gallery } from "./schemas/gallery";
import { category } from "./schemas/category";
import { author } from "./schemas/author";

import {
  siteSettings,
  navigation,
  socialLinks,
  visualIdentity,
} from "./schemas/settings";
import { teamMember } from "./schemas/team/teamMember";
import { systemD } from "./schemas/systemD/systemD";
import { festival } from "./schemas/festival/festival";
import { event } from "./schemas/events/event";
import { archiveCollection, archiveItem, tag } from "./schemas/archives";

import {
  bigBang,
  info,
  planet1,
  planet2,
  planet3,
  planet4,
} from "./schemas/planets";
import { blockContentModule } from "./schemas/blockContentModule";

export const schema = {
  types: [
    // post,
    // author,
    // category,
    blockContent,
    blockContentModule,
    gallery,
    siteSettings,
    navigation,
    socialLinks,
    visualIdentity,
    teamMember,
    systemD,
    festival,
    event,
    tag,
    // archiveCollection,
    archiveItem,
    bigBang,
    info,
    planet1,
    planet2,
    planet3,
    planet4,
  ],
};
