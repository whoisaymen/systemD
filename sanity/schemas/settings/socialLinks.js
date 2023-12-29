export const socialLinks = {
  name: "socialLinks",
  title: "Social Links",
  type: "document",
  fields: [
    {
      name: "instagram",
      title: "Instagram",
      type: "url",
    },
    {
      name: "facebook",
      title: "Facebook",
      type: "url",
    },
    {
      name: "youtube",
      title: "YouTube",
      type: "url",
    },
  ],

  preview: {
    select: {},
    prepare() {
      return {
        title: "Social Media Links", // Custom title for the studio
      };
    },
  },
};
