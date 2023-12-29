export const planet1 = {
  name: "planet1",
  title: "La Fabrique",
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
    title: "La Fabrique",
    // slug: "la-fabrique",
  },
  preview: {
    select: {},
    prepare() {
      return {
        title: "La Fabrique",
      };
    },
  },
};
