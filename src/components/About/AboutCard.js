import React from "react";
import Card from "react-bootstrap/Card";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify", lineHeight: "1.8" }}>
            Hello! I am <span className="purple">Parth Kulkarni</span> from{" "}
            <span className="purple">Pune, Maharashtra, India</span>.
            <br />
            I am a <span className="purple">Computer Engineering</span> student at{" "}
            <span className="purple">JSPM's Rajarshi Shahu College of Engineering (RSCOE), Pune</span> (CGPA: 8.11/10, Expected 2028).
            <br />
            <br />
            My engineering work is dedicated to building <span className="purple">privacy-first, agentic AI applications</span>: 
            architecting <span className="purple">LangGraph & Model Context Protocol (MCP)</span> multi-agent systems, 
            resilient <span className="purple">RAG pipelines</span>, and fully <span className="purple">on-device LLM inference</span> in the browser using WebLLM and WebGPU.
            <br />
            <br />
            Key milestones & engineering achievements:
          </p>

          <ul style={{ listStyleType: "none", paddingLeft: "10px" }}>
            <li className="about-activity mb-2">
              <span style={{ color: "#be6adf", marginRight: "10px", fontSize: "1.1em" }}>•</span> <b className="purple">Open Source Contributor:</b> Authored PR #143 (+592 lines) for <b className="purple">agent-guard</b>, implementing async policy enforcement for agent tool calls with 23 pytest-asyncio tests.
            </li>
            <li className="about-activity mb-2">
              <span style={{ color: "#be6adf", marginRight: "10px", fontSize: "1.1em" }}>•</span> <b className="purple">Shipped Flagship AI Apps:</b> Built <b className="purple">ResumeAgent</b> (with skill-hallucination detection) and <b className="purple">StudyMind AI</b> (100% on-device private RAG).
            </li>
            <li className="about-activity mb-2">
              <span style={{ color: "#be6adf", marginRight: "10px", fontSize: "1.1em" }}>•</span> <b className="purple">Hackathon Achievement:</b> Finished <b className="purple">Top 10 in both rounds</b> of the <b className="purple">Datathon ML Hackathon</b> conducted by PCCOE College.
            </li>
            <li className="about-activity">
              <span style={{ color: "#be6adf", marginRight: "10px", fontSize: "1.1em" }}>•</span> <b className="purple">Kaggle &amp; Community:</b> 5+ datasets and 10+ notebooks on Kaggle (9,400+ views); Core Member, ML &amp; Data Science Team at Coding Club RSCOE.
            </li>
          </ul>

          <p style={{ color: "rgb(155 126 172)", marginTop: "20px" }}>
            "Building reliable, secure AI that keeps user data strictly under the user's control."
          </p>
          <footer className="blockquote-footer">Parth Kulkarni</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
