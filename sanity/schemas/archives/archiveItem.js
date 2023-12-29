export const archiveItem = {
  name: "archiveItem",
  title: "Archive",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "year",
      title: "Year",
      type: "number",
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "Visual (photo or illustration)",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "media",
      title: "Media",
      type: "array",
      of: [
        { type: "image", title: "Image" },
        { type: "file", title: "File" },
      ], // Add any other types like video if needed
    },
    // ... any other fields like links to videos, pdfs, etc.
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
  },
};
