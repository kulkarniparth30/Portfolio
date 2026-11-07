import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import { projects } from "./projectsData";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          Featured <strong className="purple">AI & ML Projects</strong>
        </h1>
        <p style={{ color: "#c7b8db", fontSize: "1.1em", marginBottom: "40px" }}>
          Production-grade Multi-Agent Systems, RAG pipelines, and LLM diagnostic applications verified against my GitHub implementations.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          {projects.map((proj) => (
            <Col key={proj.id} lg={4} md={6} className="project-card d-flex align-items-stretch">
              <ProjectCard
                imgPath={proj.imgPath}
                title={proj.title}
                year={proj.year}
                badge={proj.badge}
                description={proj.description}
                technologies={proj.technologies}
                keyFeatures={proj.keyFeatures}
                ghLink={proj.ghLink}
                demoLink={proj.demoLink}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
