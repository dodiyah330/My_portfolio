import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Typewriter from "typewriter-effect";
import { introdata, meta, serviceHighlights, trustStats } from "../../content_option";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <HelmetProvider>
      <section id="home" className="home modern-home">
        <Helmet>
          <meta charSet="utf-8" />
          <title> {meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>

        <div className="hero-shell">
          <div className="hero-content">
            <p className="hero-tag">Available for freelance & long-term roles</p>
            <h2>{introdata.title}</h2>
            <h1 className="fluidz-48">
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
            </h1>
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
            <div
              className="h_bg-image"
              style={{ backgroundImage: `url(${introdata.your_img_url})` }}
            ></div>
          </div>
        </div>
      </section>
    </HelmetProvider>
  );
};
