import React, { useEffect, useState } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Typewriter from "typewriter-effect";
import { FaLinkedinIn, FaArrowRight, FaYoutube, FaPlay } from "react-icons/fa";
import { introdata, meta, serviceHighlights, trustStats, homeServices, socialprofils } from "../../content_option";
import { Link } from "react-router-dom";
import brandMark from "../../assets/images/logo.svg";
import youtubeFeed from "../../content/youtube_videos.json";
import youtubeShortsFeed from "../../content/youtube_shorts.json";

const LINKEDIN_BADGE_SCRIPT = "https://platform.linkedin.com/badges/js/profile.js";
const LINKEDIN_PROFILE_URL = "https://in.linkedin.com/in/hitesh-dodiya1?trk=profile-badge";
const YOUTUBE_CHANNEL_URL = socialprofils.youtube || youtubeFeed.channelUrl;
const YOUTUBE_SHORTS_URL = youtubeShortsFeed.shortsUrl || `${YOUTUBE_CHANNEL_URL}/shorts`;
const HERO_INTRO_VIDEO_ID = "kdWB9X5dQDQ";
const heroIntroVideo =
  (youtubeFeed.videos || []).find((video) => video.id === HERO_INTRO_VIDEO_ID) || {
    id: HERO_INTRO_VIDEO_ID,
    title: "Introduction - Hitesh Dodiya",
    url: `https://www.youtube.com/watch?v=${HERO_INTRO_VIDEO_ID}`,
    embedUrl: `https://www.youtube.com/embed/${HERO_INTRO_VIDEO_ID}`,
    thumbnail: `https://i.ytimg.com/vi/${HERO_INTRO_VIDEO_ID}/hqdefault.jpg`,
  };

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hitesh Dodiya",
  jobTitle: "Full-Stack Developer",
  url: meta.siteUrl,
  sameAs: [
    "https://github.com/dodiyah330",
    socialprofils.linkedin,
    YOUTUBE_CHANNEL_URL,
  ].filter(Boolean),
  knowsAbout: ["React", "Node.js", "Next.js", "MongoDB", "Full-Stack Development", "AI Automation", "AI Integrations"],
};

const getDocumentTheme = () =>
  document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";

const formatViews = (views) => {
  if (typeof views !== "number" || Number.isNaN(views)) return null;
  if (views >= 1000) return `${(views / 1000).toFixed(1).replace(/\.0$/, "")}K views`;
  return `${views} view${views === 1 ? "" : "s"}`;
};

const formatVideoDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export const Home = () => {
  const [badgeTheme, setBadgeTheme] = useState(() =>
    typeof document !== "undefined" ? getDocumentTheme() : "dark"
  );
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [activeShortId, setActiveShortId] = useState(null);
  const [heroVideoPlaying, setHeroVideoPlaying] = useState(false);
  const youtubeShorts = youtubeShortsFeed.shorts || [];
  const shortIds = new Set(youtubeShorts.map((short) => short.id));
  const youtubeVideos = (youtubeFeed.videos || []).filter((video) => !shortIds.has(video.id));

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
              <a
                className="ac_btn btn ac_btn--youtube"
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube aria-hidden="true" />
                YouTube
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

          <div className="hero-image-wrap hero-video-wrap">
            <div className="hero-video">
              {heroVideoPlaying ? (
                <iframe
                  title={heroIntroVideo.title}
                  src={`${heroIntroVideo.embedUrl}?autoplay=1&rel=0`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  className="hero-video__preview"
                  onClick={() => setHeroVideoPlaying(true)}
                  aria-label={`Play ${heroIntroVideo.title}`}
                >
                  <img
                    src={heroIntroVideo.thumbnail}
                    alt=""
                    loading="eager"
                  />
                  <span className="hero-video__play" aria-hidden="true">
                    <FaPlay />
                  </span>
                  <span className="hero-video__label">Watch introduction</span>
                </button>
              )}
            </div>
          </div>
        </div>

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

        {youtubeVideos.length > 0 ? (
          <section className="youtube-home" aria-labelledby="youtube-heading">
            <div className="youtube-home__head">
              <div className="youtube-home__title-block">
                <p className="youtube-home__eyebrow">
                  <FaYoutube aria-hidden="true" />
                  YouTube
                </p>
                <h3 id="youtube-heading">Watch tutorials &amp; walkthroughs</h3>
                <p>
                  Latest videos from my channel — WordPress plugins, product walkthroughs,
                  and development tips.
                </p>
              </div>
              <a
                className="youtube-home__channel-cta"
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube aria-hidden="true" />
                Visit channel
                <FaArrowRight aria-hidden="true" />
              </a>
            </div>

            <div className="youtube-home__grid">
              {youtubeVideos.map((video) => {
                const isPlaying = activeVideoId === video.id;
                const viewsLabel = formatViews(video.views);
                const dateLabel = formatVideoDate(video.publishedAt);

                return (
                  <article className="youtube-card" key={video.id}>
                    <div className="youtube-card__media">
                      {isPlaying ? (
                        <iframe
                          title={video.title}
                          src={`${video.embedUrl}?autoplay=1&rel=0`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                        />
                      ) : (
                        <button
                          type="button"
                          className="youtube-card__preview"
                          onClick={() => setActiveVideoId(video.id)}
                          aria-label={`Play ${video.title}`}
                        >
                          <img
                            src={video.thumbnail}
                            alt=""
                            loading="lazy"
                          />
                          <span className="youtube-card__play" aria-hidden="true">
                            <FaPlay />
                          </span>
                        </button>
                      )}
                    </div>
                    <div className="youtube-card__body">
                      <h4>
                        <a href={video.url} target="_blank" rel="noopener noreferrer">
                          {video.title}
                        </a>
                      </h4>
                      {(viewsLabel || dateLabel) && (
                        <p className="youtube-card__meta">
                          {[viewsLabel, dateLabel].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      {video.description ? (
                        <p className="youtube-card__desc">{video.description}</p>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {youtubeShorts.length > 0 ? (
          <section className="youtube-shorts" aria-labelledby="youtube-shorts-heading">
            <div className="youtube-home__head">
              <div className="youtube-home__title-block">
                <p className="youtube-home__eyebrow">
                  <FaYoutube aria-hidden="true" />
                  YouTube Shorts
                </p>
                <h3 id="youtube-shorts-heading">Quick AI automation clips</h3>
                <p>
                  Short-form tips on AI workflows, lead gen, and customer support automation.
                </p>
              </div>
              <a
                className="youtube-home__channel-cta"
                href={YOUTUBE_SHORTS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube aria-hidden="true" />
                View all Shorts
                <FaArrowRight aria-hidden="true" />
              </a>
            </div>

            <div className="youtube-shorts__grid">
              {youtubeShorts.map((short) => {
                const isPlaying = activeShortId === short.id;
                const viewsLabel = formatViews(short.views);

                return (
                  <article className="youtube-short-card" key={short.id}>
                    <div className="youtube-short-card__media">
                      {isPlaying ? (
                        <iframe
                          title={short.title}
                          src={`${short.embedUrl}?autoplay=1&rel=0`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                        />
                      ) : (
                        <button
                          type="button"
                          className="youtube-short-card__preview"
                          onClick={() => setActiveShortId(short.id)}
                          aria-label={`Play Short: ${short.title}`}
                        >
                          <img src={short.thumbnail} alt="" loading="lazy" />
                          <span className="youtube-short-card__badge" aria-hidden="true">
                            Shorts
                          </span>
                          <span className="youtube-card__play" aria-hidden="true">
                            <FaPlay />
                          </span>
                        </button>
                      )}
                    </div>
                    <div className="youtube-short-card__body">
                      <h4>
                        <a href={short.url} target="_blank" rel="noopener noreferrer">
                          {short.title}
                        </a>
                      </h4>
                      {viewsLabel ? (
                        <p className="youtube-card__meta">{viewsLabel}</p>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="linkedin-home linkedin-home--cta" aria-labelledby="linkedin-heading">
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
                  Next step
                </p>
                <h3 id="linkedin-heading">Ready to work together?</h3>
                <p>
                  Connect on LinkedIn to see recent work, recommendations, and open roles —
                  or message me about your next product build.
                </p>
              </div>
            </div>

            <div className="linkedin-home__actions">
              <a
                className="linkedin-home__cta linkedin-home__cta--primary"
                href={LINKEDIN_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect with Hitesh Dodiya on LinkedIn"
              >
                <span className="linkedin-home__cta-icon" aria-hidden="true">
                  <FaLinkedinIn />
                </span>
                <span className="linkedin-home__cta-copy">
                  <strong>Connect on LinkedIn</strong>
                  <small>Open profile &amp; send a message</small>
                </span>
                <FaArrowRight className="linkedin-home__cta-arrow" aria-hidden="true" />
              </a>

              <div className="linkedin-home__cta-row">
                <Link className="linkedin-home__cta linkedin-home__cta--secondary" to="/blog">
                  Read LinkedIn blog
                  <FaArrowRight aria-hidden="true" />
                </Link>
                <a
                  className="linkedin-home__cta linkedin-home__cta--secondary"
                  href={YOUTUBE_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch on YouTube
                  <FaArrowRight aria-hidden="true" />
                </a>
              </div>

              <div className="linkedin-home__badge" key={badgeTheme} aria-hidden="true">
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
                    tabIndex={-1}
                  >
                    Hitesh Dodiya
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </HelmetProvider>
  );
};
