/**
 * @type {import('tinacms').Collection}
 */
export default {
  label: "Projets de Portfolio",
  name: "post",
  path: "content/posts",
  format: "mdx",
  fields: [
    {
      name: "title",
      label: "Titre",
      type: "string",
      required: true,
    },
    {
      name: "date",
      label: "Date de publication",
      type: "datetime",
      required: true,
    },
    {
      name: "category",
      label: "Catégorie",
      type: "string",
    },
    {
      name: "featuredImage",
      label: "Image principale",
      type: "image",
    },
    {
      name: "excerpt",
      label: "Extrait",
      type: "string",
      ui: {
        component: "textarea",
      },
    },
    {
      name: "body",
      label: "Contenu",
      type: "rich-text",
      isBody: true,
    },
  ],
  ui: {
    router: ({ document }) => {
      return `/blog/${document._sys.filename}`;
    },
  },
};
