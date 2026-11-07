import React from "react";
import { Col, Row } from "react-bootstrap";
import {
  SiVisualstudiocode,
  SiPostman,
  SiDocker,
  SiLinux,
  SiGit,
  SiGooglecloud,
} from "react-icons/si";

function Toolstack() {
  const tools = [
    { name: "VS Code", icon: <SiVisualstudiocode color="#007ACC" /> },
    { name: "Docker", icon: <SiDocker color="#2496ED" /> },
    { name: "Linux / WSL", icon: <SiLinux color="#FCC624" /> },
    { name: "Postman", icon: <SiPostman color="#FF6C37" /> },
    { name: "Google Cloud", icon: <SiGooglecloud color="#4285F4" /> },
    { name: "Git", icon: <SiGit color="#F05032" /> },
  ];

  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      {tools.map((t, idx) => (
        <Col key={idx} xs={6} sm={4} md={2} className="tech-icons">
          <span style={{ fontSize: "1.4em", display: "flex", alignItems: "center" }}>
            {t.icon}
          </span>
          <div className="tech-icons-text" style={{ fontSize: "0.88rem", fontWeight: "500" }}>{t.name}</div>
        </Col>
      ))}
    </Row>
  );
}

export default Toolstack;
