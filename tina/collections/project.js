export default {
  label: "Projets",
  name: "project",
  path: "content/projects",
  format: "mdx",
  fields: [
    {
      name: "title",
      label: "Titre du projet",
      type: "string",
      required: true,
    },
    {
      name: "projectNumber",
      label: "Numéro du projet",
      type: "number",
    },
    {
      name: "projectType",
      label: "Type de projet",
      type: "string",
    },
    {
      name: "date",
      label: "Date",
      type: "datetime",
    },
    {
      name: "images",
      label: "Galerie photos",
      type: "image",
      list: true,
    },
    {
      name: "summary",
      label: "Résumé court (pour la liste)",
      type: "string",
    },
    {
      name: "body",
      label: "Description détaillée",
      type: "rich-text",
      isBody: true,
    },
  ],
  ui: {
    // Ceci génère des URLs basées sur le titre
    router: ({ document }) => {
      return `/projects/${document._sys.filename}`;
    },
  },
} 