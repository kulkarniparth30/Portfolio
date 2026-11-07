import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import { CgWebsite } from "react-icons/cg";
import { BsGithub } from "react-icons/bs";
import { FaCalendarAlt } from "react-icons/fa";

function ProjectCards(props) {
  return (
    <Card className="project-card-view d-flex flex-column justify-content-between">
      <div>
        <div style={{ position: "relative", overflow: "hidden", borderRadius: "10px 10px 0 0", background: "#0e051d", minHeight: "200px" }}>
          <Card.Img
            variant="top"
            src={props.imgPath}
            alt={props.title}
            style={{
              width: "100%",
              height: "220px",
              objectFit: "cover",
              objectPosition: "top center",
              display: "block",
              borderBottom: "1px solid rgba(138, 73, 168, 0.3)"
            }}
          />
        </div>
        <Card.Body style={{ padding: "20px" }}>
          <div className="d-flex justify-content-between align-items-baseline mb-2">
            <Card.Title style={{ color: "#cd5ff8", fontWeight: "700", fontSize: "1.25em", margin: 0 }}>
              {props.title}
            </Card.Title>
            {props.year && (
              <span style={{ color: "#a78bfa", fontSize: "0.85em", fontWeight: "600", marginLeft: "10px", whiteSpace: "nowrap" }}>
                <FaCalendarAlt style={{ marginRight: "4px", fontSize: "0.8em" }} />
                {props.year}
              </span>
            )}
          </div>

          <Card.Text style={{ textAlign: "justify", fontSize: "0.92em", color: "#e3def0", lineHeight: "1.6" }}>
            {props.description}
          </Card.Text>

          {/* Tech Badges */}
          {props.technologies && props.technologies.length > 0 && (
            <div className="project-tech-badges mb-3 d-flex flex-wrap gap-1">
              {props.technologies.map((tech, idx) => (
                <Badge
                  key={idx}
                  bg="transparent"
                  className="project-tech-badge"
                  style={{
                    border: "1px solid rgba(192, 132, 252, 0.35)",
                    background: "rgba(36, 15, 70, 0.35)",
                    color: "#e0aaff",
                    fontWeight: "500",
                    fontSize: "0.75rem",
                    padding: "4px 9px",
                    marginRight: "4px",
                    marginBottom: "4px",
                  }}
                >
                  {tech}
                </Badge>
              ))}
            </div>
          )}

          {/* Key Features */}
          {props.keyFeatures && props.keyFeatures.length > 0 && (
            <div className="project-features text-start mb-2">
              <span style={{ fontSize: "0.82em", color: "#00f5d4", fontWeight: "700", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                Key Technical Highlights:
              </span>
              <ul style={{ paddingLeft: "18px", marginTop: "8px", marginBottom: "0", fontSize: "0.88em", color: "#cdc5db", lineHeight: "1.5" }}>
                {props.keyFeatures.map((feat, fIdx) => (
                  <li key={fIdx} style={{ marginBottom: "6px", listStyleType: "none", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <span style={{ color: "#be6adf", fontSize: "1.1em", lineHeight: "1.3" }}>•</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card.Body>
      </div>

      <Card.Footer style={{ background: "transparent", borderTop: "1px solid rgba(138, 73, 168, 0.25)", padding: "16px 20px" }}>
        <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap" style={{ width: "100%" }}>
          {props.ghLink && (
            <Button
              as="a"
              href={props.ghLink}
              target="_blank"
              rel="noopener noreferrer"
              className="project-action-btn project-btn-gh"
            >
              <BsGithub style={{ fontSize: "1.05em" }} />
              <span>GitHub Repo</span>
            </Button>
          )}

          {props.demoLink && (
            <Button
              as="a"
              href={props.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="project-action-btn project-btn-demo"
            >
              <CgWebsite style={{ fontSize: "1.1em" }} />
              <span>Live Demo ↗</span>
            </Button>
          )}
        </div>
      </Card.Footer>
    </Card>
  );
}
export default ProjectCards;
