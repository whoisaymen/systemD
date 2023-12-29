// schemas/archiveCollection.js

export const archiveCollection = {
  name: "archiveCollection",
  title: "Archive Collection",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      description: "Title of the collection",
    },
    {
      name: "items",
      title: "Archive Items",
      type: "array",
      of: [{ type: "reference", to: [{ type: "archiveItem" }] }],
      description: "Select archive items to include in this collection",
    },
    // Additional fields for filtering, categorization, etc.
  ],
};
