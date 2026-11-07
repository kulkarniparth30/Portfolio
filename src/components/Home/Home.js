import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import aiHero from "../../Assets/ai-hero.svg";
import Particle from "../Particle";
import Home2 from "./Home2";
import Type from "./Type";
import { AiFillGithub, AiOutlineMail } from "react-icons/ai";
import { FaLinkedinIn, FaProjectDiagram, FaFileDownload } from "react-icons/fa";

function Home() {
  const resumePublicUrl = `${process.env.PUBLIC_URL || ""}/Parth_Kulkarni_Resume.pdf`;

  return (
    <section>
      <Container fluid className="home-section" id="home">
        <Particle />
        <Container className="home-content">
          <Row className="align-items-center">
            <Col md={7} className="home-header">
              <h1 style={{ paddingBottom: 15 }} className="heading">
                Hi There!
              </h1>

              <h1 className="heading-name">
                I'M
                <strong className="main-name"> PARTH KULKARNI</strong>
              </h1>

              <h3 className="heading-title" style={{ paddingLeft: "45px", paddingTop: "10px" }}>
                AI/ML Engineer | Generative AI &amp; Agentic Systems Developer
              </h3>

              <div style={{ padding: "30px 45px 20px 45px", textAlign: "left" }}>
                <Type />
              </div>

              <p className="hero-intro" style={{ paddingLeft: "45px", paddingRight: "30px", fontSize: "1.15em", color: "#e0d6eb" }}>
                Building privacy-first, agentic AI applications: LangGraph/MCP multi-agent systems, RAG pipelines, and fully on-device LLM inference in the browser.
              </p>

              <div className="hero-cta-btns" style={{ paddingLeft: "45px", paddingTop: "25px", display: "flex", gap: "15px", flexWrap: "wrap", position: "relative", zIndex: 10 }}>
                <Button
                  as={Link}
                  to="/project"
                  variant="primary"
                  className="hero-btn"
                >
                  <FaProjectDiagram style={{ marginRight: "8px" }} /> Explore My Projects
                </Button>
                <Button
                  as="a"
                  href={resumePublicUrl}
                  download="Parth_Kulkarni_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline-primary"
                  className="hero-btn hero-btn-secondary"
                >
                  <FaFileDownload style={{ marginRight: "8px" }} /> Download Resume
                </Button>
              </div>
            </Col>

            <Col md={5} style={{ paddingBottom: 20 }} className="text-center">
              <div className="hero-image-wrapper">
                <img
                  src={aiHero}
                  alt="Parth Kulkarni - AI Engineer"
                  className="img-fluid floating-ai-hero"
                  style={{ maxHeight: "480px" }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </Container>

      <Home2 />

      <Container fluid className="home-about-section" id="connect">
        <Container>
          <Row>
            <Col md={12} className="home-about-social">
              <h1 style={{ fontSize: "2.2em" }}>FIND ME ON</h1>
              <p style={{ color: "#d1c4e9", fontSize: "1.05em" }}>
                Feel free to <span className="purple">connect </span>with me
              </p>
              <ul className="home-about-social-links">
                <li className="social-icons">
                  <a
                    href="https://github.com/kulkarniparth30"
                    target="_blank"
                    rel="noreferrer"
                    className="icon-colour home-social-icons"
                    aria-label="GitHub Profile"
                  >
                    <AiFillGithub />
                  </a>
                </li>
                <li className="social-icons">
                  <a
                    href="https://www.linkedin.com/in/parth-kulkarni-39260432a/"
                    target="_blank"
                    rel="noreferrer"
                    className="icon-colour home-social-icons"
                    aria-label="LinkedIn Profile"
                  >
                    <FaLinkedinIn />
                  </a>
                </li>
                <li className="social-icons">
                  <a
                    href="mailto:kulkarniparth0930@gmail.com"
                    target="_blank"
                    rel="noreferrer"
                    className="icon-colour home-social-icons"
                    aria-label="Send Email"
                  >
                    <AiOutlineMail />
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </Container>
    </section>
  );
}

export default Home;
