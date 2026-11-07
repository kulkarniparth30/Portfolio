import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Particle from "../Particle";
import pdf from "../../Assets/Parth_Kulkarni_Resume.pdf";
import resumeSnapshot from "../../Assets/resume-snapshot.png";
import { AiOutlineDownload } from "react-icons/ai";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ResumeNew() {
  const [width, setWidth] = useState(1200);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    setWidth(window.innerWidth);
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const resumePublicUrl = `${process.env.PUBLIC_URL || ""}/Parth_Kulkarni_Resume.pdf`;

  return (
    <div>
      <Container fluid className="resume-section">
        <Particle />

        {/* Top Action Buttons */}
        <Row className="justify-content-center align-items-center gap-3 mb-4" style={{ position: "relative" }}>
          <Button
            variant="primary"
            as="a"
            href={resumePublicUrl}
            download="Parth_Kulkarni_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{ maxWidth: "240px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            <AiOutlineDownload style={{ fontSize: "1.2em", marginRight: "6px" }} />
            Download Resume
          </Button>

          <Button
            variant="primary"
            as="a"
            href={resumePublicUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ maxWidth: "240px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            <FaExternalLinkAlt style={{ fontSize: "1.0em", marginRight: "8px" }} />
            View Fullscreen
          </Button>
        </Row>

        {/* Full Page Clean Resume Document */}
        <Row className="resume justify-content-center">
          {pdfError ? (
            <div className="d-flex justify-content-center" style={{ width: "100%", padding: "10px" }}>
              <img
                src={resumeSnapshot}
                alt="Parth Kulkarni Resume"
                style={{
                  width: width > 786 ? "840px" : "96%",
                  maxWidth: "100%",
                  borderRadius: "6px",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7)",
                  display: "block",
                }}
              />
            </div>
          ) : (
            <Document
              file={pdf}
              className="d-flex justify-content-center"
              loading={
                <div style={{ color: "#c084fc", padding: "40px", textAlign: "center" }}>
                  <div className="spinner-border spinner-border-sm text-purple mb-2" role="status" />
                  <div>Loading Resume...</div>
                </div>
              }
              onLoadError={(err) => {
                console.warn("React-PDF error, displaying crisp document image:", err);
                setPdfError(true);
              }}
            >
              <Page
                pageNumber={1}
                scale={width > 1200 ? 1.35 : width > 786 ? 1.15 : width > 480 ? 0.75 : 0.55}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          )}
        </Row>

        {/* Bottom Action Buttons */}
        <Row className="justify-content-center align-items-center gap-3 mt-4" style={{ position: "relative" }}>
          <Button
            variant="primary"
            as="a"
            href={resumePublicUrl}
            download="Parth_Kulkarni_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{ maxWidth: "240px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            <AiOutlineDownload style={{ fontSize: "1.2em", marginRight: "6px" }} />
            Download Resume
          </Button>

          <Button
            variant="primary"
            as="a"
            href={resumePublicUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ maxWidth: "240px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            <FaExternalLinkAlt style={{ fontSize: "1.0em", marginRight: "8px" }} />
            View Fullscreen
          </Button>
        </Row>
      </Container>
    </div>
  );
}

export default ResumeNew;
