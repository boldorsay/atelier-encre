import ClientPage from "./client-page.tsx";
import client from "../../tina/__generated__/client";

export const query = `
  query PageQuery($relativePath: String!) {
    page(relativePath: $relativePath) {
      title
      services {
        ... on PageServicesService {
          serviceTitle
          image
          description
        }
      }
      contactLinks {
        linkText
        linkUrl
      }
     }
  }
`;

export default async function Page({
  params,
}: {
  params: { filename: string };
}) {
  // On ignore complètement le contenu normal
  // et on affiche directement le message personnalisé
  return (
    <div style={{
      padding: "50px",
      textAlign: "center",
      maxWidth: "600px",
      margin: "100px auto",
      fontFamily: "sans-serif",
      fontSize: "1.2rem",
      color: "#333",
      backgroundColor: "#f8f8f8",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
    }}>
      <h1 style={{
        color: "#e74c3c",
        marginBottom: "20px",
        fontSize: "2rem"
      }}>
        Attention !
      </h1>
      <p style={{ lineHeight: "1.6", fontSize: "1.3rem" }}>
        Annick, tu ne devrais pas faire ça. Écris-moi.
      </p>
      <p style={{ marginTop: "30px", fontSize: "0.9rem", color: "#888" }}>
        Pour revenir à l'accueil, <a href="/" style={{ color: "#2980b9", textDecoration: "none" }}>cliquez ici</a>
      </p>
    </div>
  );
}