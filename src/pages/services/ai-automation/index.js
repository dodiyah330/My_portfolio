import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaExternalLinkAlt, FaPlayCircle } from "react-icons/fa";
import { aiAutomationService, meta } from "../../../content_option";
import brandMark from "../../../assets/images/logo.svg";

export const AiAutomation = () => {
  const pageTitle = `${aiAutomationService.title} | ${meta.title}`;
  const pageDescription = aiAutomationService.description;

  return (
    <HelmetProvider>
      <Container className="ai-automation page-glow">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta name="keywords" content={`${meta.keywords}, AI automation, workflow automation, Zapier, n8n, RAG, Pinecone`} />
          <link rel="canonical" href={`${meta.siteUrl}services/ai-automation`} />
        </Helmet>

        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <div className="service-hero__badge">
              <img src={brandMark} alt="Hitesh logo" />
              <span>Service</span>
            </div>
            <h1 className="display-4 mb-3">{aiAutomationService.title}</h1>
            <p className="service-hero__subtitle">{aiAutomationService.subtitle}</p>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>

        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">Overview</h3>
          </Col>
          <Col lg="7" className="d-flex align-items-center">
            <p className="service-overview">{aiAutomationService.description}</p>
          </Col>
        </Row>

        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">What I Build</h3>
          </Col>
          <Col lg="7">
            <div className="capability-grid">
              {aiAutomationService.capabilities.map((item) => (
                <article className="capability-card" key={item.title}>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </Col>
        </Row>

        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">Automation Demos</h3>
            <p className="demo-note">Watch real workflow examples built with Zapier, n8n, Slack, WhatsApp, and RAG.</p>
          </Col>
          <Col lg="7">
            <div className="demo-grid">
              {aiAutomationService.demos.map((demo) => (
                <a
                  className="demo-card"
                  href={demo.link}
                  key={demo.title}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="demo-card__icon" aria-hidden="true">
                    <FaPlayCircle />
                  </div>
                  <div>
                    <h4>
                      {demo.title}
                      <FaExternalLinkAlt />
                    </h4>
                    <p>{demo.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </Col>
        </Row>

        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">Tools & Stack</h3>
          </Col>
          <Col lg="7">
            <div className="tool-grid">
              {aiAutomationService.tools.map((tool) => (
                <span className="tool-chip" key={tool}>
                  {tool}
                </span>
              ))}
            </div>
          </Col>
        </Row>

        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">Deliverables</h3>
          </Col>
          <Col lg="7">
            <ul className="deliverable-list">
              {aiAutomationService.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Col>
        </Row>

        <Row className="sec_sp service-cta">
          <Col lg="12">
            <div className="service-cta__panel">
              <div>
                <h3>Ready to automate repetitive work?</h3>
                <p>Tell me about your tools, bottlenecks, and goals — I will map the right automation approach.</p>
              </div>
              <Link to="/contact" className="ac_btn btn text_2">
                Start a Project
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </HelmetProvider>
  );
};
