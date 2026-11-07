# Featured Projects & Contributions

### 1. Omni-Agent — Multi-Tool LangGraph & MCP AI Assistant (2026)
- **Tech Stack**: Python, LangChain, LangGraph, MCP, FastAPI, REST APIs, pytest, LLM Evaluation, Git/GitHub
- **GitHub**: https://github.com/kulkarniparth30/Omni-Agent
- **Problem**: LLMs cannot reliably interface with live external environments and frequently hallucinate API tool calls when lacking context.
- **Solution & Architecture**:
  - Built an LLM-powered multi-agent assistant in Python using LangGraph where the model autonomously selects tools across hosted Model Context Protocol (MCP) servers (Context7, DeepWiki, Semgrep) and a custom FastAPI arithmetic tool server.
  - Engineered prompt and tool-routing logic to eliminate multi-tool chaining failures and cut hallucinated tool calls.
  - Restructured the codebase into modular tools/, prompts/, and evals/ layers behind a FastAPI API layer.
  - Implemented automated testing (pytest) and an evaluation suite to benchmark tool selection and response relevance.
  - Authored reproducible documentation covering architecture, setup, and experimental benchmarks.

### 2. KisanSetu — Agentic Multimodal AI Platform for Crop Disease Diagnosis (2026)
- **Tech Stack**: Python, FastAPI, LangChain, Gemini 2.5 Flash, Vector Databases, ResNet50, Google Cloud Platform, Twilio
- **GitHub**: https://github.com/kulkarniparth30/kisanSetu
- **Problem**: Farmers receive hallucinated or generalized crop disease advice from raw LLMs and often lack continuous smartphone internet connectivity.
- **Solution & Architecture**:
  - Solved hallucinated crop-disease advice by building a RAG pipeline (embeddings + vector database, LangChain) over verified agricultural knowledge bases to ground Gemini 2.5 Flash responses via FastAPI.
  - Added an offline ResNet50 image-classification fallback for farmers in low-connectivity areas; benchmarked quality vs latency against the cloud multimodal path.
  - Deployed containerized on Google Cloud Platform with a multilingual Twilio IVR so non-smartphone, regional-language users can reach diagnosis by phone in Marathi, Hindi, and English.

### 3. ResumeAgent — AI Resume Analyser, ATS Ranker & Skill-Gap Detector (2026)
- **Tech Stack**: Python, LangGraph, FastAPI, React, Vite, Tailwind CSS, Pydantic, Supabase, Docker, Render
- **GitHub**: https://github.com/kulkarniparth30/ResumeAgent
- **Problem**: Candidates do not know why Automated Tracking Systems (ATS) reject resumes or which exact skills are missing for a role.
- **Solution & Architecture**:
  - Full-stack FastAPI + React app parsing PDF/DOCX resumes and scoring candidate match against job descriptions with a visual skill-gap matrix.
  - Designed an innovative Skill Hallucination Detector that audits resumes to flag claimed skills lacking project context or proof.
  - Multi-LLM resilient architecture: Primary Google Gemini inference with dynamic Groq fallback for high reliability.
  - Live A4 resume editor with AI enhancement, PDF export, Supabase history, and Docker + Render deployment.
  - Co-authored research paper: "AI-Powered Career Diagnostics and Resume Enhancement System" (under review).

### 4. StudyMind AI — Offline On-Device RAG & Multi-Agent Study Assistant (2026)
- **Tech Stack**: React 18, Vite, WebLLM, Llama-3.2-1B, Transformers.js, CrewAI, IndexedDB, WebGPU, FastAPI
- **GitHub**: https://github.com/kulkarniparth30/NOTES_RAG_ASSISTANT
- **Recognition**: Built for OSDHack 2026
- **Problem**: Traditional student RAG tools leak private lecture notes to cloud servers and incur costly per-token inference charges.
- **Solution & Architecture**:
  - Implemented 100% on-device RAG in the browser via WebGPU & Web Workers running Llama-3.2-1B and Phi-3.5-mini locally with zero external API calls.
  - Built CrewAI multi-agent tools orchestrating specialized agents for autonomous quiz generation, personalized study schedules, and flashcard extraction.
  - Engineered client-side vector search caching MiniLM embeddings locally in IndexedDB for instant sub-second retrieval across large textbooks.
  - Streaming responses at 48+ tokens/second locally with zero cloud subscription or token costs.

### 5. PharmaComplaint AI — QMS Complaint Intake & LangGraph CAPA Engine (2026)
- **Tech Stack**: Python, FastAPI, LangGraph, Groq AI (Llama 3.3 70B), React, Redux Toolkit, SQLite, Pydantic
- **GitHub**: https://github.com/kulkarniparth30/pharma-complaint-ai
- **Industry Standard**: 21 CFR Part 11 & GAMP-5 QMS Compliance
- **Problem**: Pharmaceutical quality management teams spend days manually reviewing customer complaint emails and medical defect reports.
- **Solution & Architecture**:
  - Engineered a multi-stage LangGraph state graph pipeline (`ingest -> extract -> validate -> risk -> capa -> summary`) parsing unstructured complaint forms.
  - Built automated critical-risk triage classifying sterility failures, packaging defects, and contamination under GAMP-5 regulatory severity levels.
  - Integrated intelligent CAPA recommendation engine generating standardized Corrective and Preventive Actions with SLA assignments.
  - Implemented regulatory audit logging with SHA-256 data validation and automated regulatory draft generation via Groq Llama 3.3 70B in under 350ms.

### 6. ReelFlow AI — Automated Viral Reel & Short-Form Video Generator (2026)
- **Tech Stack**: Python, Flask, FFmpeg, Google Text-to-Speech (gTTS), MoviePy, Jinja2, Bootstrap 5, CSS3 Glassmorphism
- **GitHub**: https://github.com/kulkarniparth30/ReelFlow-AI
- **Problem**: Content creators spend hours recording voiceovers, timing image transitions, and burning captions into short-form videos.
- **Solution & Architecture**:
  - Built an automated video generation pipeline using Python and FFmpeg stitching multi-image uploads with dynamic pan/zoom transitions (Ken Burns).
  - Integrated free, API-keyless AI voiceover synthesis via Google Text-to-Speech (gTTS) with automatic speech cadence detection.
  - Designed automated audio ducking reducing background music volume during spoken voiceover segments.
  - Built real-time multi-stage rendering progress tracking (Queued -> Audio -> Video -> Done) with instant 1080x1920 60FPS MP4 export.

### 7. Open Source Contributor — agent-guard (AI-Agent Tool-Call Policy Enforcement) (Sep 2026)
- **Tech Stack**: Python, asyncio, pytest-asyncio, Git/GitHub
- **Pull Request**: PR #143 (+592 lines)
- **Contributions**:
  - Implemented async policy enforcement for agent tool calls (`check_async` and `check_batch_async`), evaluating calls concurrently with `asyncio.gather` and returning structured `PolicyDecision` results with opt-in `PolicyViolation` exceptions.
  - Wrote 23 pytest-asyncio tests (including 100 concurrent calls) and updated documentation.
