export const visualIdentity = {
  name: "visualIdentity",
  title: "Visual Identity",
  type: "document",
  fields: [
    {
      name: "primaryColor",
      title: "Primary Color",
      type: "color",
    },
    {
      name: "secondaryColor",
      title: "Secondary Color",
      type: "color",
    },
    {
      name: "logo",
      title: "Logo",
      type: "image",
    },
  ],
  preview: {
    select: {},
    prepare() {
      return {
        title: "Visual Identity",
      };
    },
  },
};
