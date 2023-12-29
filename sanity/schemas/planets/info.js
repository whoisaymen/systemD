export const info = {
  name: "info",
  title: "Infos Pratiques",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        maxLength: 96,
      },
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "reference", to: [{ type: "systemD" }] }],
    },
  ],
  initialValue: {
    title: "Infos Pratiques",
    slug: "info",
  },
  preview: {
    select: {},
    prepare() {
      return {
        title: "Infos Pratiques",
      };
    },
  },
};
