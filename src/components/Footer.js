import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { AiFillGithub, AiOutlineMail } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Footer() {
  let date = new Date();
  let year = date.getFullYear();
  return (
    <Container fluid className="footer">
      <Container>
        <Row className="align-items-center">
          <Col md="4" className="footer-copywright text-md-start text-center">
            <h3>Parth Kulkarni</h3>
            <p style={{ color: "#a588c0", fontSize: "0.85em", margin: 0 }}>
              AI/ML Engineer | Generative AI Developer
            </p>
          </Col>
          <Col md="4" className="footer-copywright text-center">
            <h3>Copyright © {year} Parth Kulkarni</h3>
          </Col>
          <Col md="4" className="footer-body text-md-end text-center">
            <ul className="footer-icons">
              <li className="social-icons">
                <a
                  href="https://github.com/kulkarniparth30"
                  style={{ color: "white" }}
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="GitHub"
                >
                  <AiFillGithub />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://www.linkedin.com/in/parth-kulkarni-39260432a/"
                  style={{ color: "white" }}
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="mailto:kulkarniparth0930@gmail.com"
                  style={{ color: "white" }}
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Email"
                >
                  <AiOutlineMail />
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Footer;
