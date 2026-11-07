import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import Github from "./Github";
import Aboutcard from "./AboutCard";
import laptopImg from "../../Assets/about.png";

function About() {
  return (
    <>
      <Particle />
      <Container fluid className="about-section">
        <Container>
          <Row style={{ justifyContent: "center", padding: "10px", alignItems: "center" }}>
            <Col
              md={7}
              style={{
                justifyContent: "center",
                paddingTop: "30px",
                paddingBottom: "50px",
              }}
            >
              <h1 style={{ fontSize: "2.3em", paddingBottom: "20px" }}>
                Know Who <strong className="purple">I'M</strong>
              </h1>
              <Aboutcard />
            </Col>
            <Col
              md={5}
              style={{ paddingTop: "30px", paddingBottom: "50px" }}
              className="about-img text-center"
            >
              <img src={laptopImg} alt="about" className="img-fluid" style={{ maxHeight: "420px" }} />
            </Col>
          </Row>

          {/* GitHub Activity & Coding Consistency */}
          <div style={{ paddingTop: "30px", paddingBottom: "50px" }}>
            <Github />
          </div>
        </Container>
      </Container>
    </>
  );
}

export default About;
