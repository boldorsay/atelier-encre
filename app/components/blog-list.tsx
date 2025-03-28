"use client";
import Link from "next/link";
import Image from "next/image";
import "./blog.css";

export function BlogList({ posts }) {
    return (
        <div className="blog-container">
            <h1>Blog</h1>
            <div className="blog-grid">
                {posts.map((post) => (
                    <article key={post.node.id} className="blog-card">
                        {post.node.featuredImage && (
                            <div className="blog-image">
                                <Image
                                    src={post.node.featuredImage}
                                    alt={post.node.title}
                                    width={400}
                                    height={225}
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                        )}
                        <div className="blog-content">
                            <div className="blog-meta">
                                <span className="blog-date">
                                    {new Date(post.node.date).toLocaleDateString()}
                                </span>
                                {post.node.category && (
                                    <span className="blog-category">{post.node.category}</span>
                                )}
                            </div>
                            <h2 className="blog-title">
                                <Link href={`/blog/${post.node._sys.filename}`}>
                                    {post.node.title}
                                </Link>
                            </h2>
                            {post.node.excerpt && (
                                <p className="blog-excerpt">{post.node.excerpt}</p>
                            )}
                            <Link href={`/blog/${post.node._sys.filename}`} className="blog-read-more">
                                Lire l'article
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
} 