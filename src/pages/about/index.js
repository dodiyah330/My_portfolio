import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import {
  dataabout,
  meta,
  worktimeline,
  skills,
  services,
} from "../../content_option";
import { Link } from "react-router-dom/dist";
import { FaExternalLinkAlt } from "react-icons/fa";
import brandMark from "../../assets/images/logo.svg";

const serviceSectors = [
  {
    name: "AI, SaaS & Platforms",
    matcher: (project) =>
      ["OpenTools", "Cosnap", "POBO", "Thiba-Ingozi", "Revidit", "Web Assessment"].includes(project.title),
  },
  {
    name: "E-commerce & Marketplace",
    matcher: (project) =>
      ["Professional Hair Labs", "Adam Sea", "Berry Family Services"].includes(project.title),
  },
  {
    name: "Admin Panels, Business Tools & Productivity",
    matcher: (project) =>
      [
        "Eagle Property Management",
        "Client Details Organiser",
        "National Service Providers",
        "E-Resume",
      ].includes(project.title),
  },
  {
    name: "Communication & Engagement",
    matcher: (project) => ["Chat Omni", "Chat App"].includes(project.title),
  },
  {
    name: "Graphic Design Portfolio",
    matcher: (project) => project.title.includes("Graphic Design Portfolio"),
  },
];

const groupedServices = serviceSectors
  .map((sector) => ({
    ...sector,
    items: services.filter(sector.matcher),
  }))
  .filter((sector) => sector.items.length > 0);

const groupedTitles = new Set(groupedServices.flatMap((sector) => sector.items.map((item) => item.title)));
const uncategorizedProjects = services.filter((item) => !groupedTitles.has(item.title));

if (uncategorizedProjects.length) {
  groupedServices.push({
    name: "Other Projects",
    items: uncategorizedProjects,
  });
}

export const About = () => {
  return (
    <HelmetProvider>
      <Container className="About-header">
        <Helmet>
          <meta charSet="utf-8" />
          <title> About | {meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>
        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4">About me</h1>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>
        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">{dataabout.title}</h3>
          </Col>
          <Col lg="7" className="d-flex align-items-center">
            <div>
              <p>{dataabout.aboutme}</p>
            </div>
          </Col>
        </Row>
        <Row className=" sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">Work Timeline</h3>
          </Col>
          <Col lg="7">
            <table className="table caption-top">
              <tbody>
                {worktimeline.map((data, i) => {
                  return (
                    <tr key={i}>
                      <th scope="row">{data.jobtitle}</th>
                      <td>{data.where}</td>
                      <td>{data.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Col>
        </Row>
        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">Skills</h3>
          </Col>
          <Col lg="7">
            {skills.map((data, i) => {
              return (
                <div key={i}>
                  <h3 className="progress-title">{data.name}</h3>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${data.value}%`,
                      }}
                    >
                      <div className="progress-value">{data.value}%</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Col>
        </Row>
        <Row className="sec_sp">
          <Col lang="5">
            <h3 className="color_sec py-4">Projects</h3>
            <div className="projects-note">
              <img src={brandMark} alt="Brand mark" className="projects-note__logo" />
              <p>Sector-wise showcase for development and design work.</p>
            </div>
          </Col>
          <Col lg="7">
            {groupedServices.map((sector) => (
              <div className="project-sector" key={sector.name}>
                <h4 className="project-sector__title">{sector.name}</h4>
                {sector.items.map((data, i) => (
                  <div className="service_ py-4" key={`${sector.name}-${data.title}-${i}`}>
                    <h5 className="service__title">
                      {data.title}
                      {data.link && (
                        <Link to={data.link} target="_blank">
                          <FaExternalLinkAlt />
                        </Link>
                      )}
                    </h5>
                    <p className="service_desc">{data.description}</p>
                  </div>
                ))}
              </div>
            ))}
          </Col>
        </Row>
      </Container>
    </HelmetProvider>
  );
};
