"use client";
import { useTina, tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import './services.css';  // Importez le nouveau CSS
import './contact.css';  // Importez le nouveau CSS
import './blog-highlights.css';  // Importez les styles
import './presentation.css';  // Importez le CSS de présentation
import './accordion.css';
import Accordion from './accordion';

// Importez Three.js dynamiquement (côté client uniquement)
const ThreeScene = dynamic(() => import('./ThreeScene'), { ssr: false });

export default function HomeClient({ data, projectsData, query, variables }) {

    const { data: tinaData } = useTina({
        query,
        variables,
        data,
    });

    // Extraction des projets de portfolio
    const projects = projectsData?.postConnection?.edges || [];

    if (!tinaData?.page) {
        return <div>Loading...</div>;
    }

    console.log("Données de page:", tinaData.page);
    console.log("Présentation:", tinaData.page.presentation);

    return (
        <div className="content">
            {/* Canvas Three.js en haut */}
            <ThreeScene />

            <h1 className="title" data-tina-field={tinaField(tinaData.page, "title")}>
                {tinaData.page?.title || "No title available"}
            </h1>

            {/* Section Accordéon */}
            {tinaData.page?.accordion && (
                <Accordion items={tinaData.page.accordion} tinaData={tinaData} />
            )}


            {/* Section Présentation */}
            {tinaData.page.presentation && (
                <section
                    className="presentation-section"
                    data-tina-field={tinaField(tinaData.page, "presentation")}
                >
                    <div className={`presentation-container ${tinaData.page.presentation.imagePosition === 'right' ? 'image-right' : ''}`}>
                        <div className="presentation-image">
                            {tinaData.page.presentation.image && (
                                <Image
                                    src={tinaData.page.presentation.image}
                                    alt={tinaData.page.presentation.title || "Présentation"}
                                    width={600}
                                    height={400}
                                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                />
                            )}
                        </div>
                        <div className="presentation-content">
                            <h2
                                className="presentation-title"
                                data-tina-field={tinaField(tinaData.page.presentation, "title")}
                            >
                                {tinaData.page.presentation.title}
                            </h2>
                            <div
                                className="presentation-text"
                                data-tina-field={tinaField(tinaData.page.presentation, "content")}
                            >
                                <TinaMarkdown content={tinaData.page.presentation.content} />
                            </div>
                        </div>
                    </div>
                </section>
            )}
            {/* Projets de Portfolio */}
            {projects.length > 0 && (
                <div className="blog-highlights">
                    <h2 className="highlights-title">Projets de Portfolio</h2>
                    <div className="blog-list">
                        {projects.map((project, index) => (
                            <Link
                                href={`/portfolio/${project.node._sys.filename}`}
                                key={index}
                                className="blog-item"
                            >
                                <div className="blog-item-content">
                                    <span className="blog-item-number">{(index + 1).toString().padStart(2, '0')}</span>
                                    <span className="blog-item-title">{project.node.title}</span>
                                    {project.node.category && (
                                        <span className="blog-item-category">{project.node.category}</span>
                                    )}
                                    <span className="blog-item-date">
                                        {new Date(project.node.date).toLocaleDateString('fr-FR', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <span className="blog-item-arrow">→</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Section Services */}
            {tinaData.page?.services && (
                <div className="services-grid">
                    {tinaData.page.services.map((service, index) => (
                        <div
                            key={index}
                            className="service-card"
                            data-tina-field={tinaField(service, "serviceTitle")}
                        >
                            {service.image && (
                                <div className="service-image">
                                    <Image
                                        src={service.image}
                                        alt={service.serviceTitle}
                                        width={300}
                                        height={200}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                            )}
                            <div className="service-content">
                                <h2>{service.serviceTitle}</h2>
                                <div className="service-description">
                                    <TinaMarkdown content={service.description} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}



            {/* Section Contact */}
            {tinaData.page?.contactLinks && (
                <div className="contact-section" data-tina-field={tinaField(tinaData.page, "contactLinks")}>
                    <h2 className="contact-title">Contact</h2>
                    <div className="contact-links">
                        {tinaData.page.contactLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.linkUrl}
                                className="contact-link"
                                data-tina-field={tinaField(link, "linkText")}
                            >
                                {link.linkText}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 