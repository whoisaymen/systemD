export const systemD = {
  name: "systemD",
  title: "System D",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "description",
      title: "Description",
      type: "string",
      description: "A short description of the content.",
    },
    {
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    },
    {
      name: "body",
      title: "Body",
      type: "blockContent",
    },
    // {
    //   name: "gallery",
    //   title: "Image gallery",
    //   type: "gallery",
    // },
    {
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        { name: "gallery", type: "gallery" },
        { name: "blockContentModule", type: "blockContentModule" },
      ],
      description: "Add, edit, and reorder sections",
    },
  ],

  preview: {
    select: {
      title: "title",
      description: "description",
    },
    prepare(selection) {
      const { title, description } = selection;

      // Function to generate a random color
      function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

      // Generate a random color for each preview
      const randomColor = getRandomColor();

      return {
        ...selection,
        subtitle: description && `${description}`,
        media: (
          <span
            style={{
              width: "2rem",
              height: "2rem",
              backgroundColor: randomColor,
              textAlign: "center",
              textColor: "black",
              fontWeight: "bold", // This will make the text bold
              display: "inline-block", // Ensures the span behaves like a block for vertical alignment
              verticalAlign: "middle",
            }}
          >
            {/* {title[0]} */}
          </span>
        ),
      };
    },
  },
};
