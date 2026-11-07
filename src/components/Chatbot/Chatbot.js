import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  AiOutlineClose,
  AiOutlineSend,
  AiOutlineDelete,
} from "react-icons/ai";
import {
  FaBrain,
  FaExternalLinkAlt,
  FaTerminal,
} from "react-icons/fa";
import "./Chatbot.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8001";

const SUGGESTED_QUESTIONS = [
  "What are the architecture details of Omni-Agent (LangGraph + MCP)?",
  "How does KisanSetu eliminate hallucinations in crop diagnosis?",
  "Tell me about ResumeAgent and its hallucination detector",
  "What is Parth's contribution to agent-guard (PR #143)?",
  "What are Parth's core technical skills & education?",
];

const INITIAL_WELCOME_MESSAGE = {
  id: "welcome-1",
  role: "assistant",
  content:
    "**Hello. I am Parth AI.**\n\nI am Parth Kulkarni's engineering assistant, grounded in his verified project repositories, technical implementations, and engineering background.\n\n• Ask about **Omni-Agent** (LangGraph & MCP architecture)\n• Ask about **ResumeAgent** (Skill hallucination detector & ATS ranker)\n• Ask about **KisanSetu** (Multimodal agricultural diagnosis)\n• Ask about his **Datathon ML Hackathon** achievement\n• Inquire about his **agent-guard** open-source policy PR or core technical skills.",
  sources: ["Verified Profile"],
  links: [],
};

// Helper: Formats plain/markdown text into structured JSX with bolding, lists, and links
function renderFormattedMessage(content) {
  if (!content) return null;

  // Split content by lines
  const lines = content.split("\n");
  const elements = [];
  let currentList = [];

  const flushList = (key) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${key}`} className="chat-bullet-list">
          {currentList.map((item, idx) => (
            <li key={idx} className="chat-bullet-item">
              <span className="chat-bullet-symbol">•</span>
              <span>{parseInlineStyles(item)}</span>
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  const parseInlineStyles = (text) => {
    // Regex for bold **text**, links [text](url) or standalone URLs
    const parts = [];
    let keyIdx = 0;

    // First replace Markdown links [label](url)
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    let match;
    let lastIndex = 0;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(parseBoldText(text.substring(lastIndex, match.index), keyIdx++));
      }
      parts.push(
        <a
          key={`link-${keyIdx++}`}
          href={match[2]}
          target="_blank"
          rel="noreferrer"
          className="chat-inline-link"
        >
          {match[1]} <FaExternalLinkAlt style={{ fontSize: "0.7em", marginLeft: "2px" }} />
        </a>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(parseBoldText(text.substring(lastIndex), keyIdx++));
    }

    return parts.length > 0 ? parts : parseBoldText(text, 0);
  };

  const parseBoldText = (str, pKey) => {
    const boldParts = str.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((sub, i) => {
      if (sub.startsWith("**") && sub.endsWith("**")) {
        return (
          <strong key={`b-${pKey}-${i}`} className="chat-strong-text">
            {sub.slice(2, -2)}
          </strong>
        );
      }
      // Check for standalone URLs
      const urlRegex = /(https?:\/\/[^\s)]+)/g;
      const urlParts = sub.split(urlRegex);
      if (urlParts.length > 1) {
        return urlParts.map((u, uIdx) => {
          if (u.match(urlRegex)) {
            return (
              <a
                key={`rawurl-${pKey}-${i}-${uIdx}`}
                href={u}
                target="_blank"
                rel="noreferrer"
                className="chat-inline-link"
              >
                {u.length > 28 ? u.slice(0, 28) + "..." : u}
              </a>
            );
          }
          return u;
        });
      }
      return sub;
    });
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList(index);
      return;
    }

    // Check if line is a bullet item
    if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
      const bulletText = trimmed.replace(/^[•\-*]\s*/, "");
      currentList.push(bulletText);
    } else if (trimmed.startsWith("###") || trimmed.startsWith("##") || trimmed.startsWith("#")) {
      flushList(index);
      const headingText = trimmed.replace(/^#+\s*/, "");
      elements.push(
        <h5 key={`h-${index}`} className="chat-content-heading">
          {headingText}
        </h5>
      );
    } else {
      flushList(index);
      elements.push(
        <p key={`p-${index}`} className="chat-content-para">
          {parseInlineStyles(trimmed)}
        </p>
      );
    }
  });

  flushList("final");
  return elements;
}

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || loading) return;

    setErrorMessage("");
    const userMsg = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await axios.post(
        `${API_BASE_URL}/api/chat`,
        {
          message: text,
          history: historyPayload,
        },
        { timeout: 15000 }
      );

      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.data.answer,
        sources: res.data.sources || [],
        links: res.data.links || [],
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn("[Chatbot] API request failed, applying verified fallback:", err);
      let fallbackText =
        "The portfolio backend server at " +
        API_BASE_URL +
        " is initializing. Please verify the backend service is active.";

      const lower = text.toLowerCase();
      if (lower.includes("omni") || lower.includes("toolbot")) {
        fallbackText =
          "**Omni-Agent — Multi-Tool LangGraph & MCP AI Assistant (2026)**\n\n• **Core Tech:** Python, LangChain, LangGraph, Model Context Protocol (MCP), FastAPI, REST APIs, pytest.\n• **Architecture:** Dynamic tool routing across hosted MCP servers (Context7, DeepWiki, Semgrep) and custom arithmetic APIs.\n• **Debugging:** Solved multi-tool chaining failures and eliminated tool call hallucinations.\n• **Repository:** [github.com/kulkarniparth30/Omni-Agent](https://github.com/kulkarniparth30/Omni-Agent)";
      } else if (lower.includes("kisan") || lower.includes("crop")) {
        fallbackText =
          "**KisanSetu — Multimodal Crop Disease Diagnosis Platform (2026)**\n\n• **Core Tech:** Python, FastAPI, LangChain, Gemini 2.5 Flash, Vector Databases, ResNet50, GCP, Twilio.\n• **Grounding:** RAG pipeline over verified agricultural knowledge bases suppressing hallucinated advice.\n• **Offline Edge Fallback:** ResNet50 classification for low-connectivity regions with multilingual voice IVR.\n• **Repository:** [github.com/kulkarniparth30/kisanSetu](https://github.com/kulkarniparth30/kisanSetu)";
      } else if (lower.includes("hackathon") || lower.includes("datathon") || lower.includes("pccoe")) {
        fallbackText =
          "**Hackathon Achievements — Parth Kulkarni**\n\n• **Datathon ML Hackathon (PCCOE College):** Finished **Top 10 in both rounds** of the competitive Machine Learning hackathon.\n• Demonstrates strong predictive modeling, feature engineering, and high-pressure model evaluation under tight time constraints.";
      } else if (lower.includes("resumeagent") || lower.includes("resume")) {
        fallbackText =
          "**ResumeAgent — AI Resume Analyser & ATS Ranker (2026)**\n\n• **Core Tech:** Python, LangGraph, FastAPI, React, Vite, Tailwind CSS, Supabase, Docker, Render.\n• **Skill Hallucination Detector:** Audits resumes to flag claimed skills lacking verifiable project evidence.\n• **Multi-LLM Layer:** Primary Google Gemini inference with dynamic Groq fallback.\n• **Research Paper:** Co-authored publication under peer review.\n• **Repository:** [github.com/kulkarniparth30/ResumeAgent](https://github.com/kulkarniparth30/ResumeAgent)";
      } else if (lower.includes("agent-guard") || lower.includes("guard")) {
        fallbackText =
          "**agent-guard Open Source Contribution (Sep 2026)**\n\n• **Pull Request:** PR #143 (+592 lines) for enterprise AI agent guardrails.\n• **Implementation:** Async policy enforcement (`check_async`, `check_batch_async`) using `asyncio.gather`.\n• **Validation:** 23 `pytest-asyncio` tests evaluating 100 concurrent tool calls.";
      } else if (lower.includes("skill") || lower.includes("tech")) {
        fallbackText =
          "**Parth's Technical Skillset**\n\n• **AI Engineering:** LangGraph, LangChain, Multi-Agent Systems, RAG Pipelines, MCP, WebLLM, Guardrails, Prompt Engineering.\n• **Languages:** Python, C++, C, JavaScript, TypeScript, SQL.\n• **Systems & Backend:** FastAPI, Flask, asyncio, Docker, Supabase, PostgreSQL, GCP.\n• **Machine Learning:** PyTorch, Scikit-learn, TensorFlow, Transformers.js & MiniLM.";
      }

      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: fallbackText,
        sources: ["Verified Portfolio Documentation"],
        links: ["https://github.com/kulkarniparth30"],
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
    setErrorMessage("");
  };

  return (
    <>
      {/* Sleek Floating Trigger Button */}
      <button
        className="parth-ai-floating-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Parth AI Assistant"
      >
        <div className="parth-ai-btn-pulse" />
        {isOpen ? (
          <AiOutlineClose style={{ fontSize: "1.35rem" }} />
        ) : (
          <FaBrain style={{ fontSize: "1.35rem" }} />
        )}
        <span className="parth-ai-tooltip">Ask Parth AI</span>
      </button>

      {/* Expandable Chat Window */}
      {isOpen && (
        <div className="parth-ai-window">
          {/* Header */}
          <div className="parth-ai-header">
            <div className="parth-ai-header-left">
              <div className="parth-ai-avatar-badge">
                <FaBrain />
                <span className="status-dot" />
              </div>
              <div className="parth-ai-header-info">
                <h4>PARTH AI</h4>
                <p>Verified Engineering Assistant</p>
              </div>
            </div>

            <div className="parth-ai-header-actions">
              <button
                className="header-icon-btn"
                onClick={handleClearChat}
                title="Reset Conversation"
              >
                <AiOutlineDelete />
              </button>
              <button
                className="header-icon-btn"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                <AiOutlineClose />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="parth-ai-body">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-msg ${msg.role}`}>
                <div className="msg-bubble">
                  {/* Clean Formatted Markdown Component */}
                  <div className="chat-formatted-body">
                    {renderFormattedMessage(msg.content)}
                  </div>

                  {/* Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="msg-sources">
                      {msg.sources.map((s, idx) => (
                        <span key={idx} className="source-tag">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Verified Links */}
                  {msg.links && msg.links.length > 0 && (
                    <div className="msg-links">
                      {msg.links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          className="link-btn"
                        >
                          <FaExternalLinkAlt style={{ marginRight: "4px" }} />
                          {link.length > 32 ? link.slice(0, 32) + "..." : link}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="chat-msg assistant">
                <div className="typing-bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            {/* High-Signal Suggested Questions */}
            {messages.length === 1 && !loading && (
              <div className="suggested-section">
                <div className="suggested-title">Verified Inquiries:</div>
                <div className="suggested-chips">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      className="suggested-chip"
                      onClick={() => handleSendMessage(q)}
                    >
                      <FaTerminal style={{ marginRight: "8px", fontSize: "0.75em", color: "#00f5d4" }} />
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="parth-ai-footer">
            <form
              className="parth-ai-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about Omni-Agent, KisanSetu, ResumeAgent, skills..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={loading || !inputValue.trim()}
                title="Send Query"
              >
                <AiOutlineSend />
              </button>
            </form>
            <div className="chat-footnote">
              Personal Engineering Assistant • Grounded Responses
            </div>
            {errorMessage && (
              <div className="chat-error-banner">{errorMessage}</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
