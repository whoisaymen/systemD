import {
  CalendarIcon,
  UsersIcon,
  TagsIcon,
  CogIcon,
  CodeBlockIcon,
  MenuIcon,
  EarthGlobeIcon,
  MasterDetailIcon,
  LemonIcon,
  EarthAmericasIcon,
  HomeIcon,
  EnvelopeIcon,
  ComponentIcon,
  ImageIcon,
} from "@sanity/icons";

import { apiVersion } from "./env";
const archiveYears = [2012, 2013, 2014, 2015, 2016, 2017, 2021, 2022, 2023];

export const deskStructure = (S) =>
  S.list()
    .title("Content")
    .items([
      // Group all settings under a single "Settings" list item
      S.listItem()
        .title("Settings")
        .icon(CogIcon)
        .child(
          S.list()
            .title("Settings Documents")
            .items([
              S.listItem()
                .title("Metadata")
                .icon(CodeBlockIcon)
                .child(
                  S.document()
                    .schemaType("siteSettings")
                    .documentId("siteSettings")
                ),
              S.listItem()
                .title("Navigation")
                .icon(MenuIcon)
                .child(
                  S.document().schemaType("navigation").documentId("navigation")
                ),
              S.listItem()
                .title("Social Links")
                .icon(EarthGlobeIcon)
                .child(
                  S.document()
                    .schemaType("socialLinks")
                    .documentId("socialLinks")
                ),
              S.listItem()
                .title("Visual Identity")
                .icon(LemonIcon)
                .child(
                  S.document()
                    .schemaType("visualIdentity")
                    .documentId("visualIdentity")
                ),
            ])
        ),

      S.divider(),
      S.listItem()
        .title("Planets")
        .icon(EarthGlobeIcon) // Or any other appropriate icon
        .child(
          S.list()
            .title("Planets")
            .items([
              S.listItem()
                .title("Big Bang")
                .icon(EarthGlobeIcon)
                .child(
                  S.document().schemaType("bigBang").documentId("bigBang")
                ),
              S.listItem()
                .title("Infos Pratiques")
                .icon(EarthGlobeIcon)
                .child(S.document().schemaType("info").documentId("info")),
              S.listItem()
                .title("Planet 1")
                .icon(EarthGlobeIcon)
                .child(
                  S.document().schemaType("planet1").documentId("planet1")
                ),
              S.listItem()
                .title("Planet 2")
                .icon(EarthGlobeIcon)
                .child(
                  S.document().schemaType("planet2").documentId("planet2")
                ),
              S.listItem()
                .title("Planet 3")
                .icon(EarthGlobeIcon)
                .child(
                  S.document().schemaType("planet3").documentId("planet3")
                ),
              S.listItem()
                .title("Planet 4")
                .icon(EarthGlobeIcon)
                .child(
                  S.document().schemaType("planet4").documentId("planet4")
                ),
            ])
        ),

      S.divider(),
      S.listItem()
        .title("System D")
        .icon(MasterDetailIcon)
        .child(S.documentTypeList("systemD").title("System D")),
      S.divider(),
      S.listItem()
        .title("Festival")
        .icon(ComponentIcon)
        .child(S.documentTypeList("festival").title("Festival")),
      S.divider(),
      S.listItem()
        .title("Médiathèque")
        .icon(ImageIcon)
        .child(
          S.list()
            .title("Médiathèque Filters")
            .items([
              S.listItem()
                .title("All Archives")
                .child(
                  S.documentList()
                    .title("Archives")
                    .filter('_type == "archiveItem"')
                    .apiVersion(apiVersion)
                ),
              // Archives by Year
              S.listItem()
                .title("Archives by Year")
                .child(
                  S.list()
                    .title("Archives by Year")
                    .items(
                      archiveYears.map((year) =>
                        S.listItem()
                          .title(String(year))
                          .child(
                            S.documentList()
                              .title(`Archives from ${year}`)
                              .filter('_type == "archiveItem" && year == $year')
                              .params({ year })
                              .apiVersion(apiVersion)
                          )
                      )
                    )
                ),
              S.listItem()
                .title("Archives by Tag")
                .child(
                  S.documentTypeList("tag")
                    .title("Tags")
                    .child((tagId) =>
                      S.documentList()
                        .title("Archives")
                        .filter(
                          '_type == "archiveItem" && $tagId in tags[]._ref'
                        )
                        .params({ tagId })
                        .apiVersion(apiVersion)
                    )
                ),
            ])
        ),
      S.listItem()
        .title("Tags")
        .icon(TagsIcon)
        .child(S.documentTypeList("tag").title("Tag")),

      S.divider(),
      S.listItem()
        .title("Events")
        .icon(CalendarIcon)
        .child(S.documentTypeList("event").title("Events")),

      S.divider(),
      S.listItem()
        .title("Team")
        .icon(UsersIcon)
        .child(S.documentTypeList("teamMember").title("Team Members")),

      ...S.documentTypeListItems().filter(
        (listItem) =>
          ![
            "siteSettings",
            "navigation",
            "socialLinks",
            "visualIdentity",
            "teamMember",
            "systemD",
            "festival",
            "archiveItem",
            "archiveCollection",
            "tag",
            "event",
            "info",
            "bigBang",
            "planet1",
            "planet2",
            "planet3",
            "planet4",
          ].includes(listItem.getId())
      ),
    ]);
