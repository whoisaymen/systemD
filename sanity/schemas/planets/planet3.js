export const planet3 = {
  name: "planet3",
  title: "La Mémoire",
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
    title: "La Mémoire",
    // slug: "la-mémoire",
  },
  preview: {
    select: {},
    prepare() {
      return {
        title: "La Mémoire",
      };
    },
  },
};
