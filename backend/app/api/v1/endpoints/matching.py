"""Role Matching API Endpoints."""
from typing import List
from fastapi import APIRouter
from app.models.schemas import AnalysisMatchRequest, RoleMatchResult
from app.services.matching_service import match_student_against_all_roles

router = APIRouter(prefix="/analysis", tags=["Deterministic Analysis"])


@router.post("/match", response_model=List[RoleMatchResult], summary="Calculate deterministic match across all roles")
def run_role_match(req: AnalysisMatchRequest):
    """Calculates weighted match scores against all 4 controlled roles.
    All scores are derived from pure mathematical formulas.
    """
    return match_student_against_all_roles(
        student_skills=req.student_skills,
        degree_field=req.degree_field,
    )
