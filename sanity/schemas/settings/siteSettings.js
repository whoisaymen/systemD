export const siteSettings = {
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    {
      name: "searchableTitle",
      title: "Searchable Title",
      type: "string",
      hidden: true, // This hides it from the editing interface
      initialValue: "Metadata", // This sets the default value that gets indexed
    },
    {
      name: "title",
      title: "Site Title",
      type: "string",
    },
    {
      name: "description",
      title: "Site Description",
      type: "text",
    },
    {
      name: "keywords",
      title: "SEO Keywords",
      type: "array",
      of: [{ type: "string" }],
    },
  ],
  initialValue: {
    title: "Metadata", // Set the initial title to "Metadata"
  },
  preview: {
    select: {},
    prepare() {
      return {
        title: "Metadata",
      };
    },
  },
};
