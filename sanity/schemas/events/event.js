export const event = {
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    {
      name: "date",
      title: "Date and Time",
      type: "datetime",
    },
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
      description: "Event introductory text",
    },
    {
      name: "visual",
      title: "Visual",
      type: "image",
      options: {
        hotspot: true, // Enables image cropping
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text", // Important for accessibility
        },
      ],
    },
    {
      name: "link",
      title: "Link",
      type: "url",
    },
  ],
  preview: {
    select: {
      title: "title",
      date: "date",
      media: "visual",
    },
    prepare(selection) {
      const { title, date, media } = selection;
      return {
        title: title,
        subtitle: date ? new Date(date).toLocaleDateString() : "No date set",
        media: media,
      };
    },
  },
};
