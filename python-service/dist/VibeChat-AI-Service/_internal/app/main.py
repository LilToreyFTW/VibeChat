"""
VibeChat Python AI Service
Provides AI-powered features for the VibeChat application
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uvicorn
import logging
from typing import Optional

from app.config.settings import settings
from app.routes import auth, rooms, bots, ai, billing
from app.database import engine
from app.models import base

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Security scheme
security = HTTPBearer()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager"""
    # Startup
    logger.info("Starting VibeChat AI Service...")

    # Create database tables
    async with engine.begin() as conn:
        await conn.run_sync(base.Base.metadata.create_all)

    yield

    # Shutdown
    logger.info("Shutting down VibeChat AI Service...")

# Create FastAPI application
app = FastAPI(
    title="VibeChat AI Service",
    description="AI-powered features for VibeChat application",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(rooms.router, prefix="/rooms", tags=["Rooms"])
app.include_router(bots.router, prefix="/bots", tags=["Bots"])
app.include_router(ai.router, prefix="/ai", tags=["AI"])
app.include_router(billing.router, prefix="/billing", tags=["Billing"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "VibeChat AI Service",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )
