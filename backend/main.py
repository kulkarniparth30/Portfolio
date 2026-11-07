import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
from typing import List, Dict, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from rag import RAGPipeline

app = FastAPI(
    title="Parth AI Portfolio Assistant API",
    description="RAG-powered conversational API for Parth Kulkarni's AI Engineer Portfolio",
    version="1.0.0"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows localhost:3000 and deployed frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG Pipeline
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
KB_DIR = os.path.join(BASE_DIR, "knowledge_base")
rag_pipeline = RAGPipeline(kb_dir=KB_DIR)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000, description="User's query")
    history: Optional[List[ChatMessage]] = Field(default=[], description="Previous conversation turns")

class ChatResponse(BaseModel):
    answer: str
    sources: List[str]
    links: List[str]
    model: str

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Parth AI Portfolio Assistant",
        "endpoints": {
            "health": "/api/health",
            "chat": "/api/chat",
            "docs": "/docs"
        }
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "chunks_indexed": len(rag_pipeline.vector_store.chunks),
        "vector_database": "FAISS (IndexFlatIP, 384-dim)",
        "gemini_api_configured": bool(os.getenv("GEMINI_API_KEY")),
        "model": "gemini-2.5-flash (FAISS Indexed)" if os.getenv("GEMINI_API_KEY") else "FAISS-Semantic-Retrieval"
    }

@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    try:
        user_query = request.message.strip()
        if not user_query:
            raise HTTPException(status_code=400, detail="Query cannot be empty.")

        history_dicts = [{"role": msg.role, "content": msg.content} for msg in request.history] if request.history else []
        result = rag_pipeline.generate_response(query=user_query, history=history_dicts)
        return ChatResponse(
            answer=result["answer"],
            sources=result["sources"],
            links=result.get("links", []),
            model=result.get("model", "unknown")
        )
    except Exception as e:
        print(f"[API ERROR] {e}")
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@app.post("/api/reload-kb")
def reload_knowledge_base():
    rag_pipeline.load_or_rebuild()
    return {"status": "reloaded", "total_chunks": len(rag_pipeline.vector_store.chunks)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
