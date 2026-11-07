import React from "react";
import { Row, Col } from "react-bootstrap";
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
  SiGooglecloud,
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
} from "react-icons/fa";

const skillCategories = [
  {
    category: "AI, LLMs & Agentic Systems",
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
      { name: "Vector Databases & Embeddings", icon: <FaLayerGroup color="#00f5d4" /> },
    ],
  },
  {
    category: "Programming Languages",
    skills: [
      { name: "Python", icon: <SiPython color="#3776AB" /> },
      { name: "C++", icon: <SiCplusplus color="#00599C" /> },
      { name: "JavaScript", icon: <SiJavascript color="#F7DF1E" /> },
      { name: "SQL", icon: <FaDatabase color="#c770f0" /> },
    ],
  },
  {
    category: "Backend & Systems",
    skills: [
      { name: "FastAPI", icon: <SiFastapi color="#009688" /> },
      { name: "Python asyncio", icon: <FaCogs color="#3776AB" /> },
      { name: "REST APIs", icon: <FaMicrochip color="#00f5d4" /> },
      { name: "Supabase", icon: <FaDatabase color="#3ECF8E" /> },
      { name: "PostgreSQL", icon: <SiPostgresql color="#4169E1" /> },
    ],
  },
  {
    category: "Machine Learning & Core Data",
    skills: [
      { name: "PyTorch", icon: <SiPytorch color="#EE4C2C" /> },
      { name: "Scikit-Learn", icon: <SiScikitlearn color="#F7931E" /> },
      { name: "Transformers & Tokenizers", icon: <FaBrain color="#e0aaff" /> },
      { name: "Pandas & NumPy", icon: <FaDatabase color="#c770f0" /> },
    ],
  },
  {
    category: "Tools, DevOps & Cloud",
    skills: [
      { name: "Git", icon: <SiGit color="#F05032" /> },
      { name: "GitHub", icon: <SiGithub color="#ffffff" /> },
      { name: "Docker", icon: <SiDocker color="#2496ED" /> },
      { name: "Google Cloud Platform", icon: <SiGooglecloud color="#4285F4" /> },
    ],
  },
];

function Techstack() {
  return (
    <div className="skills-container pb-4">
      {skillCategories.map((cat, idx) => (
        <div key={idx} className="skill-category-block mb-4">
          <h3 className="skill-category-title">
            {cat.category}
          </h3>
          <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
            {cat.skills.map((skill, sIdx) => (
              <Col key={sIdx} xs={6} sm={4} md={3} lg={2} className="tech-icons">
                <span className="tech-icon-svg" style={{ fontSize: "1.4em", display: "flex", alignItems: "center" }}>
                  {skill.icon}
                </span>
                <div className="tech-icons-text" style={{ fontSize: "0.88rem", fontWeight: "500" }}>{skill.name}</div>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </div>
  );
}

export default Techstack;
