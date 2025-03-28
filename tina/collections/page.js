/**
 * @type {import('tinacms').Collection}
 */
export default {
  label: "Pages",
  name: "page",
  path: "content/page",
  format: "mdx",
  fields: [
    {
      name: "title",
      label: "Title",
      type: "string",
    },
    {
      name: "presentation",
      label: "Section Présentation",
      type: "object",
      fields: [
        {
          name: "image",
          label: "Image",
          type: "image",
        },
        {
          name: "title",
          label: "Titre",
          type: "string",
        },
        {
          name: "content",
          label: "Contenu",
          type: "rich-text",
        },
        {
          name: "imagePosition",
          label: "Position de l'image",
          type: "string",
          options: [
            { label: "Gauche", value: "left" },
            { label: "Droite", value: "right" },
          ],
          defaultValue: "left",
        },
      ],
    },
    {
      name: "services",
      label: "Services",
      type: "object",
      list: true,
      templates: [
        {
          name: "service",
          label: "Service",
          fields: [
            {
              name: "serviceTitle",
              label: "Titre du Service",
              type: "string",
              required: true,
              defaultValue: "Nouveau service",
            },
            {
              name: "image",
              label: "Image",
              type: "image",
            },
            {
              name: "description",
              label: "Description",
              type: "rich-text",
            },
          ],
        },
      ],
      itemProps: (item) => ({
        label: item?.serviceTitle || "Nouveau service",
      }),
    },
    {
      name: "contactLinks",
      label: "Liens de Contact",
      type: "object",
      list: true,
      itemProps: (item) => ({
        label: item?.linkText || "Nouveau lien",
      }),
      fields: [
        {
          name: "linkText",
          label: "Texte du lien",
          type: "string",
          required: true,
        },
        {
          name: "linkUrl",
          label: "URL du lien",
          type: "string",
          required: true,
        },
      ],
    },
    {
      name: "accordion",
      label: "Accordéon",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.title || "Nouvel élément",
        }),
      },
      fields: [
        {
          name: "title",
          label: "Titre",
          type: "string",
          required: true,
        },
        {
          name: "content",
          label: "Contenu",
          type: "rich-text",
        }
      ],
    },
  ],
  ui: {
    router: ({ document }) => {
      if (document._sys.filename === "home2") {
        return `/`;
      }
      return `/${document._sys.filename}`;
    },
  },
};
