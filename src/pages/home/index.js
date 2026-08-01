import React, { useEffect, useState } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Typewriter from "typewriter-effect";
import { FaLinkedinIn, FaArrowRight } from "react-icons/fa";
import { introdata, meta, serviceHighlights, trustStats, homeServices, socialprofils } from "../../content_option";
import { Link } from "react-router-dom";
import brandMark from "../../assets/images/logo.svg";

const LINKEDIN_BADGE_SCRIPT = "https://platform.linkedin.com/badges/js/profile.js";
const LINKEDIN_PROFILE_URL = "https://in.linkedin.com/in/hitesh-dodiya1?trk=profile-badge";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hitesh Dodiya",
  jobTitle: "Full-Stack Developer",
  url: meta.siteUrl,
  sameAs: ["https://github.com/dodiyah330", socialprofils.linkedin],
  knowsAbout: ["React", "Node.js", "Next.js", "MongoDB", "Full-Stack Development", "AI Automation", "AI Integrations"],
};

const getDocumentTheme = () =>
  document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";

export const Home = () => {
  const [badgeTheme, setBadgeTheme] = useState(() =>
    typeof document !== "undefined" ? getDocumentTheme() : "dark"
  );

  useEffect(() => {
    const syncTheme = () => setBadgeTheme(getDocumentTheme());
    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const existingScript = document.querySelector(`script[src="${LINKEDIN_BADGE_SCRIPT}"]`);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.src = LINKEDIN_BADGE_SCRIPT;
    script.async = true;
    script.defer = true;
    script.type = "text/javascript";
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [badgeTheme]);

  return (
    <HelmetProvider>
      <section id="home" className="home modern-home page-glow">
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
          <span className="hero-orb orb-one" aria-hidden="true"></span>
          <span className="hero-orb orb-two" aria-hidden="true"></span>
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

            <div className="chip-grid" aria-label="Core strengths">
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
              <a
                className="ac_btn btn ac_btn--linkedin"
                href={socialprofils.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn aria-hidden="true" />
                LinkedIn
              </a>
            </div>

            <div className="stats-grid" aria-label="Experience highlights">
              {trustStats.map((stat) => (
                <div className="stat-card" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-image-wrap">
            <div
              className="h_bg-image"
              style={{ backgroundImage: `url(${introdata.your_img_url})` }}
              role="img"
              aria-label="Portrait of Hitesh Dodiya"
            ></div>
          </div>
        </div>

        <section className="linkedin-home" aria-labelledby="linkedin-heading">
          <div className="linkedin-home__panel">
            <div className="linkedin-home__identity">
              <div
                className="linkedin-home__avatar"
                style={{ backgroundImage: `url(${introdata.your_img_url})` }}
                role="img"
                aria-label="Hitesh Dodiya"
              ></div>
              <div className="linkedin-home__copy">
                <p className="linkedin-home__eyebrow">
                  <FaLinkedinIn aria-hidden="true" />
                  Professional network
                </p>
                <h3 id="linkedin-heading">Let's connect on LinkedIn</h3>
                <p>
                  See recent work, recommendations, and open roles. Happy to chat about
                  product builds, AI automation, and freelance collaborations.
                </p>
              </div>
            </div>

            <div className="linkedin-home__actions">
              <div className="linkedin-home__badge" key={badgeTheme}>
                <div
                  className="badge-base LI-profile-badge"
                  data-locale="en_US"
                  data-size="large"
                  data-theme={badgeTheme}
                  data-type="HORIZONTAL"
                  data-vanity="hitesh-dodiya1"
                  data-version="v1"
                >
                  <a
                    className="badge-base__link LI-simple-link"
                    href={LINKEDIN_PROFILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Hitesh Dodiya
                  </a>
                </div>
              </div>

              <a
                className="linkedin-home__cta"
                href={LINKEDIN_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                View LinkedIn profile
                <FaArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section className="services-home" aria-labelledby="services-heading">
          <div className="services-home__head">
            <img src={brandMark} alt="" />
            <div>
              <p className="services-home__eyebrow">What I deliver</p>
              <h3 id="services-heading">Services</h3>
            </div>
          </div>
          <div className="services-grid">
            {homeServices.map((service) => {
              const cardContent = (
                <>
                  <h4>{service.title}</h4>
                  <p>{service.description}</p>
                  {service.link ? (
                    <span className="service-card__action">
                      Explore service
                      <FaArrowRight aria-hidden="true" />
                    </span>
                  ) : null}
                </>
              );

              return service.link ? (
                <Link to={service.link} className="service-card service-card--linked" key={service.title}>
                  {cardContent}
                </Link>
              ) : (
                <article className="service-card" key={service.title}>
                  {cardContent}
                </article>
              );
            })}
          </div>
        </section>
      </section>
    </HelmetProvider>
  );
};
