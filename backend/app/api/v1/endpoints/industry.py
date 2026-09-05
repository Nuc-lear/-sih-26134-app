"""Industry extraction endpoints."""
from fastapi import APIRouter
from app.models.schemas import (
    JobExtractRequest,
    JobExtractResponse,
    LinkedInAnalyzeRequest,
    LinkedInAnalyzeResponse,
    RolePredictionRequest,
    RolePredictionResponse,
)
from app.services.llm_service import llm_service

router = APIRouter(prefix="/industry", tags=["Industry & Job Description Parsing"])


@router.post("/extract", response_model=JobExtractResponse, summary="Extract structured skills from raw job description")
async def extract_job_skills(req: JobExtractRequest):
    """Parses unstructured job description text into validated, normalized skills.
    Enforces strict Pydantic JSON schema.
    """
    return await llm_service.extract_skills_from_jd(req)


@router.post(
    "/linkedin-analyze",
    response_model=LinkedInAnalyzeResponse,
    summary="Analyze LinkedIn profile text, extract skills and provide optimization critique",
)
async def analyze_linkedin(req: LinkedInAnalyzeRequest):
    """Analyzes a student's LinkedIn headline or bio, providing profile strength tier,
    headline optimization review, missing keywords, and automatically extracted canonical skills.
    """
    return await llm_service.analyze_linkedin_profile(req)


@router.post(
    "/predict-roles",
    response_model=RolePredictionResponse,
    summary="Predict top 10 market roles matching evaluated student skills",
)
async def predict_roles(req: RolePredictionRequest):
    """Dynamically predicts and ranks the top 10 tech market roles based on student's evaluated skills."""
    return await llm_service.predict_top_10_market_roles(req)


