# Parth Kulkarni — AI/ML Engineer Portfolio & RAG Assistant

<div align="center">
  <h2>Parth Kulkarni | Portfolio & Parth AI</h2>
  <p><strong>AI/ML Engineer | Generative AI Developer</strong></p>
  <p>Building intelligent applications using Machine Learning, Generative AI, Large Language Models, RAG, and Agentic AI.</p>
</div>

---

## 🌟 Key Features

1. **80/20 Visual Preservation & Modernization**:
   - Preserved the signature dark purple aesthetic, starry particle background, and responsive grid layout.
   - Enhanced hero section with customized AI/ML neural network illustration, interactive typewriting, and quick CTA buttons.
2. **Personal Branding**:
   - Replaced all previous developer references across the entire site, metadata, open graph tags, navbar, footer, and resume.
3. **Categorized AI & ML Technical Skillset**:
   - Organized into clean, modern skill cards: Programming Languages, Machine Learning, Deep Learning, Generative AI & Agentic Systems, Backend & Databases, and Tools & Deployment.
4. **Configurable AI/ML Projects**:
   - Modular project showcase driven by `src/components/Projects/projectsData.js` featuring Multi-Agent workflows, Enterprise Multimodal RAG, NL-to-SQL Analytics, and Deep Learning vision models.
5. **RAG-Powered Chatbot ("Parth AI")**:
   - Floating chat interface with subtle glowing animation and expand/collapse modal.
   - Connected to a **FastAPI backend** running a **Retrieval-Augmented Generation (RAG)** pipeline over a structured Markdown knowledge base.
   - Grounded responses, source citations, suggested questions, auto-scrolling, and conversation memory.
6. **Blog Section**:
   - Cleanly removed per project specifications.

---

## 🏗️ Architecture

```
Portfolio Frontend (React + React-Bootstrap)
      │
      ▼  HTTP POST /api/chat
FastAPI Backend (backend/main.py)
      │
      ▼
RAG Pipeline (backend/rag.py)
      │
      ▼ Semantic Retrieval
Knowledge Base (backend/knowledge_base/*.md)
      │
      ▼ Context Augmentation
LLM Generation (Gemini 2.5 Flash / Grounded Semantic Fallback)
      │
      ▼ JSON Response with Answer & Citations
Parth AI Chatbot Interface
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v16+ recommended)
- **Python** (v3.10+ recommended)

### 2. Frontend Setup & Run
From the root directory:

```bash
# Install dependencies (if not already installed)
npm install

# Start React development server
npm start
```
The application will launch at **[http://localhost:3000](http://localhost:3000)**.

### 3. Backend Setup & Run
Open a separate terminal in the project directory:

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# (Optional) Set your Gemini API Key for dynamic LLM generation:
# On Windows PowerShell:
$env:GEMINI_API_KEY="your-google-gemini-api-key"
# On Linux/macOS:
export GEMINI_API_KEY="your-google-gemini-api-key"

# Run FastAPI with Uvicorn
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI backend will start at **[http://127.0.0.1:8000](http://127.0.0.1:8000)**.
- Interactive API Docs (Swagger): **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**
- Health check: **[http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)**

---

## 📚 Customizing the Knowledge Base

The chatbot grounds all answers in editable markdown files located inside `backend/knowledge_base/`:
- `about_me.md`: Background, contact details, and engineering philosophy.
- `education.md`: Degrees, coursework, and academic focus.
- `skills.md`: Technical competencies across languages, ML, DL, and GenAI.
- `projects.md`: Project summaries, architecture details, and GitHub links.
- `certifications.md`: Courses and certifications.
- `achievements.md`: Accomplishments and milestones.
- `resume.md`: Resume highlights.
- `career_interests.md`: Target roles and domains.
- `frequently_asked_questions.md`: Common questions and answers.

To hot-reload changes without restarting the backend, you can trigger:
```bash
curl -X POST http://127.0.0.1:8000/api/reload-kb
```

---

## 🐳 Docker Containerization

Run the entire full-stack application (React frontend + FastAPI vector search backend) with a single command:

```bash
docker-compose up --build
```

- **Frontend**: Accessible at `http://localhost:3000`
- **Backend API**: Accessible at `http://localhost:8001` (API Docs at `http://localhost:8001/docs`)

---

## 🌐 Deployment Guide

### Frontend Deployment (e.g., Vercel / Netlify)
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy the `build` directory or link your GitHub repository to Vercel.
3. Configure the environment variable:
   ```env
   REACT_APP_API_URL=https://your-backend-domain.com
   ```

### Backend Deployment (e.g., Render / Railway / Cloud Run)
1. Deploy the `backend/` directory as a Python web service.
2. Build command:
   ```bash
   pip install -r requirements.txt
   ```
3. Start command:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
4. Set environment variable `GEMINI_API_KEY` in your hosting dashboard.

---

## 📄 License
MIT License.
