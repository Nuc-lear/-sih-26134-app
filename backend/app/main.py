"""Main FastAPI application factory and root router."""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from app.database.session import Base, engine, SessionLocal
from app.database.seed import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: run database setup and seed on startup."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Deterministic Career & Skill Intelligence Platform API. All scores are mathematically calculated in Python engines.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include v1 API routes
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/api/v1/health", tags=["System"])
def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "engines": {
            "role_matcher": "online",
            "gap_analyzer": "online",
            "priority_engine": "online",
        },
    }
