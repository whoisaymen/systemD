export const navigation = {
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    {
      name: "mainMenu",
      title: "Main Menu",
      type: "array",
      of: [
        {
          type: "reference",
          to: [
            { type: "planet1" },
            { type: "planet2" },
            { type: "planet3" },
            { type: "planet4" },
            { type: "info" },
            { type: "bigBang" },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {},
    prepare() {
      return {
        title: "Menu Navigation",
      };
    },
  },
};
