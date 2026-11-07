import os
import glob
import re
import json
import numpy as np
from typing import List, Dict, Any, Optional

import faiss
from sentence_transformers import SentenceTransformer

# Optional Google GenAI client
try:
    from google import genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

SOURCE_LABEL_MAP = {
    "projects.md": "Verified Projects",
    "skills.md": "Technical Competencies",
    "education.md": "Academic Background",
    "about_me.md": "Profile Summary",
    "achievements.md": "Achievements & Hackathons",
    "certifications.md": "Professional Certifications",
    "resume.md": "Resume Documentation",
    "career_interests.md": "Career Interests",
    "frequently_asked_questions.md": "Verified FAQ",
}

class KnowledgeChunk:
    def __init__(self, content: str, source: str, title: str = "", chunk_id: int = 0):
        self.chunk_id = chunk_id
        self.content = content.strip()
        self.source = source
        self.title = title

    def to_dict(self):
        return {
            "chunk_id": self.chunk_id,
            "content": self.content,
            "source": self.source,
            "title": self.title
        }

class FAISSVectorStore:
    def __init__(self, embedding_model_name: str = "all-MiniLM-L6-v2", index_path: str = "faiss_index.bin", meta_path: str = "faiss_meta.json"):
        self.embedding_model = SentenceTransformer(embedding_model_name)
        self.dimension = 384
        self.index_path = index_path
        self.meta_path = meta_path
        self.index = faiss.IndexFlatIP(self.dimension)
        self.chunks: List[KnowledgeChunk] = []

    def build_and_save(self, chunks: List[KnowledgeChunk]):
        self.chunks = chunks
        if not chunks:
            return

        texts = [f"{c.title}\n{c.content}" for c in chunks]
        embeddings = self.embedding_model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
        faiss.normalize_L2(embeddings)

        self.index = faiss.IndexFlatIP(self.dimension)
        self.index.add(embeddings.astype(np.float32))

        faiss.write_index(self.index, self.index_path)
        with open(self.meta_path, "w", encoding="utf-8") as f:
            json.dump([c.to_dict() for c in chunks], f, indent=2)
        print(f"[FAISS] Built and saved {len(chunks)} vectors to {self.index_path}")

    def load_if_exists(self) -> bool:
        if os.path.exists(self.index_path) and os.path.exists(self.meta_path):
            try:
                self.index = faiss.read_index(self.index_path)
                with open(self.meta_path, "r", encoding="utf-8") as f:
                    meta_data = json.load(f)
                self.chunks = [KnowledgeChunk(**item) for item in meta_data]
                print(f"[FAISS] Loaded {len(self.chunks)} vectors from {self.index_path}")
                return True
            except Exception as e:
                print(f"[FAISS] Could not load existing index: {e}")
        return False

    def search(self, query: str, top_k: int = 3) -> List[KnowledgeChunk]:
        if self.index.ntotal == 0 or not self.chunks:
            return []

        query_vector = self.embedding_model.encode([query], convert_to_numpy=True)
        faiss.normalize_L2(query_vector)

        distances, indices = self.index.search(query_vector.astype(np.float32), min(top_k * 2, self.index.ntotal))
        results = []
        for idx in indices[0]:
            if 0 <= idx < len(self.chunks):
                results.append(self.chunks[idx])
        return results

class RAGPipeline:
    def __init__(self, kb_dir: str):
        self.kb_dir = kb_dir
        base_dir = os.path.dirname(os.path.abspath(__file__))
        index_file = os.path.join(base_dir, "faiss_index.bin")
        meta_file = os.path.join(base_dir, "faiss_meta.json")
        self.vector_store = FAISSVectorStore(index_path=index_file, meta_path=meta_file)
        self.load_or_rebuild()

    def load_or_rebuild(self, force: bool = False):
        if not force and self.vector_store.load_if_exists():
            print(f"[RAG Pipeline] Loaded {len(self.vector_store.chunks)} chunks from existing FAISS index.")
            return

        chunks = []
        files = glob.glob(os.path.join(self.kb_dir, "*.md"))
        chunk_id = 0

        for file_path in files:
            source_file = os.path.basename(file_path)
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    text = f.read()

                sections = re.split(r'\n(?=#{1,3}\s)', text)
                for sec in sections:
                    sec = sec.strip()
                    if not sec:
                        continue
                    lines = [l.strip() for l in sec.split("\n") if l.strip()]
                    # Skip top-level empty title chunks (e.g. just "# Technical Skills")
                    if len(lines) <= 1 and lines and lines[0].startswith("#"):
                        continue
                    title = lines[0].replace("#", "").strip() if lines else source_file
                    chunks.append(KnowledgeChunk(
                        content=sec,
                        source=source_file,
                        title=title,
                        chunk_id=chunk_id
                    ))
                    chunk_id += 1
            except Exception as e:
                print(f"[RAG] Error reading {file_path}: {e}")

        self.vector_store.build_and_save(chunks)
        print(f"[RAG Pipeline] Indexed {len(chunks)} chunks into FAISS vector database.")

    def retrieve(self, query: str, top_k: int = 3) -> List[KnowledgeChunk]:
        """Hybrid retrieval: FAISS semantic search + intent keyword matching."""
        dense_results = self.vector_store.search(query, top_k=top_k)
        
        query_lower = query.lower()
        exact_boosted = []
        for chunk in self.vector_store.chunks:
            title_lower = chunk.title.lower()
            content_lower = chunk.content.lower()

            # Priority 1: Flagship projects
            if ("omni" in query_lower or "toolbot" in query_lower) and ("omni" in title_lower or "toolbot" in title_lower):
                exact_boosted.insert(0, chunk)
            elif "kisan" in query_lower and "kisan" in title_lower:
                exact_boosted.insert(0, chunk)
            elif "resume" in query_lower and ("resumeagent" in title_lower or "resume analyser" in content_lower):
                exact_boosted.insert(0, chunk)
            elif "studymind" in query_lower and ("studymind" in title_lower or "notes_rag" in content_lower):
                exact_boosted.insert(0, chunk)
            elif "pharma" in query_lower and "pharma" in title_lower:
                exact_boosted.insert(0, chunk)
            elif ("reelflow" in query_lower or "reel" in query_lower) and "reelflow" in title_lower:
                exact_boosted.insert(0, chunk)
            elif ("agent-guard" in query_lower or "open source" in query_lower or "pr" in query_lower) and "agent-guard" in title_lower:
                exact_boosted.insert(0, chunk)
            # Priority 2: Sections
            elif any(w in query_lower for w in ["education", "college", "degree", "cgpa", "rscoe"]) and chunk.source == "education.md":
                exact_boosted.append(chunk)
            elif any(w in query_lower for w in ["certification", "oracle", "certificate"]) and chunk.source == "certifications.md":
                exact_boosted.append(chunk)
            elif any(w in query_lower for w in ["skill", "technologies", "tech stack"]) and chunk.source == "skills.md":
                exact_boosted.append(chunk)
            elif any(w in query_lower for w in ["contact", "email", "phone", "linkedin", "github"]) and chunk.source == "about_me.md":
                exact_boosted.append(chunk)

        combined = []
        for c in exact_boosted + dense_results:
            if c not in combined:
                combined.append(c)
        return combined[:top_k]

    def generate_response(self, query: str, history: List[Dict[str, str]] = None) -> Dict[str, Any]:
        """Generates clean, structured, concise response with bullet points and clickable links."""
        retrieved_chunks = self.retrieve(query, top_k=3)
        context = "\n\n---\n\n".join([f"[{c.source} | {c.title}]\n{c.content}" for c in retrieved_chunks])

        # Map human-friendly source labels
        sources = []
        for c in retrieved_chunks:
            label = SOURCE_LABEL_MAP.get(c.source, c.source.replace(".md", "").replace("_", " ").title())
            if label not in sources:
                sources.append(label)

        links = []
        all_content = "\n".join([c.content for c in retrieved_chunks])
        url_matches = re.findall(r'https?://[^\s)"]+', all_content)
        for url in url_matches:
            if url not in links:
                links.append(url)

        gemini_api_key = os.getenv("GEMINI_API_KEY")

        system_instruction = f"""You are 'Parth AI', Parth Kulkarni's verified portfolio assistant.
Parth is an AI Engineering student at RSCOE Pune specializing in Agentic AI (LangGraph, MCP, CrewAI), RAG pipelines, and on-device privacy-first AI.

CRITICAL FORMATTING & GROUNDING RULES:
1. Always be concise, clean, and properly structured. Avoid walls of text or long unbroken paragraphs.
2. Structure answers using a short bold heading, 2 to 4 bullet points, and exact key takeaways.
3. Ground strictly in the context below. Never hallucinate facts or claim unverified work experience.
4. Include relevant GitHub links directly in your response if applicable.
5. If information is not in the context, concisely state: "That information is not available in Parth's verified portfolio."

CONTEXT:
{context}
"""

        if gemini_api_key and GENAI_AVAILABLE:
            try:
                client = genai.Client(api_key=gemini_api_key)
                
                # Context history
                history_prompt = ""
                if history:
                    for h in history[-3:]:
                        role = "User" if h.get("role") == "user" else "Assistant"
                        history_prompt += f"{role}: {h.get('content')}\n"

                prompt_text = f"{system_instruction}\n\n{history_prompt}User: {query}\nAssistant:"
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt_text
                )
                return {
                    "answer": response.text.strip(),
                    "sources": sources,
                    "links": links[:3],
                    "model": "gemini-2.5-flash (Verified RAG)"
                }
            except Exception as e:
                print(f"[RAG] Gemini generation error: {e}")

        # Deterministic, high-fidelity structured synthesis
        q_lower = query.lower()

        # Intent 1: General Skills
        if any(w in q_lower for w in ["skill", "technologies", "tech stack", "languages", "tools"]):
            answer = (
                "**Parth Kulkarni's Technical Competencies**\n\n"
                "• **AI & Multi-Agent Systems**: LangGraph state graphs, LangChain, CrewAI, Model Context Protocol (MCP), tool routing & policy evaluation.\n"
                "• **RAG & Search**: Hybrid dense & sparse search, context chunking, cross-encoder re-ranking, dense vector search, WebLLM in-browser inference.\n"
                "• **Programming Languages**: Python (Primary for AI/ML & concurrency), C++, C, JavaScript, SQL.\n"
                "• **Backend & Distributed Systems**: FastAPI (async REST APIs), Flask, Python asyncio concurrency, PostgreSQL, Docker.\n"
                "• **Machine Learning & Core Data**: PyTorch, Scikit-learn, CNNs, Transformers, Transfer Learning, Pandas, NumPy.\n"
                "• **Evaluation & Quality**: LangSmith, Langfuse, Guardrails AI, pytest-asyncio, Git & GitHub CI."
            )
            return {
                "answer": answer,
                "sources": ["Technical Competencies"],
                "links": ["https://github.com/kulkarniparth30"],
                "model": "Portfolio-AI-Engine"
            }

        # Intent 2: Projects Overview
        if any(w in q_lower for w in ["projects", "genai project", "work", "portfolio projects", "built"]) and not any(w in q_lower for w in ["omni", "toolbot", "kisan", "resumeagent", "studymind", "pharma", "reelflow", "reel"]):
            answer = (
                "**Parth's Flagship AI Engineering Projects (Verified on GitHub)**\n\n"
                "• **Omni-Agent (2026)**: Multi-agent AI assistant built with LangGraph & Model Context Protocol (MCP). Autonomous tool routing across hosted MCP servers (Context7, DeepWiki, Semgrep) and custom FastAPI servers.\n"
                "  https://github.com/kulkarniparth30/Omni-Agent\n\n"
                "• **KisanSetu (2026)**: Multimodal crop disease diagnosis platform. Dual-tier architecture with local PyTorch ResNet50 edge classification and cloud Gemini 2.5 Flash RAG, with multilingual Twilio voice IVR.\n"
                "  https://github.com/kulkarniparth30/kisanSetu\n\n"
                "• **ResumeAgent (2026)**: Agentic resume analysis & ATS ranker using LangGraph, dense semantic & keyword hybrid retrieval, and custom Skill Hallucination Detector scoring candidates against IEEE/ACM benchmarks.\n"
                "  https://github.com/kulkarniparth30/ResumeAgent\n\n"
                "• **StudyMind AI (2026)**: Privacy-first study platform running 100% on-device RAG in the browser via WebLLM (Llama-3.2-1B) and client-side vector search in IndexedDB, backed by CrewAI multi-agent study tools (OSDHack 2026).\n"
                "  https://github.com/kulkarniparth30/NOTES_RAG_ASSISTANT\n\n"
                "• **PharmaComplaint AI (2026)**: Enterprise QMS complaint intake copilot using LangGraph to automate customer complaint ingestion, GAMP-5 critical risk classification, and CAPA recommendations under 21 CFR Part 11 standards.\n"
                "  https://github.com/kulkarniparth30/pharma-complaint-ai\n\n"
                "• **ReelFlow AI (2026)**: Automated short-form video generation pipeline with FFmpeg pan/zoom transitions, AI voiceover synthesis via gTTS, dynamic burned captions, and automatic audio ducking.\n"
                "  https://github.com/kulkarniparth30/ReelFlow-AI"
            )
            return {
                "answer": answer,
                "sources": ["Verified Projects", "Achievements & Hackathons"],
                "links": [
                    "https://github.com/kulkarniparth30/Omni-Agent",
                    "https://github.com/kulkarniparth30/kisanSetu",
                    "https://github.com/kulkarniparth30/ResumeAgent",
                    "https://github.com/kulkarniparth30/NOTES_RAG_ASSISTANT",
                    "https://github.com/kulkarniparth30/pharma-complaint-ai",
                    "https://github.com/kulkarniparth30/ReelFlow-AI"
                ],
                "model": "Portfolio-AI-Engine"
            }

        # Intent 3: RAG specific
        if "rag" in q_lower or "retrieval" in q_lower:
            answer = (
                "**Retrieval-Augmented Generation (RAG) Expertise**\n\n"
                "• **Hybrid Retrieval Systems**: Builds production RAG combining dense embeddings (SentenceTransformers/MiniLM) and sparse BM25/TF-IDF with cross-encoder re-ranking.\n"
                "• **Context Chunking & Metadata**: Implements hierarchical and context-aware chunking preserving tables and section boundaries.\n"
                "• **Zero-Latency In-Browser RAG**: Integrates WebLLM and client-side vector search for privacy-first, serverless document reasoning.\n"
                "• **RAG Triad & Guardrails**: Evaluates generation grounding using context relevance, groundedness, and hallucination metrics (LangSmith/Langfuse).\n"
                "• **Vector Databases**: Extensive hands-on experience with pgvector, Supabase Vector, and scalable embedding indexes."
            )
            return {
                "answer": answer,
                "sources": ["Technical Competencies", "Verified Projects"],
                "links": ["https://github.com/kulkarniparth30"],
                "model": "Portfolio-AI-Engine"
            }

        # Intent 4: Why Hire / Career
        if any(w in q_lower for w in ["why should", "why hire", "consider", "ai engineer role", "hire parth"]):
            answer = (
                "**Why Consider Parth Kulkarni for AI Engineering Roles**\n\n"
                "• **Proven Agentic AI Experience**: Builds autonomous multi-agent state machines using LangGraph, CrewAI, and Model Context Protocol (MCP) tool integration.\n"
                "• **Open Source Contributor**: Authored PR #143 (+592 lines) for agent-guard, implementing concurrent asyncio policy enforcement for agent tool calls with 23 passing pytest-asyncio tests.\n"
                "• **Competitive Hackathon Track Record**: Finished Top 10 in both rounds of the Datathon ML Hackathon conducted by PCCOE College.\n"
                "• **Rigorous Engineering Foundation**: B.Tech in Computer Engineering from JSPM's RSCOE Pune (Expected 2028, CGPA: 8.11/10) with deep fluency in Python, FastAPI, PyTorch, and distributed systems."
            )
            return {
                "answer": answer,
                "sources": ["Profile Summary", "Achievements & Hackathons", "Academic Background"],
                "links": ["https://github.com/kulkarniparth30", "https://www.linkedin.com/in/parth-kulkarni-39260432a/"],
                "model": "Portfolio-AI-Engine"
            }

        # Intent 5: Education
        if any(w in q_lower for w in ["education", "college", "degree", "cgpa", "rscoe", "university"]):
            answer = (
                "**Academic Background — Parth Kulkarni**\n\n"
                "• **Bachelor of Technology (B.Tech) in Computer Engineering**\n"
                "  JSPM's Rajarshi Shahu College of Engineering (RSCOE), Pune | Expected: 2028\n"
                "  **CGPA**: 8.11 / 10.0\n"
                "• **Higher Secondary Certificate (Class XII)**\n"
                "  Mahatma Phule Junior College, Ahmadpur | 2024\n"
                "  **MHT-CET Percentile**: 95.25\n"
                "• **Core Disciplines**: Data Structures & Algorithms, Machine Learning, Deep Learning, Operating Systems, Database Management Systems."
            )
            return {
                "answer": answer,
                "sources": ["Academic Background"],
                "links": [],
                "model": "Portfolio-AI-Engine"
            }

        # Intent 6: Open source / agent-guard
        if any(w in q_lower for w in ["open source", "agent-guard", "pr 143", "contribution"]):
            answer = (
                "**Open Source Contribution — agent-guard (PR #143)**\n\n"
                "• **Repository**: agent-guard (AI Agent Tool Security & Policy Enforcement)\n"
                "• **Authored Pull Request**: PR #143 (+592 lines added)\n"
                "• **Key Deliverables**:\n"
                "  • Implemented an asynchronous policy enforcement engine for AI agent tool calls using Python `asyncio`.\n"
                "  • Built concurrency-safe tool interception hooks validating LLM arguments before external execution.\n"
                "  • Authored 23 comprehensive unit and integration tests with `pytest-asyncio`."
            )
            return {
                "answer": answer,
                "sources": ["Achievements & Hackathons", "Profile Summary"],
                "links": ["https://github.com/kulkarniparth30"],
                "model": "Portfolio-AI-Engine"
            }

        # Intent 7: Resume download / file
        if any(w in q_lower for w in ["download resume", "resume pdf", "cv", "resume link"]):
            answer = (
                "**Parth Kulkarni's Verified Resume**\n\n"
                "• You can view the live PDF preview and download his complete resume directly in the dedicated **Resume** section of this portfolio.\n"
                "• Includes verified details on his Computer Engineering B.Tech (CGPA 8.11/10), Omni-Agent, KisanSetu, ResumeAgent, and agent-guard open-source PR."
            )
            return {
                "answer": answer,
                "sources": ["Resume Documentation"],
                "links": ["https://www.linkedin.com/in/parth-kulkarni-39260432a/"],
                "model": "Portfolio-AI-Engine"
            }

        # Intent: Hackathon / Datathon
        if any(w in q_lower for w in ["hackathon", "datathon", "competition", "pccoe"]):
            answer = (
                "**Hackathon Achievements — Parth Kulkarni**\n\n"
                "• **Datathon ML Hackathon (PCCOE College)**: Finished **Top 10 in both rounds** of the competitive Machine Learning hackathon.\n"
                "• Demonstrated end-to-end predictive modeling, advanced feature engineering, and model evaluation under tight competitive deadlines."
            )
            return {
                "answer": answer,
                "sources": ["Achievements & Hackathons"],
                "links": ["https://github.com/kulkarniparth30"],
                "model": "Portfolio-AI-Engine"
            }

        # Intent: Omni-Agent (formerly ToolBot)
        if "omni" in q_lower or "toolbot" in q_lower:
            answer = (
                "**Omni-Agent — Multi-Tool LangGraph & MCP AI Assistant (2026)**\n\n"
                "• **Tech Stack**: Python, LangChain, LangGraph, Model Context Protocol (MCP), FastAPI, pytest, LLM Evaluation\n"
                "• **GitHub Repository**: https://github.com/kulkarniparth30/Omni-Agent\n"
                "• **Problem**: LLMs cannot reliably interface with live external environments and frequently hallucinate tool calls.\n"
                "• **Key Architecture & Deliverables**:\n"
                "  • Built an LLM-powered multi-agent assistant in Python using LangGraph where the model autonomously selects tools across hosted MCP servers (Context7, DeepWiki, Semgrep) and custom FastAPI arithmetic tool servers.\n"
                "  • Engineered prompt and tool-routing logic eliminating multi-tool chaining failures.\n"
                "  • Structured modular tools/, prompts/, and evals/ layers behind a high-performance FastAPI API.\n"
                "  • Built an automated evaluation suite with pytest benchmarking tool selection and response relevance."
            )
            return {
                "answer": answer,
                "sources": ["Verified Projects"],
                "links": ["https://github.com/kulkarniparth30/Omni-Agent"],
                "model": "Portfolio-AI-Engine"
            }

        # Intent: KisanSetu
        if "kisan" in q_lower:
            answer = (
                "**KisanSetu — Agentic Multimodal AI Platform for Crop Disease Diagnosis (2026)**\n\n"
                "• **Tech Stack**: Python, PyTorch, ResNet-50, Gemini 2.5 Flash, FastAPI, Twilio API, Streamlit\n"
                "• **GitHub Repository**: https://github.com/kulkarniparth30/kisanSetu\n"
                "• **Key Architecture & Problem Solved**:\n"
                "  • Solved crop misdiagnosis and connectivity barriers in rural farming through a grounded multimodal RAG pipeline over verified agronomic databases.\n"
                "  • Engineered a dual-tier diagnostic architecture: cloud Gemini 2.5 Flash RAG when connected, with local PyTorch ResNet50 edge inference under zero/low-bandwidth constraints.\n"
                "  • Benchmarked offline edge accuracy vs cloud multimodal latency to optimize edge model quantization.\n"
                "  • Deployed a multilingual Twilio voice IVR allowing non-smartphone rural farmers to speak symptoms and receive voice diagnosis in Marathi, Hindi, and English."
            )
            return {
                "answer": answer,
                "sources": ["Verified Projects"],
                "links": ["https://github.com/kulkarniparth30/kisanSetu"],
                "model": "Portfolio-AI-Engine"
            }

        # Intent: ResumeAgent
        if "resumeagent" in q_lower or ("resume" in q_lower and "agent" in q_lower):
            answer = (
                "**ResumeAgent — AI Resume Analyser, ATS Ranker & Skill-Gap Detector (2026)**\n\n"
                "• **Tech Stack**: Python, LangGraph, FastAPI, React, Vite, Tailwind CSS, Supabase, Docker\n"
                "• **GitHub Repository**: https://github.com/kulkarniparth30/ResumeAgent\n"
                "• **Live Web Application**: https://resume-agent-c1ww.onrender.com/\n"
                "• **Key Architecture & Problem Solved**:\n"
                "  • Engineered multi-factor ATS compatibility scoring combining dense semantic dense semantic embeddings with sparse TF-IDF parsing.\n"
                "  • Built an innovative Skill Hallucination Detector evaluating candidate claims against project context to flag unevidenced keywords before submission.\n"
                "  • Multi-LLM resilient inference: primary Google Gemini structured extraction with automated sub-second Groq fallback for high availability.\n"
                "  • Interactive A4 live resume builder with instant PDF generation, gap-remediation roadmaps, and persistent Supabase database session state."
            )
            return {
                "answer": answer,
                "sources": ["Verified Projects"],
                "links": [
                    "https://github.com/kulkarniparth30/ResumeAgent",
                    "https://resume-agent-c1ww.onrender.com/"
                ],
                "model": "Portfolio-AI-Engine"
            }

        # Intent: StudyMind AI (NOTES_RAG_ASSISTANT)
        if "studymind" in q_lower or "notes_rag" in q_lower or "on-device rag" in q_lower:
            answer = (
                "**StudyMind AI — Offline On-Device RAG & Multi-Agent Study Assistant (2026)**\n\n"
                "• **Tech Stack**: React 18, Vite, WebLLM, Llama-3.2-1B, Transformers.js, CrewAI, IndexedDB, WebGPU, FastAPI\n"
                "• **GitHub Repository**: https://github.com/kulkarniparth30/NOTES_RAG_ASSISTANT\n"
                "• **Recognition**: Built for OSDHack 2026 (100% Privacy-First Architecture)\n"
                "• **Key Architecture & Deliverables**:\n"
                "  • Executes 100% on-device RAG in the browser via WebGPU & Web Workers with zero student documents or queries leaving the local device.\n"
                "  • Built CrewAI multi-agent crew orchestrating autonomous quiz generation, personalized study schedules, and flashcard extraction.\n"
                "  • Client-side vector search caching MiniLM embeddings locally in IndexedDB for instant sub-second retrieval.\n"
                "  • High-throughput local inference streaming responses at 48+ tokens/second with zero API or subscription costs."
            )
            return {
                "answer": answer,
                "sources": ["Verified Projects"],
                "links": ["https://github.com/kulkarniparth30/NOTES_RAG_ASSISTANT"],
                "model": "Portfolio-AI-Engine"
            }

        # Intent: PharmaComplaint AI
        if "pharma" in q_lower or "complaint" in q_lower:
            answer = (
                "**PharmaComplaint AI — QMS Complaint Intake & LangGraph CAPA Engine (2026)**\n\n"
                "• **Tech Stack**: Python, FastAPI, LangGraph, Groq AI (Llama 3.3 70B), React, Redux Toolkit, SQLite, Pydantic\n"
                "• **GitHub Repository**: https://github.com/kulkarniparth30/pharma-complaint-ai\n"
                "• **Standard**: 21 CFR Part 11 & GAMP-5 QMS Compliance\n"
                "• **Key Architecture & Deliverables**:\n"
                "  • Engineered a multi-stage LangGraph state graph pipeline (`ingest -> extract -> validate -> risk -> capa -> summary`) parsing complex complaint documents.\n"
                "  • Automated critical-risk triage classifying sterility failures, packaging defects, and contamination under GAMP-5 regulatory standards.\n"
                "  • Integrated intelligent CAPA recommendation engine generating standardized action steps and SLA assignments for QA release teams.\n"
                "  • High-speed inference using Groq Llama 3.3 70B for compliant regulatory drafts in under 350ms with SHA-256 audit logs."
            )
            return {
                "answer": answer,
                "sources": ["Verified Projects"],
                "links": ["https://github.com/kulkarniparth30/pharma-complaint-ai"],
                "model": "Portfolio-AI-Engine"
            }

        # Intent: ReelFlow AI
        if "reelflow" in q_lower or "reel" in q_lower or "video" in q_lower:
            answer = (
                "**ReelFlow AI — Automated Viral Reel & Short-Form Video Generator (2026)**\n\n"
                "• **Tech Stack**: Python, Flask, FFmpeg, Google Text-to-Speech (gTTS), MoviePy, Jinja2, Bootstrap 5, CSS3 Glassmorphism\n"
                "• **GitHub Repository**: https://github.com/kulkarniparth30/ReelFlow-AI\n"
                "• **Key Architecture & Deliverables**:\n"
                "  • Automated FFmpeg rendering pipeline stitching multi-image uploads with Ken Burns zoom, pan transitions, and dynamic burned text captions.\n"
                "  • Free, API-keyless AI voiceover generation using gTTS with automatic speech cadence and intelligent audio ducking behind background tracks.\n"
                "  • Real-time multi-stage rendering progress tracking (Queued -> Audio -> Video -> Done) with navigation resilience.\n"
                "  • One-click 1080x1920 60FPS MP4 video export with instant social-ready download and built-in gallery preview."
            )
            return {
                "answer": answer,
                "sources": ["Verified Projects"],
                "links": ["https://github.com/kulkarniparth30/ReelFlow-AI"],
                "model": "Portfolio-AI-Engine"
            }

        # Fallback: Dynamic chunk synthesis from retrieved chunks
        top_chunk = retrieved_chunks[0]
        content = top_chunk.content

        # If FAQ, clean the QA formatting
        if "frequently_asked_questions.md" in top_chunk.source:
            q_match = re.search(r'###\s*Q:\s*(.*?)\n\s*A:\s*(.*)', content, re.DOTALL)
            if q_match:
                q_text = q_match.group(1).strip()
                a_text = q_match.group(2).strip()
                # Clean up bullet lines inside the answer
                clean_lines = []
                for line in a_text.split("\n"):
                    l = line.strip()
                    if l.startswith("-") or l.startswith("•") or l.startswith("*"):
                        clean_lines.append(f"• {re.sub(r'^[•\-*]\s*', '', l)}")
                    elif l:
                        clean_lines.append(l)
                answer = f"**{q_text}**\n\n" + "\n".join(clean_lines)
            else:
                answer = f"**{top_chunk.title}**\n\n{content}"
        else:
            lines = [line.strip() for line in content.split("\n") if line.strip()]
            header = lines[0].replace("#", "").strip() if lines else top_chunk.title
            body_lines = []
            for line in lines[1:]:
                if line.startswith("-") or line.startswith("•") or line.startswith("*"):
                    body_lines.append(f"• {re.sub(r'^[•\-*]\s*', '', line)}")
                elif line.startswith("#"):
                    body_lines.append(f"\n**{line.replace('#', '').strip()}**")
                else:
                    body_lines.append(line)
            
            body_text = "\n".join(body_lines)
            answer = f"**{header}**\n\n{body_text}"

        return {
            "answer": answer,
            "sources": sources,
            "links": links[:3],
            "model": "Portfolio-AI-Engine"
        }
