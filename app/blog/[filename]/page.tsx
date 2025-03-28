import client from "../../../tina/__generated__/client";
import Link from "next/link";
import Image from "next/image";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import "./project-detail.css";

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
    const response = await client.queries.post({
      relativePath: `${filename}.mdx`,
    });

    const project = response.data.post;

    return (
      <article className="project-detail">
        <Link href="/" className="back-button">
          ← Retour à l'accueil
        </Link>

        <header className="project-header">
          <h1 className="project-title">{project.title}</h1>

          <div className="project-meta">
            {project.category && (
              <span className="project-category">{project.category}</span>
            )}
            <time className="project-date">
              {new Date(project.date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </header>

        {project.featuredImage && (
          <div className="project-hero">
            <Image
              src={project.featuredImage}
              alt={project.title}
              width={1200}
              height={675}
              layout="responsive"
              priority
            />
          </div>
        )}

        <div className="project-content">
          <TinaMarkdown content={project.body} />
        </div>
      </article>
    );
  } catch (error) {
    console.error("Erreur:", error);
    return (
      <div className="error-container">
        <h1>Impossible de charger le projet</h1>
        <p>{error.message}</p>
        <Link href="/">Retour à l'accueil</Link>
      </div>
    );
  }
}