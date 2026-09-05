"""Skill Gap Analysis API Endpoints."""
from typing import List
from fastapi import APIRouter, HTTPException, status
from app.models.schemas import AnalysisGapRequest, SkillGapResult
from app.services.gap_service import compute_gaps_for_role

router = APIRouter(prefix="/analysis", tags=["Deterministic Analysis"])


@router.post("/gap", response_model=List[SkillGapResult], summary="Calculate skill gaps against a specific role")
def run_gap_analysis(req: AnalysisGapRequest):
    """Calculates skill gaps against benchmark requirements for the target role.
    Categorizes skills into Strong, Developing, Major Gap, and Critical Gap.
    """
    try:
        return compute_gaps_for_role(
            role_slug=req.role_slug,
            student_skills=req.student_skills,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
