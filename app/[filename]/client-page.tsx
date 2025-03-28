"use client";
import { tinaField, useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import Image from "next/image";
import '../components/services.css';
import { PageContent } from '../components/page-content.tsx';

// Mise à jour de l'interface pour gérer les valeurs nullables
interface PageData {
  page: {
    title: string | null | undefined;  // Ajout des types null et undefined
    body: any;
    services?: Array<{
      serviceTitle: string | null | undefined;
      image: string | null | undefined;
      description: any;
    }> | null;
  }
}

interface ClientPageProps {
  query: string;
  variables: {
    relativePath: string;
  };
  data: PageData;
}

export default function ClientPage(props: ClientPageProps) {
  const { data } = useTina(props);
  return <PageContent data={data} />;
}