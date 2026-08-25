import React, { useEffect, useState } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaExternalLinkAlt, FaLinkedinIn } from "react-icons/fa";
import { meta, socialprofils } from "../../content_option";
import seededFeed from "../../content/linkedin_posts.json";
import { formatPostDate } from "../../lib/linkedinPosts";

const API_ENDPOINTS = [
  "/.netlify/functions/linkedin-posts",
  "/api/linkedin-posts",
];

async function findPost(slug) {
  const fromSeed = (seededFeed.posts || []).find((post) => post.slug === slug || post.id === slug);
  for (const endpoint of API_ENDPOINTS) {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) continue;
      const data = await response.json();
      const match = (data.posts || []).find((post) => post.slug === slug || post.id === slug);
      if (match) return match;
    } catch {
      // Continue.
    }
  }
  return fromSeed || null;
}

export const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(() =>
    (seededFeed.posts || []).find((item) => item.slug === slug || item.id === slug) || null
  );
  const [status, setStatus] = useState(post ? "ready" : "loading");

  useEffect(() => {
    let active = true;
    setStatus("loading");
    findPost(slug).then((result) => {
      if (!active) return;
      setPost(result);
      setStatus(result ? "ready" : "missing");
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (status === "missing" || (!post && status === "ready")) {
    return (
      <HelmetProvider>
        <section className="blog-page page-glow">
          <div className="blog-shell blog-post-shell">
            <Link to="/blog" className="blog-back">
              <FaArrowLeft aria-hidden="true" />
              Back to blog
            </Link>
            <h1>Post not found</h1>
            <p>This LinkedIn post is unavailable or has not been synced yet.</p>
          </div>
        </section>
      </HelmetProvider>
    );
  }

  if (!post) {
    return (
      <HelmetProvider>
        <section className="blog-page page-glow">
          <div className="blog-shell blog-post-shell">
            <p className="blog-status">Loading post…</p>
          </div>
        </section>
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <section className="blog-page page-glow">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{post.title} | Blog | {meta.title}</title>
          <meta name="description" content={post.excerpt} />
          <link rel="canonical" href={`${meta.siteUrl}blog/${post.slug}`} />
          <meta property="og:title" content={post.title} />
          <meta property="og:description" content={post.excerpt} />
          {post.image ? <meta property="og:image" content={post.image} /> : null}
        </Helmet>

        <article className="blog-shell blog-post-shell">
          <Link to="/blog" className="blog-back">
            <FaArrowLeft aria-hidden="true" />
            Back to blog
          </Link>

          <header className="blog-post-header">
            <p className="blog-eyebrow">
              <FaLinkedinIn aria-hidden="true" />
              LinkedIn post
            </p>
            <h1>{post.title}</h1>
            <div className="blog-hero__meta">
              <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
              <span>{post.author || "Hitesh Dodiya"}</span>
              {typeof post.reactions === "number" ? <span>{post.reactions} reactions</span> : null}
            </div>
          </header>

          {post.image ? (
            <div
              className="blog-post-image"
              style={{ backgroundImage: `url(${post.image})` }}
              role="img"
              aria-label=""
            />
          ) : null}

          <div className="blog-post-content">
            {post.content.split(/\n+/).filter(Boolean).map((paragraph, index) => (
              <p key={`${post.id}-${index}`}>{paragraph.replace(/\*\*/g, "")}</p>
            ))}
          </div>

          <footer className="blog-post-footer">
            <a
              className="blog-post-cta"
              href={post.url || socialprofils.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              Continue on LinkedIn
              <FaExternalLinkAlt aria-hidden="true" />
            </a>
          </footer>
        </article>
      </section>
    </HelmetProvider>
  );
};
