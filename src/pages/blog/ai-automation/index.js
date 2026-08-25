import React, { useMemo, useState } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import {
  aiAutomationBlogIndex,
  aiAutomationBlogs,
} from "../../../data/aiAutomationBlogs";
import { meta } from "../../../content_option";
import brandMark from "../../../assets/images/logo.svg";

export const AiAutomationBlogIndex = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(aiAutomationBlogs.map((post) => post.category)));
    return ["All", ...unique.sort()];
  }, []);

  const filteredPosts = useMemo(() => {
    if (activeCategory === "All") return aiAutomationBlogs;
    return aiAutomationBlogs.filter((post) => post.category === activeCategory);
  }, [activeCategory]);

  const pageTitle = `${aiAutomationBlogIndex.title} | ${meta.title}`;
  const canonical = `${meta.siteUrl}blog/ai-automation`;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: aiAutomationBlogIndex.title,
    description: aiAutomationBlogIndex.description,
    url: canonical,
    blogPost: filteredPosts.slice(0, 20).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date || undefined,
      url: `${meta.siteUrl}blog/ai-automation/${post.slug}`,
    })),
  };

  return (
    <HelmetProvider>
      <Container className="ai-blog page-glow">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{pageTitle}</title>
          <meta name="description" content={aiAutomationBlogIndex.description} />
          <meta
            name="keywords"
            content={`${meta.keywords}, AI automation blogs, workflow automation blog, Zapier tutorials, n8n workflows`}
          />
          <link rel="canonical" href={canonical} />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={aiAutomationBlogIndex.description} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={canonical} />
          <script type="application/ld+json">{JSON.stringify(collectionSchema)}</script>
        </Helmet>

        <Row className="mb-4 mt-3 pt-md-3">
          <Col lg="9">
            <div className="ai-blog__badge">
              <img src={brandMark} alt="Hitesh logo" />
              <span>AI Automation Blogs</span>
            </div>
            <h1 className="display-4 mb-3">{aiAutomationBlogIndex.title}</h1>
            <p className="ai-blog__subtitle">{aiAutomationBlogIndex.subtitle}</p>
            <p className="ai-blog__intro">{aiAutomationBlogIndex.description}</p>
            <div className="ai-blog__actions">
              <Link to="/services/ai-automation" className="ai-blog__ghost-link">
                Back to AI Automation service
              </Link>
              <a
                href={aiAutomationBlogIndex.notionFolderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ai-blog__ghost-link"
              >
                Notion folder <FaExternalLinkAlt />
              </a>
            </div>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>

        <div className="ai-blog__filters" role="tablist" aria-label="Blog categories">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={activeCategory === category}
              className={`ai-blog__filter ${activeCategory === category ? "is-active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <p className="ai-blog__count">
          Showing {filteredPosts.length} of {aiAutomationBlogs.length} posts
        </p>

        <div className="ai-blog__grid">
          {filteredPosts.map((post) => (
            <article className="ai-blog-card" key={post.id}>
              <div className="ai-blog-card__meta">
                <span>{post.category}</span>
              </div>
              <h2>
                <Link to={`/blog/ai-automation/${post.slug}`}>{post.title}</Link>
              </h2>
              <p>{post.description}</p>
              <div className="ai-blog-card__footer">
                <Link to={`/blog/ai-automation/${post.slug}`} className="ai-blog-card__read">
                  Read article
                </Link>
                <a href={post.notionUrl} target="_blank" rel="noopener noreferrer">
                  Notion <FaExternalLinkAlt />
                </a>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </HelmetProvider>
  );
};
