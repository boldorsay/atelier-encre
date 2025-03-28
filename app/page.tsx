import HomeClient from "./components/home-client";
import client from "../tina/__generated__/client";

export const query = `
  query HomeQuery($relativePath: String!) {
    page(relativePath: $relativePath) {
      title
      presentation {
        image
        title
        content
        imagePosition
      }
      services {
        ... on PageServicesService {
          serviceTitle
          image
          description
        }
      }
      accordion {
        title
        content
      }
      contactLinks {
        linkText
        linkUrl
      }
    }
    postConnection(sort: "date", last: 5) {
      edges {
        node {
          _sys {
            filename
          }
          title
          category
          date
        }
      }
    }
  }
`;

export default async function Home() {
  try {
    console.log('🏠 Début du chargement de la page');

    const response = await client.queries.page({
      relativePath: "home2.mdx",
    });

    console.log('📦 Données reçues:', {
      title: response.data?.page?.title,
      hasBody: !!response.data?.page?.body
    });

    // Récupérer les projets séparément pour s'assurer qu'ils sont là
    const projectsResponse = await client.queries.postConnection({
      sort: "date",
      last: 5,
    });

    // Passer les données de page ET les projets
    return (
      <div>
        <HomeClient
          data={response.data}
          projectsData={projectsResponse.data}
          query={query}
          variables={{ relativePath: "home2.mdx" }}
        />
      </div>
    );
  } catch (error) {
    console.error('❌ Erreur:', error);
    return <div>Erreur : {error.message}</div>;
  }
}