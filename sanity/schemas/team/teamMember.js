export const teamMember = {
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      description: "Team member's first name and last name",
    },
    {
      name: "title",
      title: "Title",
      type: "string",
      description: "Team member's role",
    },
    {
      name: "bio",
      title: "Bio",
      type: "array",
      of: [{ type: "block" }],
      description: "Team member's bio",
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
  ],
  preview: {
    select: {
      title: "name",
      role: "title",
      media: "image",
    },
    prepare(selection) {
      const { role } = selection;
      return { ...selection, subtitle: role && `${role}` };
    },
  },
};
