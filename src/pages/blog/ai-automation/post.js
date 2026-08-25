import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { Link, Navigate, useParams } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import {
  aiAutomationBlogIndex,
  aiAutomationBlogs,
  getAiAutomationBlogBySlug,
} from "../../../data/aiAutomationBlogs";
import { getAiAutomationBlogBody } from "../../../data/aiAutomationBlogBodies";
import { meta } from "../../../content_option";
import { NotionBody } from "../../../components/NotionBody";

export const AiAutomationBlogPost = () => {
  const { slug } = useParams();
  const post = getAiAutomationBlogBySlug(slug);

  if (!post) {
    return <Navigate to="/blog/ai-automation" replace />;
  }

  const body = getAiAutomationBlogBody(post.id);
  const canonical = `${meta.siteUrl}blog/ai-automation/${post.slug}`;
  const pageTitle = `${post.title} | ${meta.title}`;
  const related = aiAutomationBlogs
    .filter((item) => item.category === post.category && item.slug !== post.slug)
    .slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date || undefined,
    mainEntityOfPage: canonical,
    author: {
      "@type": "Person",
      name: "Hitesh Dodiya",
      url: meta.siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Hitesh Dodiya",
    },
    keywords: [post.category, post.topic, "AI automation", "workflow automation"],
  };

  return (
    <HelmetProvider>
      <Container className="ai-blog ai-blog-post page-glow">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{pageTitle}</title>
          <meta name="description" content={post.description} />
          <meta
            name="keywords"
            content={`${post.title}, ${post.category}, ${post.topic}, AI automation, workflow automation, ${meta.keywords}`}
          />
          <link rel="canonical" href={canonical} />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={post.description} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={canonical} />
          {post.date ? <meta property="article:published_time" content={post.date} /> : null}
          <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        </Helmet>

        <Row className="mb-4 mt-3 pt-md-3">
          <Col lg="10">
            <nav className="ai-blog__breadcrumb" aria-label="Breadcrumb">
              <Link to="/services/ai-automation">AI Automation</Link>
              <span>/</span>
              <Link to="/blog/ai-automation">Workflows Blog</Link>
              <span>/</span>
              <span>{post.topic}</span>
            </nav>
            <div className="ai-blog-card__meta ai-blog-post__meta">
              <span>{post.category}</span>
            </div>
            <h1 className="display-5 mb-3">{post.title}</h1>
            <p className="ai-blog__intro">{post.description}</p>
            <div className="ai-blog__actions">
              <a
                href={post.notionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ai-blog__ghost-link"
              >
                Open in Notion <FaExternalLinkAlt />
              </a>
              <Link to="/blog/ai-automation" className="ai-blog__ghost-link">
                All workflow blogs
              </Link>
            </div>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>

        <article className="ai-blog-article">
          <NotionBody blocks={body} />
        </article>

        {related.length > 0 ? (
          <section className="ai-blog-related" aria-labelledby="related-heading">
            <h2 id="related-heading">Related {post.category} posts</h2>
            <div className="ai-blog__grid ai-blog__grid--compact">
              {related.map((item) => (
                <article className="ai-blog-card" key={item.id}>
                  <h3>
                    <Link to={`/blog/ai-automation/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="ai-blog-cta">
          <div>
            <h2>Want this workflow implemented for your team?</h2>
            <p>
              I design and ship production-ready AI automation systems based on guides like{" "}
              {aiAutomationBlogIndex.title.toLowerCase()}.
            </p>
          </div>
          <Link to="/contact" className="ac_btn btn text_2">
            Contact Me
          </Link>
        </section>
      </Container>
    </HelmetProvider>
  );
};
