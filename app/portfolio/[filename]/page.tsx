import client from "../../../tina/__generated__/client";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import Link from "next/link";
import Image from "next/image";

export const query = `
  query ProjectQuery($relativePath: String!) {
    post(relativePath: $relativePath) {
      title
      date
      category
      featuredImage
    }
  }
`;

export default async function ProjectPage({ params }) {
  const { filename } = params;

  try {
    // Récupérer les vraies données du projet
    const response = await client.queries.post({
      relativePath: `${filename}.mdx`,
    });

    const project = response.data.post;

    return (
      <article style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
        <Link href="/" style={{ display: "inline-block", marginBottom: "2rem", color: "#555" }}>
          ← Retour à l'accueil
        </Link>

        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
          {project.title}
        </h1>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          {project.category && (
            <span style={{ background: "#f0f0f0", padding: "0.3rem 0.8rem", borderRadius: "30px" }}>
              {project.category}
            </span>
          )}
          <time>
            {new Date(project.date).toLocaleDateString('fr-FR')}
          </time>
        </div>

        {project.featuredImage && (
          <div style={{ margin: "2rem 0" }}>
            <Image
              src={project.featuredImage}
              alt={project.title}
              width={900}
              height={500}
              style={{ borderRadius: "8px", width: "100%", height: "auto" }}
            />
          </div>
        )}

        <div style={{ fontSize: "1.1rem", lineHeight: "1.7" }}>
          <TinaMarkdown content={project.body} />
        </div>
      </article>
    );
  } catch (error) {
    console.error("Erreur:", error);
    return (
      <div style={{ maxWidth: "600px", margin: "4rem auto", padding: "2rem", textAlign: "center" }}>
        <h1>Impossible de charger le projet</h1>
        <p>{error.message}</p>
        <Link href="/">Retour à l'accueil</Link>
      </div>
    );
  }
}
