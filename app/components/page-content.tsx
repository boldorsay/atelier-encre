"use client";
import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import Image from "next/image";
import Link from "next/link";
import './services.css';
import './contact.css';
import './presentation.css';
import { BlogHighlights } from './blog-highlights';

interface PageContentProps {
    data: {
        page: {
            title?: string | null;
            body?: any;
            services?: Array<{
                serviceTitle?: string | null;
                image?: string | null;
                description?: any;
            }> | null;
            contactLinks?: Array<{
                linkText?: string | null;
                linkUrl?: string | null;
            }> | null;
            presentation?: {
                image: string | null;
                title: string | null;
                content: any;
                imagePosition: string | null;
            } | null;
        }
        postConnection?: {
            edges?: Array<{
                node?: {
                    _sys?: {
                        filename?: string | null;
                    } | null;
                    title?: string | null;
                    category?: string | null;
                    date?: string | null;
                } | null;
            }> | null;
        }
    }
}

export function PageContent({ data }: PageContentProps) {
    if (!data?.page) {
        return <div>Loading...</div>;
    }

    console.log("Data de page:", data.page);
    console.log("Présentation:", data.page.presentation);

    return (
        <div className="content">
            <h1 className="title" data-tina-field={tinaField(data.page, "title")}>
                {data.page?.title || "No title available"}
            </h1>

            {/* Section Présentation */}
            {data.page.presentation && (
                <section
                    className="presentation-section"
                    data-tina-field={tinaField(data.page, "presentation")}
                >
                    <div className={`presentation-container ${data.page.presentation.imagePosition === 'right' ? 'image-right' : ''}`}>
                        <div className="presentation-image">
                            {data.page.presentation.image && (
                                <Image
                                    src={data.page.presentation.image}
                                    alt={data.page.presentation.title || "Présentation"}
                                    width={600}
                                    height={400}
                                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                />
                            )}
                        </div>
                        <div className="presentation-content">
                            <h2
                                className="presentation-title"
                                data-tina-field={tinaField(data.page.presentation, "title")}
                            >
                                {data.page.presentation.title}
                            </h2>
                            <div
                                className="presentation-text"
                                data-tina-field={tinaField(data.page.presentation, "content")}
                            >
                                <TinaMarkdown content={data.page.presentation.content} />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Section Services */}
            {data.page?.services && (
                <div className="services-grid">
                    {data.page.services.map((service, index) => (
                        <div
                            key={index}
                            className="service-card"
                            data-tina-field={tinaField(service, "serviceTitle")}
                        >
                            {service.image && (
                                <div className="service-image">
                                    <Image
                                        src={service.image}
                                        alt={service.serviceTitle || ""}
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
                                <h2>{service.serviceTitle || "Sans titre"}</h2>
                                <div className="service-description">
                                    <TinaMarkdown content={service.description} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {data.postConnection?.edges && (
                <BlogHighlights posts={data.postConnection.edges} />
            )}

            {/* Section Contact */}
            {data.page?.contactLinks && (
                <div className="contact-section" data-tina-field={tinaField(data.page, "contactLinks")}>
                    <h2 className="contact-title">Contact</h2>
                    <div className="contact-links">
                        {data.page.contactLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.linkUrl || "#"}
                                className="contact-link"
                                data-tina-field={tinaField(link, "linkText")}
                            >
                                {link.linkText || "Lien"}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <div className="body" data-tina-field={tinaField(data.page, "body")}>
                {data.page?.body ? (
                    <TinaMarkdown content={data.page.body} />
                ) : (
                    <p>No content available</p>
                )}
            </div>
        </div>
    );
}