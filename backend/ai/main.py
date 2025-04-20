from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from agent import AIAgent  # Make sure this is the correct path to your AIAgent class
import asyncio
import uuid
import json
import time
from typing import Dict, Optional
from datetime import datetime, timedelta

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Consider restricting this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store agents with their last used timestamp
class SessionInfo:
    def __init__(self, agent: AIAgent):
        self.agent = agent
        self.last_used = datetime.now()
    
    def update_timestamp(self):
        self.last_used = datetime.now()

# Global session store
sessions: Dict[str, SessionInfo] = {}

@app.get("/chat/{session_id}")
async def chat(session_id: str, input: str):
    # Create agent for new sessions or get existing one
    if session_id not in sessions:
        sessions[session_id] = SessionInfo(AIAgent(model_name="qwen2.5", temperature=0.0))
    else:
        # Update last used timestamp
        sessions[session_id].update_timestamp()
    
    agent = sessions[session_id].agent
    
    # Define the streaming response
    async def response_stream():
        try:
            async for chunk in agent.generate_response(input):
                # Convert the structured response to JSON string for SSE
                chunk_json = json.dumps(chunk)
                yield f"data: {chunk_json}\n\n"
                
                # Small delay for smoother streaming
                # Only add delay for token chunks to make typed text feel natural
                if chunk.get("type") == "token":
                    await asyncio.sleep(0.01)
        except Exception as e:
            error_json = json.dumps({"type": "error", "content": str(e)})
            yield f"data: {error_json}\n\n"
    
    return StreamingResponse(
        response_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@app.post("/new_session")
async def create_session():
    session_id = str(uuid.uuid4())
    sessions[session_id] = SessionInfo(AIAgent(model_name="qwen2.5", temperature=0.0))
    return {"session_id": session_id}

@app.delete("/session/{session_id}")
async def delete_session(session_id: str):
    if session_id in sessions:
        # Clean up resources before deleting
        await sessions[session_id].agent.cleanup()
        del sessions[session_id]
        return {"status": "session deleted"}
    raise HTTPException(status_code=404, detail="Session not found")

@app.get("/clear_history/{session_id}")
async def clear_history(session_id: str):
    if session_id in sessions:
        sessions[session_id].agent.clear_chat_history()
        sessions[session_id].update_timestamp()
        return {"status": "chat history cleared"}
    raise HTTPException(status_code=404, detail="Session not found")

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "active_sessions": len(sessions),
        "timestamp": datetime.now().isoformat()
    }

# Cleanup inactive sessions periodically
@app.on_event("startup")
async def start_cleanup_task():
    asyncio.create_task(cleanup_inactive_sessions())

async def cleanup_inactive_sessions():
    while True:
        try:
            await asyncio.sleep(60 * 30)  # Check every 30 minutes
            
            # Get current time and calculate cutoff (2 hours of inactivity)
            now = datetime.now()
            cutoff = now - timedelta(hours=2)
            
            # Identify sessions to remove
            sessions_to_remove = [
                session_id for session_id, session_info in sessions.items()
                if session_info.last_used < cutoff
            ]
            
            # Clean up each expired session
            for session_id in sessions_to_remove:
                try:
                    await sessions[session_id].agent.cleanup()
                    del sessions[session_id]
                    print(f"Cleaned up inactive session: {session_id}")
                except Exception as e:
                    print(f"Error cleaning up session {session_id}: {e}")
                    
        except Exception as e:
            print(f"Error in cleanup task: {e}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)