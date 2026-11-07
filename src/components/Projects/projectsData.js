// Verified Projects for Parth Kulkarni's Portfolio
import toolbotImg from "../../Assets/Projects/toolbot-preview.svg";
import kisansetuImg from "../../Assets/Projects/kisansetu-dashboard.png";
import resumeagentImg from "../../Assets/Projects/resumeagent-dashboard.png";
import studymindImg from "../../Assets/Projects/studymind-real.png";
import pharmacompImg from "../../Assets/Projects/pharmacomp-preview.svg";
import reelflowImg from "../../Assets/Projects/reelflow-preview.svg";

export const projects = [
  {
    id: 1,
    title: "ResumeAgent — AI Resume Analyser, ATS Ranker & Skill-Gap Detector",
    year: "2026",
    description:
      "Engineered an automated career diagnostics system solving candidate mismatch and unverifiable resumes. Combines dense semantic FAISS embeddings with sparse TF-IDF parsing to compute a multi-factor ATS compatibility score, run AST-level skill extraction against IEEE/ACM job taxonomies, and audit claimed competencies.",
    technologies: [
      "Python",
      "LangGraph",
      "FastAPI",
      "FAISS",
      "SentenceTransformers",
      "React",
      "Vite",
      "Tailwind CSS",
      "Supabase",
      "Docker"
    ],
    keyFeatures: [
      "Engineered a novel Skill Hallucination Detector evaluating candidate claims against project context to flag unevidenced keywords before submission.",
      "Built multi-LLM resilient inference: primary Google Gemini structured extraction with automated sub-second Groq fallback for high-availability uptime.",
      "Developed a multidimensional evaluation breakdown scoring skills match (85%), experience relevance (80%), education fit (90%), and project alignment (82%).",
      "Integrated an interactive A4 live resume builder with instant PDF generation, gap-remediation roadmaps, and persistent Supabase database session state.",
    ],
    imgPath: resumeagentImg,
    ghLink: "https://github.com/kulkarniparth30/ResumeAgent",
    demoLink: "https://resume-agent-c1ww.onrender.com/",
  },
  {
    id: 2,
    title: "Omni-Agent — Multi-Tool LangGraph & MCP AI Assistant",
    year: "2026",
    description:
      "Architected an autonomous multi-agent assistant built with LangGraph to eliminate multi-tool chaining failures and ungrounded API calls. The state machine dynamically routes execution across hosted Model Context Protocol (MCP) servers (Context7, DeepWiki, Semgrep) and custom FastAPI microservices with strict schema validation.",
    technologies: [
      "Python",
      "LangGraph",
      "LangChain",
      "Model Context Protocol (MCP)",
      "FastAPI",
      "FAISS",
      "pytest-asyncio",
      "LLM Evaluation",
      "Docker"
    ],
    keyFeatures: [
      "Engineered a cyclic LangGraph state machine with deterministic guardrails and conditional tool routing, reducing tool-call hallucinations across multi-step tasks.",
      "Integrated Model Context Protocol (MCP) servers allowing seamless real-time tool expansion across static code analysis (Semgrep) and documentation retrieval.",
      "Implemented an automated evaluation harness with pytest benchmarking retriever precision, tool selection accuracy, and safety constraints against golden datasets.",
      "Structured clean three-tier architecture separating tools/, prompts/, and evals/ behind asynchronous FastAPI REST endpoints.",
    ],
    imgPath: toolbotImg,
    ghLink: "https://github.com/kulkarniparth30/Omni-Agent",
    demoLink: "",
  },
  {
    id: 3,
    title: "KisanSetu — Agentic Multimodal AI Platform for Crop Disease Diagnosis",
    year: "2026",
    description:
      "Addressed severe crop misdiagnosis and connectivity barriers in rural agriculture by engineering a hybrid multimodal RAG platform. Grounds vision-language models in peer-reviewed agronomic databases and introduces an on-device ResNet50 classification fallback with multilingual telephone voice access.",
    technologies: [
      "Python",
      "FastAPI",
      "LangChain",
      "PyTorch",
      "ResNet50",
      "Gemini 2.5 Flash",
      "FAISS",
      "Google Cloud Platform",
      "Twilio IVR"
    ],
    keyFeatures: [
      "Built end-to-end RAG pipeline over verified agricultural extension databases, eliminating medical/chemical advisory hallucinations in Gemini 2.5 Flash outputs.",
      "Designed a dual-tier diagnostic fallback: cloud multimodal RAG when connected, with local PyTorch ResNet50 edge inference under zero/low-bandwidth constraints.",
      "Benchmarked offline edge accuracy vs cloud multimodal latency to optimize edge model quantization and inference speed.",
      "Engineered Twilio voice IVR allowing non-smartphone rural farmers to speak symptoms and receive voice diagnosis in Marathi, Hindi, and English.",
    ],
    imgPath: kisansetuImg,
    ghLink: "https://github.com/kulkarniparth30/kisanSetu",
    demoLink: "",
  },
  {
    id: 4,
    title: "StudyMind AI — Offline On-Device RAG & Multi-Agent Study Assistant",
    year: "2026",
    description:
      "Solved private data leakage and costly cloud inference fees for academic document synthesis. Executes complete Retrieval-Augmented Generation (RAG) 100% inside the user's browser via WebGPU and Web Workers, combined with CrewAI multi-agent crews for autonomous quiz and study plan creation.",
    technologies: [
      "React 18",
      "Vite",
      "WebLLM (Llama-3.2-1B)",
      "Transformers.js",
      "CrewAI",
      "IndexedDB",
      "WebGPU",
      "FastAPI"
    ],
    keyFeatures: [
      "Zero-server data privacy: model weights (Llama-3.2-1B / Phi-3.5) execute directly on user client hardware via WebGPU with 0 bytes transmitted externally.",
      "Persistent in-browser vector search: generates MiniLM embeddings via Transformers.js and stores normalized vectors in IndexedDB for sub-second chunk retrieval.",
      "CrewAI multi-agent orchestration generating customized Bloom's taxonomy quizzes, spaced-repetition flashcards, and syllabus schedules from lecture PDFs.",
      "High-throughput local streaming benchmarked at 48+ tokens/second on consumer hardware with zero token pricing or subscription requirements.",
    ],
    imgPath: studymindImg,
    ghLink: "https://github.com/kulkarniparth30/NOTES_RAG_ASSISTANT",
    demoLink: "",
  },
  {
    id: 5,
    title: "PharmaComplaint AI — QMS Complaint Intake & LangGraph CAPA Engine",
    year: "2026",
    description:
      "Developed an enterprise quality copilot for pharmaceutical manufacturing Quality Management Systems (QMS). Uses LangGraph to transform unstandardized defect emails and customer reports into structured, regulatory-compliant audits under GAMP-5 and 21 CFR Part 11 guidelines.",
    technologies: [
      "Python",
      "FastAPI",
      "LangGraph",
      "Groq AI (Llama 3.3 70B)",
      "React",
      "Redux Toolkit",
      "SQLite",
      "Pydantic",
      "GAMP-5"
    ],
    keyFeatures: [
      "Multi-stage LangGraph workflow pipeline (ingest -> extract -> validate -> risk -> capa -> summary) parsing complex chemical and packaging defects.",
      "Automated critical-risk triage classifying sterility breaches, foreign contaminants, and dosage variations into validated GAMP-5 regulatory severity levels.",
      "Intelligent Corrective and Preventive Actions (CAPA) engine generating automated quarantine orders, inspection calibrations, and assigned team SLAs.",
      "High-speed compliant regulatory draft generation running on Groq Llama 3.3 70B in under 350ms with immutable SHA-256 validation logging.",
    ],
    imgPath: pharmacompImg,
    ghLink: "https://github.com/kulkarniparth30/pharma-complaint-ai",
    demoLink: "",
  },
  {
    id: 6,
    title: "ReelFlow AI — Automated Viral Reel & Short-Form Video Generator",
    year: "2026",
    description:
      "Automated the multi-step video synthesis lifecycle for short-form content. Orchestrates image sequence timing, dynamic Ken Burns camera pans, Google Text-to-Speech (gTTS) voiceover generation, and automatic audio ducking into a single asynchronous FFmpeg pipeline.",
    technologies: [
      "Python",
      "Flask",
      "FFmpeg",
      "Google Text-to-Speech (gTTS)",
      "MoviePy",
      "Jinja2",
      "Bootstrap 5",
      "CSS3 Glassmorphism"
    ],
    keyFeatures: [
      "Multi-pass FFmpeg rendering engine applying cinematic pan/zoom filters (Ken Burns) and dynamic hard-burned subtitle captions per slide.",
      "Intelligent speech cadence detection with automatic audio ducking attenuating background music tracks by -14dB during voiceover segments.",
      "Real-time rendering status tracking across multi-stage queues (Queued -> Audio -> Video -> Done) with resilient client-side polling.",
      "Instant 1080x1920 60FPS MP4 video export with one-click direct download and responsive video player preview.",
    ],
    imgPath: reelflowImg,
    ghLink: "https://github.com/kulkarniparth30/ReelFlow-AI",
    demoLink: "",
  },
];
