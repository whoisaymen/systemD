export const bigBang = {
  name: "bigBang",
  title: "Big Bang",
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
    title: "Big Bang",
    slug: "big-bang",
  },
  preview: {
    select: {},
    prepare() {
      return {
        title: "Big Bang",
      };
    },
  },
};
