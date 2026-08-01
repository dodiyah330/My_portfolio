import React, { useEffect, useMemo, useState } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FaArrowRight, FaLinkedinIn, FaExternalLinkAlt } from "react-icons/fa";
import { meta, socialprofils } from "../../content_option";
import seededFeed from "../../content/linkedin_posts.json";
import { formatPostDate } from "../../lib/linkedinPosts";

const API_ENDPOINTS = [
  "/.netlify/functions/linkedin-posts",
  "/api/linkedin-posts",
];

async function loadPosts() {
  for (const endpoint of API_ENDPOINTS) {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) continue;
      const data = await response.json();
      if (Array.isArray(data.posts) && data.posts.length) {
        return {
          posts: data.posts,
          source: data.source || "live",
          syncedAt: data.syncedAt,
          profileUrl: data.profileUrl || socialprofils.linkedin,
        };
      }
    } catch {
      // Fall through to the next endpoint / seed data.
    }
  }

  return {
    posts: seededFeed.posts || [],
    source: "seed",
    syncedAt: seededFeed.syncedAt,
    profileUrl: seededFeed.profileUrl || socialprofils.linkedin,
  };
}

export const Blog = () => {
  const [feed, setFeed] = useState({
    posts: seededFeed.posts || [],
    source: "seed",
    syncedAt: seededFeed.syncedAt,
    profileUrl: seededFeed.profileUrl || socialprofils.linkedin,
  });
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    loadPosts()
      .then((data) => {
        if (!active) return;
        setFeed(data);
        setStatus("ready");
      })
      .catch(() => {
        if (!active) return;
        setStatus("ready");
      });
    return () => {
      active = false;
    };
  }, []);

  const posts = useMemo(() => feed.posts || [], [feed.posts]);

  return (
    <HelmetProvider>
      <section className="blog-page page-glow">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Blog | {meta.title}</title>
          <meta
            name="description"
            content="LinkedIn posts from Hitesh Dodiya on AI automation, SaaS workflows, and full-stack product delivery — synced automatically."
          />
          <link rel="canonical" href={`${meta.siteUrl}blog`} />
        </Helmet>

        <div className="blog-shell">
          <header className="blog-hero">
            <p className="blog-eyebrow">
              <FaLinkedinIn aria-hidden="true" />
              Auto-synced from LinkedIn
            </p>
            <h1>Blog</h1>
            <p className="blog-lead">
              Practical notes on AI automation, SaaS operations, and shipping
              reliable product workflows. New LinkedIn posts appear here
              automatically.
            </p>
            <div className="blog-hero__meta">
              <span>{posts.length} posts</span>
              {feed.syncedAt ? <span>Updated {formatPostDate(feed.syncedAt)}</span> : null}
              <a href={feed.profileUrl} target="_blank" rel="noopener noreferrer">
                View LinkedIn profile
                <FaExternalLinkAlt aria-hidden="true" />
              </a>
            </div>
          </header>

          {status === "loading" && !posts.length ? (
            <p className="blog-status">Loading posts…</p>
          ) : null}

          <div className="blog-grid">
            {posts.map((post) => (
              <article className="blog-card" key={post.id}>
                {post.image ? (
                  <div
                    className="blog-card__media"
                    style={{ backgroundImage: `url(${post.image})` }}
                    role="img"
                    aria-label=""
                  />
                ) : (
                  <div className="blog-card__media blog-card__media--fallback" aria-hidden="true">
                    <FaLinkedinIn />
                  </div>
                )}

                <div className="blog-card__body">
                  <div className="blog-card__meta">
                    <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
                    {typeof post.reactions === "number" ? (
                      <span>{post.reactions} reactions</span>
                    ) : null}
                  </div>
                  <h2>
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p>{post.excerpt}</p>
                  <div className="blog-card__actions">
                    <Link to={`/blog/${post.slug}`} className="blog-card__read">
                      Read post
                      <FaArrowRight aria-hidden="true" />
                    </Link>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="blog-card__linkedin"
                    >
                      LinkedIn
                      <FaExternalLinkAlt aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {!posts.length ? (
            <div className="blog-empty">
              <h2>No posts yet</h2>
              <p>
                Connect a LinkedIn RSS feed with <code>LINKEDIN_RSS_FEED_URL</code> to
                sync posts automatically, or check back soon.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </HelmetProvider>
  );
};
