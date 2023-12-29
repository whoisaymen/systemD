export const planet4 = {
  name: "planet4",
  title: "La Team",
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
        source: "title",
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
    title: "La Team",
    // slug: "la-team",
  },
  preview: {
    select: {},
    prepare() {
      return {
        title: "La Team",
      };
    },
  },
};
