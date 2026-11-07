import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import {
  SiPython,
  SiCplusplus,
  SiPytorch,
  SiScikitlearn,
  SiFastapi,
  SiPostgresql,
  SiDocker,
  SiGit,
  SiGithub,
  SiJavascript,
  SiTypescript,
  SiGooglecloud,
  SiPandas,
  SiNumpy,
  SiLinux,
} from "react-icons/si";
import {
  FaBrain,
  FaDatabase,
  FaRobot,
  FaProjectDiagram,
  FaSearch,
  FaShieldAlt,
  FaTerminal,
  FaMicrochip,
  FaLayerGroup,
  FaCogs,
  FaDesktop,
  FaVial,
  FaServer,
} from "react-icons/fa";

const skillCategories = [
  {
    category: "AI Engineering & Multi-Agent Systems",
    description: "Core agentic frameworks, state machines, and context-aware retrieval architectures.",
    skills: [
      { name: "LangGraph", icon: <FaProjectDiagram color="#be6adf" /> },
      { name: "Multi-Agent Systems", icon: <FaRobot color="#00f5d4" /> },
      { name: "RAG Pipelines", icon: <FaSearch color="#c770f0" /> },
      { name: "Model Context Protocol (MCP)", icon: <FaCogs color="#00f5d4" /> },
      { name: "CrewAI", icon: <FaBrain color="#e0aaff" /> },
      { name: "WebLLM (On-Device Inference)", icon: <FaDesktop color="#00f5d4" /> },
      { name: "Prompt Engineering", icon: <FaTerminal color="#ffb703" /> },
      { name: "Guardrails & AI Safety", icon: <FaShieldAlt color="#be6adf" /> },
      { name: "LangSmith & Langfuse", icon: <FaSearch color="#9d4edd" /> },
      { name: "Open-Weight LLMs (Llama, Phi)", icon: <FaMicrochip color="#38bdf8" /> },
    ],
  },
  {
    category: "Programming Languages",
    description: "Primary languages for systems programming, high-concurrency backends, and algorithmic problem-solving.",
    skills: [
      { name: "Python", icon: <SiPython color="#3776AB" /> },
      { name: "C++", icon: <SiCplusplus color="#00599C" /> },
      { name: "SQL", icon: <FaDatabase color="#c770f0" /> },
      { name: "TypeScript", icon: <SiTypescript color="#3178C6" /> },
      { name: "JavaScript", icon: <SiJavascript color="#F7DF1E" /> },
    ],
  },
  {
    category: "Software & Systems Engineering",
    description: "Production API design, distributed architecture, and asynchronous execution.",
    skills: [
      { name: "FastAPI", icon: <SiFastapi color="#009688" /> },
      { name: "Python asyncio", icon: <FaCogs color="#3776AB" /> },
      { name: "REST API Design", icon: <FaMicrochip color="#00f5d4" /> },
      { name: "Distributed System Design", icon: <FaServer color="#a78bfa" /> },
      { name: "Testing (pytest / pytest-asyncio)", icon: <FaVial color="#10b981" /> },
      { name: "React & Vite", icon: <FaDesktop color="#61DAFB" /> },
      { name: "CI/CD & GitHub Actions", icon: <SiGithub color="#ffffff" /> },
    ],
  },
  {
    category: "Databases & Cloud Infrastructure",
    description: "Persistent data storage, vector indexing engines, and containerized cloud deployment.",
    skills: [
      { name: "Vector Databases & Embeddings", icon: <FaLayerGroup color="#00f5d4" /> },
      { name: "PostgreSQL", icon: <SiPostgresql color="#4169E1" /> },
      { name: "Supabase", icon: <FaDatabase color="#3ECF8E" /> },
      { name: "IndexedDB (Browser Storage)", icon: <FaDatabase color="#f59e0b" /> },
      { name: "Google Cloud Platform (GCP)", icon: <SiGooglecloud color="#4285F4" /> },
      { name: "GPU Acceleration (CUDA/WebGPU)", icon: <FaMicrochip color="#76B900" /> },
    ],
  },
  {
    category: "Machine Learning & Core Data",
    description: "Deep learning backends, classical modeling, and data pipelines.",
    skills: [
      { name: "PyTorch", icon: <SiPytorch color="#EE4C2C" /> },
      { name: "Scikit-Learn", icon: <SiScikitlearn color="#F7931E" /> },
      { name: "Transformers & Tokenizers", icon: <FaBrain color="#e0aaff" /> },
      { name: "Pandas", icon: <SiPandas color="#150458" /> },
      { name: "NumPy", icon: <SiNumpy color="#013243" /> },
      { name: "Model Evaluation & Benchmarking", icon: <FaVial color="#34d399" /> },
    ],
  },
  {
    category: "Developer Tooling & DevOps",
    description: "Essential workflow, containerization, and debugging toolsets.",
    skills: [
      { name: "Docker & Containers", icon: <SiDocker color="#2496ED" /> },
      { name: "Git & GitHub", icon: <SiGit color="#F05032" /> },
      { name: "Linux & Shell Scripting", icon: <SiLinux color="#FCC624" /> },
    ],
  },
];

function Skills() {
  return (
    <Container fluid className="about-section" id="skills-page">
      <Particle />
      <Container>
        <h1 className="project-heading text-center" style={{ paddingBottom: "10px" }}>
          Technical <strong className="purple">Skills &amp; Competencies</strong>
        </h1>
        <p style={{ color: "#c7b8db", textAlign: "center", fontSize: "1.1em", marginBottom: "40px" }}>
          Practical, production-tested technologies across Agentic AI, high-concurrency backends, and ML systems.
        </p>

        <div className="skills-container pb-5">
          {skillCategories.map((cat, idx) => (
            <div key={idx} className="skill-category-block mb-4">
              <div className="d-flex flex-column mb-3">
                <h3 className="skill-category-title mb-1">
                  {cat.category}
                </h3>
                <span style={{ fontSize: "0.85rem", color: "#a594bd", fontStyle: "italic" }}>
                  {cat.description}
                </span>
              </div>
              <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
                {cat.skills.map((skill, sIdx) => (
                  <Col key={sIdx} xs={6} sm={4} md={3} lg={2} className="tech-icons">
                    <span className="tech-icon-svg" style={{ fontSize: "1.4em", display: "flex", alignItems: "center" }}>
                      {skill.icon}
                    </span>
                    <div className="tech-icons-text" style={{ fontSize: "0.86rem", fontWeight: "500" }}>
                      {skill.name}
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </div>
      </Container>
    </Container>
  );
}

export default Skills;
