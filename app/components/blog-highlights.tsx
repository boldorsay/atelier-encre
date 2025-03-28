"use client";
import Link from "next/link";
import "./blog-highlights.css";

export function BlogHighlights({ posts }) {
    if (!posts || posts.length === 0) {
        return null;
    }

    return (
        <div className="blog-highlights">
            <h2 className="highlights-title">Derniers Articles</h2>
            <div className="blog-list">
                {posts.map((post, index) => (
                    <Link
                        href={`/blog/${post.node._sys.filename}`}
                        key={index}
                        className="blog-item"
                    >
                        <div className="blog-item-content">
                            <span className="blog-item-number">{(index + 1).toString().padStart(2, '0')}</span>
                            <span className="blog-item-title">{post.node.title}</span>
                            {post.node.category && (
                                <span className="blog-item-category">{post.node.category}</span>
                            )}
                            <span className="blog-item-date">
                                {new Date(post.node.date).toLocaleDateString('fr-FR', {
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
            <div className="view-all-container">
                <Link href="/blog" className="view-all-link">
                    Voir tous les articles
                </Link>
            </div>
        </div>
    );
} 