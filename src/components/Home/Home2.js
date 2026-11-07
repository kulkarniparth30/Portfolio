import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/parth-avatar.svg";
import Tilt from "react-parallax-tilt";

function Home2() {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row className="align-items-center">
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              LET ME <span className="purple"> INTRODUCE </span> MYSELF
            </h1>
            <p className="home-about-body" style={{ fontSize: "1.06em", lineHeight: "1.8", paddingTop: "35px" }}>
              I am a Computer Science student at <b className="purple">JSPM’s RSCOE, Pune</b> (CGPA 8.11/10), focused on engineering AI systems that are evaluated, secure, and deployable.
              <br />
              <br />
              My core engineering revolves around:
              <br />
              • <b className="purple">Agentic AI &amp; Multi-Agent Workflows:</b> Architected tool-routing workflows with LangGraph and the Model Context Protocol (MCP) in Omni-Agent (ToolBot), using prompt design and automated testing to reduce hallucinated tool calls.
              <br />
              • <b className="purple">On-Device &amp; Privacy-First RAG:</b> Implemented retrieval with dense embeddings and local LLMs (Phi-3.5-mini, Llama-3.2-1B) in the browser via WebLLM and Transformers.js, keeping user data entirely on the device.
              <br />
              • <b className="purple">AI Security &amp; Guardrails:</b> Contributed an asynchronous policy-enforcement module (+592 lines, with tests) to the open-source agent-guard project, enabling concurrent tool-call validation.
              <br />
              • <b className="purple">Evaluation-Driven Development:</b> Built ResumeAgent, a deployed ATS ranking system with a hallucination detector, validated through custom eval suites, DeepEval and RAG-triad metrics, and documented in a co-authored research paper.
            </p>
          </Col>
          <Col md={4} className="myAvtar text-center">
            <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} perspective={1000}>
              <img src={myImg} className="img-fluid" alt="Parth Kulkarni avatar" style={{ maxWidth: "280px" }} />
            </Tilt>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default Home2;
