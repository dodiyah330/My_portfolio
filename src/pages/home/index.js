import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Typewriter from "typewriter-effect";
import { introdata, meta, serviceHighlights, trustStats, homeServices } from "../../content_option";
import { Link } from "react-router-dom";
import projectPreview from "../../assets/images/react-porfolio.png";
import brandMark from "../../assets/images/logo.svg";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hitesh Dodiya",
  jobTitle: "Full-Stack Developer",
  url: meta.siteUrl,
  sameAs: ["https://github.com/dodiyah330", "https://www.linkedin.com/in/hitesh-dodiya-4061171b2/"],
  knowsAbout: ["React", "Node.js", "Next.js", "MongoDB", "Full-Stack Development", "AI Integrations"],
};

export const Home = () => {
  return (
    <HelmetProvider>
      <section id="home" className="home modern-home">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />
          <meta name="keywords" content={meta.keywords} />
          <link rel="canonical" href={meta.siteUrl} />
          <meta property="og:title" content={meta.title} />
          <meta property="og:description" content={meta.description} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={meta.siteUrl} />
          <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
        </Helmet>

        <div className="hero-shell">
          <span className="hero-orb orb-one"></span>
          <span className="hero-orb orb-two"></span>
          <div className="hero-content">
            <p className="hero-tag">Available for freelance & long-term roles</p>
            <h1>{introdata.title}</h1>
            <h2 className="fluidz-48">
              <Typewriter
                options={{
                  strings: [
                    introdata.animated.first,
                    introdata.animated.second,
                    introdata.animated.third,
                  ],
                  autoStart: true,
                  loop: true,
                  deleteSpeed: 10,
                }}
              />
            </h2>
            <p className="hero-description">{introdata.description}</p>

            <div className="chip-grid">
              {serviceHighlights.map((item) => (
                <span className="service-chip" key={item}>
                  {item}
                </span>
              ))}
            </div>

            <div className="intro_btn-action">
              <Link to="/about" className="ac_btn btn text_2" id="button_p">
                About Me
              </Link>
              <Link to="/contact" className="ac_btn btn" id="button_h">
                Contact Me
              </Link>
            </div>

            <div className="stats-grid">
              {trustStats.map((stat) => (
                <div className="stat-card" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-image-wrap">
            <img src={projectPreview} alt="Recent product interface designed and developed by Hitesh Dodiya" className="hero-side-preview" />
            <div
              className="h_bg-image"
              style={{ backgroundImage: `url(${introdata.your_img_url})` }}
              aria-label="Portrait of Hitesh Dodiya"
            ></div>
          </div>
        </div>

        <section className="services-home" aria-labelledby="services-heading">
          <div className="services-home__head">
            <img src={brandMark} alt="Hitesh logo" />
            <h3 id="services-heading">Services</h3>
          </div>
          <div className="services-grid">
            {homeServices.map((service) => (
              <article className="service-card" key={service.title}>
                <h4>{service.title}</h4>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </HelmetProvider>
  );
};
